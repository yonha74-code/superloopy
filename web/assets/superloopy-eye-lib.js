(() => {
  const COMPONENT_TYPES = {
    5121: Uint8Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
  };
  const COMPONENT_BYTES = {
    5121: 1,
    5123: 2,
    5125: 4,
    5126: 4
  };
  const TYPE_SIZE = {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT4: 16
  };

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInOut(t) {
    return t * t * (3 - 2 * t);
  }

  function parseGlb(buffer) {
    const view = new DataView(buffer);
    if (view.getUint32(0, true) !== 0x46546c67) throw new Error("Invalid GLB header");
    let offset = 12;
    let json = null;
    let bin = null;

    while (offset < view.byteLength) {
      const chunkLength = view.getUint32(offset, true);
      const chunkType = view.getUint32(offset + 4, true);
      const chunkStart = offset + 8;
      if (chunkType === 0x4e4f534a) {
        json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, chunkStart, chunkLength)));
      } else if (chunkType === 0x004e4942) {
        bin = new Uint8Array(buffer, chunkStart, chunkLength);
      }
      offset = chunkStart + chunkLength;
    }

    if (!json || !bin) throw new Error("Incomplete GLB");
    return { json, bin };
  }

  function readAccessor(document, accessorIndex) {
    const accessor = document.json.accessors[accessorIndex];
    const view = document.json.bufferViews[accessor.bufferView];
    const TypedArray = COMPONENT_TYPES[accessor.componentType];
    const componentSize = COMPONENT_BYTES[accessor.componentType];
    const itemSize = TYPE_SIZE[accessor.type];
    if (!accessor || !view || !TypedArray || !itemSize) throw new Error(`Unsupported accessor ${accessorIndex}`);

    const byteOffset = document.bin.byteOffset + (view.byteOffset || 0) + (accessor.byteOffset || 0);
    const elementCount = accessor.count * itemSize;
    const byteLength = elementCount * componentSize;
    return new TypedArray(document.bin.buffer.slice(byteOffset, byteOffset + byteLength));
  }

  function extractLineLayers(glb) {
    return glb.json.nodes
      .filter((node) => /iris-lines/i.test(node.name || ""))
      .map((node) => {
        const mesh = glb.json.meshes[node.mesh];
        const primitive = mesh?.primitives?.[0];
        if (!primitive || primitive.mode !== 1) return null;
        return {
          positions: readAccessor(glb, primitive.attributes.POSITION),
          indices: readAccessor(glb, primitive.indices)
        };
      })
      .filter(Boolean);
  }

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(error || "Shader compile failed");
    }
    return shader;
  }

  function createProgram(gl, vertexSource, fragmentSource) {
    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(error || "Program link failed");
    }
    return program;
  }

  function bufferData(gl, target, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    return buffer;
  }

  function generateSphere(widthSegments = 96, heightSegments = 56) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let y = 0; y <= heightSegments; y += 1) {
      const v = y / heightSegments;
      const theta = v * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let x = 0; x <= widthSegments; x += 1) {
        const u = x / widthSegments;
        const phi = u * Math.PI * 2;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const px = sinTheta * cosPhi;
        const py = cosTheta;
        const pz = sinTheta * sinPhi;
        positions.push(px, py, pz);
        normals.push(px, py, pz);
        uvs.push(u, 1 - v);
      }
    }

    for (let y = 0; y < heightSegments; y += 1) {
      for (let x = 0; x < widthSegments; x += 1) {
        const a = y * (widthSegments + 1) + x;
        const b = a + widthSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices)
    };
  }

  function identity(out) {
    out.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    return out;
  }

  function perspective(out, fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) / (near - far);
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) / (near - far);
    out[15] = 0;
    return out;
  }

  function normalize(out, value) {
    const length = Math.hypot(value[0], value[1], value[2]) || 1;
    out[0] = value[0] / length;
    out[1] = value[1] / length;
    out[2] = value[2] / length;
    return out;
  }

  function cross(out, a, b) {
    const ax = a[0], ay = a[1], az = a[2];
    const bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }

  function lookAt(out, eye, center, up) {
    const z = [0, 0, 0];
    const x = [0, 0, 0];
    const y = [0, 0, 0];
    normalize(z, [eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);
    normalize(x, cross(x, up, z));
    cross(y, z, x);

    out[0] = x[0];
    out[1] = y[0];
    out[2] = z[0];
    out[3] = 0;
    out[4] = x[1];
    out[5] = y[1];
    out[6] = z[1];
    out[7] = 0;
    out[8] = x[2];
    out[9] = y[2];
    out[10] = z[2];
    out[11] = 0;
    out[12] = -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]);
    out[13] = -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]);
    out[14] = -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]);
    out[15] = 1;
    return out;
  }

  function multiply(out, a, b) {
    const result = new Float32Array(16);
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        result[col * 4 + row] =
          a[0 * 4 + row] * b[col * 4 + 0] +
          a[1 * 4 + row] * b[col * 4 + 1] +
          a[2 * 4 + row] * b[col * 4 + 2] +
          a[3 * 4 + row] * b[col * 4 + 3];
      }
    }
    out.set(result);
    return out;
  }

  function translate(out, a, value) {
    const x = value[0], y = value[1], z = value[2];
    if (out !== a) out.set(a);
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    return out;
  }

  function rotateX(out, a, radians) {
    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    if (out !== a) {
      out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
      out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }

  function rotateY(out, a, radians) {
    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    if (out !== a) {
      out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
      out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }

  function rotateZ(out, a, radians) {
    const s = Math.sin(radians);
    const c = Math.cos(radians);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    if (out !== a) {
      out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
      out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }

  function scale(out, a, value) {
    const x = value[0], y = value[1], z = value[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }

  const sphereVertex = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUv;
    uniform mat4 uMvp;
    uniform mat4 uModel;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying vec2 vUv;
    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      vWorld = world.xyz;
      vNormal = normalize((uModel * vec4(aNormal, 0.0)).xyz);
      vUv = aUv;
      gl_Position = uMvp * vec4(aPosition, 1.0);
    }
  `;

  const sphereFragment = `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vWorld;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uAlpha;
    uniform vec3 uCamera;
    float band(float value, float density) {
      return smoothstep(0.035, 0.0, abs(fract(value * density) - 0.5));
    }
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(uCamera - vWorld);
      float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.25);
      float lowerMask = smoothstep(0.72, 0.28, vUv.y);
      float hexA = band(vUv.x + vUv.y * 0.48, 34.0);
      float hexB = band(vUv.x - vUv.y * 0.48, 34.0);
      float hexC = band(vUv.y, 27.0);
      float lattice = max(min(hexA, hexB), min(hexC, max(hexA, hexB))) * lowerMask;
      float highlight = smoothstep(0.22, 0.0, distance(vUv, vec2(0.68, 0.58)));
      float wash = 0.5 + 0.5 * sin((vUv.x * 2.0 + vUv.y + uProgress) * 3.14159);
      vec3 cyan = vec3(0.18, 0.95, 0.91);
      vec3 blue = vec3(0.30, 0.50, 1.0);
      vec3 color = mix(cyan, blue, wash) + rim * vec3(0.54, 0.82, 1.0) + lattice * vec3(0.38, 1.0, 0.94) + highlight * vec3(0.92, 0.72, 1.0);
      float alpha = 0.24 + rim * 0.58 + lattice * 0.48 + highlight * 0.2;
      gl_FragColor = vec4(color, alpha * uAlpha);
    }
  `;

  const lineVertex = `
    attribute vec3 aPosition;
    uniform mat4 uMvp;
    uniform float uTime;
    uniform float uLayer;
    varying float vGlow;
    void main() {
      vec3 p = aPosition;
      float pulse = sin((p.x * 7.5 + p.z * 9.0 + uTime * 1.4 + uLayer) * 2.0) * 0.012;
      p += normalize(p + vec3(0.001, 0.32, 0.001)) * pulse;
      vGlow = 0.52 + 0.48 * sin(uTime * 2.1 + p.x * 13.0 + p.z * 8.0 + uLayer);
      gl_Position = uMvp * vec4(p, 1.0);
    }
  `;

  const lineFragment = `
    precision mediump float;
    varying float vGlow;
    uniform float uAlpha;
    void main() {
      vec3 core = mix(vec3(0.14, 0.82, 0.96), vec3(0.84, 1.0, 0.96), vGlow);
      gl_FragColor = vec4(core, (0.48 + vGlow * 0.5) * uAlpha);
    }
  `;

  const pointVertex = `
    attribute vec3 aPosition;
    uniform mat4 uMvp;
    uniform float uTime;
    uniform float uDpr;
    varying float vAlpha;
    void main() {
      vec3 p = aPosition * (1.0 + sin(uTime + aPosition.x * 8.0) * 0.008);
      vAlpha = 0.35 + 0.65 * sin(uTime * 1.8 + aPosition.z * 12.0);
      gl_Position = uMvp * vec4(p, 1.0);
      gl_PointSize = (1.15 + vAlpha * 1.4) * uDpr;
    }
  `;

  const pointFragment = `
    precision mediump float;
    varying float vAlpha;
    void main() {
      vec2 p = gl_PointCoord - 0.5;
      float d = dot(p, p);
      if (d > 0.25) discard;
      gl_FragColor = vec4(0.88, 1.0, 0.98, (1.0 - d * 4.0) * vAlpha * 0.7);
    }
  `;

  window.SuperloopyEyeLib = {
    clamp,
    mix,
    easeInOut,
    parseGlb,
    readAccessor,
    extractLineLayers,
    createShader,
    createProgram,
    bufferData,
    generateSphere,
    identity,
    perspective,
    normalize,
    cross,
    lookAt,
    multiply,
    translate,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    sphereVertex,
    sphereFragment,
    lineVertex,
    lineFragment,
    pointVertex,
    pointFragment
  };
})();

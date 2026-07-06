(() => {
  // Parsing, GL, matrix, and shader primitives live in superloopy-eye-lib.js
  // (loaded first by the enhancement layer) to keep each file reviewable.
  const {
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
  } = window.SuperloopyEyeLib;

  function prepareScene(gl, lineLayers) {
    const sphere = generateSphere();
    const lineBuffers = lineLayers.map((layer) => ({
      position: bufferData(gl, gl.ARRAY_BUFFER, layer.positions),
      index: bufferData(gl, gl.ELEMENT_ARRAY_BUFFER, layer.indices),
      count: layer.indices.length,
      indexType: layer.indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT
    }));

    const pointPositions = new Float32Array(lineLayers[0]?.positions || []);
    return {
      sphere: {
        position: bufferData(gl, gl.ARRAY_BUFFER, sphere.positions),
        normal: bufferData(gl, gl.ARRAY_BUFFER, sphere.normals),
        uv: bufferData(gl, gl.ARRAY_BUFFER, sphere.uvs),
        index: bufferData(gl, gl.ELEMENT_ARRAY_BUFFER, sphere.indices),
        count: sphere.indices.length
      },
      lines: lineBuffers,
      points: {
        position: bufferData(gl, gl.ARRAY_BUFFER, pointPositions),
        count: Math.floor(pointPositions.length / 3)
      }
    };
  }

  function mount(canvas, options = {}) {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
      stencil: false
    });
    if (!gl) throw new Error("WebGL unavailable");
    gl.getExtension("OES_element_index_uint");

    const state = {
      progress: 0,
      targetProgress: 0,
      pointerX: 0,
      pointerY: 0,
      targetPointerX: 0,
      targetPointerY: 0,
      visible: true,
      destroyed: false,
      raf: 0,
      dpr: 1,
      width: 0,
      height: 0,
      startedAt: performance.now()
    };

    const matrices = {
      model: new Float32Array(16),
      view: new Float32Array(16),
      projection: new Float32Array(16),
      vp: new Float32Array(16),
      mvp: new Float32Array(16)
    };

    const programs = {
      sphere: createProgram(gl, sphereVertex, sphereFragment),
      line: createProgram(gl, lineVertex, lineFragment),
      point: createProgram(gl, pointVertex, pointFragment)
    };

    const locations = {
      sphere: {
        position: gl.getAttribLocation(programs.sphere, "aPosition"),
        normal: gl.getAttribLocation(programs.sphere, "aNormal"),
        uv: gl.getAttribLocation(programs.sphere, "aUv"),
        mvp: gl.getUniformLocation(programs.sphere, "uMvp"),
        model: gl.getUniformLocation(programs.sphere, "uModel"),
        progress: gl.getUniformLocation(programs.sphere, "uProgress"),
        alpha: gl.getUniformLocation(programs.sphere, "uAlpha"),
        camera: gl.getUniformLocation(programs.sphere, "uCamera")
      },
      line: {
        position: gl.getAttribLocation(programs.line, "aPosition"),
        mvp: gl.getUniformLocation(programs.line, "uMvp"),
        time: gl.getUniformLocation(programs.line, "uTime"),
        layer: gl.getUniformLocation(programs.line, "uLayer"),
        alpha: gl.getUniformLocation(programs.line, "uAlpha")
      },
      point: {
        position: gl.getAttribLocation(programs.point, "aPosition"),
        mvp: gl.getUniformLocation(programs.point, "uMvp"),
        time: gl.getUniformLocation(programs.point, "uTime"),
        dpr: gl.getUniformLocation(programs.point, "uDpr")
      }
    };

    let scene = null;
    let resolveReady;
    let rejectReady;
    const ready = new Promise((resolve, reject) => {
      resolveReady = resolve;
      rejectReady = reject;
    });

    const status = {
      ready: false,
      frames: 0,
      progress: 0,
      visible: true,
      renderer: "dedicated-webgl",
      model: options.modelUrl,
      errors: []
    };
    window.__superloopyEyeRendererStatus = status;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = options.reducedMotion ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (width === state.width && height === state.height && dpr === state.dpr) return;
      state.width = width;
      state.height = height;
      state.dpr = dpr;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    function bindAttribute(location, buffer, size) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    }

    function updateMatrices(progress, pointerX, pointerY) {
      const eased = easeInOut(progress);
      const aspect = Math.max(0.1, state.width / Math.max(1, state.height));
      const camera = [
        mix(-1.05, 0.12, eased) + pointerX * 0.22,
        mix(0.48, -0.04, eased) - pointerY * 0.18,
        // Pulled back from mix(4.58, 3.68): the eye should read as watched from a
        // distance, not filling the frame.
        mix(10.4, 8.9, eased)
      ];
      const target = [
        mix(-0.12, 0, eased) + pointerX * 0.12,
        mix(-0.18, 0.02, eased) - pointerY * 0.1,
        0
      ];
      perspective(matrices.projection, Math.PI / 5.2, aspect, 0.1, 40);
      lookAt(matrices.view, camera, target, [0, 1, 0]);
      multiply(matrices.vp, matrices.projection, matrices.view);

      identity(matrices.model);
      translate(matrices.model, matrices.model, [
        mix(-0.58, 0.02, eased),
        mix(0.38, -0.06, eased),
        0
      ]);
      rotateX(matrices.model, matrices.model, mix(0.78, 0.82, eased) - pointerY * 0.08);
      rotateY(matrices.model, matrices.model, mix(0.08, 1.46, eased) + pointerX * 0.14);
      rotateZ(matrices.model, matrices.model, mix(0.81, 0.73, eased));
      scale(matrices.model, matrices.model, [1.24, 1.24, 1.24]);
      multiply(matrices.mvp, matrices.vp, matrices.model);
      return camera;
    }

    function render(now) {
      state.raf = 0;
      if (state.destroyed || !scene) return;
      resize();
      const time = (now - state.startedAt) / 1000;
      const motionFactor = options.reducedMotion ? 1 : 0.085;
      state.progress += (state.targetProgress - state.progress) * motionFactor;
      state.pointerX += (state.targetPointerX - state.pointerX) * 0.1;
      state.pointerY += (state.targetPointerY - state.pointerY) * 0.1;
      status.frames += 1;
      status.progress = state.progress;
      status.visible = state.visible;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.disable(gl.CULL_FACE);
      const camera = updateMatrices(state.progress, state.pointerX, state.pointerY);

      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(false);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(programs.sphere);
      gl.uniformMatrix4fv(locations.sphere.mvp, false, matrices.mvp);
      gl.uniformMatrix4fv(locations.sphere.model, false, matrices.model);
      gl.uniform1f(locations.sphere.progress, state.progress);
      gl.uniform1f(locations.sphere.alpha, 0.92);
      gl.uniform3f(locations.sphere.camera, camera[0], camera[1], camera[2]);
      bindAttribute(locations.sphere.position, scene.sphere.position, 3);
      bindAttribute(locations.sphere.normal, scene.sphere.normal, 3);
      bindAttribute(locations.sphere.uv, scene.sphere.uv, 2);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.sphere.index);
      gl.drawElements(gl.TRIANGLES, scene.sphere.count, gl.UNSIGNED_SHORT, 0);

      gl.disable(gl.DEPTH_TEST);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(programs.line);
      gl.uniformMatrix4fv(locations.line.mvp, false, matrices.mvp);
      gl.uniform1f(locations.line.time, time);
      gl.uniform1f(locations.line.alpha, 0.78);
      scene.lines.forEach((line, index) => {
        gl.uniform1f(locations.line.layer, index + 1);
        bindAttribute(locations.line.position, line.position, 3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, line.index);
        gl.drawElements(gl.LINES, line.count, line.indexType, 0);
      });

      gl.useProgram(programs.point);
      gl.uniformMatrix4fv(locations.point.mvp, false, matrices.mvp);
      gl.uniform1f(locations.point.time, time);
      gl.uniform1f(locations.point.dpr, state.dpr);
      bindAttribute(locations.point.position, scene.points.position, 3);
      gl.drawArrays(gl.POINTS, 0, scene.points.count);

      gl.depthMask(true);
      const moving = Math.abs(state.targetProgress - state.progress) > 0.001 ||
        Math.abs(state.targetPointerX - state.pointerX) > 0.001 ||
        Math.abs(state.targetPointerY - state.pointerY) > 0.001;
      if (state.visible && (!options.reducedMotion || moving)) requestRender();
    }

    function requestRender() {
      if (state.raf || state.destroyed || !state.visible) return;
      state.raf = window.requestAnimationFrame(render);
    }

    fetch(options.modelUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Eye model request failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const glb = parseGlb(buffer);
        scene = prepareScene(gl, extractLineLayers(glb));
        status.ready = true;
        resolveReady(status);
        requestRender();
      })
      .catch((error) => {
        status.errors.push(String(error?.message || error));
        rejectReady(error);
      });

    canvas.addEventListener("webglcontextlost", (event) => {
      // Keep the context restorable but fall back to the preview image: our GL
      // resources would need a full re-init, and the static preview is safer than
      // rendering with dead buffers under GPU pressure (e.g. resize storms).
      event.preventDefault();
      status.contextLost = true;
      canvas.closest(".superloopy-eye-model")?.classList.add("is-webgl-error");
    });

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
        state.visible = entries.some((entry) => entry.isIntersecting);
        status.visible = state.visible;
        if (state.visible) requestRender();
      }, { rootMargin: "240px" })
      : null;
    observer?.observe(canvas);

    const resizeObserver = "ResizeObserver" in window
      ? new ResizeObserver(requestRender)
      : null;
    resizeObserver?.observe(canvas);
    window.addEventListener("visibilitychange", () => {
      state.visible = !document.hidden;
      if (state.visible) requestRender();
    });

    return {
      ready,
      setMotion({ progress = state.targetProgress, pointerX = state.targetPointerX, pointerY = state.targetPointerY } = {}) {
        state.targetProgress = clamp(progress);
        state.targetPointerX = clamp(pointerX, -1, 1);
        state.targetPointerY = clamp(pointerY, -1, 1);
        requestRender();
      },
      destroy() {
        state.destroyed = true;
        if (state.raf) window.cancelAnimationFrame(state.raf);
        observer?.disconnect();
        resizeObserver?.disconnect();
      }
    };
  }

  window.SuperloopyEyeRenderer = { mount };
})();

// Three.js Interactive 3D Teddy Bear
class TeddyBearScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.teddyGroup = null;
    this.headGroup = null;
    this.rightArmGroup = null;
    this.leftArmGroup = null;
    this.heartMesh = null;
    this.floatingHearts = [];
    this.clock = new THREE.Clock();

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.actionState = 'idle'; // idle, hug, bow, wave, spin
    this.actionTimer = 0;

    this.init();
  }

  init() {
    const width = this.container.clientWidth > 0 ? this.container.clientWidth : 380;
    const height = this.container.clientHeight > 0 ? this.container.clientHeight : 380;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.2, 5.2);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Ensure size updates when layout settles
    setTimeout(() => {
      if (this.container && this.container.clientWidth > 0) {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight || 380;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    }, 150);

    // Controls
    if (window.THREE && THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
      this.controls.minDistance = 3.5;
      this.controls.maxDistance = 7.0;
      this.controls.enablePan = false;
    }

    // Lights
    this.setupLights();

    // Build Teddy
    this.buildTeddy();

    // Events
    this.setupEvents();

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLights() {
    // Soft Ambient
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 0.85);
    this.scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfffaf0, 0.9);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    // Soft Pink Rim Light
    const rimLight = new THREE.DirectionalLight(0xffb6c1, 0.6);
    rimLight.position.set(-4, 3, -3);
    this.scene.add(rimLight);

    // Heart Glow Point Light
    this.heartLight = new THREE.PointLight(0xff2d55, 1.2, 3);
    this.heartLight.position.set(0, 0.8, 0.8);
    this.scene.add(this.heartLight);
  }

  buildTeddy() {
    this.teddyGroup = new THREE.Group();
    this.scene.add(this.teddyGroup);

    // Materials
    const furColor = 0xb07248; // Warm caramel brown
    const bellyColor = 0xf5dfc6; // Creamy soft belly
    const noseColor = 0x24140e; // Dark chocolate nose
    const eyeColor = 0x111111; // Shiny button eyes
    const blushColor = 0xff9bb2; // Rosy cheeks

    const furMat = new THREE.MeshStandardMaterial({
      color: furColor,
      roughness: 0.85,
      metalness: 0.05,
    });

    const bellyMat = new THREE.MeshStandardMaterial({
      color: bellyColor,
      roughness: 0.9,
    });

    const noseMat = new THREE.MeshStandardMaterial({
      color: noseColor,
      roughness: 0.3,
      metalness: 0.1,
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: eyeColor,
      roughness: 0.15,
      metalness: 0.3,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.blushMat = new THREE.MeshBasicMaterial({
      color: blushColor,
      transparent: true,
      opacity: 0.7,
    });

    // 1. Body
    const bodyGeo = new THREE.SphereGeometry(0.85, 32, 32);
    bodyGeo.scale(1.05, 1.2, 0.95);
    const body = new THREE.Mesh(bodyGeo, furMat);
    body.position.set(0, 0.7, 0);
    body.castShadow = true;
    this.teddyGroup.add(body);

    // Belly patch
    const bellyGeo = new THREE.SphereGeometry(0.62, 32, 32);
    bellyGeo.scale(0.95, 1.1, 0.4);
    const belly = new THREE.Mesh(bellyGeo, bellyMat);
    belly.position.set(0, 0.65, 0.65);
    this.teddyGroup.add(belly);

    // 2. Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.85, 0);
    this.teddyGroup.add(this.headGroup);

    // Head sphere
    const headGeo = new THREE.SphereGeometry(0.75, 32, 32);
    headGeo.scale(1.05, 0.98, 0.98);
    const head = new THREE.Mesh(headGeo, furMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Muzzle / Snout
    const snoutGeo = new THREE.SphereGeometry(0.38, 28, 28);
    snoutGeo.scale(1.1, 0.8, 0.8);
    const snout = new THREE.Mesh(snoutGeo, bellyMat);
    snout.position.set(0, -0.1, 0.55);
    this.headGroup.add(snout);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.12, 20, 20);
    noseGeo.scale(1.2, 0.8, 0.7);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -0.04, 0.83);
    this.headGroup.add(nose);

    // Cute mouth stitched line
    const mouthCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.08, -0.16, 0.8),
      new THREE.Vector3(0, -0.22, 0.82),
      new THREE.Vector3(0.08, -0.16, 0.8)
    );
    const mouthGeo = new THREE.TubeGeometry(mouthCurve, 16, 0.014, 8, false);
    const mouth = new THREE.Mesh(mouthGeo, noseMat);
    this.headGroup.add(mouth);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), eyeMat);
    leftEye.position.set(-0.28, 0.1, 0.65);
    this.headGroup.add(leftEye);

    const leftHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), eyeHighlightMat);
    leftHighlight.position.set(-0.25, 0.14, 0.72);
    this.headGroup.add(leftHighlight);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), eyeMat);
    rightEye.position.set(0.28, 0.1, 0.65);
    this.headGroup.add(rightEye);

    const rightHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), eyeHighlightMat);
    rightHighlight.position.set(0.31, 0.14, 0.72);
    this.headGroup.add(rightHighlight);

    // Cheeks (Blush)
    const leftBlush = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), this.blushMat);
    leftBlush.position.set(-0.42, -0.06, 0.65);
    leftBlush.rotation.y = -0.4;
    this.headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), this.blushMat);
    rightBlush.position.set(0.42, -0.06, 0.65);
    rightBlush.rotation.y = 0.4;
    this.headGroup.add(rightBlush);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.26, 24, 24);
    earGeo.scale(1, 1, 0.5);

    const innerEarGeo = new THREE.SphereGeometry(0.17, 20, 20);
    innerEarGeo.scale(1, 1, 0.3);

    // Left Ear
    const leftEar = new THREE.Mesh(earGeo, furMat);
    leftEar.position.set(-0.62, 0.62, 0.05);
    leftEar.rotation.z = 0.35;
    this.headGroup.add(leftEar);

    const leftInnerEar = new THREE.Mesh(innerEarGeo, bellyMat);
    leftInnerEar.position.set(-0.61, 0.62, 0.12);
    leftInnerEar.rotation.z = 0.35;
    this.headGroup.add(leftInnerEar);

    // Right Ear
    const rightEar = new THREE.Mesh(earGeo, furMat);
    rightEar.position.set(0.62, 0.62, 0.05);
    rightEar.rotation.z = -0.35;
    this.headGroup.add(rightEar);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, bellyMat);
    rightInnerEar.position.set(0.61, 0.62, 0.12);
    rightInnerEar.rotation.z = -0.35;
    this.headGroup.add(rightInnerEar);

    // 3. Sitting Legs
    const legGeo = new THREE.SphereGeometry(0.38, 24, 24);
    legGeo.scale(1, 0.8, 1.4);

    const pawPadGeo = new THREE.CircleGeometry(0.2, 20);
    const pawPadMat = new THREE.MeshStandardMaterial({ color: bellyColor, roughness: 0.9 });

    // Left leg
    const leftLeg = new THREE.Mesh(legGeo, furMat);
    leftLeg.position.set(-0.65, 0.15, 0.5);
    leftLeg.rotation.y = 0.25;
    leftLeg.rotation.x = -0.1;
    this.teddyGroup.add(leftLeg);

    const leftPad = new THREE.Mesh(pawPadGeo, pawPadMat);
    leftPad.position.set(-0.65, 0.15, 1.05);
    leftPad.rotation.x = -0.1;
    this.teddyGroup.add(leftPad);

    // Right leg
    const rightLeg = new THREE.Mesh(legGeo, furMat);
    rightLeg.position.set(0.65, 0.15, 0.5);
    rightLeg.rotation.y = -0.25;
    rightLeg.rotation.x = -0.1;
    this.teddyGroup.add(rightLeg);

    const rightPad = new THREE.Mesh(pawPadGeo, pawPadMat);
    rightPad.position.set(0.65, 0.15, 1.05);
    rightPad.rotation.x = -0.1;
    this.teddyGroup.add(rightPad);

    // 4. Arms & Paws
    // Right arm group (pivot at shoulder)
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.75, 1.1, 0.1);
    this.teddyGroup.add(this.rightArmGroup);

    const armGeo = new THREE.SphereGeometry(0.26, 24, 24);
    armGeo.scale(0.8, 1.4, 0.8);

    const rightArm = new THREE.Mesh(armGeo, furMat);
    rightArm.position.set(0, -0.3, 0.25);
    rightArm.rotation.x = 0.7;
    rightArm.rotation.z = -0.3;
    this.rightArmGroup.add(rightArm);

    // Left arm group
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.75, 1.1, 0.1);
    this.teddyGroup.add(this.leftArmGroup);

    const leftArm = new THREE.Mesh(armGeo, furMat);
    leftArm.position.set(0, -0.3, 0.25);
    leftArm.rotation.x = 0.7;
    leftArm.rotation.z = 0.3;
    this.leftArmGroup.add(leftArm);

    // 5. Beating Glowing Heart held by Teddy
    this.buildHeart();

    // Floor shadow disc
    const shadowGeo = new THREE.CircleGeometry(1.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0xefd3d7,
      transparent: true,
      opacity: 0.45,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.12;
    this.scene.add(shadow);
  }

  buildHeart() {
    // 3D Heart Shape
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    // Center heart geometry
    heartGeo.center();

    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0xaa1133,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.1,
    });

    this.heartMesh = new THREE.Mesh(heartGeo, heartMat);
    this.heartMesh.scale.set(0.85, 0.85, 0.85);
    this.heartMesh.rotation.z = Math.PI; // flip upright
    this.heartMesh.position.set(0, 0.82, 0.85);
    this.teddyGroup.add(this.heartMesh);
  }

  // Create floating 3D heart particle
  spawnHeartParticle() {
    const pGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const pMat = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xff4d79 : 0xff85a2,
      transparent: true,
      opacity: 0.9,
    });
    const particle = new THREE.Mesh(pGeo, pMat);
    particle.position.set(
      (Math.random() - 0.5) * 0.8,
      0.9 + Math.random() * 0.3,
      0.9 + (Math.random() - 0.5) * 0.3
    );
    particle.userData = {
      velY: 0.015 + Math.random() * 0.02,
      velX: (Math.random() - 0.5) * 0.015,
      velZ: (Math.random() - 0.5) * 0.015,
      life: 1.0,
      scaleSpeed: 0.98,
    };
    this.scene.add(particle);
    this.floatingHearts.push(particle);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    const onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.mouse.targetX = Math.max(-1, Math.min(1, x));
      this.mouse.targetY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0]);
    }, { passive: true });
  }

  // Interactivity Actions
  triggerHug() {
    this.actionState = 'hug';
    this.actionTimer = 0;
    if (window.soundEngine) window.soundEngine.playSparkle();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.spawnHeartParticle(), i * 80);
    }
  }

  triggerBow() {
    this.actionState = 'bow';
    this.actionTimer = 0;
    if (window.soundEngine) window.soundEngine.playChime(440, 0.6, 0.1);
  }

  triggerWave() {
    this.actionState = 'wave';
    this.actionTimer = 0;
    if (window.soundEngine) window.soundEngine.playSparkle();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.spawnHeartParticle(), i * 100);
    }
  }

  triggerSpin() {
    this.actionState = 'spin';
    this.actionTimer = 0;
    if (window.soundEngine) window.soundEngine.playSparkle();
    for (let i = 0; i < 10; i++) {
      setTimeout(() => this.spawnHeartParticle(), i * 60);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.controls) this.controls.update();

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Heart beating pulsation
    if (this.heartMesh) {
      const beat = Math.sin(time * 3.5) * 0.08 + 1.0;
      this.heartMesh.scale.set(0.85 * beat, 0.85 * beat, 0.85 * beat);
      if (this.heartLight) {
        this.heartLight.intensity = 1.0 + Math.sin(time * 3.5) * 0.4;
      }
    }

    // Default gentle floating / breathing
    this.teddyGroup.position.y = Math.sin(time * 1.8) * 0.04;

    // Head tracks mouse cursor gently (clamped)
    if (this.headGroup && this.actionState !== 'bow') {
      const targetRotY = this.mouse.x * 0.4;
      const targetRotX = -this.mouse.y * 0.25;
      this.headGroup.rotation.y += (targetRotY - this.headGroup.rotation.y) * 0.08;
      this.headGroup.rotation.x += (targetRotX - this.headGroup.rotation.x) * 0.08;
    }

    // Handle interactive action animations
    if (this.actionState === 'hug') {
      this.actionTimer += delta;
      const t = this.actionTimer;
      // Squeeze heart closer, hug arms inward, tilt head lovingly
      this.rightArmGroup.rotation.y = -0.35 + Math.sin(t * 8) * 0.1;
      this.leftArmGroup.rotation.y = 0.35 - Math.sin(t * 8) * 0.1;
      this.headGroup.rotation.z = Math.sin(t * 6) * 0.08;
      this.blushMat.opacity = 0.95;

      if (this.actionTimer > 2.0) {
        this.actionState = 'idle';
        this.blushMat.opacity = 0.7;
        this.rightArmGroup.rotation.y = 0;
        this.leftArmGroup.rotation.y = 0;
        this.headGroup.rotation.z = 0;
      }
    } else if (this.actionState === 'bow') {
      this.actionTimer += delta;
      // Head bows down apologetically
      this.headGroup.rotation.x = 0.42;
      this.headGroup.rotation.y = 0;
      this.teddyGroup.position.y = -0.15;

      if (this.actionTimer > 2.2) {
        this.actionState = 'idle';
      }
    } else if (this.actionState === 'wave') {
      this.actionTimer += delta;
      // Raise right arm and wave
      this.rightArmGroup.rotation.z = 1.8 + Math.sin(this.actionTimer * 12) * 0.4;
      this.rightArmGroup.rotation.x = -0.2;

      if (this.actionTimer > 2.0) {
        this.actionState = 'idle';
        this.rightArmGroup.rotation.z = 0;
        this.rightArmGroup.rotation.x = 0;
      }
    } else if (this.actionState === 'spin') {
      this.actionTimer += delta;
      this.teddyGroup.rotation.y += 6 * delta;
      this.teddyGroup.position.y = Math.sin(this.actionTimer * 6) * 0.15;

      if (this.actionTimer > 1.2) {
        this.actionState = 'idle';
        this.teddyGroup.rotation.y = 0;
      }
    }

    // Update floating heart particles
    for (let i = this.floatingHearts.length - 1; i >= 0; i--) {
      const p = this.floatingHearts[i];
      p.position.y += p.userData.velY;
      p.position.x += p.userData.velX;
      p.position.z += p.userData.velZ;
      p.scale.multiplyScalar(p.userData.scaleSpeed);
      p.userData.life -= delta * 0.8;
      p.material.opacity = p.userData.life;

      if (p.userData.life <= 0) {
        this.scene.remove(p);
        this.floatingHearts.splice(i, 1);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.TeddyBearScene = TeddyBearScene;

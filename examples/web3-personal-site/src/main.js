import "./styles.css";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector("#scene-canvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050812, 0.035);

const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0.6, 8.4);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  reducedMotion.matches ? 0.22 : 0.62,
  0.38,
  0.2,
);
composer.addPass(bloom);

const palette = {
  phosphor: new THREE.Color("#d7ff4f"),
  copper: new THREE.Color("#c88a35"),
  graphite: new THREE.Color("#9aa29a"),
  signal: new THREE.Color("#ff5b2e"),
  ink: new THREE.Color("#050604"),
};

const root = new THREE.Group();
scene.add(root);

const field = new THREE.Group();
root.add(field);

function createParticleField() {
  const count = 2400;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const layer = i % 5;
    const radius = 1.4 + Math.random() * 4.8 + layer * 0.28;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(1.9));
    const spiral = theta + radius * 0.36;
    const index = i * 3;
    positions[index] = Math.cos(spiral) * Math.sin(phi) * radius;
    positions[index + 1] = Math.sin(theta * 1.7) * 0.85 + THREE.MathUtils.randFloatSpread(2.2);
    positions[index + 2] = Math.sin(spiral) * Math.sin(phi) * radius;

    color.copy(layer % 2 === 0 ? palette.phosphor : palette.graphite);
    if (Math.random() > 0.86) color.copy(palette.copper);
    if (Math.random() > 0.965) color.copy(palette.signal);
    color.multiplyScalar(0.58 + Math.random() * 0.48);
    colors[index] = color.r;
    colors[index + 1] = color.g;
    colors[index + 2] = color.b;
    sizes[i] = 0.015 + Math.random() * 0.04;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("a_size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: `
      attribute float a_size;
      varying vec3 v_color;
      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        v_color = color;
        vec3 p = position;
        p.x += sin(uTime * 0.45 + position.z * 0.6) * 0.08;
        p.y += cos(uTime * 0.35 + position.x * 0.7) * 0.05;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = a_size * uPixelRatio * (360.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 v_color;

      void main() {
        vec2 p = gl_PointCoord - vec2(0.5);
        float d = length(p);
        float alpha = smoothstep(0.5, 0.02, d);
        gl_FragColor = vec4(v_color, alpha);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  points.name = "protocol-particles";
  field.add(points);
  return { points, material };
}

function createRings() {
  const rings = new THREE.Group();
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: palette.phosphor,
    transparent: true,
    opacity: 0.36,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < 5; i += 1) {
    const geometry = new THREE.TorusGeometry(1.55 + i * 0.62, 0.006, 10, 220);
    const ring = new THREE.Mesh(geometry, ringMaterial.clone());
    ring.rotation.x = Math.PI / 2 + i * 0.16;
    ring.rotation.y = i * 0.38;
    ring.material.opacity = 0.22 + i * 0.035;
    rings.add(ring);
  }

  field.add(rings);
  return rings;
}

function createCore() {
  const geometry = new THREE.IcosahedronGeometry(0.78, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0x10130d,
    emissive: 0xd7ff4f,
    emissiveIntensity: 0.18,
    metalness: 0.55,
    roughness: 0.34,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  field.add(mesh);
  return mesh;
}

function createLinks() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const lines = 160;
  for (let i = 0; i < lines; i += 1) {
    const a = i * 0.39;
    const r1 = 2.1 + (i % 9) * 0.34;
    const r2 = 1.2 + (i % 7) * 0.44;
    vertices.push(Math.cos(a) * r1, Math.sin(a * 0.71) * 1.7, Math.sin(a) * r1);
    vertices.push(Math.cos(a + 1.15) * r2, Math.sin(a * 0.51) * 1.2, Math.sin(a + 1.15) * r2);
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0xd7ff4f,
    transparent: true,
    opacity: 0.09,
    blending: THREE.AdditiveBlending,
  });
  const links = new THREE.LineSegments(geometry, material);
  field.add(links);
  return links;
}

const particles = createParticleField();
const rings = createRings();
const core = createCore();
const links = createLinks();

const ambient = new THREE.AmbientLight(0xb8b6a8, 0.72);
scene.add(ambient);
const key = new THREE.PointLight(0xd7ff4f, 8.5, 14);
key.position.set(2.8, 3.6, 4.2);
scene.add(key);
const copperLight = new THREE.PointLight(0xc88a35, 3.2, 12);
copperLight.position.set(-3, -1.2, 3);
scene.add(copperLight);

const pointer = new THREE.Vector2(0, 0);
window.addEventListener(
  "pointermove",
  (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  },
  { passive: true },
);

function setupGsap() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      desktop: "(min-width: 861px)",
      mobile: "(max-width: 860px)",
    },
    (context) => {
      const { reduceMotion, desktop } = context.conditions;
      const travel = reduceMotion ? 0 : 28;
      const duration = reduceMotion ? 0.01 : 1.1;

      gsap.set([".site-header", ".hero-copy > *", ".hero-readout"], {
        opacity: 0,
        y: travel,
      });
      gsap.set(field.scale, { x: 0.72, y: 0.72, z: 0.72 });
      gsap.set(field.rotation, { x: 0.34, y: -0.62, z: 0 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(field.scale, { x: 1, y: 1, z: 1, duration }, 0)
        .to(field.rotation, { x: 0.08, y: 0.12, duration: duration + 0.3 }, 0)
        .to(".site-header", { opacity: 1, y: 0, duration: 0.7 }, 0.08)
        .to(".hero-copy > *", { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.18)
        .to(".hero-readout", { opacity: 1, y: 0, duration: 0.75 }, 0.56);

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: reduceMotion ? 0 : 34 },
          {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0.01 : 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 78%",
              once: true,
            },
          },
        );
      });

      const sections = gsap.utils.toArray(".scene-panel");
      sections.forEach((section, index) => {
        const sceneIndex = Number(section.dataset.scene || index);
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: reduceMotion ? false : 1.2,
          onUpdate: (self) => {
            if (reduceMotion) return;
            const phase = sceneIndex + self.progress;
            field.rotation.y = phase * 0.62 + pointer.x * 0.08;
            field.rotation.x = 0.12 + Math.sin(phase) * 0.18 + pointer.y * 0.05;
            camera.position.z = desktop ? 8.1 - sceneIndex * 0.34 : 9.2;
            camera.position.x = desktop ? Math.sin(phase * 0.7) * 0.42 : 0;
            bloom.strength = 0.72 + self.progress * 0.34;
          },
        });
      });

      gsap.to(".stack-orbit span", {
        opacity: 1,
        y: 0,
        stagger: 0.035,
        duration: reduceMotion ? 0.01 : 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".stack-orbit",
          start: "top 78%",
          once: true,
        },
      });

      return () => {
        intro.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
  );
}

function animateCounter() {
  const readout = document.querySelector("[data-count]");
  if (!readout || reducedMotion.matches) return;
  const state = { value: Number(readout.dataset.count) };
  gsap.to(state, {
    value: state.value + 488,
    duration: 8,
    repeat: -1,
    ease: "none",
    onUpdate: () => {
      readout.textContent = Math.round(state.value).toLocaleString("en-US");
    },
  });
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

let lastTime = 0;
function tick(time) {
  const delta = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  const speed = reducedMotion.matches ? 0.14 : 1;

  particles.material.uniforms.uTime.value = time / 1000;
  field.rotation.y += delta * 0.08 * speed;
  rings.rotation.z -= delta * 0.12 * speed;
  core.rotation.x += delta * 0.18 * speed;
  core.rotation.y += delta * 0.22 * speed;
  links.rotation.y -= delta * 0.045 * speed;

  key.position.x = Math.sin(time * 0.00035) * 3.4;
  key.position.y = 2.2 + Math.cos(time * 0.00028) * 1.2;

  composer.render();
  window.requestAnimationFrame(tick);
}

window.addEventListener("resize", resize, { passive: true });
resize();
setupGsap();
animateCounter();
window.requestAnimationFrame(tick);

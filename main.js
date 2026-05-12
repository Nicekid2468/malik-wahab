/* ═══════════════════════════════════════════════════════════
   ENGR. MALIK. — PORTFOLIO JAVASCRIPT
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   FOOTER YEAR
───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─────────────────────────────────────────
   NAV — SHRINK ON SCROLL
───────────────────────────────────────── */
const mainNav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  mainNav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const mobLinks   = document.querySelectorAll('.mob-link');

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

mobileClose.addEventListener('click', closeMenu);
mobLinks.forEach(link => link.addEventListener('click', closeMenu));

/* ─────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.10,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   CONTACT FORM — SIMULATED SUBMIT
   Replace the setTimeout block with your
   preferred backend / Netlify Forms / EmailJS
───────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const btn     = this.querySelector('.btn-submit');
  const success = document.getElementById('form-success');

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  /* Swap this block for a real fetch() / EmailJS call */
  setTimeout(() => {
    success.style.display = 'block';
    this.reset();
    btn.innerHTML = `Send Message
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none"
           stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>`;
    btn.disabled = false;
  }, 1200);
});

/* ─────────────────────────────────────────
   THREE.JS — HERO 3D WIREFRAME
   Requires: three.min.js loaded before main.js
───────────────────────────────────────── */
(function initThreeScene() {
  const canvas = document.getElementById('hero-canvas');

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene & Camera ──
     Camera at z=13 keeps all geometry spread wide
     so wireframe edges sit near viewport perimeter, not behind text */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 13);

  /* ── Materials — all opacities 6–11% (texture only, never focal) ── */
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xB05515,
    wireframe: true,
    transparent: true,
    opacity: 0.11,
  });

  const wireFaint = new THREE.MeshBasicMaterial({
    color: 0x8B5520,
    wireframe: true,
    transparent: true,
    opacity: 0.07,
  });

  /* ── Central icosahedron ── */
  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 1), wireMat);
  scene.add(ico);

  /* ── Outer octahedron frame ── */
  const oct = new THREE.Mesh(new THREE.OctahedronGeometry(5.5, 1), wireFaint);
  scene.add(oct);

  /* ── Orbital torus rings ── */
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.008, 6, 96),
    new THREE.MeshBasicMaterial({ color: 0xC06020, transparent: true, opacity: 0.09 })
  );
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(6.5, 0.006, 6, 128),
    new THREE.MeshBasicMaterial({ color: 0x906040, transparent: true, opacity: 0.06 })
  );
  torus2.rotation.x = Math.PI / 5;
  torus2.rotation.y = Math.PI / 4;
  scene.add(torus2);

  /* ── Floating particles — spawned well outside the text zone ── */
  const ptCount     = 120;
  const ptPositions = new Float32Array(ptCount * 3);

  for (let i = 0; i < ptCount; i++) {
    const r     = 5.5 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    ptPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    ptPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    ptPositions[i * 3 + 2] = r * Math.cos(phi);
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3));

  const pts = new THREE.Points(
    ptGeo,
    new THREE.PointsMaterial({ color: 0xB05515, size: 0.055, transparent: true, opacity: 0.22 })
  );
  scene.add(pts);

  /* ── Mouse parallax ── */
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ── Resize handler ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });

  /* ── Animation loop ── */
  let frame = 0;

  function animate() {
    requestAnimationFrame(animate);
    frame += 0.004;

    ico.rotation.x  += 0.0018;
    ico.rotation.y  += 0.0026;

    oct.rotation.x  -= 0.0012;
    oct.rotation.y  += 0.0015;

    torus.rotation.z  += 0.0018;
    torus2.rotation.z -= 0.0012;
    torus2.rotation.x += 0.0008;

    pts.rotation.y += 0.0008;
    pts.rotation.x += 0.0004;

    /* Smooth camera parallax with mouse */
    camera.position.x += (mouseX * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    /* Subtle breathing scale on the core icosahedron */
    const breathe = 1 + Math.sin(frame) * 0.04;
    ico.scale.setScalar(breathe);

    renderer.render(scene, camera);
  }

  animate();
})();

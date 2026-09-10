
// Initialize Lenis
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".gs-reveal");
  reveals.forEach((el) => {
    gsap.fromTo(el, 
      { autoAlpha: 0, y: 50 }, 
      { duration: 1, autoAlpha: 1, y: 0, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
    );
  });

  const staggerContainers = document.querySelectorAll(".gs-stagger-container");
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll(".gs-stagger-item");
    gsap.fromTo(items, 
      { autoAlpha: 0, y: 30 }, 
      { duration: 0.8, autoAlpha: 1, y: 0, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: container, start: "top 85%" } }
    );
  });
});
  
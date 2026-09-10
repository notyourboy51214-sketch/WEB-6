
document.addEventListener("DOMContentLoaded", (event) => {
  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // GSAP ScrollTrigger Integration
  gsap.registerPlugin(ScrollTrigger);

  // Initial load animations
  const tl = gsap.timeline();
  tl.to("body", { opacity: 1, duration: 0.1 })
    .to(".fade-in", { opacity: 1, duration: 1, ease: "power2.out" })
    .to(".slide-up", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
    .to(".slide-up-delay", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.7")
    .to(".fade-in-late", { opacity: 1, duration: 1 }, "-=0.5");

  // Scroll Animations
  gsap.utils.toArray('.stagger-up').forEach(element => {
    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // FAQ Interaction
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
});
  
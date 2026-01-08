// Interactive animations and effects for the main page
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effect particles
  const cards = document.querySelectorAll(".variant-card:not(.coming-soon)");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function (e) {
      createRipple(e, this);
    });
  });

  function createRipple(event, element) {
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.position = "absolute";
    circle.style.borderRadius = "50%";
    circle.style.background = "rgba(255, 255, 255, 0.1)";
    circle.style.transform = "scale(0)";
    circle.style.animation = "ripple 0.6s ease-out";
    circle.style.pointerEvents = "none";
    circle.style.zIndex = "0";

    const rect = element.getBoundingClientRect();
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;

    const ripple = element.querySelector(".ripple-effect");
    if (ripple) {
      ripple.remove();
    }

    circle.classList.add("ripple-effect");
    element.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 600);
  }

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Smooth scroll reveal for cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  cards.forEach((card) => {
    observer.observe(card);
  });

  // Add parallax effect to background
  let ticking = false;

  window.addEventListener("mousemove", (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        document.body.style.setProperty("--mouse-x", x);
        document.body.style.setProperty("--mouse-y", y);

        ticking = false;
      });
      ticking = true;
    }
  });

  console.log("🔔 Toast Notifications Gallery Loaded! ✨");
});

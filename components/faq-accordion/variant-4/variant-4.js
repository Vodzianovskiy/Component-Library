document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const neonColor = item.getAttribute("data-neon");

    // Color mapping
    const colors = {
      green: "#00ff41",
      blue: "#00d4ff",
      pink: "#ff006e",
      cyan: "#00fff5",
      purple: "#bd00ff",
      orange: "#ff9500",
    };

    const color = colors[neonColor] || "#00ff41";

    // Set colors dynamically
    question.style.color = color;
    item.style.borderColor = color;

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });

  // Keyboard accessibility
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        question.click();
      }
    });
  });

  // Random glitch effect on hover
  const glitchElements = document.querySelectorAll(".glitch");

  glitchElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.animation = "none";
      setTimeout(() => {
        el.style.animation = "glitchText 0.3s ease";
      }, 10);
    });
  });
});

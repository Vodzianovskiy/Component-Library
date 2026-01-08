document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

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

  // Add focus styles for accessibility
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("focus", () => {
      item.style.outline = "2px solid #2a2a2a";
      item.style.outlineOffset = "2px";
    });

    question.addEventListener("blur", () => {
      item.style.outline = "none";
    });
  });
});

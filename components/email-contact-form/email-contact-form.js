// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add hover effects to variant cards
const variantCards = document.querySelectorAll(".variant-card");

variantCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.zIndex = "10";
  });

  card.addEventListener("mouseleave", function () {
    this.style.zIndex = "1";
  });
});

// Add loading state to buttons
const viewButtons = document.querySelectorAll(".btn");

viewButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // Optional: Add loading indicator before navigation
    const icon = this.querySelector("i");
    if (icon) {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-spinner", "fa-spin");
    }
  });
});

// Log page view (optional analytics placeholder)
console.log("Email Contact Form Variants - Page loaded");
console.log("Available variants: 4");

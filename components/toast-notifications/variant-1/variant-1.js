// Toast Notification Manager - Glassmorphism Style
class ToastManager {
  constructor() {
    this.container = document.getElementById("toastContainer");
    this.toasts = [];
    this.autoDismissTime = 5000;
  }

  show(type, title, message) {
    const toast = this.createToast(type, title, message);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Auto dismiss
    const timeoutId = setTimeout(() => {
      this.remove(toast);
    }, this.autoDismissTime);

    // Store timeout ID for cleanup
    toast.dataset.timeoutId = timeoutId;

    return toast;
  }

  createToast(type, title, message) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };

    toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">×</button>
        `;

    // Close button handler
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.remove(toast);
    });

    // Click anywhere on toast to close
    toast.addEventListener("click", () => {
      this.remove(toast);
    });

    return toast;
  }

  remove(toast) {
    if (!toast || !toast.parentElement) return;

    // Clear auto-dismiss timeout
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }

    toast.classList.add("removing");

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 400);
  }

  clearAll() {
    this.toasts.forEach((toast) => this.remove(toast));
  }

  showAll() {
    const notifications = [
      {
        type: "success",
        title: "Success!",
        message: "Your action was completed successfully.",
      },
      {
        type: "error",
        title: "Error!",
        message: "Something went wrong. Please try again.",
      },
      {
        type: "warning",
        title: "Warning!",
        message: "Please review your information carefully.",
      },
      {
        type: "info",
        title: "Info",
        message: "Here's some helpful information for you.",
      },
    ];

    notifications.forEach((notif, index) => {
      setTimeout(() => {
        this.show(notif.type, notif.title, notif.message);
      }, index * 200);
    });
  }

  showRandom() {
    const types = ["success", "error", "warning", "info"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const messages = {
      success: [
        {
          title: "Success!",
          message: "Your changes have been saved successfully.",
        },
        { title: "Done!", message: "Task completed without any errors." },
        { title: "Perfect!", message: "Everything is working as expected." },
      ],
      error: [
        { title: "Error!", message: "Failed to connect to the server." },
        { title: "Failed!", message: "Unable to process your request." },
        { title: "Oops!", message: "Something unexpected happened." },
      ],
      warning: [
        {
          title: "Warning!",
          message: "Your session will expire in 5 minutes.",
        },
        { title: "Caution!", message: "Please save your work before leaving." },
        { title: "Alert!", message: "Low storage space remaining." },
      ],
      info: [
        { title: "Info", message: "New features are now available!" },
        { title: "Notice", message: "System maintenance tonight at 2 AM." },
        { title: "Tip", message: "Enable notifications to stay updated." },
      ],
    };

    const typeMessages = messages[randomType];
    const randomMessage =
      typeMessages[Math.floor(Math.random() * typeMessages.length)];

    this.show(randomType, randomMessage.title, randomMessage.message);
  }
}

// Initialize Toast Manager
const toastManager = new ToastManager();

// Demo button handlers
document.addEventListener("DOMContentLoaded", () => {
  const messages = {
    success: {
      title: "Success!",
      messages: [
        "Your changes have been saved successfully.",
        "File uploaded successfully!",
        "Account created successfully.",
        "Settings updated successfully!",
      ],
    },
    error: {
      title: "Error!",
      messages: [
        "Failed to save changes. Please try again.",
        "Network connection error.",
        "Invalid credentials provided.",
        "An unexpected error occurred.",
      ],
    },
    warning: {
      title: "Warning!",
      messages: [
        "Your session will expire in 5 minutes.",
        "This action cannot be undone.",
        "Please save your work before leaving.",
        "Low storage space remaining.",
      ],
    },
    info: {
      title: "Information",
      messages: [
        "New features are now available!",
        "System maintenance scheduled for tonight.",
        "Your profile has been viewed 10 times.",
        "Remember to update your password regularly.",
      ],
    },
  };

  // Demo buttons
  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const data = messages[type];
      const randomMessage =
        data.messages[Math.floor(Math.random() * data.messages.length)];

      toastManager.show(type, data.title, randomMessage);
    });
  });

  // Show all button
  document.getElementById("showAll").addEventListener("click", () => {
    toastManager.showAll();
  });

  // Clear all button
  document.getElementById("clearAll").addEventListener("click", () => {
    toastManager.clearAll();
  });

  // Random toast button
  document.getElementById("randomToast").addEventListener("click", () => {
    toastManager.showRandom();
  });

  // Welcome toast
  setTimeout(() => {
    toastManager.show(
      "info",
      "Welcome! ✨",
      "Try clicking the buttons above to see different toast styles."
    );
  }, 500);

  console.log("✨ Glassmorphism Toasts Ready!");
});

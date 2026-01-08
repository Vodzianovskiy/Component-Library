// Toast Notification Manager - Gradient Pop Style
class GradientToastManager {
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

    toast.dataset.timeoutId = timeoutId;

    return toast;
  }

  createToast(type, title, message) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success: "🎉",
      error: "🔥",
      warning: "⚡",
      info: "💡",
    };

    toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">×</button>
            <div class="toast-progress"></div>
        `;

    // Close button handler
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.remove(toast);
    });

    // Click to close
    toast.addEventListener("click", () => {
      this.remove(toast);
    });

    return toast;
  }

  remove(toast) {
    if (!toast || !toast.parentElement) return;

    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }

    toast.classList.add("removing");

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 500);
  }

  clearAll() {
    this.toasts.forEach((toast) => this.remove(toast));
  }

  showAll() {
    const notifications = [
      {
        type: "success",
        title: "Success! 🎉",
        message: "Your operation completed successfully!",
      },
      {
        type: "error",
        title: "Error! 🔥",
        message: "Something went wrong. Please try again.",
      },
      {
        type: "warning",
        title: "Warning! ⚡",
        message: "Please review your action carefully.",
      },
      {
        type: "info",
        title: "Info 💡",
        message: "Here's something you should know.",
      },
    ];

    notifications.forEach((notif, index) => {
      setTimeout(() => {
        this.show(notif.type, notif.title, notif.message);
      }, index * 250);
    });
  }

  showRandom() {
    const types = ["success", "error", "warning", "info"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const messages = {
      success: [
        { title: "Awesome! 🎉", message: "Everything is working perfectly!" },
        {
          title: "Great Job! 🌟",
          message: "Your task has been completed successfully.",
        },
        {
          title: "Success! ✨",
          message: "Data saved successfully to the cloud.",
        },
      ],
      error: [
        { title: "Oops! 🔥", message: "Failed to connect to the server." },
        { title: "Error! ❌", message: "Unable to process your request." },
        { title: "Failed! 💥", message: "Something unexpected happened." },
      ],
      warning: [
        { title: "Careful! ⚡", message: "Your session will expire soon." },
        {
          title: "Attention! ⚠️",
          message: "This action requires confirmation.",
        },
        {
          title: "Hold On! 🛑",
          message: "Make sure to save your changes first.",
        },
      ],
      info: [
        {
          title: "Hey! 💡",
          message: "New updates are available for download.",
        },
        {
          title: "Did You Know? 🎯",
          message: "You can use keyboard shortcuts for faster navigation.",
        },
        { title: "Tip! 💫", message: "Enable notifications to stay updated." },
      ],
    };

    const typeMessages = messages[randomType];
    const randomMessage =
      typeMessages[Math.floor(Math.random() * typeMessages.length)];

    this.show(randomType, randomMessage.title, randomMessage.message);
  }
}

// Initialize Toast Manager
const toastManager = new GradientToastManager();

// Demo handlers
document.addEventListener("DOMContentLoaded", () => {
  const messages = {
    success: [
      {
        title: "Perfect! 🎉",
        message: "Your profile has been updated successfully!",
      },
      {
        title: "Done! ✅",
        message: "File uploaded and processed without errors.",
      },
      { title: "Success! 🌟", message: "Payment completed successfully!" },
    ],
    error: [
      {
        title: "Error! 🔥",
        message: "Network connection failed. Check your internet.",
      },
      {
        title: "Failed! ❌",
        message: "Unable to authenticate. Invalid credentials.",
      },
      {
        title: "Oops! 💥",
        message: "Server error occurred. Please try again later.",
      },
    ],
    warning: [
      {
        title: "Warning! ⚡",
        message: "Your storage is almost full. Clean up space.",
      },
      {
        title: "Caution! ⚠️",
        message: "Unsaved changes will be lost if you leave now.",
      },
      {
        title: "Alert! 🚨",
        message: "Security update recommended for your account.",
      },
    ],
    info: [
      { title: "Info 💡", message: "New features released! Check what's new." },
      {
        title: "Update 🎯",
        message: "System maintenance scheduled for tonight.",
      },
      { title: "Tip 💫", message: "Use dark mode to reduce eye strain." },
    ],
  };

  // Demo buttons
  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const typeMessages = messages[type];
      const randomMsg =
        typeMessages[Math.floor(Math.random() * typeMessages.length)];

      toastManager.show(type, randomMsg.title, randomMsg.message);
    });
  });

  // Show all
  document.getElementById("showAll").addEventListener("click", () => {
    toastManager.showAll();
  });

  // Clear all
  document.getElementById("clearAll").addEventListener("click", () => {
    toastManager.clearAll();
  });

  // Random toast
  document.getElementById("randomToast").addEventListener("click", () => {
    toastManager.showRandom();
  });

  // Welcome toast
  setTimeout(() => {
    toastManager.show(
      "success",
      "Welcome! 🎨",
      "Enjoy the vibrant gradient toast notifications!"
    );
  }, 600);

  console.log("🎨 Gradient Pop Toasts Loaded!");
});

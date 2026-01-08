// Toast Notification Manager - Minimal Dark Style
class MinimalToastManager {
  constructor() {
    this.container = document.getElementById("toastContainer");
    this.toasts = [];
    this.autoDismissTime = 5000;
  }

  show(type, title, message) {
    const toast = this.createToast(type, title, message);
    this.container.appendChild(toast);
    this.toasts.push(toast);

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
      success:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>',
      error:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>',
      warning:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    };

    toast.innerHTML = `
            <div class="toast-icon-wrapper">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">×</button>
        `;

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.remove(toast);
    });

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
    }, 300);
  }

  clearAll() {
    this.toasts.forEach((toast) => this.remove(toast));
  }

  showAll() {
    const notifications = [
      {
        type: "success",
        title: "Success",
        message: "Your operation completed successfully.",
      },
      {
        type: "error",
        title: "Error",
        message: "Something went wrong. Please try again.",
      },
      {
        type: "warning",
        title: "Warning",
        message: "Please review your action carefully.",
      },
      {
        type: "info",
        title: "Information",
        message: "Here is some helpful information.",
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
          title: "Success",
          message: "Your changes have been saved successfully.",
        },
        { title: "Completed", message: "Task finished without any errors." },
        {
          title: "Done",
          message: "All files have been uploaded successfully.",
        },
      ],
      error: [
        { title: "Error", message: "Failed to connect to the server." },
        {
          title: "Failed",
          message: "Unable to process your request right now.",
        },
        {
          title: "Connection Lost",
          message: "Network connection has been interrupted.",
        },
      ],
      warning: [
        { title: "Warning", message: "Your session will expire in 5 minutes." },
        {
          title: "Attention Required",
          message: "Please confirm your action before proceeding.",
        },
        { title: "Caution", message: "Make sure to save your work first." },
      ],
      info: [
        {
          title: "Update Available",
          message: "A new version is ready to download.",
        },
        {
          title: "Tip",
          message: "Use keyboard shortcuts for faster navigation.",
        },
        {
          title: "Notice",
          message: "System maintenance scheduled for tonight.",
        },
      ],
    };

    const typeMessages = messages[randomType];
    const randomMessage =
      typeMessages[Math.floor(Math.random() * typeMessages.length)];

    this.show(randomType, randomMessage.title, randomMessage.message);
  }
}

// Initialize Toast Manager
const toastManager = new MinimalToastManager();

// Demo handlers
document.addEventListener("DOMContentLoaded", () => {
  const messages = {
    success: [
      {
        title: "Success",
        message: "Your profile has been updated successfully.",
      },
      {
        title: "Saved",
        message: "All changes have been saved to the database.",
      },
      { title: "Complete", message: "Operation completed without errors." },
    ],
    error: [
      {
        title: "Error",
        message: "Network connection failed. Check your internet.",
      },
      {
        title: "Failed",
        message: "Unable to authenticate. Invalid credentials.",
      },
      {
        title: "Server Error",
        message: "An unexpected error occurred on the server.",
      },
    ],
    warning: [
      {
        title: "Warning",
        message: "Your storage is almost full. Clean up space.",
      },
      {
        title: "Unsaved Changes",
        message: "You have unsaved changes that will be lost.",
      },
      {
        title: "Security Alert",
        message: "Update recommended for your account.",
      },
    ],
    info: [
      {
        title: "Information",
        message: "New features are now available to use.",
      },
      {
        title: "Maintenance",
        message: "System maintenance tonight from 2-4 AM.",
      },
      {
        title: "Reminder",
        message: "Remember to update your password regularly.",
      },
    ],
  };

  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const typeMessages = messages[type];
      const randomMsg =
        typeMessages[Math.floor(Math.random() * typeMessages.length)];

      toastManager.show(type, randomMsg.title, randomMsg.message);
    });
  });

  document.getElementById("showAll").addEventListener("click", () => {
    toastManager.showAll();
  });

  document.getElementById("clearAll").addEventListener("click", () => {
    toastManager.clearAll();
  });

  document.getElementById("randomToast").addEventListener("click", () => {
    toastManager.showRandom();
  });

  setTimeout(() => {
    toastManager.show(
      "info",
      "Welcome",
      "Experience clean and minimal toast notifications."
    );
  }, 500);

  console.log("🌙 Minimal Dark Toasts Ready!");
});

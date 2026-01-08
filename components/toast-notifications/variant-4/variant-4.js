// Toast Notification Manager - Neon Cyber Style
class CyberToastManager {
  constructor() {
    this.container = document.getElementById("toastContainer");
    this.toasts = [];
    this.autoDismissTime = 5000;
    this.totalCount = 0;

    this.updateStats();
  }

  show(type, title, message) {
    const toast = this.createToast(type, title, message);
    this.container.appendChild(toast);
    this.toasts.push(toast);
    this.totalCount++;

    this.updateStats();

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
      success: "◆",
      error: "✖",
      warning: "▲",
      info: "●",
    };

    toast.innerHTML = `
            <div class="toast-cyber-icon">${icons[type]}</div>
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
      this.updateStats();
    }, 400);
  }

  clearAll() {
    this.toasts.forEach((toast) => this.remove(toast));
  }

  showAll() {
    const notifications = [
      {
        type: "success",
        title: "[ SUCCESS ]",
        message: "System operation completed successfully.",
      },
      {
        type: "error",
        title: "[ ERROR ]",
        message: "Critical system failure detected.",
      },
      {
        type: "warning",
        title: "[ WARNING ]",
        message: "System resources running low.",
      },
      {
        type: "info",
        title: "[ INFO ]",
        message: "New firmware update available.",
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
        {
          title: "[ AUTHORIZED ]",
          message: "Access granted to secure network.",
        },
        {
          title: "[ COMPLETED ]",
          message: "Data upload finished successfully.",
        },
        { title: "[ SYNCHRONIZED ]", message: "All systems are now in sync." },
      ],
      error: [
        {
          title: "[ DENIED ]",
          message: "Access to mainframe has been denied.",
        },
        {
          title: "[ CRITICAL ]",
          message: "System breach detected on port 8080.",
        },
        { title: "[ FAILURE ]", message: "Connection to remote server lost." },
      ],
      warning: [
        { title: "[ ALERT ]", message: "Security protocol update required." },
        {
          title: "[ CAUTION ]",
          message: "Unauthorized access attempt detected.",
        },
        {
          title: "[ ATTENTION ]",
          message: "System resources at 85% capacity.",
        },
      ],
      info: [
        { title: "[ UPDATE ]", message: "New cybersecurity patch available." },
        {
          title: "[ NOTICE ]",
          message: "Scheduled maintenance in 60 minutes.",
        },
        { title: "[ TIP ]", message: "Enable two-factor authentication." },
      ],
    };

    const typeMessages = messages[randomType];
    const randomMessage =
      typeMessages[Math.floor(Math.random() * typeMessages.length)];

    this.show(randomType, randomMessage.title, randomMessage.message);
  }

  updateStats() {
    const totalElement = document.getElementById("totalToasts");
    const activeElement = document.getElementById("activeToasts");

    if (totalElement) {
      totalElement.textContent = this.totalCount;
    }
    if (activeElement) {
      activeElement.textContent = this.toasts.length;
    }
  }
}

// Initialize Toast Manager
const toastManager = new CyberToastManager();

// Demo handlers
document.addEventListener("DOMContentLoaded", () => {
  const messages = {
    success: [
      {
        title: "[ AUTHENTICATED ]",
        message: "User credentials verified successfully.",
      },
      { title: "[ UPLOADED ]", message: "Neural network data transferred." },
      { title: "[ CONNECTED ]", message: "Quantum link established." },
    ],
    error: [
      {
        title: "[ TERMINATED ]",
        message: "Process killed due to memory overflow.",
      },
      { title: "[ CORRUPTED ]", message: "Data integrity check failed." },
      { title: "[ TIMEOUT ]", message: "Server response time exceeded." },
    ],
    warning: [
      {
        title: "[ UNSTABLE ]",
        message: "Network connection experiencing high latency.",
      },
      {
        title: "[ EXPIRING ]",
        message: "Security certificate expires in 48 hours.",
      },
      {
        title: "[ OVERLOAD ]",
        message: "CPU temperature reaching critical levels.",
      },
    ],
    info: [
      {
        title: "[ AVAILABLE ]",
        message: "Neural interface upgrade ready to install.",
      },
      {
        title: "[ SCHEDULED ]",
        message: "System backup starts at 03:00 hours.",
      },
      { title: "[ PROTOCOL ]", message: "New encryption standard deployed." },
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
      "[ SYSTEM ONLINE ]",
      "Neon cyber notification system initialized."
    );
  }, 600);

  console.log("⚡ Neon Cyber Toasts Loaded!");
});

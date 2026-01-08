class NeonContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitBtn = this.form.querySelector(".submit-btn");
    this.statusDiv = this.form.querySelector(".form-status");
    this.rateLimitKey = "neonForm_lastSubmit";
    this.rateLimitDelay = 30000;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupCharCounter();
    this.addGlitchEffect();
  }

  setupEventListeners() {
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("error")) {
          this.validateField(field);
        }
      });
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  setupCharCounter() {
    const messageField = document.getElementById("message");
    const counter = document.querySelector(".char-counter");

    messageField.addEventListener("input", () => {
      const length = messageField.value.length;
      counter.textContent = `${length} / 1000`;

      if (length > 900) {
        counter.style.color = "#ff0055";
        counter.style.textShadow = "0 0 10px #ff0055";
      } else {
        counter.style.color = "#8a8a8a";
        counter.style.textShadow = "none";
      }
    });
  }

  addGlitchEffect() {
    const glitch = document.querySelector(".glitch");
    setInterval(() => {
      if (Math.random() > 0.95) {
        glitch.style.textShadow = `
                    ${Math.random() * 10 - 5}px ${
          Math.random() * 10 - 5
        }px 0 #ff0055,
                    ${Math.random() * 10 - 5}px ${
          Math.random() * 10 - 5
        }px 0 #00d4ff
                `;
        setTimeout(() => {
          glitch.style.textShadow =
            "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #8a2be2";
        }, 100);
      }
    }, 2000);
  }

  validateField(field) {
    const value = field.value.trim();
    const errorSpan = field.parentElement.querySelector(".error-message");
    let errorMessage = "";

    field.classList.remove("error", "success");

    if (field.hasAttribute("required") && !value) {
      errorMessage = "⚠ Required Field";
    } else if (field.type === "email" && value) {
      if (!this.isValidEmail(value)) {
        errorMessage = "⚠ Invalid Email";
      }
    } else if (field.name === "name" && value) {
      if (value.length < 2) {
        errorMessage = "⚠ Min 2 Chars";
      } else if (!this.isValidName(value)) {
        errorMessage = "⚠ Letters Only";
      }
    } else if (field.name === "message" && value) {
      if (value.length < 10) {
        errorMessage = "⚠ Min 10 Chars";
      }
    }

    if (errorMessage) {
      field.classList.add("error");
      errorSpan.textContent = errorMessage;
      return false;
    } else if (value) {
      field.classList.add("success");
      errorSpan.textContent = "";
      return true;
    }

    errorSpan.textContent = "";
    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  }

  isValidName(name) {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
  }

  checkRateLimit() {
    const lastSubmit = localStorage.getItem(this.rateLimitKey);
    if (lastSubmit) {
      const timePassed = Date.now() - parseInt(lastSubmit);
      if (timePassed < this.rateLimitDelay) {
        const secondsLeft = Math.ceil(
          (this.rateLimitDelay - timePassed) / 1000
        );
        return { allowed: false, secondsLeft };
      }
    }
    return { allowed: true };
  }

  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  async handleSubmit() {
    let isValid = true;
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showStatus("⚠ Fix Errors", "error");
      return;
    }

    const rateCheck = this.checkRateLimit();
    if (!rateCheck.allowed) {
      this.showStatus(`⏳ Wait ${rateCheck.secondsLeft}s`, "error");
      return;
    }

    const formData = {
      name: this.sanitizeInput(document.getElementById("name").value.trim()),
      email: this.sanitizeInput(document.getElementById("email").value.trim()),
      subject: this.sanitizeInput(
        document.getElementById("subject").value.trim()
      ),
      message: this.sanitizeInput(
        document.getElementById("message").value.trim()
      ),
      timestamp: new Date().toISOString(),
    };

    this.setLoading(true);

    try {
      const response = await this.sendEmail(formData);

      if (response.success) {
        this.showStatus("✓ Message Sent!", "success");
        this.form.reset();
        this.form.querySelectorAll("input, textarea").forEach((field) => {
          field.classList.remove("success", "error");
        });
        localStorage.setItem(this.rateLimitKey, Date.now().toString());
      } else {
        throw new Error(response.message || "Send error");
      }
    } catch (error) {
      this.showStatus("✗ Send Failed", "error");
      console.error("Submit error:", error);
    } finally {
      this.setLoading(false);
    }
  }

  async sendEmail(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form data to send:", data);
        resolve({ success: true });
      }, 1500);
    });

    /* REAL SUBMISSION:
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
        */
  }

  setLoading(isLoading) {
    this.submitBtn.disabled = isLoading;
    if (isLoading) {
      this.submitBtn.classList.add("loading");
    } else {
      this.submitBtn.classList.remove("loading");
    }
  }

  showStatus(message, type) {
    this.statusDiv.textContent = message;
    this.statusDiv.className = `form-status ${type}`;

    if (type === "success") {
      setTimeout(() => {
        this.statusDiv.style.display = "none";
      }, 5000);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new NeonContactForm("contactForm");
});

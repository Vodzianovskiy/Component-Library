class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitBtn = this.form.querySelector(".submit-btn");
    this.statusDiv = this.form.querySelector(".form-status");
    this.rateLimitKey = "contactForm_lastSubmit";
    this.rateLimitDelay = 30000; // 30 seconds between submissions

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupCharCounter();
  }

  setupEventListeners() {
    // Real-time validation
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("error")) {
          this.validateField(field);
        }
      });
    });

    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  setupCharCounter() {
    const messageField = document.getElementById("message");
    const counter = this.form.querySelector(".char-counter");

    messageField.addEventListener("input", () => {
      const length = messageField.value.length;
      counter.textContent = `${length} / 1000`;

      if (length > 900) {
        counter.style.color = "#f56565";
      } else {
        counter.style.color = "#a0aec0";
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const errorSpan = field.parentElement.querySelector(".error-message");
    let errorMessage = "";

    // Clear previous styles
    field.classList.remove("error", "success");

    if (field.hasAttribute("required") && !value) {
      errorMessage = "This field is required";
    } else if (field.type === "email" && value) {
      if (!this.isValidEmail(value)) {
        errorMessage = "Please enter a valid email";
      }
    } else if (field.name === "name" && value) {
      if (value.length < 2) {
        errorMessage = "Minimum 2 characters";
      } else if (!this.isValidName(value)) {
        errorMessage = "Only letters and spaces allowed";
      }
    } else if (field.name === "message" && value) {
      if (value.length < 10) {
        errorMessage = "Minimum 10 characters";
      }
    }

    // Display error or success
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
    // RFC 5322 simplified version
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  }

  isValidName(name) {
    // Allow letters, spaces, hyphens, apostrophes
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
    // XSS protection
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  async handleSubmit() {
    // Validate all fields
    let isValid = true;
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showStatus("Please fix the errors in the form", "error");
      return;
    }

    // Rate limiting
    const rateCheck = this.checkRateLimit();
    if (!rateCheck.allowed) {
      this.showStatus(
        `Please wait ${rateCheck.secondsLeft} seconds before submitting again`,
        "error"
      );
      return;
    }

    // Collect and sanitize data
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

    // Show loading state
    this.setLoading(true);

    try {
      // Your backend endpoint here
      const response = await this.sendEmail(formData);

      if (response.success) {
        this.showStatus("✅ Message sent successfully!", "success");
        this.form.reset();
        this.form.querySelectorAll("input, textarea").forEach((field) => {
          field.classList.remove("success", "error");
        });
        localStorage.setItem(this.rateLimitKey, Date.now().toString());
      } else {
        throw new Error(response.message || "Send error");
      }
    } catch (error) {
      this.showStatus("❌ Failed to send. Please try again later.", "error");
      console.error("Submit error:", error);
    } finally {
      this.setLoading(false);
    }
  }

  async sendEmail(data) {
    // SIMULATION (replace with your endpoint)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Form data to send:", data);
        resolve({ success: true });
      }, 1500);
    });

    /* REAL SUBMISSION (uncomment and configure):
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

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  new ContactForm("contactForm");
});

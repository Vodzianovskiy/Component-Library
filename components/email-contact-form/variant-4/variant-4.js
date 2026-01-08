class CorporateContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitBtn = this.form.querySelector(".submit-btn");
    this.resetBtn = this.form.querySelector(".reset-btn");
    this.statusDiv = this.form.querySelector(".form-status");
    this.rateLimitKey = "corporateForm_lastSubmit";
    this.rateLimitDelay = 30000;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupCharCounter();
  }

  setupEventListeners() {
    // Real-time validation
    this.form
      .querySelectorAll('input:not([type="checkbox"]), textarea, select')
      .forEach((field) => {
        field.addEventListener("blur", () => this.validateField(field));
        field.addEventListener("input", () => {
          if (field.classList.contains("error")) {
            this.validateField(field);
          }
        });
      });

    // Checkbox validation
    const termsCheckbox = document.getElementById("terms");
    termsCheckbox.addEventListener("change", () =>
      this.validateCheckbox(termsCheckbox)
    );

    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Reset button
    this.resetBtn.addEventListener("click", () => this.handleReset());
  }

  setupCharCounter() {
    const messageField = document.getElementById("message");
    const counter = document.querySelector(".char-counter");

    messageField.addEventListener("input", () => {
      const length = messageField.value.length;
      counter.textContent = `${length} / 2000`;

      if (length > 1800) {
        counter.style.color = "#ef4444";
      } else {
        counter.style.color = "#94a3b8";
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const errorSpan = field.parentElement.querySelector(".error-message");
    let errorMessage = "";

    field.classList.remove("error", "success");

    // Required field check
    if (field.hasAttribute("required") && !value) {
      errorMessage = "This field is required";
    }
    // Email validation
    else if (field.type === "email" && value) {
      if (!this.isValidEmail(value)) {
        errorMessage = "Please enter a valid business email";
      }
    }
    // Name validation
    else if (
      (field.name === "firstName" || field.name === "lastName") &&
      value
    ) {
      if (value.length < 2) {
        errorMessage = "Minimum 2 characters required";
      } else if (!this.isValidName(value)) {
        errorMessage = "Only letters, spaces, and hyphens allowed";
      }
    }
    // Phone validation
    else if (field.type === "tel" && value) {
      if (!this.isValidPhone(value)) {
        errorMessage = "Please enter a valid phone number";
      }
    }
    // Message validation
    else if (field.name === "message" && value) {
      if (value.length < 20) {
        errorMessage = "Message must be at least 20 characters";
      }
    }

    if (errorMessage) {
      field.classList.add("error");
      errorSpan.textContent = errorMessage;
      return false;
    } else if (value || field.tagName === "SELECT") {
      field.classList.add("success");
      errorSpan.textContent = "";
      return true;
    }

    errorSpan.textContent = "";
    return true;
  }

  validateCheckbox(checkbox) {
    const errorSpan = checkbox
      .closest(".checkbox-group")
      .querySelector(".error-message");

    if (!checkbox.checked) {
      errorSpan.textContent = "You must agree to the terms and conditions";
      return false;
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

  isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
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

    // Validate all text fields
    this.form
      .querySelectorAll('input:not([type="checkbox"]), textarea, select')
      .forEach((field) => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

    // Validate checkbox
    const termsCheckbox = document.getElementById("terms");
    if (!this.validateCheckbox(termsCheckbox)) {
      isValid = false;
    }

    if (!isValid) {
      this.showStatus("Please fix all errors before submitting", "error");
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
      firstName: this.sanitizeInput(
        document.getElementById("firstName").value.trim()
      ),
      lastName: this.sanitizeInput(
        document.getElementById("lastName").value.trim()
      ),
      email: this.sanitizeInput(document.getElementById("email").value.trim()),
      phone: this.sanitizeInput(document.getElementById("phone").value.trim()),
      company: this.sanitizeInput(
        document.getElementById("company").value.trim()
      ),
      department: document.getElementById("department").value,
      subject: this.sanitizeInput(
        document.getElementById("subject").value.trim()
      ),
      message: this.sanitizeInput(
        document.getElementById("message").value.trim()
      ),
      termsAccepted: document.getElementById("terms").checked,
      timestamp: new Date().toISOString(),
    };

    this.setLoading(true);

    try {
      const response = await this.sendEmail(formData);

      if (response.success) {
        this.showStatus(
          "✓ Your request has been submitted successfully. We will contact you soon.",
          "success"
        );
        this.form.reset();
        this.form
          .querySelectorAll("input, textarea, select")
          .forEach((field) => {
            field.classList.remove("success", "error");
          });
        localStorage.setItem(this.rateLimitKey, Date.now().toString());
      } else {
        throw new Error(response.message || "Submission error");
      }
    } catch (error) {
      this.showStatus(
        "✗ Submission failed. Please try again or contact support.",
        "error"
      );
      console.error("Submit error:", error);
    } finally {
      this.setLoading(false);
    }
  }

  async sendEmail(data) {
    // SIMULATION (replace with your endpoint)
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Corporate form data to send:", data);
        resolve({ success: true });
      }, 1500);
    });

    /* REAL SUBMISSION:
        const response = await fetch('/api/corporate-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return await response.json();
        */
  }

  handleReset() {
    if (confirm("Are you sure you want to clear all form fields?")) {
      this.form.reset();
      this.form.querySelectorAll("input, textarea, select").forEach((field) => {
        field.classList.remove("success", "error");
      });
      this.form.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
      });
      this.statusDiv.style.display = "none";
    }
  }

  setLoading(isLoading) {
    this.submitBtn.disabled = isLoading;
    this.resetBtn.disabled = isLoading;
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
      }, 7000);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CorporateContactForm("contactForm");
});

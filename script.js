document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // INITIALIZE LUCIDE ICONS
  // ==========================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // THEME SWITCHER
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const toggleLabel = document.getElementById('toggle-label');
  const body = document.body;

  // Load saved theme or default to Slate
  const savedTheme = localStorage.getItem('portfolio-theme') || 'theme-dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
    const newTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    applyTheme(newTheme);
  });

  function applyTheme(theme) {
    if (theme === 'theme-light') {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      toggleLabel.textContent = 'VANILLA';
    } else {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      toggleLabel.textContent = 'STEEL';
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  // ==========================================================================
  // PROJECT FILTERING
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Animate in
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          // Animate out
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match CSS transition speeds
        }
      });
    });
  });

  // Ensure card layout transitions are smooth
  projectCards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
  });

  // ==========================================================================
  // SCROLL-TRIGGERED REVEAL ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.animate-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // triggers slightly before elements enter screen
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(element => {
      element.classList.add('active');
    });
  }

  // ==========================================================================
  // CONTACT FORM VALIDATION & SIMULATION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Reset validation states
      resetInputState(nameInput);
      resetInputState(emailInput);
      resetInputState(messageInput);
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';

      // 1. Name Validation
      if (!nameInput.value.trim()) {
        showInputError(nameInput);
        isValid = false;
      }

      // 2. Email Validation
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
        showInputError(emailInput);
        isValid = false;
      }

      // 3. Message Validation
      if (!messageInput.value.trim()) {
        showInputError(messageInput);
        isValid = false;
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const submitText = submitBtn.querySelector('span');
        const originalText = submitText.textContent;
        
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        formFeedback.textContent = 'Sending your message...';
        formFeedback.className = 'form-feedback info';
        formFeedback.style.display = 'block';

        fetch("https://formsubmit.co/ajax/udaykarthik1204@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
            _subject: `New Portfolio Message from ${nameInput.value}`,
            _captcha: "false"
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
          formFeedback.className = 'form-feedback success';
          contactForm.reset();
        })
        .catch(error => {
          console.error('Error sending message:', error);
          formFeedback.textContent = 'Something went wrong. Please try again later.';
          formFeedback.className = 'form-feedback error';
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitText.textContent = originalText;
        });
      }
    });

    // Real-time error clearing
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          resetInputState(input);
        }
      });
    });
  }

  function showInputError(input) {
    const parent = input.parentElement;
    parent.classList.add('invalid');
    const errorMsg = parent.querySelector('.error-msg');
    if (errorMsg) errorMsg.style.display = 'block';
  }

  function resetInputState(input) {
    const parent = input.parentElement;
    parent.classList.remove('invalid');
    const errorMsg = parent.querySelector('.error-msg');
    if (errorMsg) errorMsg.style.display = 'none';
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ==========================================================================
  // PORTRAIT HOVER REVEAL EFFECT
  // ==========================================================================
  const portraitContainer = document.getElementById('portrait-container');
  const overlayFrame = portraitContainer ? portraitContainer.querySelector('.overlay-frame') : null;

  if (portraitContainer && overlayFrame) {
    portraitContainer.addEventListener('mousemove', (e) => {
      const rect = portraitContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Reveal alternate photo inside a circle centered at the mouse coordinates
      overlayFrame.style.clipPath = `circle(80px at ${x}px ${y}px)`;
    });

    portraitContainer.addEventListener('mouseleave', () => {
      // Smoothly hide the overlay image when mouse leaves
      overlayFrame.style.clipPath = 'circle(0px at 50% 50%)';
    });
  }
});

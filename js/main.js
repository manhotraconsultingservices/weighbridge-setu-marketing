/* ══════════════════════════════════════════════════════════════
   WeighbridgeSetu Marketing Site — main.js
   Scroll reveals, counters, sticky nav, form handling
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Scroll Reveal (Intersection Observer) ──────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    revealObserver.observe(el);
  });

  // ── Stagger children delay ─────────────────────────────────
  document.querySelectorAll('[data-stagger]').forEach((parent) => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.setProperty('--i', i);
    });
  });

  // ── Animated Counters ──────────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('[data-count]').forEach((el) => {
    counterObserver.observe(el);
  });

  // ── Sticky Navbar ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Smooth Scroll for Anchor Links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) mobileMenu.classList.remove('open');
      }
    });
  });

  // ── Mobile Menu Toggle ─────────────────────────────────────
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      // Toggle hamburger / X icon
      const bars = menuToggle.querySelector('.bars');
      const xIcon = menuToggle.querySelector('.x-icon');
      if (bars && xIcon) {
        bars.style.display = isOpen ? 'none' : 'block';
        xIcon.style.display = isOpen ? 'block' : 'none';
      }
    });
  }

  // ── Hero Weight Display Animation ──────────────────────────
  const hwd = document.querySelector('.hwd-value');
  if (hwd) {
    const weights = [24850, 25120, 24990, 25040, 24870, 25200, 24760];
    let idx = 0;
    function updateWeight() {
      const w = weights[idx];
      hwd.innerHTML = (w / 1000).toFixed(2) + ' <span>t</span>';
      idx = (idx + 1) % weights.length;
    }
    updateWeight();
    setInterval(updateWeight, 2500);
  }

  // ── Contact Form Handling ──────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        // Try Formspree (replace with your endpoint)
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          form.style.display = 'none';
          const success = document.querySelector('.form-success');
          if (success) success.classList.add('show');
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        // Fallback: show success anyway for demo
        // In production, replace with real error handling
        form.style.display = 'none';
        const success = document.querySelector('.form-success');
        if (success) success.classList.add('show');
      }

      btn.textContent = originalText;
      btn.disabled = false;
    });
  }

  // ── Active Nav Link on Scroll ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.style.color =
                link.getAttribute('href') === '#' + id ? '#fff' : '';
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );
    sections.forEach((s) => activeObserver.observe(s));
  }
  // ── Floating Chat Widget Toggle ────────────────────────────────
  var chatWidget = document.getElementById('chatWidget');
  var chatToggleBtn = document.getElementById('chatToggleBtn');
  var chatCloseBtn = document.getElementById('chatCloseBtn');

  if (chatWidget && chatToggleBtn) {
    chatToggleBtn.addEventListener('click', function () {
      chatWidget.classList.toggle('open');
      if (chatWidget.classList.contains('open')) {
        var inp = document.getElementById('chatInput');
        if (inp) setTimeout(function () { inp.focus(); }, 100);
      }
    });
    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', function () {
        chatWidget.classList.remove('open');
      });
    }
  }

  // ── AI Chatbot (Cloudflare Workers AI + Email Notifications) ──
  var chatInput = document.getElementById('chatInput');
  var chatSendBtn = document.getElementById('chatSendBtn');
  var chatMessages = document.getElementById('chatMessages');

  if (chatInput && chatSendBtn && chatMessages) {
    const WORKER_URL = 'https://weighbridgesetu-ai.manhotraconsultingservices.workers.dev';
    const FORMSPREE_URL = 'https://formspree.io/f/xlgpvrjz';
    const chatHistory = [];

    function addMessage(text, role) {
      const div = document.createElement('div');
      div.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');
      div.textContent = text;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    }

    function addTypingIndicator() {
      const div = document.createElement('div');
      div.className = 'chat-msg bot typing';
      div.id = 'typingIndicator';
      div.textContent = 'Thinking';
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    }

    function removeTypingIndicator() {
      var el = document.getElementById('typingIndicator');
      if (el) el.remove();
    }

    function notifyEmail(userMessage, botReply) {
      fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'WeighbridgeSetu AI Chat Query',
          source: 'AI Chatbot',
          user_query: userMessage,
          ai_response: botReply,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          page_url: window.location.href
        })
      }).catch(function () {});
    }

    async function sendMessage() {
      var text = chatInput.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      chatInput.value = '';
      chatInput.disabled = true;
      chatSendBtn.disabled = true;

      chatHistory.push({ role: 'user', content: text });
      addTypingIndicator();

      try {
        var response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: chatHistory.slice(0, -1)
          })
        });

        var data = await response.json();
        removeTypingIndicator();

        var reply = data.reply || 'Sorry, I could not process that. Please contact us at +91 70111 89371.';

        addMessage(reply, 'bot');
        chatHistory.push({ role: 'assistant', content: reply });

        notifyEmail(text, reply);

      } catch (err) {
        removeTypingIndicator();
        addMessage('Connection error. Please try again or call us at +91 70111 89371.', 'bot');
      }

      chatInput.disabled = false;
      chatSendBtn.disabled = false;
      chatInput.focus();
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

})();

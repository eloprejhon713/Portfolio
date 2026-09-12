/* ── LOADER ── */
  const loaderEl = document.getElementById('loader');
  const pctEl    = document.getElementById('loaderPct');
  const statusEl = document.getElementById('loaderStatus');
  const phases   = ['Initialising','Loading assets','Building UI','Almost ready','Complete'];
  let pct = 0;
  document.body.style.overflow = 'hidden';
  const iv = setInterval(() => {
    pct = Math.min(pct + Math.floor(Math.random() * 9) + 4, 100);
    pctEl.textContent = pct + '%';
    statusEl.textContent = phases[Math.min(Math.floor(pct / 25), 4)];
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        loaderEl.classList.add('loader-done');
        setTimeout(() => { loaderEl.style.display = 'none'; document.body.style.overflow = ''; }, 650);
      }, 300);
    }
  }, 80);

  /* ── SCROLL REVEAL ── */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* ── PANEL NAV ── */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuBtn = document.getElementById('menuBtn');

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
  menuBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  function showPanel(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if (!panel) return;
    panel.classList.add('active');
    document.querySelectorAll('#sideNav a').forEach(a => {
      a.classList.toggle('active', a.dataset.nav === id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebar();
    panel.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    if (id === 'projects') {
      const scroller = document.getElementById('projectsScroll');
      const grid = document.getElementById('projectsGrid');
      if (scroller) scroller.scrollTop = 0;
      if (grid) {
        grid.querySelectorAll('.project-card').forEach(card => {
          card.classList.add('visible');
          if (card.classList.contains('is-hidden')) return;
          card.style.display = '';
          card.style.opacity = '';
          card.style.transform = '';
          card.style.pointerEvents = '';
        });
      }
    }
  }

  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.nav;
      if (!id) return;
      e.preventDefault();
      showPanel(id);
      history.replaceState(null, '', '#' + id);
    });
  });

  const hash = (location.hash || '#home').slice(1);
  if (['home','projects','services','stack','about','contact'].includes(hash)) {
    showPanel(hash);
  }
  /* ── BENTO PROJECTS CAROUSEL ── */
  (function initProjectsCarousel() {
    const root = document.getElementById('projectsCarousel');
    if (!root) return;
    const track = root.querySelector('.bento-carousel-track');
    const slides = Array.from(track.querySelectorAll('.slide'));
    const dotsWrap = document.getElementById('projectsCarouselDots');
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
      // pause other videos, play current if video
      slides.forEach((slide, si) => {
        const v = slide.querySelector('video');
        if (!v) return;
        if (si === index) {
          v.currentTime = 0;
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function start() {
      clearInterval(timer);
      timer = setInterval(next, 3500);
    }

    prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); prev(); start(); });
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); next(); start(); });
    root.addEventListener('click', (e) => {
      if (e.target.closest('.bento-carousel-nav')) e.preventDefault();
    });
    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', start);

    go(0);
    start();
  })();

  /* ── PROJECT FILTER ── */
  function filterProjects(cat, btn) {
    const filtersRoot = document.getElementById('filters');
    if (filtersRoot) {
      filtersRoot.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    } else {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    }
    if (btn) btn.classList.add('active');
    const scroller = document.getElementById('projectsScroll');
    if (scroller) scroller.scrollTop = 0;
    document.querySelectorAll('#projectsGrid .project-card').forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      if (match) {
        card.classList.remove('is-hidden');
        card.style.display = '';
        card.style.opacity = '';
        card.style.transform = '';
        card.style.pointerEvents = '';
        card.classList.add('visible');
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  const filtersEl = document.getElementById('filters');
  if (filtersEl) {
    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn || !filtersEl.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      const cat = btn.getAttribute('data-filter') || 'all';
      filterProjects(cat, btn);
    });
  }

  /* ── PROJECT DETAIL POPUP ── */
  const projectModal = document.getElementById('project-modal');
  const projectModalImg = document.getElementById('projectModalImg');
  const projectModalType = document.getElementById('projectModalType');
  const projectModalMeta = document.getElementById('projectModalMeta');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalDesc = document.getElementById('projectModalDesc');
  const projectModalTags = document.getElementById('projectModalTags');
  const projectModalClose = document.getElementById('projectModalClose');

  function openProjectModal(card) {
    if (!projectModal || !card) return;
    const img = card.querySelector('.project-cover');
    const type = card.querySelector('.project-type');
    const meta = card.querySelector('.project-meta');
    const name = card.querySelector('.project-name');
    const desc = card.querySelector('.project-desc');
    const tags = card.querySelector('.project-tags');

    if (projectModalImg) {
      projectModalImg.src = img ? img.getAttribute('src') || '' : '';
      projectModalImg.alt = (name && name.textContent) || (img && img.alt) || 'Project';
    }
    if (projectModalType) projectModalType.textContent = type ? type.textContent.trim() : '';
    if (projectModalMeta) projectModalMeta.innerHTML = meta ? meta.innerHTML : '';
    if (projectModalTitle) projectModalTitle.textContent = name ? name.textContent.trim() : '';
    if (projectModalDesc) projectModalDesc.textContent = desc ? desc.textContent.trim() : '';
    if (projectModalTags) projectModalTags.innerHTML = tags ? tags.innerHTML : '';

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (projectModalClose) projectModalClose.focus();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const projectsGridEl = document.getElementById('projectsGrid');
  if (projectsGridEl) {
    projectsGridEl.querySelectorAll('.project-card').forEach(card => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
    });
    projectsGridEl.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      if (!card || card.classList.contains('is-hidden')) return;
      openProjectModal(card);
    });
    projectsGridEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.project-card');
      if (!card || card.classList.contains('is-hidden')) return;
      e.preventDefault();
      openProjectModal(card);
    });
  }

  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    const backdrop = projectModal.querySelector('[data-close-project-modal]');
    if (backdrop) backdrop.addEventListener('click', closeProjectModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  /* ── API base (Render backend when hosted on GitHub Pages) ── */
  const API_BASE = (() => {
    const host = location.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".onrender.com") ||
      host.endsWith(".test") ||
      host === "portfolio.test"
    ) {
      return "";
    }
    return "https://portfolio-1-f9t6.onrender.com";
  })();

  /* ── SITE MODAL ── */
  const siteModal = document.getElementById('site-modal');
  const siteModalIcon = document.getElementById('siteModalIcon');
  const siteModalTitle = document.getElementById('siteModalTitle');
  const siteModalMsg = document.getElementById('siteModalMsg');
  const siteModalOk = document.getElementById('siteModalOk');
  const siteModalLoadingText = document.getElementById('siteModalLoadingText');
  const siteModalLoadingSub = document.getElementById('siteModalLoadingSub');
  const siteModalProgressFill = document.getElementById('siteModalProgressFill');

  const MODAL_ICONS = {
    success: '<svg class="checkmark" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
  };

  const RESUME_URL = 'assets/documents/Junior-Programmer-Elopre-Jhon.pdf';
  const RESUME_FILENAME = 'Junior-Programmer-Elopre-Jhon.pdf';
  let modalAutoCloseTimer = null;

  function showSendLoader() {
    siteModal.classList.remove('is-download', 'auto-close');
    siteModalLoadingText.innerHTML = 'Sending message<span class="overlay-dots"><span>.</span><span>.</span><span>.</span></span>';
    siteModal.classList.add('is-loading', 'open');
    siteModal.setAttribute('aria-hidden', 'false');
  }

  function showDownloadLoader() {
    siteModal.classList.remove('auto-close');
    siteModalLoadingText.textContent = 'Downloading resume...';
    siteModalLoadingSub.textContent = 'Please wait a moment';
    siteModal.classList.add('is-loading', 'is-download', 'open');
    siteModal.setAttribute('aria-hidden', 'false');
    if (siteModalProgressFill) {
      siteModalProgressFill.style.transition = 'none';
      siteModalProgressFill.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          siteModalProgressFill.style.transition = 'width 1.6s cubic-bezier(0.4, 0, 0.2, 1)';
          siteModalProgressFill.style.width = '100%';
        });
      });
    }
  }

  function openSiteModal(type, title, message, opts) {
    const kind = MODAL_ICONS[type] ? type : 'info';
    const options = opts || {};
    if (modalAutoCloseTimer) {
      clearTimeout(modalAutoCloseTimer);
      modalAutoCloseTimer = null;
    }
    siteModal.classList.remove('is-loading', 'is-download');
    siteModalIcon.className = 'site-modal-icon ' + kind;
    siteModalIcon.innerHTML = MODAL_ICONS[kind];
    siteModalTitle.textContent = title || '';
    siteModalMsg.textContent = message || '';
    if (options.autoClose) {
      siteModal.classList.add('auto-close', 'open');
      siteModal.setAttribute('aria-hidden', 'false');
      modalAutoCloseTimer = setTimeout(() => {
        closeSiteModal(true);
      }, options.autoClose);
    } else {
      siteModal.classList.remove('auto-close');
      siteModal.classList.add('open');
      siteModal.setAttribute('aria-hidden', 'false');
      siteModalOk.focus();
    }
  }

  function closeSiteModal(force) {
    if (!force && siteModal.classList.contains('is-loading')) return;
    if (modalAutoCloseTimer) {
      clearTimeout(modalAutoCloseTimer);
      modalAutoCloseTimer = null;
    }
    siteModal.classList.remove('open', 'is-loading', 'is-download', 'auto-close');
    siteModal.setAttribute('aria-hidden', 'true');
  }

  siteModalOk.addEventListener('click', () => closeSiteModal());
  siteModal.querySelector('[data-close-modal]').addEventListener('click', () => closeSiteModal());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteModal.classList.contains('open') && !siteModal.classList.contains('is-loading')) {
      closeSiteModal();
    }
  });

  function triggerResumeDownload() {
    const link = document.createElement('a');
    link.href = RESUME_URL;
    link.download = RESUME_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleResumeDownload(btn) {
    if (!btn || btn.disabled || siteModal.classList.contains('open')) return;
    btn.disabled = true;
    showDownloadLoader();
    try {
      await new Promise((resolve) => setTimeout(resolve, 1700));
      triggerResumeDownload();
      openSiteModal('success', 'Resume downloaded!', 'Saved to your downloads folder.', { autoClose: 1400 });
    } catch (err) {
      openSiteModal('error', 'Download failed', 'Please try again in a moment.');
    } finally {
      btn.disabled = false;
    }
  }

  document.querySelectorAll('[data-resume-download]').forEach((btn) => {
    btn.addEventListener('click', () => handleResumeDownload(btn));
  });

  /* ── CONTACT FORM ── */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.form-submit');
    if (siteModal.classList.contains('open')) return;

    const phone = document.getElementById('phone').value.trim();
    if (!/^\d{11}$/.test(phone)) {
      openSiteModal('error', 'Invalid contact number', 'Please enter a valid 11-digit contact number.');
      return;
    }

    const payload = {
      firstName: document.getElementById('fname').value.trim(),
      lastName:  document.getElementById('lname').value.trim(),
      email:     document.getElementById('email').value.trim(),
      phone,
      service:   document.getElementById('service').value,
      message:   document.getElementById('message').value.trim()
    };
    btn.disabled = true;
    showSendLoader();
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to send message.');
      form.reset();
      openSiteModal('success', 'Message sent!', "Thanks for reaching out — I'll get back to you soon.");
    } catch (err) {
      openSiteModal('error', 'Unable to send', err.message || 'Please try again in a moment, or email me directly at eloprepotchy@gmail.com.');
    } finally {
      btn.disabled = false;
    }
  }

  /* ── CHATBOT ── */
  /* Intent-scored resume Q&A (resumeChatbot.js); first person as Jhon */
  function answerFromResume(question) {
    if (window.ResumeChatbot && typeof window.ResumeChatbot.chatbot === 'function') {
      return window.ResumeChatbot.chatbot(question).text;
    }
    return "I don't have that detail here. Feel free to email me at eloprepotchy@gmail.com for more information.";
  }

  function formatBotText(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  const chatToggle   = document.getElementById('chat-toggle');
  const chatWindow   = document.getElementById('chat-window');
  const chatBody     = document.getElementById('chat-body');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput    = document.getElementById('chat-input');
  const chatSend     = document.getElementById('chat-send');
  const suggestions  = document.getElementById('chat-suggestions');

  const ALL_SUGGESTIONS = (window.ResumeChatbot && window.ResumeChatbot.suggestedQuestions)
    ? window.ResumeChatbot.suggestedQuestions.slice(0, 4)
    : [
      "What services do you offer?",
      "What technologies do you use?",
      "What projects have you worked on?",
      "How can I contact you?",
    ];
  let remainingSuggestions = ALL_SUGGESTIONS.slice();

  let isOpen    = false;
  let isLoading = false;
  let chatHistory = [];
  let greeted = false;

  const USER_AVATAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 19.5c.8-3.2 3.2-5 6.5-5s5.7 1.8 6.5 5"/></svg>`;

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = `msg ${role}`;
    const avatarInner = role === 'bot'
      ? `<img src="assets/images/brand/icon.png" alt="" style="width:100%;height:100%;object-fit:cover;">`
      : USER_AVATAR_SVG;
    msg.innerHTML = `
      <div class="msg-avatar" aria-hidden="true">${avatarInner}</div>
      <div class="msg-content">
        <div class="msg-bubble">${formatBotText(text)}</div>
        <div class="msg-time">${getTime()}</div>
      </div>
    `;
    chatMessages.appendChild(msg);
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'typing-indicator';
    t.id = 'typing-ind';
    t.innerHTML = `
      <div class="msg-avatar" style="width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;overflow:hidden;background:transparent;"><img src="assets/images/brand/icon.png" alt="Jhon" style="width:100%;height:100%;object-fit:cover;"></div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    `;
    chatMessages.appendChild(t);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById('typing-ind');
    if (t) t.remove();
  }

  function renderSuggestions() {
    suggestions.innerHTML = '';
    if (!remainingSuggestions.length) {
      suggestions.style.display = 'none';
      if (chatBody) chatBody.classList.remove('has-suggestions');
      return;
    }
    suggestions.style.display = 'flex';
    if (chatBody) chatBody.classList.add('has-suggestions');
    remainingSuggestions.forEach((text) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'suggestion-chip';
      btn.textContent = text;
      btn.addEventListener('click', () => sendSuggestion(text));
      suggestions.appendChild(btn);
    });
  }

  function consumeSuggestion(text) {
    const normalized = text.trim().toLowerCase();
    remainingSuggestions = remainingSuggestions.filter(
      (s) => s.trim().toLowerCase() !== normalized
    );
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function sendMessage(userText) {
    if (!userText.trim() || isLoading) return;
    consumeSuggestion(userText);
    suggestions.style.display = 'none';
    if (chatBody) chatBody.classList.remove('has-suggestions');
    isLoading = true;
    chatSend.disabled = true;

    appendMessage('user', userText);
    chatHistory.push({ role: 'user', content: userText });

    showTyping();

    const typingStarted = Date.now();
    let reply = '';
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, message: userText })
      });
      if (response.ok) {
        const data = await response.json();
        reply = (data && data.reply) ? data.reply : '';
      }
    } catch (err) {
      reply = '';
    }

    if (!reply) reply = answerFromResume(userText);

    // Brief typing pause only (bubble already visible)
    const typingMin = 600;
    const elapsed = Date.now() - typingStarted;
    if (elapsed < typingMin) await wait(typingMin - elapsed);

    hideTyping();
    chatHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply);

    isLoading = false;
    chatSend.disabled = false;
    renderSuggestions();
    chatInput.focus();
  }

  function sendSuggestion(text) {
    if (isLoading) return;
    sendMessage(text);
  }

  renderSuggestions();

  chatToggle.addEventListener('click', () => {
    isOpen = !isOpen;
    chatToggle.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);

    if (isOpen && !greeted) {
      greeted = true;
      setTimeout(() => {
        appendMessage('bot', "Hi! 👋 I'm Jhon. Ask me about my work experience, freelance & thesis projects, education, certifications, or how to get in touch.");
      }, 350);
    }
  });

  chatSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) { chatInput.value = ''; autoResize(); sendMessage(text); }
  });

  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) { chatInput.value = ''; autoResize(); sendMessage(text); }
    }
  });

  function autoResize() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  }
  chatInput.addEventListener('input', autoResize);

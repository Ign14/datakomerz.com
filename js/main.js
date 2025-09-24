// Interacciones y animaciones de la portada DataKomerz
(function(){
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let chatWidget;
  let chatCloseBtn;
  let chatSendLink;
  const CHAT_MESSAGE = 'Hola DataKomerz 👋 Me interesa impulsar mi negocio con soluciones digitales.';

  const createToast = (message) => {
    if (!message) return;
    const existing = document.querySelector('.dk-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'dk-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    window.setTimeout(() => {
      toast.classList.remove('is-visible');
      window.setTimeout(() => toast.remove(), 420);
    }, 3400);
  };

  const runTypewriter = () => {
    const targets = document.querySelectorAll('[data-typewriter]');
    targets.forEach((el) => {
      const fullText = el.dataset.typewriter || '';
      if (!fullText) return;
      const speed = Number(el.dataset.typewriterSpeed) || 48;

      if (prefersReducedMotion) {
        el.textContent = fullText;
        el.classList.add('is-complete');
        return;
      }

      let index = 0;
      el.textContent = '';

      const write = () => {
        if (index <= fullText.length) {
          el.textContent = fullText.slice(0, index);
          index += 1;
          const lastChar = fullText.charAt(index - 1);
          const pause = /[\.\!\?]/.test(lastChar) ? speed * 6 : speed;
          window.setTimeout(write, pause);
        } else {
          el.classList.add('is-complete');
        }
      };

      window.setTimeout(write, 500);
    });
  };

  const runReveal = () => {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    items.forEach((el) => observer.observe(el));
  };

  const runHeroParallax = () => {
    const heroVisual = document.querySelector('.hero-visual');
    const heroGlass = heroVisual ? heroVisual.querySelector('.hero-glass') : null;
    if (!heroVisual || !heroGlass) return;

    let ready = prefersReducedMotion;
    heroGlass.style.willChange = 'transform';

    if (!prefersReducedMotion) {
      window.setTimeout(() => {
        ready = true;
        heroGlass.style.transform = 'translate3d(0,0,0)';
      }, 900);
    } else {
      heroGlass.style.transform = 'translate3d(0,0,0)';
    }

    const handleMove = (event) => {
      if (!ready) return;
      const rect = heroVisual.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      const offset = 16;
      const x = (relX * offset).toFixed(2);
      const y = (relY * offset).toFixed(2);
      heroGlass.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const reset = () => {
      heroGlass.style.transform = 'translate3d(0,0,0)';
    };

    heroVisual.addEventListener('pointermove', handleMove);
    heroVisual.addEventListener('pointerleave', reset);
  };

  document.addEventListener('DOMContentLoaded', () => {
    runTypewriter();
    runReveal();
    runHeroParallax();

    chatWidget = document.getElementById('chatWidget');
    if (chatWidget) {
      chatCloseBtn = chatWidget.querySelector('.chat-close');
      chatSendLink = chatWidget.querySelector('.chat-send');
      chatWidget.setAttribute('aria-hidden', 'true');

      if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', () => {
          closeChat();
        });
      }

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatWidget.classList.contains('is-open')) {
          closeChat();
        }
      });
    }
  });

  const toggleChat = (open) => {
    if (!chatWidget) {
      createToast('Hola 👋 Somos DataKomerz. Envíanos un mensaje y diseñemos experiencias geométricas juntos.');
      return;
    }

    chatWidget.classList.toggle('is-open', open);
    chatWidget.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (open) {
      createToast('Listo para conversar por WhatsApp 🚀');
      const bubble = chatWidget.querySelector('.chat-bubble');
      if (bubble) {
        bubble.textContent = CHAT_MESSAGE;
      }
      if (chatSendLink) {
        chatSendLink.setAttribute('href', `https://wa.me/56984664812?text=${encodeURIComponent(CHAT_MESSAGE)}`);
        window.setTimeout(() => chatSendLink.focus(), 120);
      }
    }
  };

  const openChat = () => {
    const shouldOpen = !chatWidget || !chatWidget.classList.contains('is-open');
    toggleChat(shouldOpen);
  };

  const closeChat = () => {
    toggleChat(false);
  };

  window.openChat = openChat;
  window.closeChat = closeChat;
})();

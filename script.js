document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');
  const yearNode = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const projectCards = document.querySelectorAll('.project-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoPlayer = document.querySelector('[data-video-player]');
  const revealTargets = document.querySelectorAll([
    'main > section:not(.hero) .section-header',
    '.about-grid > *',
    '.services-grid > *',
    '.preview-grid > *',
    '.why-grid > *',
    '.projects-grid > *',
    '.values-grid > *',
    '.contact-layout > *',
    '.team-grid > *',
    '.stats-grid > *',
    '.feature-grid > *',
    '.objective-grid > *'
  ].join(','));

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

    revealTargets.forEach((target, index) => {
      target.classList.add('scroll-reveal');
      target.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
      revealObserver.observe(target);
    });
  }

  if (videoPlayer) {
    const video = videoPlayer.querySelector('video');
    const playButton = videoPlayer.querySelector('.video-play-toggle');
    const seekBar = videoPlayer.querySelector('.video-seek');
    const currentTimeNode = videoPlayer.querySelector('[data-video-current-time]');
    const durationNode = videoPlayer.querySelector('[data-video-duration]');
    const muteButton = videoPlayer.querySelector('.video-mute-toggle');
    const fullscreenButton = videoPlayer.querySelector('.video-fullscreen-toggle');

    if (video && playButton && seekBar && currentTimeNode && durationNode && muteButton && fullscreenButton) {
      video.controls = false;
      video.muted = true;

      const formatTime = (time) => {
        if (!Number.isFinite(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
      };

      const updatePlayButton = () => {
        const isPlaying = !video.paused && !video.ended;
        const label = isPlaying ? 'Pause video' : 'Play video';
        playButton.setAttribute('aria-label', label);
        playButton.title = label;
        playButton.innerHTML = `<i class="fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}" aria-hidden="true"></i>`;
      };

      const updateSeekBar = () => {
        const progress = video.duration ? (video.currentTime / video.duration) * 100 : 0;
        seekBar.value = String(progress);
        seekBar.style.setProperty('--video-progress', `${progress}%`);
        seekBar.setAttribute('aria-valuetext', `${formatTime(video.currentTime)} of ${formatTime(video.duration)}`);
        currentTimeNode.textContent = formatTime(video.currentTime);
      };

      const updateMuteButton = () => {
        const label = video.muted ? 'Unmute video' : 'Mute video';
        muteButton.setAttribute('aria-label', label);
        muteButton.title = label;
        muteButton.innerHTML = `<i class="fa-solid ${video.muted ? 'fa-volume-xmark' : 'fa-volume-high'}" aria-hidden="true"></i>`;
      };

      const updateFullscreenButton = () => {
        const isFullscreen = document.fullscreenElement === videoPlayer;
        const label = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
        fullscreenButton.setAttribute('aria-label', label);
        fullscreenButton.title = label;
        fullscreenButton.innerHTML = `<i class="fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}" aria-hidden="true"></i>`;
      };

      playButton.addEventListener('click', () => {
        if (video.paused || video.ended) {
          video.play().catch(updatePlayButton);
        } else {
          video.pause();
        }
      });

      seekBar.addEventListener('input', () => {
        const targetTime = (Number(seekBar.value) / 100) * video.duration;
        seekBar.style.setProperty('--video-progress', `${seekBar.value}%`);
        seekBar.setAttribute('aria-valuetext', `${formatTime(targetTime)} of ${formatTime(video.duration)}`);
        currentTimeNode.textContent = formatTime(targetTime);
      });

      seekBar.addEventListener('change', () => {
        if (Number.isFinite(video.duration)) {
          video.currentTime = (Number(seekBar.value) / 100) * video.duration;
        }
      });

      muteButton.addEventListener('click', () => {
        video.muted = !video.muted;
      });

      fullscreenButton.addEventListener('click', () => {
        if (document.fullscreenElement === videoPlayer) {
          document.exitFullscreen?.();
        } else if (videoPlayer.requestFullscreen) {
          videoPlayer.requestFullscreen().catch(() => {});
        }
      });

      video.addEventListener('loadedmetadata', () => {
        seekBar.disabled = false;
        durationNode.textContent = formatTime(video.duration);
        updateSeekBar();
      });
      video.addEventListener('durationchange', () => {
        durationNode.textContent = formatTime(video.duration);
        updateSeekBar();
      });
      video.addEventListener('timeupdate', updateSeekBar);
      video.addEventListener('play', updatePlayButton);
      video.addEventListener('pause', updatePlayButton);
      video.addEventListener('ended', updatePlayButton);
      video.addEventListener('volumechange', updateMuteButton);
      document.addEventListener('fullscreenchange', updateFullscreenButton);

      updatePlayButton();
      updateMuteButton();
      updateFullscreenButton();
    }
  }

  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('open');
      }
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const currentPath = window.location.pathname.split('/').pop();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isHome = href === 'index.html' || href === './' || href === '/';
    const isCurrentPage = currentPath === href || (isHome && (currentPath === '' || currentPath === 'index.html'));
    if (isCurrentPage) {
      link.classList.add('active');
    }
  });

  const setFieldError = (name, message) => {
    const field = document.getElementById(name);
    const errorNode = document.querySelector(`[data-error-for="${name}"]`);

    if (field) {
      field.setAttribute('aria-invalid', 'true');
    }

    if (errorNode) {
      errorNode.textContent = message;
      errorNode.style.display = 'block';
    }
  };

  const clearFieldError = (name) => {
    const field = document.getElementById(name);
    const errorNode = document.querySelector(`[data-error-for="${name}"]`);

    if (field) {
      field.setAttribute('aria-invalid', 'false');
    }
    if (errorNode) {
      errorNode.style.display = 'none';
    }
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!formStatus) return;

      formStatus.className = 'form-status';
      formStatus.textContent = '';

      const payload = {
        fullName: document.getElementById('fullName')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        service: document.getElementById('service')?.value.trim() || '',
        message: document.getElementById('message')?.value.trim() || ''
      };

      Object.keys(payload).forEach((key) => clearFieldError(key));

      let valid = true;

      if (!payload.fullName) {
        setFieldError('fullName', 'Please enter your full name.');
        valid = false;
      }

      if (!payload.email || !validateEmail(payload.email)) {
        setFieldError('email', 'Please enter a valid email address.');
        valid = false;
      }

      if (!payload.phone) {
        setFieldError('phone', 'Please enter your phone number.');
        valid = false;
      }

      if (!payload.service) {
        setFieldError('service', 'Please choose a service.');
        valid = false;
      }

      if (!payload.message) {
        setFieldError('message', 'Please include a short message.');
        valid = false;
      }

      if (!valid) {
        formStatus.classList.add('error');
        formStatus.textContent = 'Please correct the highlighted fields and try again.';
        return;
      }

      const subject = encodeURIComponent('Business Enquiry - OSYTRACO GLOBAL SERVICE');
      const body = encodeURIComponent(
        `Full Name: ${payload.fullName}\nEmail Address: ${payload.email}\nPhone Number: ${payload.phone}\nService Required: ${payload.service}\n\nMessage:\n${payload.message}`
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=osytraco2016@gmail.com&su=${subject}&body=${body}`;
      const mailtoUrl = `mailto:osytraco2016@gmail.com?subject=${subject}&body=${body}`;

      formStatus.classList.add('success');
      formStatus.textContent = 'Your enquiry draft is ready. Your email client will open now.';

      window.open(gmailUrl, '_blank');
      window.location.href = mailtoUrl;
    });
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!lightbox || !lightboxImage || !lightboxTitle) return;
      const img = card.querySelector('img');
      const title = card.querySelector('.project-meta strong')?.textContent || 'Project Preview';
      lightboxImage.src = img?.src || '';
      lightboxTitle.textContent = title;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
    }
    document.body.style.overflow = '';
  };

  const lightboxCloseButton = document.querySelector('.lightbox-close');
  if (lightboxCloseButton) {
    lightboxCloseButton.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      projectCards.forEach((card) => {
        const category = card.dataset.category || '';
        const show = filter === 'all' || category.toLowerCase().includes(filter.toLowerCase());
        card.classList.toggle('hidden', !show);
      });
    });
  });
});

// Mobile nav toggle, smooth scroll, modal inquiry, and mailto fallback forms.

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');
  const modal = document.getElementById('inquiry-modal');
  const openInquiry = document.getElementById('open-inquiry');
  const closeInquiry = document.getElementById('close-inquiry');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('active', !expanded);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 820px)').matches) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('active');
        }
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;

      const el = document.getElementById(targetId);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + targetId);
    });
  });

  if (modal && openInquiry && closeInquiry) {
    const openModal = function () {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = function () {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    openInquiry.addEventListener('click', openModal);
    closeInquiry.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  const revealItems = document.querySelectorAll('.section, .card, .timeline-item, .service-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach(function (item) {
      item.classList.add('reveal');
      observer.observe(item);
    });
  }
});

function prepareMail(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();
  const subject = encodeURIComponent('Website inquiry from ' + name);
  const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

  window.location.href = 'mailto:anil02573@gmail.com?subject=' + subject + '&body=' + body;
  return false;
}

function sendInquiry(e) {
  e.preventDefault();
  const name = document.getElementById('i-name').value.trim();
  const email = document.getElementById('i-email').value.trim();
  const company = document.getElementById('i-company').value.trim();
  const message = document.getElementById('i-message').value.trim();

  const subject = encodeURIComponent('Automation suggestion request from ' + company);
  const body = encodeURIComponent(
    'Name: ' + name + '\nEmail: ' + email + '\nCompany: ' + company + '\n\n' + message
  );

  window.location.href = 'mailto:anil02573@gmail.com?subject=' + subject + '&body=' + body;
  return false;
}

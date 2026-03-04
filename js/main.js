// Mobile nav toggle, smooth scroll, and contact-form mailto fallback.

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav a');

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

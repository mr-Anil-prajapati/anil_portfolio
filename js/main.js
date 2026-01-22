// Mobile nav toggle and contact form mailto handler

document.addEventListener('DOMContentLoaded', function () {
  // Nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
    });

    // Close menu when a link is clicked (mobile)
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (menu.classList.contains('open')) {
          menu.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Smooth scroll for same-page links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + targetId);
      }
    });
  });
});

// Prepare a mailto from the contact form (simple client-side mailto fallback)
function prepareMail(e) {
  e.preventDefault();

  const name = (document.getElementById('name') || {}).value || '';
  const email = (document.getElementById('email') || {}).value || '';
  const message = (document.getElementById('message') || {}).value || '';

  const subject = encodeURIComponent('Website inquiry from ' + name);
  const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

  // Open user's mail client
  window.location.href = `mailto:anil02573@gmail.com?subject=${subject}&body=${body}`;
  return false;
}

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar-container');
    let isMouseDown = false;
    let startX;
    let scrollLeft;

    navbar.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      startX = e.pageX - navbar.offsetLeft;
      scrollLeft = navbar.scrollLeft;
    });

    navbar.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    navbar.addEventListener('mouseleave', () => {
      isMouseDown = false;
    });

    navbar.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const x = e.pageX - navbar.offsetLeft;
      const walk = x - startX;
      navbar.scrollLeft = scrollLeft - walk;
    });

    const navbarLinks = document.querySelectorAll('.navbar-list a');

    navbarLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  });
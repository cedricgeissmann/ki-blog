const navbarContainer = document.querySelector('.navbar-container');
    const navbar = document.querySelector('.navbar');

    navbarContainer.addEventListener('mouseover', () => {
      navbar.style.display = 'block';
      navbar.style.opacity = '0';
      animateNavbar(1);
    });

    navbarContainer.addEventListener('mouseout', () => {
      animateNavbar(0, () => {
        navbar.style.display = 'none';
      });
    });

    function animateNavbar(targetOpacity, callback) {
      let currentOpacity = parseFloat(navbar.style.opacity);
      const animationSpeed = 0.2;

      const animation = setInterval(() => {
        if (currentOpacity === targetOpacity) {
          clearInterval(animation);
          if (callback) callback();
          return;
        }

        if (targetOpacity > currentOpacity) {
          currentOpacity += animationSpeed;
          if (currentOpacity > targetOpacity) currentOpacity = targetOpacity;
        } else {
          currentOpacity -= animationSpeed;
          if (currentOpacity < targetOpacity) currentOpacity = targetOpacity;
        }

        navbar.style.opacity = currentOpacity.toString();
      }, 20);
    }
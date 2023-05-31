
document.addEventListener('DOMContentLoaded', function() {
  var navbarContainer = document.querySelector('.navbar-container');

  document.addEventListener('click', function(event) {
    if (event.clientX < 50) { // Adjust this value as needed
      navbarContainer.style.visibility = 'visible';
    } else {
      navbarContainer.style.visibility = 'hidden';
    }
  });
});

function flyAwayAlert() {
  var alertBox = document.getElementById("alertBox");
  alertBox.style.animation = "flyAway 0.5s ease-in-out forwards"; // Apply the fly away animation
  setTimeout(function() {
    alertBox.parentNode.removeChild(alertBox); // Remove the alert box after the animation ends
  }, 500);
}

// Animation to fly away the alert box
var flyAwayKeyframes = `
  @keyframes flyAway {
    0% {
      top: 30%; /* Set the initial position */
    }
    100% {
      top: 200%; /* Set position outside the page */
    }
  }
`;

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerHTML = flyAwayKeyframes;
document.head.appendChild(styleSheet);

var navbar = document.querySelector('.navbar');
var lastScrollTop = 0;

window.addEventListener('scroll', function() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    // Scrolling down
    navbar.classList.add('hidden');
  } else {
    // Scrolling up
    navbar.classList.remove('hidden');
  }

  lastScrollTop = scrollTop;
});


 navbar = document.querySelector('.navbar');
navbar.addEventListener('mouseover', function() {
  navbar.style.overflowX = 'scroll';
  navbar.style.scrollBehavior = 'smooth';
});

navbar.addEventListener('mouseout', function() {
  navbar.style.overflowX = 'auto';
  navbar.style.scrollBehavior = 'auto';
});

const navbar = document.querySelector('.navbar');
  
  navbar.addEventListener('mouseover', function() {
    document.body.style.overflowX = 'hidden';
  });
  
  navbar.addEventListener('mouseout', function() {
    document.body.style.overflowX = 'auto';
  });


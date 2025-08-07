// Mobile Menu for Notablog
// Handles the mobile navigation menu toggle

document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.Navbar__MobileToggle');
    const navItems = document.querySelector('.Navbar__Items');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'Navbar__Overlay';
    body.appendChild(overlay);

    // Toggle menu function
    function toggleMenu() {
        const isOpen = navItems.classList.contains('active');

        if (isOpen) {
            // Close menu
            navItems.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        } else {
            // Open menu
            navItems.classList.add('active');
            mobileToggle.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
        }
    }

    // Event listeners
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking overlay
    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking on a nav item (on mobile)
    const navLinks = navItems.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                toggleMenu();
            }
        });
    });

    // Close menu on window resize if switching to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navItems.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navItems.classList.contains('active')) {
            toggleMenu();
        }
    });
}); 
// Initialize Animate On Scroll (AOS) library
AOS.init({
    duration: 800,
    once: false, // As per user request to keep animations on repeat scroll
    offset: 100, 
    delay: 50,  
    easing: 'ease-out-cubic', 
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const header = document.querySelector('header.sticky-top'); // More specific selector for header

window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const headerHeight = header?.offsetHeight || 80; 

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - headerHeight - 50) { 
            currentSectionId = section.getAttribute('id');
        }
    });
    
    // Handle active state for page-specific nav links (not hash links)
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');

        if (linkHref) {
            const linkPage = linkHref.split("/").pop().split("#")[0]; // Get page name from href
            
            // For hash links on the same page (e.g., index.html#hero)
            if (linkHref.includes('#') && (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html'))) {
                if (linkHref.substring(linkHref.lastIndexOf('#') + 1) === currentSectionId) {
                    link.classList.add('active');
                }
            }
            // For direct page links (e.g., about.html)
            else if (currentPage === linkPage) {
                 // If on a specific page, its nav link should be active
                 // unless a section ID on that page takes precedence (handled above for index)
                if (!linkHref.includes('#')) { // Prioritize section-based active for multi-section pages
                    link.classList.add('active');
                }
            }
        }
    });
    
    // Default to Home if at the top of index.html or no section is active on index
    if (currentPage === 'index.html' || currentPage === '') {
        let homeLinkIsActive = Array.from(navLinks).some(link => link.classList.contains('active') && link.getAttribute('href')?.includes('index.html#'));
        if (!homeLinkIsActive && window.pageYOffset < (sections[0]?.offsetTop || 0) - headerHeight - 50) {
            const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html#hero"]');
            if (homeLink) {
                navLinks.forEach(nl => nl.classList.remove('active')); // Remove other actives
                homeLink.classList.add('active');
            }
        } else if (!currentSectionId && (currentPage === 'index.html' || currentPage === '') && window.pageYOffset < (sections[0]?.offsetTop || 0) - headerHeight - 20) {
            const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html#hero"]');
            if (homeLink) {
                navLinks.forEach(nl => nl.classList.remove('active'));
                homeLink.classList.add('active');
            }
        }
    }


    // If on a non-index page and no section scrolling logic applies, ensure its link is active
    if (currentPage !== 'index.html' && currentPage !== '') {
        let pageSpecificLinkActive = false;
        navLinks.forEach(link => {
            if (link.classList.contains('active')) {
                pageSpecificLinkActive = true;
            }
        });
        if (!pageSpecificLinkActive) {
            const activePageLink = document.querySelector(`.navbar-nav .nav-link[href^="${currentPage}"]`);
            if (activePageLink) {
                activePageLink.classList.add('active');
            }
        }
    }
});


// Update current year in footer
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Smooth scroll for navigation links (primarily for same-page # links)
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const currentPath = window.location.pathname.split("/").pop();
        const targetPath = href ? href.split("#")[0] : "";

        // Check if it's an internal hash link on the current page
        if (href && href.startsWith('#') || (href && href.includes('#') && currentPath === targetPath)) { 
            e.preventDefault();
            const targetId = href.substring(href.lastIndexOf('#') + 1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = header?.offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile navbar if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    // Bootstrap 5 uses a Bootstrap instance to control collapse
                    var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    } else {
                        // Fallback for manual creation if instance not found
                        new bootstrap.Collapse(navbarCollapse, { toggle: false }).hide();
                    }
                }
            }
        }
        // If it's a link to a different page with a hash, just let the browser handle default navigation
        // then on page load, scroll to hash if present.
    });
});

// Scroll to hash on page load if present (for links from other pages)
window.addEventListener('load', () => {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        const headerOffset = header?.offsetHeight || 80;

        if (targetElement) {
            // Needs a slight delay for layout to settle, especially if images are loading
            setTimeout(() => {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth' 
                });
            }, 100);
        }
    }
    // Trigger scroll event once on load to set initial active nav link
    window.dispatchEvent(new Event('scroll'));
});
// Header styling change on scroll
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile Menu controller
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtnIcon = document.querySelector('#mobile-menu-btn i');

        function toggleMobileMenu() {
            mobileMenu.classList.toggle('open');
            if (mobileMenu.classList.contains('open')) {
                mobileMenuBtnIcon.classList.remove('fa-bars');
                mobileMenuBtnIcon.classList.add('fa-xmark');
            } else {
                mobileMenuBtnIcon.classList.remove('fa-xmark');
                mobileMenuBtnIcon.classList.add('fa-bars');
            }
        }

        // Navigation scroll trigger
        function showPage(pageId) {
            const targetSection = document.getElementById(pageId);
            if (targetSection) {
                // Adjust for floating header height
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetSection.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }

        function handleMobileLinkClick(pageId) {
            toggleMobileMenu();
            setTimeout(() => {
                showPage(pageId);
            }, 300);
        }

        // Auto-detect currently visible section on manual scroll to update active states
        const sections = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-links a');

        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px', // trigger when section occupies main focus area
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.id;

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const targetHref = link.getAttribute('href');
                        if (targetHref === `#${activeId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // Lightbox Viewers
        function openLightbox(src) {
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = src;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden'; // lock page scroll
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; // restore scroll
        }

        // Close lightbox on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // 3D Carousel Implementation
const certCards = document.querySelectorAll('.cert-card');
const certDotsContainer = document.getElementById('cert-dots');
let certActiveIndex = 0;
const certTotalCards = certCards.length;
let certAutoSlideTimer = null; // Auto-slide timer variable

// Generate pagination dots
for (let i = 0; i < certTotalCards; i++) {
    const dot = document.createElement('div');
    dot.classList.add('cert-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        setCertActive(i);
        startCertAutoSlide(); // Reset timer on dot click
    });
    certDotsContainer.appendChild(dot);
}
const certDots = document.querySelectorAll('.cert-dot');

function updateCertCarousel() {
    certCards.forEach((card, index) => {
        const offset = (index - certActiveIndex + certTotalCards) % certTotalCards;

        let translateX = 0;
        let scale = 1;
        let rotateY = 0;
        let opacity = 1;
        let zIndex = certTotalCards - offset;

        if (offset === 0) {
            translateX = 0;
            scale = 1;
            rotateY = 0;
            opacity = 1;
        } else if (offset === 1 || (offset > 1 && offset < certTotalCards / 2)) {
            translateX = 120 + offset * 25;
            scale = 0.85 - offset * 0.08;
            rotateY = -20;
            opacity = 0.6 - offset * 0.15;
        } else {
            const leftOffset = certTotalCards - offset;
            translateX = -120 - leftOffset * 25;
            scale = 0.85 - leftOffset * 0.08;
            rotateY = 20;
            opacity = 0.6 - leftOffset * 0.15;
            zIndex = certTotalCards - leftOffset;
        }

        card.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
        card.style.opacity = Math.max(opacity, 0.15);
        card.style.zIndex = zIndex;
    });

    certDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === certActiveIndex);
    });
}

function setCertActive(index) {
    certActiveIndex = index;
    updateCertCarousel();
}

function nextCertSlide() {
    certActiveIndex = (certActiveIndex + 1) % certTotalCards;
    updateCertCarousel();
}

function prevCertSlide() {
    certActiveIndex = (certActiveIndex - 1 + certTotalCards) % certTotalCards;
    updateCertCarousel();
}

// Auto-Slide Logic (2-second interval)
function startCertAutoSlide() {
    stopCertAutoSlide();
    certAutoSlideTimer = setInterval(nextCertSlide, 2000);
}

function stopCertAutoSlide() {
    if (certAutoSlideTimer) {
        clearInterval(certAutoSlideTimer);
        certAutoSlideTimer = null;
    }
}

// Optional: Pause auto-sliding on hover
const carouselContainer = document.querySelector('.cert-carousel-container'); // Change class to match your container
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopCertAutoSlide);
    carouselContainer.addEventListener('mouseleave', startCertAutoSlide);
}

// Initialize Carousel & Auto-Slide
updateCertCarousel();
startCertAutoSlide();

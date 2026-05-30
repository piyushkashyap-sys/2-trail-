/* ============================================================
   PRELOADER
   ============================================================ */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        // Start counter animations after preloader
        initCounters();
        // Initialize particles on hero canvas OR page canvas
        createParticles('heroCanvas');
        createParticles('pageCanvas');
    }, 2000);
});

/* ============================================================
   NAVIGATION
   ============================================================ */
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
    updateActiveNavLink();
});

// Hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active nav link on scroll (only for single-page anchor links)
function updateActiveNavLink() {
    // Skip if links point to .html pages (multi-page mode)
    if (navLinks.length && navLinks[0].getAttribute('href').includes('.html')) return;

    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
    const counters = document.querySelectorAll('.hero-stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        animateCounter(counter, target);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = Math.floor(duration / 60);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal-element, .reveal-image');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   HERO PARTICLES
   ============================================================ */
function createParticles(canvasId = 'heroCanvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return; // No canvas on this page
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getColor();
        }

        getColor() {
            const colors = [
                'rgba(200, 169, 126, OPACITY)',
                'rgba(232, 184, 75, OPACITY)',
                'rgba(255, 255, 255, OPACITY)'
            ];
            return colors[Math.floor(Math.random() * colors.length)].replace('OPACITY', this.opacity);
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor(canvas.width / 8), 100);

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(200, 169, 126, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
}

/* ============================================================
   PROPERTIES DATA & RENDERING
   ============================================================ */
const propertiesData = [
    {
        id: 1,
        title: 'Modern Luxury Villa',
        location: 'Beverly Hills, CA',
        price: '$2,850,000',
        type: 'villa',
        status: 'featured',
        beds: 5,
        baths: 4,
        sqft: 4500,
        color: '#1a1a3e'
    },
    {
        id: 2,
        title: 'Downtown Penthouse',
        location: 'New York, NY',
        price: '$1,950,000',
        type: 'apartment',
        status: 'sale',
        beds: 3,
        baths: 2,
        sqft: 2200,
        color: '#16213e'
    },
    {
        id: 3,
        title: 'Waterfront Estate',
        location: 'Miami Beach, FL',
        price: '$3,750,000',
        type: 'house',
        status: 'featured',
        beds: 6,
        baths: 5,
        sqft: 5800,
        color: '#1c1c3a'
    },
    {
        id: 4,
        title: 'Modern City Apartment',
        location: 'San Francisco, CA',
        price: '$890,000',
        type: 'apartment',
        status: 'sale',
        beds: 2,
        baths: 2,
        sqft: 1400,
        color: '#13132b'
    },
    {
        id: 5,
        title: 'Luxury Beach House',
        location: 'Malibu, CA',
        price: '$4,200,000',
        type: 'house',
        status: 'featured',
        beds: 4,
        baths: 3,
        sqft: 3500,
        color: '#1a1a2e'
    },
    {
        id: 6,
        title: 'Commercial Office Space',
        location: 'Chicago, IL',
        price: '$2,100,000',
        type: 'commercial',
        status: 'sale',
        beds: 0,
        baths: 2,
        sqft: 6200,
        color: '#0d0d1a'
    },
    {
        id: 7,
        title: 'Elegant Suburban Home',
        location: 'Austin, TX',
        price: '$675,000',
        type: 'house',
        status: 'sale',
        beds: 4,
        baths: 3,
        sqft: 2800,
        color: '#16213e'
    },
    {
        id: 8,
        title: 'Hilltop Villa Retreat',
        location: 'Los Angeles, CA',
        price: '$5,400,000',
        type: 'villa',
        status: 'featured',
        beds: 7,
        baths: 6,
        sqft: 7200,
        color: '#1c1c3a'
    },
    {
        id: 9,
        title: 'Cozy Studio Apartment',
        location: 'Seattle, WA',
        price: '$425,000',
        type: 'apartment',
        status: 'sale',
        beds: 1,
        baths: 1,
        sqft: 750,
        color: '#13132b'
    }
];

const propertyIcons = ['fa-building', 'fa-home', 'fa-warehouse', 'fa-city', 'fa-tree'];

function getIconForType(type) {
    const iconMap = {
        'villa': 'fa-building',
        'house': 'fa-home',
        'apartment': 'fa-city',
        'commercial': 'fa-warehouse'
    };
    return iconMap[type] || 'fa-home';
}

function getStatusBadge(status) {
    const badges = {
        'featured': '<span class="property-card-badge featured">Featured</span>',
        'sale': '<span class="property-card-badge sale">For Sale</span>',
        'rent': '<span class="property-card-badge rent">For Rent</span>'
    };
    return badges[status] || badges.featured;
}

function renderProperties(filter = 'all') {
    const grid = document.getElementById('propertiesGrid');
    grid.innerHTML = '';

    const filtered = filter === 'all'
        ? propertiesData
        : propertiesData.filter(p => p.type === filter);

    filtered.forEach((property, index) => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.style.transitionDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="property-card-image">
                <div class="property-card-img-placeholder" style="background: ${property.color};">
                    <i class="fas ${getIconForType(property.type)}"></i>
                </div>
                ${getStatusBadge(property.status)}
                <button class="property-card-favorite" onclick="toggleFavorite(this)">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="property-card-body">
                <div class="property-card-price">${property.price}</div>
                <h3 class="property-card-title">${property.title}</h3>
                <p class="property-card-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.location}
                </p>
                <div class="property-card-details">
                    ${property.beds > 0 ? `<span class="property-card-detail"><i class="fas fa-bed"></i> ${property.beds} Beds</span>` : ''}
                    ${property.baths > 0 ? `<span class="property-card-detail"><i class="fas fa-bath"></i> ${property.baths} Baths</span>` : ''}
                    <span class="property-card-detail"><i class="fas fa-ruler-combined"></i> ${property.sqft.toLocaleString()} sqft</span>
                </div>
            </div>
        `;

        grid.appendChild(card);

        // Animate card in
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 100 + 100);
    });
}

// Favorite toggle
function toggleFavorite(btn) {
    const icon = btn.querySelector('i');
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        btn.style.animation = 'pop 0.3s ease';
        setTimeout(() => { btn.style.animation = ''; }, 300);
    } else {
        icon.className = 'far fa-heart';
    }
}

// Filter buttons (only on pages with filter buttons)
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProperties(btn.dataset.filter);
        });
    });
}

// Initialize properties (only on pages with propertiesGrid)
if (document.getElementById('propertiesGrid')) {
    renderProperties();
}

/* ============================================================
   TESTIMONIALS SLIDER
   ============================================================ */
const track = document.getElementById('testimonialsTrack');
const dotsContainer = document.getElementById('testimonialDots');
const slides = track ? track.querySelectorAll('.testimonial-card') : [];
let currentSlide = 0;
let slideInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
    });

    resetAutoPlay();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

const nextBtn = document.getElementById('nextTestimonial');
const prevBtn = document.getElementById('prevTestimonial');
if (nextBtn && prevBtn && slides.length) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    // Start autoplay
    slideInterval = setInterval(nextSlide, 5000);
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const form = this;
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate sending
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
            }, 3000);
        }, 2000);
    });
}

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input');
        const btn = this.querySelector('button');

        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
            input.value = '';

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.style.background = '';
            }, 2500);
        }, 1500);
    });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================================
   SCROLL PROGRESS (adds a subtle progress bar at the top)
   ============================================================ */
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #c8a97e, #e8b84b);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;
});

/* ============================================================
   SMOOTH REVEAL FOR STATS IN CTA SECTION
   ============================================================ */
const ctaStats = document.querySelectorAll('.cta-stat');

const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            ctaObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

ctaStats.forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(30px)';
    stat.style.transition = `all 0.6s ease ${index * 0.15}s`;
    ctaObserver.observe(stat);
});

/* ============================================================
   AGENT CARDS STAGGER ANIMATION
   ============================================================ */
const agentCards = document.querySelectorAll('.agent-card');

const agentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(agentCards).indexOf(entry.target);
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
            agentObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

agentCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    agentObserver.observe(card);
});

/* ============================================================
   SERVICE CARDS STAGGER ANIMATION
   ============================================================ */
const serviceCards = document.querySelectorAll('.service-card');

const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(serviceCards).indexOf(entry.target);
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    serviceObserver.observe(card);
});

/* ============================================================
   KEYBOARD SHORTCUTS
   ============================================================ */
document.addEventListener('keydown', (e) => {
    // Escape closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.click();
    }
});

/* ============================================================
   ADD POP ANIMATION KEYFRAME TO STYLESHEET
   ============================================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }

    .property-card {
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .property-card.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(styleSheet);

console.log('%c🏠 Prestige Properties', 'font-size: 24px; font-weight: bold; color: #c8a97e;');
console.log('%cDesigned & Built with ❤️', 'font-size: 14px; color: #b0b0c0;');

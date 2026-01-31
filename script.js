'use strict';

// Three.js Particle Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(0, 217, 255, 0.5)' : 'rgba(255, 0, 128, 0.5)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particlesArray = [];
const numberOfParticles = 100;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 - distance / 600})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 1000);
});

// Menu
let menu = document.querySelector('#menu-bars');
let header = document.querySelector('header');

menu.onclick = () =>{
    menu.classList.toggle('fa-times');
    header.classList.toggle('active');
}

window.onscroll = () =>{
    menu.classList.remove('fa-times');
    header.classList.remove('active');
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

// Back to top functionality
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Navigation functionality
// Set default theme to dark
document.documentElement.setAttribute('data-theme', 'dark');

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Update active navigation link
            const sectionId = entry.target.getAttribute('id');
            if (sectionId) {
                updateActiveNavLink(sectionId);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Update active navigation link
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Close mobile menu if open
            menu.classList.remove('fa-times');
            header.classList.remove('active');
        }
    });
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Ripple effect for social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const ripple = this.querySelector('.ripple');
        ripple.style.animation = 'none';
        setTimeout(() => {
            ripple.style.animation = '';
        }, 10);
    });
});

// Certificate modal
document.querySelectorAll('.zertifikate .box embed').forEach(embed => {
    embed.style.cursor = 'pointer';
    embed.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = document.createElement('div');
        modal.className = 'cert-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <embed src="${this.src}" type="application/pdf" />
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    });
});

// Certificate Slider
class CertificateSlider {
    constructor() {
        this.slider = document.querySelector('.certificate-slider');
        this.sliderWrapper = document.querySelector('.certificate-slider-wrapper');
        this.slides = document.querySelectorAll('.cert-slide');
        this.prevBtn = document.querySelector('.cert-prev');
        this.nextBtn = document.querySelector('.cert-next');
        this.dotsContainer = document.querySelector('.cert-slider-dots');
        
        if (!this.slider) return;

        this.currentIndex = 0;
        this.itemsPerView = 3;
        this.totalSlides = this.slides.length;
        
        this.init();
    }

    init() {
        this.handleResize();
        this.createDots();
        this.attachEventListeners();
        this.updateSlider();
        window.addEventListener('resize', () => this.handleResize());
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        const dotsNeeded = Math.ceil(this.totalSlides - this.itemsPerView + 1);
        for (let i = 0; i < dotsNeeded; i++) {
            const dot = document.createElement('div');
            dot.className = 'cert-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    handleResize() {
        const width = this.sliderWrapper.offsetWidth;
        const prevItemsPerView = this.itemsPerView;
        const isPhone = window.matchMedia('(max-width: 900px) and (pointer: coarse)').matches;
        
        if (isPhone) {
            this.itemsPerView = 1;
        } else if (width < 768) {
            this.itemsPerView = 1;
        } else if (width < 1024) {
            this.itemsPerView = 2;
        } else {
            this.itemsPerView = 3;
        }
        
        if (prevItemsPerView !== this.itemsPerView) {
            this.currentIndex = 0;
            this.createDots();
        }
        
        this.updateSlider();
    }

    nextSlide() {
        if (this.currentIndex < this.totalSlides - this.itemsPerView) {
            this.currentIndex++;
            this.updateSlider();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    updateSlider() {
        // Use wrapper width (visible area) for calculation
        const wrapperWidth = this.sliderWrapper.offsetWidth;
        // On mobile (1 item), no gap needed; otherwise 1rem gap
        const gap = this.itemsPerView === 1 ? 0 : 16;
        
        // Calculate slide width based on items per view
        let slideWidth;
        if (this.itemsPerView === 1) {
            slideWidth = wrapperWidth;
        } else {
            slideWidth = (wrapperWidth - gap * (this.itemsPerView - 1)) / this.itemsPerView + gap;
        }
        
        const translateValue = -this.currentIndex * slideWidth;
        this.slider.style.transform = `translateX(${translateValue}px)`;
        
        this.updateDots();
        this.updateButtonStates();
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.cert-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    updateButtonStates() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.totalSlides - this.itemsPerView;
        
        this.prevBtn.style.opacity = this.prevBtn.disabled ? '0.5' : '1';
        this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
    }
}

// Portfolio Slider
class PortfolioSlider {
    constructor() {
        this.slider = document.querySelector('.portfolio-slider');
        this.sliderWrapper = document.querySelector('.portfolio-slider-wrapper');
        this.slides = document.querySelectorAll('.portfolio-slide');
        this.prevBtn = document.querySelector('.portfolio-prev');
        this.nextBtn = document.querySelector('.portfolio-next');
        this.dotsContainer = document.querySelector('.portfolio-slider-dots');
        
        if (!this.slider) return;

        this.currentIndex = 0;
        this.itemsPerView = 3;
        this.totalSlides = this.slides.length;
        
        this.init();
    }

    init() {
        this.handleResize();
        this.createDots();
        this.attachEventListeners();
        this.updateSlider();
        window.addEventListener('resize', () => this.handleResize());
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        const dotsNeeded = Math.ceil(this.totalSlides - this.itemsPerView + 1);
        for (let i = 0; i < dotsNeeded; i++) {
            const dot = document.createElement('div');
            dot.className = 'portfolio-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    handleResize() {
        const width = this.sliderWrapper.offsetWidth;
        const prevItemsPerView = this.itemsPerView;
        const isPhone = window.matchMedia('(max-width: 900px) and (pointer: coarse)').matches;
        
        if (isPhone) {
            this.itemsPerView = 1;
        } else if (width < 768) {
            this.itemsPerView = 1;
        } else if (width < 1024) {
            this.itemsPerView = 2;
        } else {
            this.itemsPerView = 3;
        }
        
        if (prevItemsPerView !== this.itemsPerView) {
            this.currentIndex = 0;
            this.createDots();
        }
        
        this.updateSlider();
    }

    nextSlide() {
        if (this.currentIndex < this.totalSlides - this.itemsPerView) {
            this.currentIndex++;
            this.updateSlider();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    updateSlider() {
        // Use wrapper width (visible area) for calculation
        const wrapperWidth = this.sliderWrapper.offsetWidth;
        // On mobile (1 item), no gap needed; otherwise 1rem gap
        const gap = this.itemsPerView === 1 ? 0 : 16;
        
        // Calculate slide width based on items per view
        let slideWidth;
        if (this.itemsPerView === 1) {
            slideWidth = wrapperWidth;
        } else {
            slideWidth = (wrapperWidth - gap * (this.itemsPerView - 1)) / this.itemsPerView + gap;
        }
        
        const translateValue = -this.currentIndex * slideWidth;
        this.slider.style.transform = `translateX(${translateValue}px)`;
        
        this.updateDots();
        this.updateButtonStates();
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.portfolio-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    updateButtonStates() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.totalSlides - this.itemsPerView;
        
        this.prevBtn.style.opacity = this.prevBtn.disabled ? '0.5' : '1';
        this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
    }
}

// Initialize sliders
document.addEventListener('DOMContentLoaded', () => {
    new CertificateSlider();
    new PortfolioSlider();
});
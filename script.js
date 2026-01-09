document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------
       REGISTER GSAP PLUGINS (CRITICAL)
    ---------------------------------- */
    (function registerPlugins() {
        const plugins = [ScrollTrigger];
        if (typeof ScrambleTextPlugin !== 'undefined') plugins.push(ScrambleTextPlugin);
        gsap.registerPlugin(...plugins);
    })();

    /* ----------------------------------
       LOADER
    ---------------------------------- */
    const loaderTL = gsap.timeline({
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    });

    // animate CSS variable for the loader-fill so pseudo-element reflects progress
    loaderTL
        .to(".loader-bar", { "--loader-fill": "100%", duration: 1.8, ease: "power2.inOut" })
        .to({}, { duration: 0.3 }) // pause to let user see 100%
        .to("#loader", { opacity: 0, duration: 0.5 });

    // timeout fallback: ensure loader doesn't block the page if something stalls
    const _loaderEl = document.getElementById('loader');
    setTimeout(() => {
        try {
            if (_loaderEl && getComputedStyle(_loaderEl).display !== 'none') {
                _loaderEl.classList.add('loader-timeout');
                const bar = document.querySelector('.loader-bar');
                if (bar) bar.style.setProperty('--loader-fill', '100%');
                setTimeout(() => { _loaderEl.style.display = 'none'; }, 700);
                console.warn('Loader hidden by timeout');
            }
        } catch (e) { console.warn('Loader timeout check failed', e); }
    }, 6500);

    /* ----------------------------------
       LOCOMOTIVE SCROLL (FIXED)
    ---------------------------------- */
    const scrollContainer = document.querySelector(".scroll-content");

    const scroller = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true
    });

    /* Sync GSAP + Locomotive */
    scroller.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
            return arguments.length
                ? scroller.scrollTo(value, { duration: 0, disableLerp: true })
                : scroller.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    });

    ScrollTrigger.addEventListener("refresh", () => scroller.update());
    ScrollTrigger.refresh();

    /* ----------------------------------
       HERO REVEAL
    ---------------------------------- */
    gsap.from(".gsap-reveal", {
        y: 64,
        opacity: 0,
        duration: 1.0,
        stagger: 0.18,
        ease: "power3.out"
    });

    /* ----------------------------------
       SCRAMBLE TEXT (hero & subtitle)
    ---------------------------------- */
    try {
        if (typeof ScrambleTextPlugin !== 'undefined') {
            const heroScr = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
            heroScr.to('#scramble', {
                duration: 1.6,
                scrambleText: {
                    text: 'Data Scientist',
                    chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                    speed: 0.6
                },
                ease: 'power2.inOut'
            }).to('#scramble', {
                duration: 1.6,
                scrambleText: {
                    text: 'Akram',
                    chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                    speed: 0.6
                },
                ease: 'power2.inOut'
            });

            const subEl = document.querySelector('#scramble-sub');
            if (subEl) {
                const subOriginal = subEl.textContent.trim();
                const subAlt = 'Machine Learning & Data Science';
                const subScr = gsap.timeline({ repeat: -1, repeatDelay: 1.8 });
                subScr.to('#scramble-sub', {
                    duration: 2.0,
                    scrambleText: {
                        text: subAlt,
                        chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ &0123456789',
                        speed: 0.6
                    },
                    ease: 'power2.inOut'
                }).to('#scramble-sub', {
                    duration: 2.0,
                    scrambleText: {
                        text: subOriginal,
                        chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ &0123456789',
                        speed: 0.6
                    },
                    ease: 'power2.inOut'
                });
            }
        } else {
            console.warn('ScrambleTextPlugin not available; skipping scramble animations.');
        }
    } catch (e) {
        console.warn('ScrambleTextPlugin error:', e);
    }

    /* ----------------------------------
       SCROLL REVEALS
    ---------------------------------- */
    gsap.utils.toArray(".reveal").forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                scroller: scrollContainer,
                start: "top 82%"
            },
            y: 80,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out"
        });
    });

    /* ----------------------------------
       SKILL BARS
    ---------------------------------- */
    document.querySelectorAll(".skill-card").forEach(card => {
        const bar = card.querySelector(".skill-progress");
        const level = card.dataset.level;

        gsap.to(bar, {
            width: level + "%",
            scrollTrigger: {
                trigger: card,
                scroller: scrollContainer,
                start: "top 85%"
            },
            duration: 1.5,
            ease: "power3.out"
        });
    });

    /* ----------------------------------
       THEME CYCLE (dark / light / alt)
    ---------------------------------- */
    const themeBtn = document.getElementById("themeBtn");
    const altThemeLink = document.getElementById("alt-theme");
    const lightThemeLink = document.getElementById("light-theme");
    const THEME_KEY = 'site-theme';

    const THEMES = ['dark', 'light', 'alt'];

    function applyTheme(theme) {
        // enable/disable alternate stylesheets
        altThemeLink.disabled = theme !== 'alt';
        lightThemeLink.disabled = theme !== 'light';
        // keep existing body.light rules for compatibility
        document.body.classList.toggle('light', theme === 'light');

        // Update icon
        if (theme === 'dark') themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        else if (theme === 'light') themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        else themeBtn.innerHTML = '<i class="fas fa-star"></i>';

        themeBtn.title = 'Theme: ' + theme;
        localStorage.setItem(THEME_KEY, theme);
    }

    // Initialize from saved preference or default to 'dark'
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(THEMES.includes(savedTheme) ? savedTheme : 'dark');

    themeBtn.addEventListener('click', () => {
        const current = localStorage.getItem(THEME_KEY) || 'dark';
        const idx = THEMES.indexOf(current);
        const next = THEMES[(idx + 1) % THEMES.length];
        applyTheme(next);
    });

    /* ----------------------------------
       3D PROJECT CARD TILT
    ---------------------------------- */
    const projectCards = document.querySelectorAll(".project-card");
    
    projectCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) * 0.015;
            const rotateX = (centerY - y) * 0.015;
            
            card.style.transform = `
                perspective(1200px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(40px)
            `;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = "rotateX(0) rotateY(0) translateZ(0)";
        });
    });

    /* ----------------------------------
       MAGNETIC BUTTON
    ---------------------------------- */
    const magneticWrap = document.querySelector(".magnetic-wrap");
    const magneticBtn = document.querySelector(".magnetic");

    if (magneticWrap && magneticBtn) {
        magneticWrap.addEventListener("mousemove", e => {
            const rect = magneticWrap.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);

            gsap.to(magneticBtn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        magneticWrap.addEventListener("mouseleave", () => {
            gsap.to(magneticBtn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }

    // secondary CTA entrance + hover
    const secondaryCta = document.querySelector('.btn-secondary');
    if (secondaryCta) {
        // add entrance class so CSS animation plays; remove if user prefers GSAP
        secondaryCta.classList.add('entrance');

        // hover scale using GSAP for smoother animation
        secondaryCta.addEventListener('mouseenter', () => {
            gsap.to(secondaryCta, { scale: 1.04, duration: 0.28, ease: 'power2.out' });
        });
        secondaryCta.addEventListener('mouseleave', () => {
            gsap.to(secondaryCta, { scale: 1, duration: 0.38, ease: 'elastic.out(1,0.7)' });
        });
    }

    /* ----------------------------------
       CUSTOM CURSOR
    ---------------------------------- */
    const cursor = document.querySelector(".cursor");
    const blob = document.querySelector(".cursor-blob");
    const dotsContainer = document.querySelector(".cursor-dots");
    let lastDotTime = 0;
    const dotInterval = 90; // milliseconds between dots (reduced spawn rate)

    window.addEventListener("mousemove", e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15 });
        gsap.to(blob, { x: e.clientX - 60, y: e.clientY - 60, duration: 0.6 });

        // Create trailing dots with lightning effects
        const now = Date.now();
        if (now - lastDotTime > dotInterval) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            
            // Randomly choose between lightning and pulse effects
            const useLight = Math.random() > 0.7;
            dot.classList.add(useLight ? "lightning" : "pulse");
            
            dot.style.left = e.clientX - 4 + "px";
            dot.style.top = e.clientY - 4 + "px";
            dotsContainer.appendChild(dot);
            lastDotTime = now;

            // Remove dot after animation completes
            setTimeout(() => {
                dot.remove();
            }, 600);
        }
    });

    /* ----------------------------------
       BUTTON RIPPLE EFFECT
    ---------------------------------- */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('pointerdown', function (e) {
            const rect = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height) * 0.5;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple);

            // remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 700);
        });
    });

    /* ----------------------------------
       SOCIAL ICONS: small hover lift
    ---------------------------------- */
    document.querySelectorAll('.social-icons a').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            gsap.to(icon, { y: -6, duration: 0.28, ease: 'power2.out' });
        });
        icon.addEventListener('mouseleave', () => {
            gsap.to(icon, { y: 0, duration: 0.5, ease: 'elastic.out(1,0.6)' });
        });
        // ripple on press / pointerdown
        icon.addEventListener('pointerdown', (e) => {
            const rect = icon.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height) * 0.8;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            icon.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    /* ----------------------------------
       PROJECT MODAL
    ---------------------------------- */
    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent = card.dataset.desc;
            modal.classList.add("active");
        });
    });

    document.querySelector(".modal-overlay").onclick =
    document.querySelector(".modal-close").onclick = () => {
        modal.classList.remove("active");
    };

    /* ----------------------------------
       NAV SCROLL
    ---------------------------------- */
    document.querySelectorAll("[data-scroll-to]").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            scroller.scrollTo(link.getAttribute("href"));
        });
    });

    /* ----------------------------------
       ANIMATE CSS INTEGRATION
    ---------------------------------- */
    // Add Animate CSS classes to elements on scroll
    gsap.utils.toArray("[data-animate]").forEach(el => {
        const animationClass = el.dataset.animate;
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                scroller: scrollContainer,
                start: "top 85%",
                onEnter: () => {
                    el.classList.add("animate__animated", animationClass);
                }
            }
        });
    });

    /* ----------------------------------
       FRAMER MOTION STYLE ANIMATIONS (JS Equivalent)
    ---------------------------------- */
    // Initial variant animations (like Framer Motion variants)
    document.querySelectorAll("[data-framer]").forEach(el => {
        const variant = el.dataset.framer;
        
        // Initial state
        gsap.set(el, {
            opacity: 0,
            y: 30,
            scale: 0.9
        });

        // Animate in on scroll
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                scroller: scrollContainer,
                start: "top 80%"
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        });
    });

    // Hover animations (Framer Motion whileHover equivalent)
    document.querySelectorAll("[data-hover-animate]").forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(el, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out"
            });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(el, {
                scale: 1,
                duration: 0.3,
                ease: "back.out"
            });
        });
    });

});
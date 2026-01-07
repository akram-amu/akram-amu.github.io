document.addEventListener('DOMContentLoaded', () => {

    // 1. Loader Animation
    const tlLoader = gsap.timeline();
    tlLoader.to(".loader-bar", { width: "100%", duration: 1.5, ease: "power2.inOut" })
            .to("#loader", { opacity: 0, pointerEvents: "none", duration: 0.8 });

    // 2. Initialize Locomotive Scroll
    const scroller = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true
    });

    // 3. GSAP Hero Reveal
    tlLoader.from(".gsap-reveal", {
        y: 100, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power4.out"
    }, "-=0.3");

    // 4. Magnetic Button Logic
    const magneticBtn = document.querySelector('.magnetic');
    const magneticWrap = document.querySelector('.magnetic-wrap');

    magneticWrap.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = magneticWrap.getBoundingClientRect();
        const x = e.clientX - (left + width / 2);
        const y = e.clientY - (top + height / 2);
        
        gsap.to(magneticBtn, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    magneticWrap.addEventListener('mouseleave', () => {
        gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });

    // 5. ScrollTo Navigation
    const scrollLinks = document.querySelectorAll('[data-scroll-to]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            scroller.scrollTo(target);
        });
    });

    // Sync Locomotive on update
    window.addEventListener('load', () => scroller.update());
});

document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------
       REGISTER GSAP PLUGINS (CRITICAL)
    ---------------------------------- */
    gsap.registerPlugin(ScrollTrigger);

    /* ----------------------------------
       LOADER
    ---------------------------------- */
    const loaderTL = gsap.timeline({
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    });

    loaderTL
        .to(".loader-bar", { width: "100%", duration: 1.4, ease: "power2.inOut" })
        .to("#loader", { opacity: 0, duration: 0.6 });

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
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    });

    /* ----------------------------------
       SCROLL REVEALS
    ---------------------------------- */
    gsap.utils.toArray(".reveal").forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                scroller: scrollContainer,
                start: "top 85%"
            },
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "power4.out"
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
       THEME TOGGLE
    ---------------------------------- */
    const themeBtn = document.getElementById("themeBtn");
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
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

    /* ----------------------------------
       CUSTOM CURSOR
    ---------------------------------- */
    const cursor = document.querySelector(".cursor");
    const blob = document.querySelector(".cursor-blob");

    window.addEventListener("mousemove", e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15 });
        gsap.to(blob, { x: e.clientX - 60, y: e.clientY - 60, duration: 0.6 });
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

});

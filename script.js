// Loader
gsap.to(".loader-bar", { width: "100%", duration: 1.5 })
    .to("#loader", { opacity: 0, pointerEvents: "none", duration: 0.6 });

// Locomotive
const scroller = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
});

// Scroll to
document.querySelectorAll('[data-scroll-to]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        scroller.scrollTo(link.getAttribute('href'));
    });
});

// Hero reveal
gsap.from(".gsap-reveal", {
    y: 80,
    opacity: 0,
    stagger: 0.2,
    duration: 1.2
});

// Scroll reveal
gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 80,
        opacity: 0,
        duration: 1
    });
});

// Skill bars
document.querySelectorAll('.skill-card').forEach(card => {
    gsap.to(card.querySelector('.skill-progress'), {
        width: card.dataset.level + "%",
        scrollTrigger: { trigger: card, start: "top 85%" },
        duration: 1.5
    });
});

// Theme toggle
const themeBtn = document.getElementById('themeBtn');
themeBtn.onclick = () => document.body.classList.toggle('light');

// Cursor
const cursor = document.querySelector('.cursor');
const blob = document.querySelector('.cursor-blob');

window.addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    gsap.to(blob, { x: e.clientX - 60, y: e.clientY - 60, duration: 0.6 });
});

// Modal
const modal = document.getElementById('projectModal');
document.querySelectorAll('.project-card').forEach(card => {
    card.onclick = () => {
        modal.classList.add('active');
        document.getElementById('modalTitle').innerText = card.dataset.title;
        document.getElementById('modalDesc').innerText = card.dataset.desc;
    };
});
document.querySelector('.modal-overlay').onclick =
document.querySelector('.modal-close').onclick = () =>
    modal.classList.remove('active');

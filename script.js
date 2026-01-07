document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeBtn = document.getElementById('themeBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    const body = document.body;

    // 1. Theme Toggle Logic
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });

    // Check Local Storage for Theme
    if (localStorage.getItem('portfolio-theme') === 'dark') {
        body.classList.add('dark-mode');
        themeBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    // 2. Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update UI for buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projects.forEach(project => {
                const category = project.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    project.style.display = 'block';
                    // Re-trigger animation
                    setTimeout(() => project.style.opacity = '1', 10);
                } else {
                    project.style.opacity = '0';
                    setTimeout(() => project.style.display = 'none', 300);
                }
            });
        });
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once it reveals, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

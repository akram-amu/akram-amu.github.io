/**
 * MD AHMOD AKRAM CHOUDHURY - PORTFOLIO INTERACTIVE LOGIC & ANIMATIONS
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. CANVAS NEURAL NETWORK PARTICLE BACKGROUND
       ========================================================================== */
    (function initParticleCanvas() {
        const canvas = document.getElementById("bg-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        let mouse = { x: width / 2, y: height / 2, radius: 150 };

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.4 ? "#8b5cf6" : "#06b6d4";
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction distance
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }

        let particles = [];
        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((width * height) / 14000), 75);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles with lines
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = "rgba(139, 92, 246, " + (1 - dist / 120) * 0.25 + ")";
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    })();


    /* ==========================================================================
       2. HERO TYPING EFFECT
       ========================================================================== */
    (function initTypingEffect() {
        const target = document.getElementById("typing-text");
        if (!target) return;

        const words = [
            "Generative AI & Agentic Systems 🤖",
            "LangGraph & LangChain Workflows 🚀",
            "Property Price Predictors on AWS ☁️",
            "RAG Pipelines & LLM Workspaces 🧠",
            "Production Machine Learning Models 💻"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const delayBetweenWords = 1800;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                target.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                target.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentWord.length) {
                nextSpeed = delayBetweenWords;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                nextSpeed = 300;
            }

            setTimeout(type, nextSpeed);
        }
        type();
    })();


    /* ==========================================================================
       3. HERO AI TERMINAL INTERACTIVE TABS & SIMULATION
       ========================================================================== */
    (function initTerminalWidget() {
        const tabs = document.querySelectorAll(".term-tab");
        const panes = document.querySelectorAll(".tab-pane");
        const runBtn = document.getElementById("btn-run-demo");
        const logContainer = document.getElementById("terminal-log");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const targetTab = tab.getAttribute("data-tab");
                tabs.forEach(t => t.classList.remove("active"));
                panes.forEach(p => p.classList.remove("active"));

                tab.classList.add("active");
                const activePane = document.getElementById(`tab-${targetTab}`);
                if (activePane) activePane.classList.add("active");
            });
        });

        if (runBtn && logContainer) {
            let isRunning = false;
            runBtn.addEventListener("click", () => {
                if (isRunning) return;
                isRunning = true;

                // Switch tab to Console
                tabs.forEach(t => t.classList.remove("active"));
                panes.forEach(p => p.classList.remove("active"));
                document.querySelector('[data-tab="output"]').classList.add("active");
                document.getElementById("tab-output").classList.add("active");

                runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing...';

                const logs = [
                    { tag: '[AGENT LOOP]', text: 'Received prompt query from API endpoint.', type: 'info' },
                    { tag: '[RETRIEVAL]', text: 'Querying vector collection: "ai_knowledge" (top k=3)', type: 'info' },
                    { tag: '[CHROMA DB]', text: 'Found 3 vector matches (Similarity score: 0.962)', type: 'success' },
                    { tag: '[LLM CALL]', text: 'Synthesizing response with OpenAI GPT-4o...', type: 'highlight' },
                    { tag: '[STATUS 200]', text: 'Response generated in 184ms. Agent loop finished.', type: 'success' }
                ];

                logContainer.innerHTML = '<p class="log-line info"><span class="log-tag">[SYSTEM]</span> Initializing new agent thread...</p>';

                logs.forEach((log, index) => {
                    setTimeout(() => {
                        const p = document.createElement("p");
                        p.className = `log-line ${log.type}`;
                        p.innerHTML = `<span class="log-tag">${log.tag}</span> ${log.text}`;
                        logContainer.appendChild(p);
                        logContainer.scrollTop = logContainer.scrollHeight;

                        if (index === logs.length - 1) {
                            isRunning = false;
                            runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Agent Loop';
                            showToast("Agent loop execution completed successfully!", "success");
                        }
                    }, (index + 1) * 600);
                });
            });
        }
    })();


    /* ==========================================================================
       4. ANIMATED STAT COUNTERS
       ========================================================================== */
    (function initStatCounters() {
        const counters = document.querySelectorAll(".stat-number");
        let animated = false;

        function checkScroll() {
            const statsSection = document.querySelector(".stats-section");
            if (!statsSection) return;

            const rect = statsSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85 && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute("data-target"), 10);
                    let count = 0;
                    const increment = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = count;
                        }
                    }, 40);
                });
            }
        }

        window.addEventListener("scroll", checkScroll);
        checkScroll();
    })();


    /* ==========================================================================
       5. PROJECT CATEGORY FILTER & MODALS
       ========================================================================== */
    (function initProjectFilters() {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const cards = document.querySelectorAll(".project-card, .featured-banner-card");

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.getAttribute("data-filter");

                cards.forEach(card => {
                    const category = card.getAttribute("data-category");
                    if (filter === "all" || category === filter) {
                        card.style.display = "";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    })();

    // Project Modals Data
    const projectDetailsData = {
        property: {
            title: "Property Price Prediction System",
            category: "Machine Learning / AWS Cloud",
            desc: "An end-to-end machine learning application engineered to predict real estate property prices using multiple machine learning regression models, rigorous feature selection, and AWS cloud deployment.",
            bullets: [
                "Performed extensive data cleaning, outlier removal, missing value imputation, and log transformations.",
                "Exploratory Data Analysis (EDA) with statistical heatmaps, correlation matrices, and distribution metrics.",
                "Feature Selection via Random Forest Importance, Gradient Boosting, LASSO regression, and Recursive Feature Elimination (RFE).",
                "Tuned Support Vector Regression (SVR) and Linear Regression pipelines achieving R² score of 0.94+.",
                "Deployed responsive Streamlit interface on AWS EC2 with interactive geo-mapping and recommendation modules."
            ],
            tech: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Streamlit", "AWS EC2", "Matplotlib", "Seaborn"],
            github: "https://github.com/mdakram2001"
        },
        rag: {
            title: "Autonomous Multi-Agent RAG Assistant",
            category: "Generative AI / Agentic Systems",
            desc: "A production-grade agentic search workflow designed with LangGraph and LangChain that dynamically evaluates user queries, rewrites search paths, and performs retrieval-augmented generation.",
            bullets: [
                "Built stateful execution graphs with LangGraph handling routing, fallback loops, and vector search.",
                "Stored domain embeddings into ChromaDB vector database using BAAI/bge embeddings.",
                "Implemented self-reflection loops where the model evaluates its own retrieval precision before generating answers.",
                "Exposed asynchronous API endpoints using FastAPI for fast multi-tenant client requests."
            ],
            tech: ["LangGraph", "LangChain", "OpenAI GPT-4o", "ChromaDB", "FastAPI", "Python"],
            github: "https://github.com/mdakram2001"
        },
        churn: {
            title: "Deep Learning Churn & Sentiment Engine",
            category: "Deep Learning & NLP",
            desc: "Dual neural network framework providing enterprise customer retention forecasts (98% precision) alongside medical clinical consultation sentiment classification.",
            bullets: [
                "Trained multi-layer perceptron (MLP) deep neural networks in PyTorch for high-dimensional customer churn data.",
                "Fine-tuned Hugging Face Transformer models (BERT) for medical sentiment and clinical keyphrase extraction.",
                "Built Flask REST API service with automated batch prediction pipeline.",
                "Achieved 98% precision score on validation benchmarks."
            ],
            tech: ["PyTorch", "TensorFlow", "Hugging Face", "BERT", "Flask", "Scikit-learn"],
            github: "https://github.com/mdakram2001"
        },
        "local-llm": {
            title: "Local Privacy LLM Desktop Workspace",
            category: "Full Stack AI / Offline Tools",
            desc: "Privacy-first desktop software application enabling developers and researchers to interact with open-source LLMs locally without transmitting data over external servers.",
            bullets: [
                "Leveraged local Ollama runner with Llama 3 & Mistral models for offline execution.",
                "React + Tailwind CSS frontend interface with real-time token streaming & code block highlighting.",
                "Local document ingestion pipeline supporting PDF, Markdown, and source code files.",
                "Zero data exfiltration guaranteed for strict enterprise privacy standards."
            ],
            tech: ["React.js", "FastAPI", "Ollama", "Tailwind CSS", "LangChain", "Python"],
            github: "https://github.com/mdakram2001"
        }
    };

    (function initModals() {
        const modal = document.getElementById("project-modal");
        const modalBody = document.getElementById("modal-body");
        const closeBtn = document.getElementById("modal-close");

        if (!modal || !modalBody) return;

        document.querySelectorAll(".modal-trigger-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const key = btn.getAttribute("data-project");
                const data = projectDetailsData[key];
                if (!data) return;

                modalBody.innerHTML = `
                    <span class="tag" style="margin-bottom:0.5rem; display:inline-block;">${data.category}</span>
                    <h3>${data.title}</h3>
                    <p>${data.desc}</p>
                    <ul class="modal-bullet-list">
                        ${data.bullets.map(b => `<li><i class="fa-solid fa-circle-check"></i> <span>${b}</span></li>`).join('')}
                    </ul>
                    <div class="tech-pills" style="margin-bottom:1.5rem;">
                        ${data.tech.map(t => `<span>${t}</span>`).join('')}
                    </div>
                    <div style="display:flex; gap:1rem;">
                        <a href="${data.github}" target="_blank" class="btn btn-primary glow-btn">
                            <i class="fa-brands fa-github"></i> View GitHub Code
                        </a>
                    </div>
                `;

                modal.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        function closeModal() {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeModal();
        });
    })();


    /* ==========================================================================
       6. LIVE SKILL FILTER SEARCH
       ========================================================================== */
    (function initSkillSearch() {
        const searchInput = document.getElementById("skill-search");
        const badges = document.querySelectorAll(".skill-badge");

        if (!searchInput) return;

        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();

            badges.forEach(badge => {
                const text = badge.textContent.toLowerCase();
                const name = badge.getAttribute("data-name") || "";
                if (text.includes(query) || name.includes(query)) {
                    badge.classList.remove("hidden");
                } else {
                    badge.classList.add("hidden");
                }
            });
        });
    })();


    /* ==========================================================================
       7. CONTACT FORM PRESETS & HANDLING
       ========================================================================== */
    (function initContactForm() {
        const form = document.getElementById("contact-form");
        const subjectInput = document.getElementById("subject");
        const chips = document.querySelectorAll(".chip-btn");
        const copyBtn = document.querySelector(".copy-btn");

        // Subject Chip Switcher
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                chips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                if (subjectInput) {
                    subjectInput.value = chip.getAttribute("data-preset");
                }
            });
        });

        // Form Submit Simulation
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const submitBtn = document.getElementById("form-submit-btn");
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span><i class="fa-solid fa-spinner fa-spin"></i> Sending...</span>';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span><i class="fa-solid fa-paper-plane"></i> Send Message</span>';
                    form.reset();
                    showToast("Thank you! Your message has been sent successfully.", "success");
                }, 1200);
            });
        }

        // Copy Email to Clipboard
        if (copyBtn) {
            copyBtn.addEventListener("click", () => {
                const text = copyBtn.getAttribute("data-copy");
                navigator.clipboard.writeText(text).then(() => {
                    showToast("Email address copied to clipboard!", "success");
                }).catch(() => {
                    showToast("Failed to copy. Please manually copy: " + text, "info");
                });
            });
        }
    })();


    /* ==========================================================================
       8. NAVBAR SCROLL SPY & MOBILE TOGGLE
       ========================================================================== */
    (function initNavigation() {
        const header = document.getElementById("navbar");
        const navHeader = document.querySelector(".navbar-header");
        const mobileToggle = document.getElementById("mobile-toggle");
        const navLinksContainer = document.getElementById("nav-links");
        const navLinks = document.querySelectorAll(".nav-link");
        const sections = document.querySelectorAll("section[id]");

        // Sticky scrolled header
        window.addEventListener("scroll", () => {
            if (window.scrollY > 40) {
                navHeader.classList.add("scrolled");
            } else {
                navHeader.classList.remove("scrolled");
            }

            // Scroll spy active link
            let current = "";
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute("id");
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${current}`) {
                    link.classList.add("active");
                }
            });
        });

        // Mobile drawer toggle
        if (mobileToggle && navLinksContainer) {
            mobileToggle.addEventListener("click", () => {
                navLinksContainer.classList.toggle("mobile-open");
            });

            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navLinksContainer.classList.remove("mobile-open");
                });
            });
        }
    })();

});

/* Helper Function: Toast Notifications */
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
/* =========================================================
   AI HEALTECH DYNAMICS
   Interaction / Animation JS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =======================================================
       SCROLL PROGRESS
    ======================================================= */

    const progress = document.querySelector(".scroll-progress");

    function updateScrollProgress() {

        if (!progress) return;

        const scrollTop = window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percent =
            scrollHeight > 0
                ? (scrollTop / scrollHeight) * 100
                : 0;

        progress.style.width = `${percent}%`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* =======================================================
       NAVIGATION BACKGROUND
    ======================================================= */

    const nav = document.querySelector(".nav");

    function updateNav() {

        if (!nav) return;

        nav.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );
    }

    window.addEventListener(
        "scroll",
        updateNav,
        { passive: true }
    );

    updateNav();


    /* =======================================================
       CURSOR GLOW
    ======================================================= */

    const cursorGlow =
        document.querySelector(".cursor-glow");

    if (
        cursorGlow &&
        !prefersReduced &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        let mouseX = -500;
        let mouseY = -500;

        let currentX = mouseX;
        let currentY = mouseY;

        document.addEventListener("mousemove", e => {

            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorGlow.style.opacity = "1";

        });

        document.addEventListener("mouseleave", () => {

            cursorGlow.style.opacity = "0";

        });

        function animateCursor() {

            currentX += (mouseX - currentX) * .10;
            currentY += (mouseY - currentY) * .10;

            cursorGlow.style.left = `${currentX}px`;
            cursorGlow.style.top = `${currentY}px`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }


    /* =======================================================
       INTERSECTION OBSERVER
    ======================================================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right"
        );

    if (!prefersReduced && "IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: .12,
                    rootMargin: "0px 0px -70px 0px"
                }
            );

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

    } else {

        revealElements.forEach(el => {
            el.classList.add("visible");
        });

    }


    /* =======================================================
       STAGGER CARDS
    ======================================================= */

    const cardGroups = [
        ".division-grid .division-card",
        ".innovation-cards .innovation-card",
        ".founders-grid .founder",
        ".contact-cards .contact-card"
    ];

    if (!prefersReduced) {

        cardGroups.forEach(selector => {

            const cards =
                document.querySelectorAll(selector);

            cards.forEach((card, index) => {

                card.style.transitionDelay =
                    `${index * 90}ms`;

            });

        });

    }


    /* =======================================================
       MAGNETIC BUTTONS
    ======================================================= */

    if (
        !prefersReduced &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        const magneticElements =
            document.querySelectorAll(".magnetic");

        magneticElements.forEach(element => {

            element.addEventListener(
                "mousemove",
                e => {

                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        e.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        e.clientY -
                        rect.top -
                        rect.height / 2;

                    const strength =
                        element.classList.contains("contact-card")
                            ? .08
                            : .18;

                    element.style.transform =
                        `translate(${x * strength}px, ${y * strength}px)`;

                }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    element.style.transform = "";

                }
            );

        });

    }


    /* =======================================================
       HERO DASHBOARD FLOATING MOTION
    ======================================================= */

    if (!prefersReduced) {

        const dashboard =
            document.querySelector(".hero-dashboard");

        const cards =
            document.querySelectorAll(
                ".hero-dashboard .floating-card"
            );

        if (dashboard && cards.length) {

            let ticking = false;

            function updateDashboard() {

                if (window.innerWidth <= 980) {
                    ticking = false;
                    return;
                }

                const rect =
                    dashboard.getBoundingClientRect();

                const viewportCenter =
                    window.innerHeight / 2;

                const offset =
                    (rect.top + rect.height / 2) -
                    viewportCenter;

                const amount =
                    Math.max(
                        -20,
                        Math.min(20, offset * -.035)
                    );

                cards.forEach((card, index) => {

                    const direction =
                        index % 2 === 0 ? 1 : -1;

                    card.style.transform =
                        `translateY(${amount * direction}px)`;

                });

                ticking = false;
            }

            window.addEventListener(
                "scroll",
                () => {

                    if (!ticking) {

                        requestAnimationFrame(
                            updateDashboard
                        );

                        ticking = true;
                    }

                },
                { passive: true }
            );

        }

    }


    /* =======================================================
       ACTIVE NAVIGATION
    ======================================================= */

    const navLinks =
        document.querySelectorAll(
            ".desktop-nav a"
        );

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );

    if (
        navLinks.length &&
        sections.length &&
        "IntersectionObserver" in window
    ) {

        const navObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        const id =
                            entry.target.id;

                        navLinks.forEach(link => {

                            const active =
                                link.getAttribute("href") ===
                                `#${id}`;

                            link.classList.toggle(
                                "active",
                                active
                            );

                        });

                    });

                },
                {
                    threshold: .25,
                    rootMargin: "-20% 0px -60% 0px"
                }
            );

        sections.forEach(section => {
            navObserver.observe(section);
        });

    }


    /* =======================================================
       MOBILE MENU
    ======================================================= */

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn"
        );

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );

    function closeMenu() {

        if (!menuButton || !mobileMenu) return;

        menuButton.classList.remove("open");
        mobileMenu.classList.remove("open");

        document.body.classList.remove(
            "menu-open"
        );
    }

    if (menuButton && mobileMenu) {

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileMenu.classList.toggle("open");

                menuButton.classList.toggle(
                    "open",
                    isOpen
                );

                document.body.classList.toggle(
                    "menu-open",
                    isOpen
                );

            }
        );

        mobileMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });

    }


    /* =======================================================
       SMOOTH ANCHOR SCROLL
    ======================================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                e => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(targetId);

                    if (!target) return;

                    e.preventDefault();

                    const navHeight =
                        nav
                            ? nav.offsetHeight
                            : 0;

                    const targetTop =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        navHeight;

                    window.scrollTo({
                        top: targetTop,
                        behavior:
                            prefersReduced
                                ? "auto"
                                : "smooth"
                    });

                }
            );

        });


    /* =======================================================
       CARD TILT
    ======================================================= */

    if (
        !prefersReduced &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        const tiltCards =
            document.querySelectorAll(
                ".division-card, .innovation-card, .founder"
            );

        tiltCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                e => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        e.clientX - rect.left;

                    const y =
                        e.clientY - rect.top;

                    const rotateY =
                        ((x / rect.width) - .5) * 5;

                    const rotateX =
                        ((y / rect.height) - .5) * -5;

                    card.style.transform =
                        `translateY(-5px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform = "";

                }
            );

        });

    }


    /* =======================================================
       PARALLAX SECTION BACKGROUNDS
    ======================================================= */

    if (!prefersReduced) {

        const backgrounds =
            document.querySelectorAll(
                ".section-bg"
            );

        let ticking = false;

        function updateBackgrounds() {

            backgrounds.forEach(bg => {

                const section =
                    bg.closest(".section");

                if (!section) return;

                const rect =
                    section.getBoundingClientRect();

                const viewportHeight =
                    window.innerHeight;

                if (
                    rect.bottom < 0 ||
                    rect.top > viewportHeight
                ) {
                    return;
                }

                const progress =
                    (viewportHeight - rect.top) /
                    (viewportHeight + rect.height);

                const offset =
                    (progress - .5) * 18;

                bg.style.transform =
                    `scale(1.04) translate3d(0, ${offset}px, 0)`;

            });

            ticking = false;
        }

        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    requestAnimationFrame(
                        updateBackgrounds
                    );

                    ticking = true;
                }

            },
            { passive: true }
        );

        updateBackgrounds();

    }


    /* =======================================================
       TEXT HOVER GLOW
    ======================================================= */

    const heroHeading =
        document.querySelector(".hero h1");

    if (
        heroHeading &&
        !prefersReduced
    ) {

        heroHeading.addEventListener(
            "mousemove",
            e => {

                const rect =
                    heroHeading.getBoundingClientRect();

                const x =
                    ((e.clientX - rect.left) /
                        rect.width) *
                    100;

                heroHeading.style.setProperty(
                    "--mouse-x",
                    `${x}%`
                );

            }
        );

    }


    /* =======================================================
       CONTACT CARD HOVER LIGHT
    ======================================================= */

    if (
        !prefersReduced &&
        window.matchMedia("(pointer:fine)").matches
    ) {

        document
            .querySelectorAll(".contact-card")
            .forEach(card => {

                card.addEventListener(
                    "mousemove",
                    e => {

                        const rect =
                            card.getBoundingClientRect();

                        const x =
                            e.clientX - rect.left;

                        const y =
                            e.clientY - rect.top;

                        card.style.background =
                            `radial-gradient(
                circle at ${x}px ${y}px,
                rgba(122,240,196,.10),
                rgba(255,255,255,.06) 45%
              )`;

                    }
                );

                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.background =
                            "rgba(255,255,255,.06)";

                    }
                );

            });

    }


    /* =======================================================
       INITIAL HERO ANIMATION
    ======================================================= */

    if (!prefersReduced) {

        const heroItems = [
            document.querySelector(".hero-eyebrow"),
            document.querySelector(".hero h1"),
            document.querySelector(".hero-description"),
            document.querySelector(".hero-buttons"),
            document.querySelector(".hero-stats")
        ];

        heroItems.forEach((item, index) => {

            if (!item) return;

            item.style.opacity = "0";
            item.style.transform =
                "translateY(25px)";

            item.style.transition =
                `opacity .9s ease ${index * 110}ms,
         transform 1s cubic-bezier(.22,1,.36,1) ${index * 110}ms`;

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    item.style.opacity = "1";
                    item.style.transform =
                        "translateY(0)";

                });

            });

        });

    }


    /* =======================================================
       KEYBOARD ACCESSIBILITY
    ======================================================= */

    document.addEventListener(
        "keydown",
        e => {

            if (e.key === "Escape") {
                closeMenu();
            }

        }
    );


});
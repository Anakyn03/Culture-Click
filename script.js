// Database of our places so the Details view updates dynamically.
// NOTE: every image below is a real Wikimedia Commons photo of the actual
// place (not a random stock photo) - swap the `image` field for your own
// CDN url whenever you're ready to connect a real backend/CMS.
const placesData = {
    taj: {
        title: "Taj Mahal",
        location: "Agra, Uttar Pradesh",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Taj%20Mahal%20(Edited).jpeg?width=2000",
        badge: "UNESCO",
        time: "October to March (Sunrise)",
        description: "Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal, the Taj Mahal stands as the ultimate monument to love. It is a masterpiece of architectural symmetry, featuring intricate pietra dura marble inlays and perfectly manicured charbagh gardens."
    },
    hawa: {
        title: "Hawa Mahal",
        location: "Jaipur, Rajasthan",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hawa%20Mahal%202011.jpg?width=2000",
        badge: "Heritage",
        time: "September to March",
        description: "Known as the 'Palace of Winds', this five-story exterior is akin to the honeycomb of a beehive. Built from red and pink sandstone in 1799, its 953 small windows (jharokhas) were designed to allow royal ladies to observe everyday street life without being seen."
    },
    kerala: {
        title: "Kerala Backwaters",
        location: "Alleppey, Kerala",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Houseboats%20in%20Alleppey%20Backwaters.jpg?width=2000",
        badge: "Nature",
        time: "September to February",
        description: "A network of interconnected canals, rivers, lakes, and inlets formed by more than 900 km of waterways. Gliding along the calm waters in a traditional wooden houseboat (Kettuvallam) offers an immersive look into rural village life set against lush green palm fringes."
    },
    munsyari: {
        title: "Munsyari",
        location: "Pithoragarh, Uttarakhand",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Panchchuli%20Peaks%2C%20near%20Munsiyari%2C%20Uttarakhand.jpg?width=2000",
        badge: "Himalayas",
        time: "September to March",
        description: "Munsyari is a picturesque town in the Pithoragarh district of Uttarakhand, gateway to the five snow-capped Panchachuli peaks. Known for its dramatic mountain views and serene environment, it offers a perfect retreat for nature lovers and trekkers heading into the Kumaon Himalayas."
    }
};

// Maps a badge label to one of the colour variants defined in style.css,
// so different kinds of places (heritage / nature / mountains ...) read
// as visually distinct at a glance instead of one flat white pill.
const badgeColorMap = {
    UNESCO: 'badge-royal',
    Heritage: 'badge-saffron',
    Nature: 'badge-forest',
    Himalayas: 'badge-maroon'
};

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const homeView = document.getElementById('home-view');

    // --- 1. Sticky / smooth navbar appearance ---
    const updateNavbar = () => {
        if (window.scrollY > 50 || !homeView.classList.contains('active')) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // --- 2. Scroll reveal animations (home page content) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.fade-in-up').forEach((el, i) => {
        if (el.classList.contains('card')) el.style.transitionDelay = `${(i % 4) * 0.12}s`;
        observer.observe(el);
    });

    // --- 3. Mobile menu ---
    const menuToggle = document.getElementById('menuToggle');
    const menuIcon = document.getElementById('menuIcon');
    const mobilePanel = document.getElementById('mobilePanel');

    const closeMobileMenu = () => {
        mobilePanel.classList.remove('open');
        menuIcon.className = 'ri-menu-line';
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        updateNavbar(); // restore transparent-over-hero state if we're back at the top
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = mobilePanel.classList.toggle('open');
        menuIcon.className = isOpen ? 'ri-close-line' : 'ri-menu-line';
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        // The panel sits behind the navbar, so force it solid while open —
        // otherwise white hero icons would land on the panel's light background.
        if (isOpen) {
            navbar.classList.add('scrolled');
        } else {
            updateNavbar();
        }
    });

    mobilePanel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- 4. "Explore" button smooth-scrolls to the destinations grid ---
    const exploreBtn = document.getElementById('exploreBtn');
    exploreBtn.addEventListener('click', () => {
        document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- 5. Single Page Application (SPA) Routing ---
function openDetails(placeId) {
    const data = placesData[placeId];
    if (!data) return;

    const detailsView = document.getElementById('details-view');
    const badgeEl = document.getElementById('detail-badge');

    // Populate the details page with the correct data
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-location').innerHTML = `<i class="ri-map-pin-2-line"></i> ${data.location}`;
    document.getElementById('detail-img').src = data.image;
    document.getElementById('detail-img').alt = data.title;
    document.getElementById('detail-desc').textContent = data.description;
    document.getElementById('detail-time').textContent = data.time;

    badgeEl.textContent = data.badge;
    badgeEl.className = `badge ${badgeColorMap[data.badge] || ''}`;

    // Reset, then replay, the fade-in-up reveal for the details view every
    // time it opens (it would otherwise only ever fire once, since the
    // IntersectionObserver never sees it while display:none is hiding it).
    const animatedEls = detailsView.querySelectorAll('.fade-in-up');
    animatedEls.forEach((el, i) => {
        el.classList.remove('visible');
        el.style.transitionDelay = `${i * 0.08}s`;
    });

    // Hide Home, show Details
    document.getElementById('home-view').classList.remove('active');
    detailsView.classList.add('active');

    // Force navbar to its solid state — there's no dark hero behind it here
    document.getElementById('navbar').classList.add('scrolled');

    // Scroll to top, then trigger the reveal once the browser has painted
    // the "hidden" starting state (double rAF avoids a transition-less snap).
    window.scrollTo({ top: 0, behavior: 'smooth' });
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            animatedEls.forEach(el => el.classList.add('visible'));
        });
    });
}

function goHome() {
    // Hide Details, show Home
    document.getElementById('details-view').classList.remove('active');
    document.getElementById('home-view').classList.add('active');

    // Reset navbar state based on current scroll position
    if (window.scrollY <= 50) {
        document.getElementById('navbar').classList.remove('scrolled');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

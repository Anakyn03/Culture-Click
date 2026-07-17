// Database of our places so the Details view updates dynamically
const placesData = {
    taj: {
        title: "Taj Mahal",
        location: "Agra, Uttar Pradesh",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000",
        badge: "UNESCO",
        time: "October to March (Sunrise)",
        description: "Commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal, the Taj Mahal stands as the ultimate monument to love. It is a masterpiece of architectural symmetry, featuring intricate pietra dura marble inlays and perfectly manicured charbagh gardens."
    },
    hawa: {
        title: "Hawa Mahal",
        location: "Jaipur, Rajasthan",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        badge: "Heritage",
        time: "September to March",
        description: "Known as the 'Palace of Winds', this five-story exterior is akin to the honeycomb of a beehive. Built from red and pink sandstone in 1799, its 953 small windows (jharokhas) were designed to allow royal ladies to observe everyday street life without being seen."
    },
    kerala: {
        title: "Kerala Backwaters",
        location: "Alleppey, Kerala",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000",
        badge: "Nature",
        time: "September to February",
        description: "A network of interconnected canals, rivers, lakes, and inlets formed by more than 900 km of waterways. Gliding along the calm waters in a traditional wooden houseboat (Kettuvallam) offers an immersive look into rural village life set against lush green palm fringes."
    },
    Munsyari: {
        title: "Munsyari",
        location: "Uttarakhand",
        image: "https://images.unsplash.com/photo-1683700914859-27447d1b9b66?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        badge: "Titans",
        time: "September to March",
        description: "Munsyari is a picturesque town located in the Udham Singh Nagar district of Uttarakhand. Known for its stunning mountain views and serene environment, it offers a perfect retreat for nature lovers and adventure seekers."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navbar Logic ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            // Only remove glassmorphism if we are on the Home view. 
            // The details view needs a solid navbar because there is no dark hero behind it.
            if(document.getElementById('home-view').classList.contains('active')) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // --- 2. Scroll Reveal Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // Initialize animations for all elements with .fade-in-up
    document.querySelectorAll('.fade-in-up').forEach((el, i) => {
        if(el.classList.contains('card')) el.style.transitionDelay = `${(i % 3) * 0.15}s`;
        observer.observe(el);
    });
});

// --- 3. Single Page Application (SPA) Routing ---
function openDetails(placeId) {
    const data = placesData[placeId];
    if(!data) return;

    // Populate the details page with the correct data
    document.getElementById('detail-title').textContent = data.title;
    document.getElementById('detail-location').innerHTML = `<i class="ri-map-pin-2-line"></i> ${data.location}`;
    document.getElementById('detail-img').src = data.image;
    document.getElementById('detail-badge').textContent = data.badge;
    document.getElementById('detail-desc').textContent = data.description;
    document.getElementById('detail-time').textContent = data.time;

    // Hide Home, Show Details
    document.getElementById('home-view').classList.remove('active');
    document.getElementById('details-view').classList.add('active');
    
    // Force navbar to solid state since we lost the dark hero image
    document.getElementById('navbar').classList.add('scrolled');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
    // Hide Details, Show Home
    document.getElementById('details-view').classList.remove('active');
    document.getElementById('home-view').classList.add('active');
    
    // Reset navbar state based on current scroll position
    if (window.scrollY <= 50) {
        document.getElementById('navbar').classList.remove('scrolled');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
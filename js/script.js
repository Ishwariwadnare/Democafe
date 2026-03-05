document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL VARIABLES & UTILS ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('user'));
    const authSection = document.getElementById('nav-auth-section') || document.querySelector('nav div:last-child');
    
    // Elements for Mobile Menu & Scroll Highlighting
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
   

    // --- 2. MOBILE MENU & NAVIGATION ---
    if (menuBtn && mobileMenu) {
        // Toggle mobile menu
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu after clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Active link highlight on scroll
    window.addEventListener('scroll', () => {
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("text-primary", "font-bold");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("text-primary", "font-bold");
            }
        });
    });

// --- 3. DYNAMIC NAVBAR (PROFILE & LOGOUT) ---
if (isLoggedIn === 'true' && userData) {
    const initial = userData.name.charAt(0).toUpperCase();
    const shortName = userData.name.split(' ')[0];

    //  reusable profile template 
    const profileHTML = `
        <div class="relative group flex items-center h-full">
            <button class="profile-trigger flex items-center space-x-3 focus:outline-none py-2">
                <div class="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                    ${initial}
                </div>
                <span class="text-sm font-semibold text-gray-700 ${window.innerWidth < 768 ? '' : 'hidden md:block'}">${shortName}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <div class="absolute right-0 top-[90%] pt-2 w-52 hidden group-hover:block z-[100]">
                <div class="bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 overflow-hidden">
                    <div class="px-4 py-3 border-b border-gray-50 bg-stone-50/50">
                        <p class="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Logged in as</p>
                        <p class="text-xs text-stone-800 font-medium truncate">${userData.email}</p>
                    </div>
                    <a href="dashboard.html" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-secondary transition">
                         My Dashboard
                    </a>
                    <button class="logoutBtn w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-50">
                        Logout Now
                    </button>
                </div>
            </div>
        </div>
    `;

    // 1. Desktop Update
    const desktopAuth = document.getElementById('nav-auth-section');
    if (desktopAuth) {
        desktopAuth.innerHTML = profileHTML;
    }

    // 2. Mobile Update
    const mobileAuth = document.getElementById('mobile-auth-section');
    if (mobileAuth) {
        mobileAuth.innerHTML = profileHTML;
        
    }

    // Logout Click Listener ( for both buttons )
    document.querySelectorAll('.logoutBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'index.html';
            }
        });
    });
}

    // --- 4. REGISTRATION LOGIC ---
    if (window.location.pathname.includes('register.html')) {
        const registerForm = document.querySelector('form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fName = document.getElementById('first_name')?.value;
                const lName = document.getElementById('last_name')?.value;
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;

                if (!fName || !email || !password) {
                    alert("All fields are mandatory!");
                    return;
                }

                const newUser = { 
                    name: `${fName} ${lName}`, 
                    email: email, 
                    password: password 
                };
                
                localStorage.setItem('user', JSON.stringify(newUser));
                alert("Account Created Successfully! Redirecting to Login...");
                window.location.href = 'login.html';
            });
        }
    }

    // --- 5. LOGIN LOGIC ---
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('email')?.value;
                const passInput = document.getElementById('password')?.value;
                const savedUser = JSON.parse(localStorage.getItem('user'));

                if (savedUser && savedUser.email === emailInput && savedUser.password === passInput) {
                    localStorage.setItem('isLoggedIn', 'true');
                    alert(`Welcome back, ${savedUser.name}!`);
                    window.location.href = 'index.html';
                } else {
                    alert("Invalid Email or Password. Please try again!");
                }
            });
        }
    }

    // --- 6. CART SYSTEM ---
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');
    
    if (authSection && !isAuthPage) {
        let cartCount = 0;
        const cartDisplay = document.createElement('span');
        cartDisplay.className = "ml-4 bg-primary text-white px-3 py-1 rounded-full text-[10px] font-bold hidden shadow-sm";
        authSection.prepend(cartDisplay);

        // Delegation or listener for "Add to Cart"
        document.addEventListener('click', (e) => {
            if (e.target && e.target.innerText.toLowerCase().includes("add to cart")) {
                const btn = e.target;
                cartCount++;
                cartDisplay.innerText = `CART: ${cartCount}`;
                cartDisplay.classList.remove('hidden');
                
                const originalText = btn.innerHTML;
                btn.innerText = "Added!";
                btn.classList.add('bg-green-600');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('bg-green-600');
                }, 1000);
            }
        });
    }

    // --- 7. HERO SLIDER ---
    const slider = document.getElementById('hero-slider');
    const dots = document.querySelectorAll('.dot');

    if (slider && dots.length > 0) {
        let currentSlide = 0;
        const totalSlides = dots.length;

        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => {
                dot.style.opacity = index === currentSlide ? "1" : "0.5";
                dot.style.width = index === currentSlide ? "20px" : "8px";
                dot.style.transition = "all 0.3s ease";
            });
        }

        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 4000);

        updateSlider();
    }
});

/* --- GLOBAL MENU FUNCTIONS (Outside DOMContentLoaded so HTML can call them) --- */

const menuData = {
    main_cravings: {
        title: "Main Cravings 🍕",
        items: [
            { name: "Pizza", price: 120, img: "assets/images/pizza.jpg" },
            { name: "White sauce pasta", price: 180, img: "assets/images/white-pasta.jpg" },
            { name: "Veg panner roll", price: 200, img: "assets/images/panner-roll.jpg" },
            { name: "Burger", price: 220, img: "assets/images/burger.jpg" }
        ]
    },
    drinks: {
        title: "Drinks 🍹",
        items: [
            { name: "Cold Coffee", price: 190, img: "assets/images/coldcoffee.jpg" },
            { name: "Lemon Iced Tea", price: 150, img: "assets/images/icedtea.jpg" },
            { name: "Hot Chocolate", price: 210, img: "assets/images/hotchocolate.jpg" },
            { name: "Fresh Lime Soda", price: 120, img: "assets/images/lime.jpg" }
        ]
    },
    snacks: {
        title: "Snacks 🥪",
        items: [
            { name: "Garlic Bread", price: 160, img: "assets/images/garlicbread.jpg" },
            { name: "French Fries", price: 130, img: "assets/images/fries.jpg" },
            { name: "Veg Sandwich", price: 140, img: "assets/images/sandwithch.jpg" },
            { name: "Maggie", price: 170, img: "assets/images/maggie.jpg" }
        ]
    },
    desserts: {
        title: "Desserts 🍰",
        items: [
            { name: "Chocolate Brownie", price: 150, img: "assets/images/chocolate-brownie.jpg" },
            { name: "Cheesecake", price: 220, img: "assets/images/cheesecake.jpg" },
            { name: "Ice Cream", price: 180, img: "assets/images/ice-cream.jpg" },
            { name: "Waffles", price: 200, img: "assets/images/waffle.jpg" }
        ]
    }
};

function showMenu(category) {
    const content = document.getElementById("menuContent");
    if (!menuData[category] || !content) return;

    const { title, items } = menuData[category];

    content.innerHTML = `
        <h3 class="text-3xl font-bold text-center mb-10 text-primary">
            ${title}
        </h3>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            ${items.map(item => `
                <div class="bg-[#fdf6ee] rounded-2xl overflow-hidden shadow-md 
                            hover:shadow-xl hover:-translate-y-2 
                            transition duration-300">
                    <img src="${item.img}" class="w-full h-40 object-cover" alt="${item.name}">
                    <div class="p-5 text-center">
                        <h4 class="text-lg font-semibold mb-2">${item.name}</h4>
                        <p class="text-primary font-bold mb-4">₹${item.price}</p>
                        <button class="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    content.classList.remove("hidden");
    content.scrollIntoView({ behavior: "smooth" });
}
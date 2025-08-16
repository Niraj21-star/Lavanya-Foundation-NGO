// main.js
import { db } from './firebase-init.js';

let websiteSettings = {};
let projects = [];
let events = [];
let products = [];

async function loadWebsiteSettings() {
    try {
        const doc = await db.collection('website').doc('settings').get();
        if (doc.exists) {
            websiteSettings = doc.data();
            updateWebsiteContent();
        }
    } catch (error) {
        console.error('Error loading website settings:', error);
    }
}

function updateWebsiteContent() {
    if (websiteSettings.general && websiteSettings.general.siteTitle) {
        document.getElementById('pageTitle').textContent = websiteSettings.general.siteTitle;
    }
    if (websiteSettings.general && websiteSettings.general.logoText) {
        document.getElementById('logoText').textContent = websiteSettings.general.logoText;
    }
    if (websiteSettings.general && websiteSettings.general.faviconUrl) {
        updateFavicon(websiteSettings.general.faviconUrl);
    }
    if (websiteSettings.home) {
        if (websiteSettings.home.heroTitle) {
            document.getElementById('heroTitle').textContent = websiteSettings.home.heroTitle;
        }
        if (websiteSettings.home.heroSubtitle) {
            document.getElementById('heroSubtitle').textContent = websiteSettings.home.heroSubtitle;
        }
        if (websiteSettings.home.heroImage) {
            document.querySelector('.hero').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${websiteSettings.home.heroImage}')`;
        }
    }
    if (websiteSettings.about) {
        if (websiteSettings.about.missionTitle) {
            document.getElementById('missionTitle').textContent = websiteSettings.about.missionTitle;
        }
        if (websiteSettings.about.missionText) {
            document.getElementById('missionText').textContent = websiteSettings.about.missionText;
        }
        if (websiteSettings.about.visionTitle) {
            document.getElementById('visionTitle').textContent = websiteSettings.about.visionTitle;
        }
        if (websiteSettings.about.visionText) {
            document.getElementById('visionText').textContent = websiteSettings.about.visionText;
        }
        if (websiteSettings.about.aboutImage) {
            document.getElementById('aboutImage').style.backgroundImage = `url('${websiteSettings.about.aboutImage}')`;
        }
    }
    if (websiteSettings.contact) {
        if (websiteSettings.contact.address) {
            document.getElementById('contactAddress').innerHTML = websiteSettings.contact.address.replace(/\n/g, '<br>');
        }
        if (websiteSettings.contact.phone) {
            document.getElementById('contactPhone').textContent = websiteSettings.contact.phone;
        }
        if (websiteSettings.contact.email) {
            document.getElementById('contactEmail').textContent = websiteSettings.contact.email;
        }
        if (websiteSettings.contact.hours) {
            document.getElementById('contactHours').textContent = websiteSettings.contact.hours;
        }
    }
}

function updateFavicon(faviconUrl) {
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/x-icon';
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);
    
    const appleFavicon = document.createElement('link');
    appleFavicon.rel = 'apple-touch-icon';
    appleFavicon.href = faviconUrl;
    document.head.appendChild(appleFavicon);
}

async function loadProjects() {
    try {
        let snapshot;
        try {
            snapshot = await db.collection('projects').orderBy('order').get();
        } catch (orderError) {
            try {
                snapshot = await db.collection('projects').get();
            } catch (permissionError) {
                console.error('Permission denied for projects collection. Please check Firebase security rules.');
                projects = [];
                displayProjects();
                return;
            }
        }
        projects = [];
        snapshot.forEach(doc => {
            projects.push({ id: doc.id, ...doc.data() });
        });
        displayProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        projects = [];
        displayProjects();
    }
}

function displayProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) {
        console.error('projectsContainer element not found!');
        return;
    }
    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="project-card scale-in stagger-1">
                <div class="project-image" style="background-image: url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"></div>
                <div class="project-content">
                    <h3>Four Feeders</h3>
                    <p>Establishing community feeding stations in urban areas to ensure no one sleeps hungry. We provide nutritious meals to the homeless and underprivileged communities daily.</p>
                </div>
            </div>
            <div class="project-card scale-in stagger-2">
                <div class="project-image" style="background-image: url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"></div>
                <div class="project-content">
                    <h3>Food for All</h3>
                    <p>A comprehensive food distribution program that partners with local restaurants and donors to redistribute surplus food to those in need, reducing waste while fighting hunger.</p>
                </div>
            </div>
            <div class="project-card scale-in stagger-3">
                <div class="project-image" style="background-image: url('Flux_Dev_A_compassionate_outdoor_scene_showing_volunteers_dist_3.jpg')"></div>
                <div class="project-content">
                    <h3>Clothes for Those in Need</h3>
                    <p>Collecting, sorting, and distributing clothing to vulnerable populations. We ensure dignity and warmth for those who need it most, especially during harsh weather conditions.</p>
                </div>
            </div>
            <div class="project-card scale-in stagger-4">
                <div class="project-image" style="background-image: url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"></div>
                <div class="project-content">
                    <h3>Earth Unity</h3>
                    <p>Environmental conservation initiatives including tree plantation drives, waste management programs, and community education about sustainable living practices.</p>
                </div>
            </div>
        `;
        return;
    }

    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card scale-in stagger-${(index % 4) + 1} visible`;
        projectCard.style.opacity = '1';
        projectCard.style.transform = 'translateY(0) scale(1)';
        projectCard.innerHTML = `
            <div class="project-image" style="background-image: url('${project.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}')"></div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        `;
        container.appendChild(projectCard);
    });
}

async function loadEvents() {
    try {
        let snapshot;
        try {
            snapshot = await db.collection('events').orderBy('date').get();
        } catch (orderError) {
            try {
                snapshot = await db.collection('events').get();
            } catch (permissionError) {
                console.error('Permission denied for events collection. Please check Firebase security rules.');
                events = [];
                displayEvents();
                return;
            }
        }
        events = [];
        snapshot.forEach(doc => {
            events.push({ id: doc.id, ...doc.data() });
        });
        displayEvents();
    } catch (error) {
        console.error('Error loading events:', error);
        events = [];
        displayEvents();
    }
}

function displayEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) {
        console.error('eventsContainer element not found!');
        return;
    }
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = `
            <div class="event-card scale-in stagger-1">
                <div class="event-image" style="background-image: url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"></div>
                <div class="event-content">
                    <div class="event-date">March 15, 2024</div>
                    <h3>Community Clean-up Drive</h3>
                    <p>Join us for a city-wide cleaning initiative to make our neighborhoods cleaner and greener.</p>
                    <p><i class="fas fa-map-marker-alt" style="color: #e74c3c; margin-right: 0.5rem;"></i><strong>Location:</strong> Community Center, Pune</p>
                </div>
            </div>
            <div class="event-card scale-in stagger-2">
                <div class="event-image" style="background-image: url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"></div>
                <div class="event-content">
                    <div class="event-date">April 22, 2024</div>
                    <h3>Earth Day Celebration</h3>
                    <p>Celebrating our planet with tree plantation, environmental awareness sessions, and eco-friendly workshops.</p>
                    <p><i class="fas fa-map-marker-alt" style="color: #e74c3c; margin-right: 0.5rem;"></i><strong>Location:</strong> Green Park, Pune</p>
                </div>
            </div>
            <div class="event-card scale-in stagger-3">
                <div class="event-image" style="background-image: url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"></div>
                <div class="event-content">
                    <div class="event-date">May 10, 2024</div>
                    <h3>Annual Fundraising Gala</h3>
                    <p>An evening of celebration, recognition, and fundraising to support our ongoing community initiatives.</p>
                    <p><i class="fas fa-map-marker-alt" style="color: #e74c3c; margin-right: 0.5rem;"></i><strong>Location:</strong> Hotel Grand, Pune</p>
                </div>
            </div>
        `;
        return;
    }

    events.forEach((event, index) => {
        const eventCard = document.createElement('div');
        eventCard.className = `event-card scale-in stagger-${(index % 3) + 1} visible`;
        eventCard.style.opacity = '1';
        eventCard.style.transform = 'translateY(0) scale(1)';
        eventCard.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}')"></div>
            <div class="event-content">
                <div class="event-date">${event.date}</div>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                ${event.location ? `<p><i class="fas fa-map-marker-alt" style="color: #e74c3c; margin-right: 0.5rem;"></i><strong>Location:</strong> ${event.location}</p>` : ''}
            </div>
        `;
        container.appendChild(eventCard);
    });
}

async function loadProducts() {
    try {
        let snapshot;
        try {
            snapshot = await db.collection('products').orderBy('order').get();
        } catch (orderError) {
            try {
                snapshot = await db.collection('products').get();
            } catch (permissionError) {
                console.error('Permission denied for products collection. Please check Firebase security rules.');
                products = [];
                displayProducts();
                return;
            }
        }
        products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        products = [];
        displayProducts();
    }
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) {
        console.error('productsContainer element not found!');
        return;
    }
    container.innerHTML = '';

    if (products.length === 0) {
        const defaultProducts = [
            { name: 'Eco-Friendly Jute Bags', description: 'Durable and sustainable jute bags perfect for shopping and daily use. Help reduce plastic waste.', price: 150, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Comfortable Dog Mats', description: 'Soft and washable mats for your furry friends. Made from recycled materials with love.', price: 300, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Bed Corner Mats', description: 'Stylish and functional corner mats that add comfort and elegance to your bedroom.', price: 250, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
            { name: 'Organic Cotton Tote', description: 'Premium organic cotton tote bags with beautiful prints. Perfect for conscious consumers.', price: 200, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
        ];

        defaultProducts.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card fade-in visible';
            productCard.style.opacity = '1';
            productCard.style.transform = 'translateY(0)';
            productCard.innerHTML = `
                <div class="product-image" style="background-image: url('${product.image}')"></div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">₹${product.price}</div>
                    <button class="btn btn-primary order-btn" data-product-name="${product.name}" data-product-price="${product.price}">Order Now</button>
                </div>
            `;
            container.appendChild(productCard);
        });
        attachOrderButtonListeners();
        return;
    }

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card fade-in visible';
        productCard.style.opacity = '1';
        productCard.style.transform = 'translateY(0)';
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}')"></div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                <button class="btn btn-primary order-btn" data-product-name="${product.name}" data-product-price="${product.price}">Order Now</button>
            </div>
        `;
        container.appendChild(productCard);
    });
    attachOrderButtonListeners();
}

function attachOrderButtonListeners() {
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name');
            const productPrice = parseInt(this.getAttribute('data-product-price'));
            console.log('Order button clicked:', productName, productPrice);
            orderProduct(productName, productPrice);
        });
    });
}

async function initializeWebsite() {
    await loadWebsiteSettings();
    await loadProjects();
    await loadEvents();
    await loadProducts();
}

document.getElementById('volunteerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        interest: formData.get('interest'),
        availability: formData.get('availability'),
        message: formData.get('message'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('volunteers').add(data);
        alert('Thank you for your interest in volunteering! We will contact you soon.');
        this.reset();
    } catch (error) {
        console.error('Error submitting volunteer form:', error);
        alert('There was an error submitting your application. Please try again.');
    }
});

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('contact_messages').add(data);
        alert('Thank you for your message! We will get back to you within 24 hours.');
        this.reset();
    } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('There was an error sending your message. Please try again.');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .slide-in-bottom').forEach(el => {
    observer.observe(el);
});

function donate(amount) {
    alert(`Redirecting to payment gateway for ₹${amount} donation. In a real implementation, this would open Razorpay payment modal.`);
}

function donateCustom() {
    const amount = document.getElementById('customAmount').value;
    if (amount && amount > 0) {
        donate(parseInt(amount));
    } else {
        alert('Please enter a valid amount');
    }
}

function orderProduct(productName, price) {
    showOrderModal(productName, price);
}

function showOrderModal(productName, price) {
    const modalHTML = `
        <div id="orderModal" class="order-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center;
            align-items: center; z-index: 1000; animation: fadeIn 0.3s ease;
        ">
            <div class="order-modal-content" style="
                background: white; padding: 2rem; border-radius: 15px;
                max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;
                animation: slideInScale 0.3s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; color: #2c3e50;">Order ${productName}</h3>
                    <button onclick="closeOrderModal()" style="
                        background: none; border: none; font-size: 1.5rem;
                        color: #666; cursor: pointer; padding: 0; width: 30px;
                        height: 30px; display: flex; align-items: center;
                        justify-content: center;
                    ">×</button>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #2c3e50;">${productName}</h4>
                    <p style="margin: 0; font-size: 1.2rem; color: #e74c3c; font-weight: bold;">₹${price}</p>
                </div>
                <form id="orderForm">
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="customerName" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2c3e50;">Full Name *</label>
                        <input type="text" id="customerName" name="customerName" required style="width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease; box-sizing: border-box;" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#ddd'">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="customerEmail" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2c3e50;">Email Address *</label>
                        <input type="email" id="customerEmail" name="customerEmail" required style="width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease; box-sizing: border-box;" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#ddd'">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="customerPhone" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2c3e50;">Phone Number *</label>
                        <input type="tel" id="customerPhone" name="customerPhone" required style="width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease; box-sizing: border-box;" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#ddd'">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="quantity" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2c3e50;">Quantity *</label>
                        <input type="number" id="quantity" name="quantity" min="1" value="1" required style="width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease; box-sizing: border-box;" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#ddd'" onchange="updateOrderTotal(${price})">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="shippingAddress" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2c3e50;">Shipping Address *</label>
                        <textarea id="shippingAddress" name="shippingAddress" rows="3" required style="width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease; box-sizing: border-box; resize: vertical;" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#ddd'" placeholder="Enter your complete shipping address..."></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label for="orderNotes" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #2c3e50;">Additional Notes (Optional)</label>
                        <textarea id="orderNotes" name="orderNotes" rows="2" style="width: 100%; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s ease; box-sizing: border-box; resize: vertical;" onfocus="this.style.borderColor='#e74c3c'" onblur="this.style.borderColor='#ddd'" placeholder="Any special requirements or instructions..."></textarea>
                    </div>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500; color: #2c3e50;">Total Amount:</span>
                            <span id="orderTotal" style="font-size: 1.2rem; font-weight: bold; color: #e74c3c;">₹${price}</span>
                        </div>
                        <small style="color: #666; display: block; margin-top: 0.5rem;">
                            <i class="fas fa-info-circle"></i> Shipping charges will be calculated based on location
                        </small>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" onclick="closeOrderModal()" style="padding: 0.8rem 1.5rem; border: 2px solid #ddd; background: white; color: #666; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.3s ease;" onmouseover="this.style.borderColor='#999'; this.style.color='#333'" onmouseout="this.style.borderColor='#ddd'; this.style.color='#666'">Cancel</button>
                        <button type="submit" style="padding: 0.8rem 1.5rem; border: none; background: #e74c3c; color: white; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: background 0.3s ease;" onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
                            <i class="fas fa-shopping-cart"></i> Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <style>
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            @keyframes slideInScale { from { opacity: 0; transform: translateY(-30px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitOrder(productName, price);
    });
}

function updateOrderTotal(unitPrice) {
    const quantity = document.getElementById('quantity').value;
    const total = unitPrice * quantity;
    document.getElementById('orderTotal').textContent = `₹${total}`;
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => { modal.remove(); }, 300);
    }
}

async function submitOrder(productName, unitPrice) {
    const form = document.getElementById('orderForm');
    const formData = new FormData(form);
    const quantity = parseInt(formData.get('quantity'));
    const totalAmount = unitPrice * quantity;
    
    const orderData = {
        productName: productName,
        unitPrice: unitPrice,
        quantity: quantity,
        totalAmount: totalAmount,
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhone: formData.get('customerPhone'),
        shippingAddress: formData.get('shippingAddress'),
        orderNotes: formData.get('orderNotes') || '',
        orderStatus: 'pending',
        orderDate: firebase.firestore.FieldValue.serverTimestamp(),
        orderNumber: generateOrderNumber()
    };
    try {
        const docRef = await db.collection('product_orders').add(orderData);
        closeOrderModal();
        showOrderConfirmation(orderData.orderNumber, totalAmount);
        console.log('Order placed successfully:', docRef.id);
    } catch (error) {
        console.error('Error placing order:', error);
        alert('There was an error placing your order. Please try again or contact us directly.');
    }
}

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp.slice(-6)}${random}`;
}

function showOrderConfirmation(orderNumber, totalAmount) {
    const confirmationHTML = `
        <div id="orderConfirmation" class="order-modal" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center;
            align-items: center; z-index: 1000; animation: fadeIn 0.3s ease;
        ">
            <div class="order-modal-content" style="
                background: white; padding: 2rem; border-radius: 15px;
                max-width: 500px; width: 90%; text-align: center;
                animation: slideInScale 0.3s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="color: #27ae60; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">Order Placed Successfully!</h3>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <p style="margin: 0 0 0.5rem 0; color: #666;"><strong>Order Number:</strong></p>
                    <p style="margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: bold; color: #2c3e50;">${orderNumber}</p>
                    <p style="margin: 0 0 0.5rem 0; color: #666;"><strong>Total Amount:</strong></p>
                    <p style="margin: 0; font-size: 1.2rem; font-weight: bold; color: #e74c3c;">₹${totalAmount}</p>
                </div>
                <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.5;">
                    Thank you for your order! We will contact you within 24 hours to confirm your order and provide shipping details.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="closeOrderConfirmation()" style="padding: 0.8rem 1.5rem; border: none; background: #e74c3c; color: white; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: background 0.3s ease;" onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
                        Continue Shopping
                    </button>
                    <button onclick="contactWhatsApp('${orderNumber}')" style="padding: 0.8rem 1.5rem; border: 2px solid #25d366; background: white; color: #25d366; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.3s ease;" onmouseover="this.style.background='#25d366'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#25d366'">
                        <i class="fab fa-whatsapp"></i> Contact on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
}

function closeOrderConfirmation() {
    const confirmation = document.getElementById('orderConfirmation');
    if (confirmation) {
        confirmation.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => { confirmation.remove(); }, 300);
    }
}

function contactWhatsApp(orderNumber) {
    const message = `Hi! I just placed an order with order number: ${orderNumber}. I would like to get more details about the shipping and delivery.`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeOrderConfirmation();
}

document.querySelector('.mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
    const icon = this.querySelector('i');
    if (navLinks.classList.contains('mobile-active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuIcon = document.querySelector('.mobile-menu i');
        navLinks.classList.remove('mobile-active');
        mobileMenuIcon.className = 'fas fa-bars';
    });
});

document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
        navLinks.classList.remove('mobile-active');
        document.querySelector('.mobile-menu i').className = 'fas fa-bars';
    }
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite().then(() => {
        setTimeout(() => {
            document.querySelectorAll('.fade-in, .scale-in, .project-card, .event-card, .product-card').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0) translateX(0) scale(1)';
                }, index * 50);
            });
        }, 500);
    }).catch(error => {
        console.error('Error during Firebase initialization:', error);
    });
});

const products = [
{
id: 1,
name: "Wireless Headphones",
category: "Electronics",
price: 1499,
image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
description: "Enjoy high-quality sound with comfortable wireless headphones. Perfect for music, gaming, and everyday use."
},
{
id: 2,
name: "Smart Watch",
category: "Electronics",
price: 2499,
image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
description: "A stylish smartwatch for tracking your daily activity and keeping your day organized."
},
{
id: 3,
name: "Running Shoes",
category: "Fashion",
price: 1999,
image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
description: "Lightweight running shoes designed for comfort during walking, exercise, and daily activities."
},
{
id: 4,
name: "Laptop Backpack",
category: "Accessories",
price: 899,
image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
description: "A practical backpack for carrying your laptop, books, accessories, and everyday essentials."
},
{
id: 5,
name: "Mechanical Keyboard",
category: "Electronics",
price: 2199,
image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
description: "A responsive keyboard suitable for programming, office work, and gaming."
},
{
id: 6,
name: "Bluetooth Speaker",
category: "Electronics",
price: 1299,
image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
description: "Enjoy your favourite music with a compact speaker suitable for indoor and outdoor listening."
},
{
id: 7,
name: "Classic Sunglasses",
category: "Fashion",
price: 699,
image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
description: "Classic sunglasses that complement your everyday style."
},
{
id: 8,
name: "Travel Watch",
category: "Accessories",
price: 1799,
image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
description: "A versatile watch with a timeless design for everyday wear and travel."
}
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const categoryFilter = document.getElementById("category-filter");
const noProducts = document.getElementById("no-products");
const cartCount = document.getElementById("cart-count");

const modal = document.getElementById("product-modal");
const closeModalButton = document.getElementById("close-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const modalAddToCart = document.getElementById("modal-add-to-cart");

let selectedProductId = null;

function getCart() {
try {
const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!Array.isArray(savedCart)) {
        return [];
    }

    return savedCart.filter(item =>
        Number.isInteger(item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        products.some(product => product.id === item.id)
    );
} catch {
    return [];
}


}

function saveCart(cart) {
localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();
}

function updateCartCount() {
const cart = getCart();


const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
);

cartCount.textContent = totalItems;


}

function formatPrice(price) {
return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 2
}).format(price);
}

function renderProducts(productList) {
productGrid.replaceChildren();


noProducts.hidden = productList.length !== 0;

productList.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.alt = `${product.name} image unavailable`;
    });

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const detailsButton = document.createElement("button");
    detailsButton.className = "details-btn";
    detailsButton.type = "button";
    detailsButton.textContent = "View Details";
    detailsButton.addEventListener("click", () => {
        openProductDetails(product.id);
    });

    const addButton = document.createElement("button");
    addButton.className = "add-cart-btn";
    addButton.type = "button";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => {
        addToCart(product.id);
    });

    actions.append(detailsButton, addButton);
    card.append(image, name, category, price, actions);
    productGrid.appendChild(card);
});


}

function filterProducts() {
const searchTerm = searchInput.value.trim().toLowerCase();
const selectedCategory = categoryFilter.value;


const filteredProducts = products.filter(product => {
    const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

    return matchesSearch && matchesCategory;
});

renderProducts(filteredProducts);


}

function openProductDetails(productId) {
const product = products.find(item => item.id === productId);


if (!product) return;

selectedProductId = product.id;

modalImage.src = product.image;
modalImage.alt = product.name;
modalTitle.textContent = product.name;
modalCategory.textContent = `Category: ${product.category}`;
modalDescription.textContent = product.description;
modalPrice.textContent = formatPrice(product.price);

modal.classList.add("active");
modal.setAttribute("aria-hidden", "false");
document.body.style.overflow = "hidden";

closeModalButton.focus();


}

function closeProductDetails() {
modal.classList.remove("active");
modal.setAttribute("aria-hidden", "true");
document.body.style.overflow = "";
selectedProductId = null;
}

function addToCart(productId) {
const product = products.find(item => item.id === productId);


if (!product) return;

const cart = getCart();
const existingItem = cart.find(item => item.id === productId);

if (existingItem) {
    existingItem.quantity++;
} else {
    cart.push({
        id: product.id,
        quantity: 1
    });
}

saveCart(cart);

alert(`${product.name} added to cart!`);


}

searchButton.addEventListener("click", filterProducts);

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

closeModalButton.addEventListener("click", closeProductDetails);

modalAddToCart.addEventListener("click", () => {
if (selectedProductId !== null) {
addToCart(selectedProductId);
closeProductDetails();
}
});

modal.addEventListener("click", event => {
if (event.target === modal) {
closeProductDetails();
}
});

document.addEventListener("keydown", event => {
if (event.key === "Escape" && modal.classList.contains("active")) {
closeProductDetails();
}
});

renderProducts(products);
updateCartCount();

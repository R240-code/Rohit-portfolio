const cartItemsContainer = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");
const emptyCartMessage = document.getElementById("empty-cart");

const totalItemsElement = document.getElementById("total-items");
const totalPriceElement = document.getElementById("total-price");
const clearCartButton = document.getElementById("clear-cart");

const products = [
{
id: 1,
name: "Wireless Headphones",
category: "Electronics",
price: 1499,
image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
},
{
id: 2,
name: "Smart Watch",
category: "Electronics",
price: 2499,
image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
},
{
id: 3,
name: "Running Shoes",
category: "Fashion",
price: 1999,
image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
},
{
id: 4,
name: "Laptop Backpack",
category: "Accessories",
price: 899,
image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
},
{
id: 5,
name: "Mechanical Keyboard",
category: "Electronics",
price: 2199,
image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
},
{
id: 6,
name: "Bluetooth Speaker",
category: "Electronics",
price: 1299,
image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"
},
{
id: 7,
name: "Classic Sunglasses",
category: "Fashion",
price: 699,
image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
},
{
id: 8,
name: "Travel Watch",
category: "Accessories",
price: 1799,
image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500"
}
];

function formatPrice(price) {
return new Intl.NumberFormat("en-IN", {
style: "currency",
currency: "INR",
maximumFractionDigits: 2
}).format(price);
}

function getCart() {
try {
const cart = JSON.parse(localStorage.getItem("cart") || "[]");


    if (!Array.isArray(cart)) {
        return [];
    }

    return cart.filter(item =>
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
}

function renderCart() {
const cart = getCart();


cartItemsContainer.replaceChildren();

if (cart.length === 0) {
    emptyCartMessage.hidden = false;
    cartSummary.hidden = true;
    totalItemsElement.textContent = "0";
    totalPriceElement.textContent = formatPrice(0);
    return;
}

emptyCartMessage.hidden = true;
cartSummary.hidden = false;

let totalItems = 0;
let totalPrice = 0;

cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return;

    const subtotal = product.price * item.quantity;

    totalItems += item.quantity;
    totalPrice += subtotal;

    const card = document.createElement("article");
    card.className = "cart-item";

    const image = document.createElement("img");
    image.className = "cart-item-image";
    image.src = product.image;
    image.alt = product.name;

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = `Price: ${formatPrice(product.price)}`;

    const subtotalText = document.createElement("p");
    subtotalText.textContent = `Subtotal: ${formatPrice(subtotal)}`;

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.setAttribute("aria-label", `Decrease ${product.name} quantity`);

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${product.name} quantity`);

    decreaseButton.addEventListener("click", () => {
        changeQuantity(product.id, -1);
    });

    increaseButton.addEventListener("click", () => {
        changeQuantity(product.id, 1);
    });

    quantityControls.append(
        decreaseButton,
        quantity,
        increaseButton
    );

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.type = "button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
        removeProduct(product.id);
    });

    info.append(
        name,
        price,
        quantityControls,
        subtotalText,
        removeButton
    );

    card.append(image, info);
    cartItemsContainer.appendChild(card);
});

totalItemsElement.textContent = totalItems;
totalPriceElement.textContent = formatPrice(totalPrice);


}

function changeQuantity(productId, amount) {
const cart = getCart();
const item = cart.find(product => product.id === productId);


if (!item) return;

item.quantity += amount;

const updatedCart = cart.filter(product => product.quantity > 0);

saveCart(updatedCart);
renderCart();


}

function removeProduct(productId) {
const updatedCart = getCart().filter(item => item.id !== productId);


saveCart(updatedCart);
renderCart();


}

clearCartButton.addEventListener("click", () => {
localStorage.removeItem("cart");
renderCart();
});

renderCart();

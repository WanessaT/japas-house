const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")


let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity += 1;
        return;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <pclass="font-medium bt-2">R$${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

function visibleInputAddress(inputText) {
    const formAddress = document.getElementById('form-address')

    if (inputText === "retirada") {
        formAddress.classList.add("hidden")
    } else {
        formAddress.classList.remove("hidden")
    }

}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue === "") {
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
})

checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#Ef4444",
            },
        }).showToast();

        return;
    }

    if (cart.length === 0) {
        Toastify({
            text: "O pedido deve conter no mínimo um item!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#Ef4444",
            },
        }).showToast();
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    const cartItems = cart.map((item) => {
        return (
            `- ${item.name} 
                Qtd: (${item.quantity})
                Valor: ${item.price.toFixed(2)}
                `
        )
    })

    cartItems.push(`Total da compra: R$ ${total}`);


    const deliveryForm = document.getElementById("entrega")

    let deliveryText = "";
    if (deliveryForm.checked) {
        deliveryText = `Endereço de entrega: ${addressInput.value}`
    } else {
        deliveryText = "Retirada no local.";
    }

    const message = cartItems.join('%0A');
    const formattedMessage = `Novo pedido:%0A%0A${message}%0A%0A${deliveryText}`;
    const phone = "40028922"

    window.open(`https://wa.me/${phone}?text=${formattedMessage}`, "_blank");
    cartModal.style.display = "none"

    cart = [];
    updateCartModal();

})

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");

}


document.addEventListener("DOMContentLoaded", function() {
    var addToCartButtons = document.querySelectorAll(".add-to-cart");
    var cartItemsList = document.getElementById("cart-items");
    var totalPriceDisplay = document.getElementById("total-price");
    var discountSelect = document.getElementById("discount-select");

    function removeFromCart(event) {
        var cartItem = event.target.closest("li");
        var productName = cartItem.dataset.productName;
        var container = document.querySelector(".container[data-product-name='" + productName + "']");
        var productStockElement = container.querySelector(".stock");
        var productStock = parseInt(productStockElement.textContent.split(": ")[1]);
        var quantity = parseInt(cartItem.querySelector(".quantity").textContent);

        // Increase the stock count displayed on screen
        productStockElement.textContent = "In Stock: " + (productStock + quantity);

        // Remove the cart item
        cartItem.remove();

        // Update total price after removing item
        updateTotalPrice();
    }

    function updateTotalPrice() {
        var total = 0;
        var cartItems = cartItemsList.querySelectorAll("li");
        var discountRate = 0;
        var selectedDiscount = discountSelect.value;
        
        switch (selectedDiscount) {
            case "senior":
                discountRate = 0.2; // 20% for senior
                break;
            case "pwd":
                discountRate = 0.3; // 30% for PWD
                break;
            case "student":
                discountRate = 0.1; // 10% for student
                break;
            default:
                discountRate = 0; // No discount
                break;
        }
        
        cartItems.forEach(function(cartItem) {
            var price = parseFloat(cartItem.dataset.productPrice);
            var quantity = parseInt(cartItem.querySelector(".quantity").textContent);
            total += price * quantity;
        });

        // Apply discount
        total *= (1 - discountRate);

        totalPriceDisplay.textContent = "Total: $" + total.toFixed(2);
    }

    addToCartButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var container = button.parentElement;
            var productName = container.dataset.productName;
            var productPrice = parseFloat(container.dataset.productPrice);
            var productStockElement = container.querySelector(".stock");
            var productStock = parseInt(productStockElement.textContent.split(": ")[1]);
            var productQuantity = parseInt(container.querySelector(".quantity input").value);

            var existingCartItem = cartItemsList.querySelector("li[data-product-name='" + productName + "']");
            if (existingCartItem) {
                var existingQuantity = parseInt(existingCartItem.querySelector(".quantity").textContent);
                var totalQuantity = existingQuantity + productQuantity;
                if (totalQuantity <= productStock + existingQuantity) {
                    existingCartItem.querySelector(".quantity").textContent = totalQuantity;
                    productStockElement.textContent = "In Stock: " + (productStock - totalQuantity + existingQuantity);
                } else {
                    alert("Cannot add more than available stock!");
                }
            } else {
                if (productQuantity <= productStock) {
                    var cartItem = document.createElement("li");
                    cartItem.dataset.productName = productName;
                    cartItem.dataset.productPrice = productPrice; // Store product price in dataset
                    cartItem.innerHTML = productName + " - $" + productPrice.toFixed(2) + " x <span class='quantity'>" + productQuantity + "</span>";
                    var cancelButton = document.createElement("button");
                    cancelButton.textContent = "Cancel";
                    cancelButton.addEventListener("click", removeFromCart);
                    cartItem.appendChild(cancelButton);
                    cartItemsList.appendChild(cartItem);
                    productStockElement.textContent = "In Stock: " + (productStock - productQuantity);
                } else {
                    alert("Cannot add more than available stock!");
                }
            }

            // Update total price after adding item
            updateTotalPrice();
        });
    });

    discountSelect.addEventListener("change", function() {
        // Update total price when discount selection changes
        updateTotalPrice();
    });
});
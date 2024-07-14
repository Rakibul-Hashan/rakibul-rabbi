document.addEventListener("DOMContentLoaded", function () {
    function openPopup(productId, productTitle, productPrice, productDescription, productImage, productVariants) {
      const popup = document.getElementById("custom-product-popup");
      const overlay = document.getElementById("popup-overlay");
  
      if (popup && overlay) {
        // Update popup content
        const titleElement = popup.querySelector(".rr-popup-product-title");
        const priceElement = popup.querySelector(".rr-product-price");
        const descriptionElement = popup.querySelector(".rr-popup-product-description");
        const imageElement = popup.querySelector(".rr-popup-product-image img");
        const variantListElement = popup.querySelector(".rr-variant-list");
        const sizeSelectElement = popup.querySelector("#product-size");
  
        if (titleElement) titleElement.innerText = productTitle;
        if (priceElement) priceElement.innerText = productPrice;
        if (descriptionElement) descriptionElement.innerText = productDescription;
        if (imageElement) imageElement.src = productImage;
  
        variantListElement.innerHTML = '';
        sizeSelectElement.innerHTML = '';
  
        const uniqueColors = [];
        productVariants.forEach(variant => {
          if (!uniqueColors.includes(variant.option2)) {
            const variantDiv = document.createElement("div");
            variantDiv.className = "rr-variant-item";
            variantDiv.innerText = variant.option2;
            variantListElement.appendChild(variantDiv);
            uniqueColors.push(variant.option2);
          }
        });
  
        const uniqueSizes = [];
        productVariants.forEach(variant => {
          if (!uniqueSizes.includes(variant.option1)) {
            const sizeOption = document.createElement("option");
            sizeOption.value = variant.id;
            sizeOption.innerText = variant.option1;
            sizeSelectElement.appendChild(sizeOption);
            uniqueSizes.push(variant.option1);
          }
        });
  
        // Show popup and overlay
        popup.style.display = "block";
        overlay.style.display = "block";
      } else {
        console.error("Popup or overlay not found.");
      }
    }
  
    function closePopup() {
      const popup = document.getElementById("custom-product-popup");
      const overlay = document.getElementById("popup-overlay");
      if (popup && overlay) {
        popup.style.display = "none";
        overlay.style.display = "none";
      } else {
        console.error("Popup or overlay not found.");
      }
    }
  
    const popupButtons = document.querySelectorAll(".rr-product-popup-btn");
    popupButtons.forEach(button => {
      button.addEventListener("click", function () {
        const productId = button.getAttribute("data-product-id");
        const productTitle = button.getAttribute("data-product-title");
        const productPrice = button.getAttribute("data-product-price");
        const productDescription = button.getAttribute("data-product-description");
        const productImage = button.getAttribute("data-product-image");
        const productVariants = JSON.parse(button.getAttribute("data-product-variants"));
  
        openPopup(productId, productTitle, productPrice, productDescription, productImage, productVariants);
      });
    });
  
    const closeButton = document.querySelector(".rr-popup-close-btn");
    if (closeButton) {
      closeButton.addEventListener("click", closePopup);
    }
  
    const addToCartButton = document.querySelector(".rr-active-cut-btn");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", function () {
        const selectedVariantId = document.getElementById("product-size").value;
  
        if (selectedVariantId) {
          fetch("/cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: selectedVariantId,
              quantity: 1,
            }),
          })
            .then(response => response.json())
            .then(data => {
              console.log("Product added to cart:", data);
              closePopup();
              alert("Product added to cart successfully!");
            })
            .catch(error => {
              console.error("Error adding product to cart:", error);
            });
        } else {
          alert("Please select a size.");
        }
      });
    }
  });
  
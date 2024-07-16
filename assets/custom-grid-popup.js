document.addEventListener("DOMContentLoaded", function () {
  let selectedVariantId = null;

  function openPopup(
    productId,
    productTitle,
    productPrice,
    productDescription,
    productImage,
    productVariants
  ) {
    const popup = document.getElementById("custom-product-popup");
    const overlay = document.getElementById("popup-overlay");

    if (popup && overlay) {
      // Update popup content
      const titleElement = popup.querySelector(".rr-popup-product-title");
      const priceElement = popup.querySelector(".rr-product-price");
      const descriptionElement = popup.querySelector(
        ".rr-popup-product-description"
      );
      const imageElement = popup.querySelector(".rr-popup-product-image img");
      const variantListElement = popup.querySelector(".rr-variant-list");
      const sizeSelectElement = popup.querySelector("#product-size");

      if (titleElement) titleElement.innerText = productTitle;
      if (priceElement) priceElement.innerText = productPrice;
      if (descriptionElement) descriptionElement.innerHTML = productDescription; // Use innerHTML instead of innerText
      if (imageElement) imageElement.src = productImage;

      variantListElement.innerHTML = "";
      sizeSelectElement.innerHTML =
        '<option value="">Choose your size</option>'; // Add default option

      const uniqueColors = new Set();
      const uniqueSizes = new Set();

      // Function to get color value or a default color
      const getColorValue = (variant) => {
        if (variant.option2) {
          return variant.option2;
        }

        // =============================
        const variantButton = document.querySelector(".rr-product-popup-btn");
        const jsonData = variantButton.getAttribute("data-product-variants");
        // Parse the JSON data
        const variants = JSON.parse(jsonData);
        // Create the colorMap object
        const colorMap = {};
        // Extract unique colors
        variants.forEach((variant) => {
          const color = variant.option2;
          if (color) {
            colorMap[color] = color;
          }
        });
        console.log(colorMap);
        return colorMap || "#000"; // Use default black if color is not in the map
      };

      productVariants.forEach((variant) => {
        const variantColor = getColorValue(variant);
        console.log("==>", variantColor);
        if (!uniqueColors.has(variant.option2)) {
          const variantDiv = document.createElement("div");
          variantDiv.className = "rr-variant-item";
          variantDiv.innerText = variant.option2;
          variantDiv.dataset.variantId = variant.id;
          variantDiv.dataset.option1 = variant.option1;
          variantDiv.dataset.color = variantColor;
          variantDiv.style.borderLeft = `5px solid ${variantColor}`; // Apply border color
          variantDiv.style.setProperty("--variant-color", variantColor); // Store variant color for animation

          variantListElement.appendChild(variantDiv);
          uniqueColors.add(variant.option2);
        }

        if (!uniqueSizes.has(variant.option1)) {
          const sizeOption = document.createElement("option");
          sizeOption.value = variant.id;
          sizeOption.innerText = variant.option1;
          sizeSelectElement.appendChild(sizeOption);
          uniqueSizes.add(variant.option1);
        }
      });

      // Event listener for color selection
      variantListElement
        .querySelectorAll(".rr-variant-item")
        .forEach((item) => {
          item.addEventListener("click", function () {
            variantListElement
              .querySelectorAll(".rr-variant-item")
              .forEach((el) => el.classList.remove("selected"));
            this.classList.add("selected");
            this.style.setProperty("--selected-bg-color", this.dataset.color); // Apply selected background color
            selectedVariantId = this.dataset.variantId;

            // Update size dropdown based on selected color
            const selectedColor = this.innerText;
            sizeSelectElement.innerHTML =
              '<option value="">Select Size</option>  <div class="select-arrow"></div>'; // Reset dropdown
            productVariants.forEach((variant) => {
              if (variant.option2 === selectedColor) {
                const sizeOption = document.createElement("option");
                sizeOption.value = variant.id;
                sizeOption.innerText = variant.option1;
                sizeSelectElement.appendChild(sizeOption);
              }
            });
          
          });
        });

      // Event listener for size selection
      sizeSelectElement.addEventListener("change", function () {
        selectedVariantId = this.value;
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
  popupButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = button.getAttribute("data-product-id");
      const productTitle = button.getAttribute("data-product-title");
      const productPrice = button.getAttribute("data-product-price");
      const productDescription = button.getAttribute(
        "data-product-description"
      );
      const productImage = button.getAttribute("data-product-image");
      const productVariants = JSON.parse(
        button.getAttribute("data-product-variants")
      );

      openPopup(
        productId,
        productTitle,
        productPrice,
        productDescription,
        productImage,
        productVariants
      );
    });
  });

  const closeButton = document.querySelector(".rr-popup-close-btn");
  if (closeButton) {
    closeButton.addEventListener("click", closePopup);
  }

  const addToCartButton = document.querySelector(".rr-active-cut-btn");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", function () {
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
          .then((response) => response.json())
          .then((data) => {
            console.log("Product added to cart:", data);
            closePopup();
            alert("Product added to cart successfully!");
          })
          .catch((error) => {
            console.error("Error adding product to cart:", error);
          });
      } else {
        alert("Please select a size.");
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const convertPriceToInt = (priceString) => {
        const cleanedPrice = priceString.replace(/[^\d.-]/g, '');
        const floatPrice = parseFloat(cleanedPrice);
        const intPrice = Math.round(floatPrice * 100);
        return intPrice;
    };

    const convertPriceToFloat = (intPrice) => {
        return intPrice / 100;
    };

    const addToCart = (button) => {
        const itemSlot = button.closest('.slot');
        if (itemSlot) {
            const itemName = itemSlot.querySelector('p').textContent;
            const itemImage = itemSlot.querySelector('img').src;
            const itemPriceString = itemSlot.querySelector('p:nth-of-type(2)').textContent.trim();
            const itemPrice = convertPriceToInt(itemPriceString);

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ name: itemName, image: itemImage, price: itemPrice });
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${itemName} added to cart`);
            displayCartItems();
        }
    };

    const displayCartItems = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cartItems.forEach((item, index) => {
                const li = document.createElement('li');
                li.setAttribute('data-index', index);
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <span class="cart-item-text">${item.name} - Rs ${convertPriceToFloat(item.price).toFixed(2)}</span>
                    <button class="remove-item-btn">Remove</button>`;
                cartItemsContainer.appendChild(li);

                const removeButton = li.querySelector('.remove-item-btn');
                removeButton.addEventListener('click', () => {
                    removeItemFromCart(index);
                });
            });
        }
    };

    const removeItemFromCart = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    };

    const calculateCartTotal = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        return total;
    };

    const updateCheckoutButton = () => {
        const total = calculateCartTotal();
        const checkoutButton = document.getElementById('checkout');
        if (checkoutButton) {
            if (total > 0) {
                checkoutButton.style.display = 'inline-block';
            } else {
                checkoutButton.style.display = 'none';
            }
        }
    };

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => addToCart(button));
    });

    displayCartItems();

    const clearCartButton = document.getElementById('clearCart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            localStorage.removeItem('cart');
            displayCartItems();
        });
    }

    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const total = calculateCartTotal();

            if (total > 0) {
                alert(`Total amount: Rs ${(total / 100).toFixed(2)}`);
                console.log('Checkout total:', total);

                sessionStorage.setItem('cart', localStorage.getItem('cart'));

                window.location.href = '/checkout';
            } else {
                alert('No items in cart.');
            }
        });
    }

    const checkoutPage = window.location.pathname === '/checkout';
    if (checkoutPage) {
        const checkoutCartItems = JSON.parse(sessionStorage.getItem('cart')) || [];
        const checkoutCartItemsContainer = document.querySelector('.cart-items');
        const totalAmountContainer = document.querySelector('.total-amount');
        checkoutCartItemsContainer.innerHTML = '';

        if (checkoutCartItems.length > 0) {
            let totalAmount = 0;
            checkoutCartItems.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="cart-item-text">${item.name} - Rs ${convertPriceToFloat(item.price).toFixed(2)}</span>`;
                checkoutCartItemsContainer.appendChild(li);
                totalAmount += item.price;
            });
            totalAmountContainer.textContent = `Total amount: Rs ${((totalAmount / 100) + 200).toFixed(2)}`;
        } else {
            checkoutCartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            totalAmountContainer.textContent = '';
        }


        // Populate the hidden input field with the cart data
        const cartItemsInput = document.getElementById('cartItemsInput');
        if (cartItemsInput) {
            cartItemsInput.value = JSON.stringify(checkoutCartItems.map(item => ({ ...item, price: convertPriceToFloat(item.price).toFixed(2) })));
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var faqLinks = document.querySelectorAll('#faqs ul li a');

    faqLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            var answer = this.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to load reviews from localStorage
    function loadReviews() {
        const savedReviews = localStorage.getItem('reviews');
        return savedReviews ? JSON.parse(savedReviews) : [];
    }

    // Function to save reviews to localStorage
    function saveReviews(reviews) {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    // Function to render reviews
    function renderReviews(reviews) {
        const reviewsContainer = document.querySelector('.reviews-container');
        reviewsContainer.innerHTML = ''; // Clear existing reviews
        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.classList.add('review');
            reviewElement.innerHTML = `
                <p class="customer-name">${review.customerName}: ${review.text}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }

    // Load and render reviews on page load
    const reviews = loadReviews();
    renderReviews(reviews);

    // Function to handle form submission for adding reviews
    document.getElementById('add-review-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(this);
        const customerName = formData.get('customerName');
        const reviewText = formData.get('reviewText');

        // Clear form inputs
        this.reset();

        // Add the new review to the reviews array
        const newReview = { customerName: customerName, text: reviewText };
        reviews.push(newReview);
        saveReviews(reviews); // Save updated reviews to localStorage

        // Render updated reviews
        renderReviews(reviews);
    });

    // Function to simulate adding a review (replace with actual backend logic)
    function addReview(review) {
        // Optionally, you can send the review to your backend for storage
        // Replace with actual endpoint URL for adding review
        const endpoint = '/add-review';

        // Example of fetching data (simulated)
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(function (updatedReviews) {
                // Optionally, update reviews from the server if needed
                // renderReviews(updatedReviews);
            })
            .catch(function (error) {
                console.error('Error adding review:', error);
            });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const leftBtn = carousel.querySelector('.left-btn');
    const rightBtn = carousel.querySelector('.right-btn');

    let currentPosition = 0;
    const maxPosition = carouselInner.children.length - 1;
    const cardWidth = carouselInner.querySelector('.card').offsetWidth; // Get the width of each card dynamically

    // Function to automatically switch images every 3 seconds
    setInterval(() => {
        currentPosition = (currentPosition + 1) % (maxPosition + 1);
        updateCarousel();
    }, 3000);

    leftBtn.addEventListener('click', () => {
        currentPosition = (currentPosition - 1 + maxPosition + 1) % (maxPosition + 1);
        updateCarousel();
    });

    rightBtn.addEventListener('click', () => {
        currentPosition = (currentPosition + 1) % (maxPosition + 1);
        updateCarousel();
    });

    function updateCarousel() {
        const offset = -currentPosition * cardWidth;
        const maxOffset = -maxPosition * cardWidth + carousel.offsetWidth - cardWidth;

        // Ensure the carousel doesn't scroll beyond the last item
        carouselInner.style.transform = `translateX(${Math.max(maxOffset, Math.min(0, offset))}px)`;
    }
});






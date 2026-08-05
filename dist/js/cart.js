// FrontEnd Store - Carrito de Compras Visual

document.addEventListener('DOMContentLoaded', () => {
    // Obtener productos guardados en localStorage o iniciar con carrito vacío []
    let cartState = [];
    try {
        const storedCart = localStorage.getItem('cartState');
        if (storedCart) {
            cartState = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error('Error al cargar el carrito desde localStorage:', e);
        cartState = [];
    }

    // Elementos del DOM
    const cartToggleBtns = document.querySelectorAll('.js-cart-toggle');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountSummary = document.getElementById('cartCountSummary');

    // Función para guardar el estado en localStorage
    function saveCartState() {
        try {
            localStorage.setItem('cartState', JSON.stringify(cartState));
        } catch (e) {
            console.error('Error al guardar el carrito en localStorage:', e);
        }
    }

    // Función para guardar / actualizar la vista del carrito
    function renderCart() {
        if (!cartItemsContainer && !cartBadge) return;

        const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Actualizar insignias de conteo
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        if (cartCountSummary) {
            cartCountSummary.textContent = `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`;
        }
        if (cartTotalEl) {
            cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
        }

        if (!cartItemsContainer) return;

        // Renderizar items
        if (cartState.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>Tu carrito está vacío</p>
                    <small>Explora la tienda y agrega tus prendas favoritas para visualizarlas aquí.</small>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = cartState.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image}" alt="${item.name}" class="cart-item__img">
                <div class="cart-item__details">
                    <div class="cart-item__header">
                        <h4 class="cart-item__title">${item.name}</h4>
                        <button class="cart-item__remove js-remove-item" data-index="${index}" aria-label="Eliminar producto">&times;</button>
                    </div>
                    <p class="cart-item__meta">Talla: <span>${item.size}</span></p>
                    <div class="cart-item__footer">
                        <span class="cart-item__price">$${item.price}</span>
                        <div class="cart-item__qty-controls">
                            <button class="cart-qty-btn js-qty-minus" data-index="${index}">-</button>
                            <span class="cart-qty-num">${item.quantity}</span>
                            <button class="cart-qty-btn js-qty-plus" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Listeners para botones de eliminación y cantidad dentro del carrito
        cartItemsContainer.querySelectorAll('.js-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cartState.splice(idx, 1);
                saveCartState();
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll('.js-qty-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                if (cartState[idx].quantity > 1) {
                    cartState[idx].quantity -= 1;
                } else {
                    cartState.splice(idx, 1);
                }
                saveCartState();
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll('.js-qty-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cartState[idx].quantity += 1;
                saveCartState();
                renderCart();
            });
        });
    }

    // Funciones para abrir y cerrar el Drawer
    function openCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.add('cart-drawer--open');
            cartOverlay.classList.add('cart-overlay--open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.remove('cart-drawer--open');
            cartOverlay.classList.remove('cart-overlay--open');
            document.body.style.overflow = '';
        }
    }

    // Event listeners de apertura/cierre
    cartToggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    });

    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    // Listener para tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartDrawer?.classList.contains('cart-drawer--open')) {
            closeCart();
        }
    });

    // Escuchar botón de agregar producto desde formulario en producto.html
    const productForm = document.querySelector('.formulario') || document.querySelector('form');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sizeSelect = productForm.querySelector('select');
            const qtyInput = productForm.querySelector('input[type="number"]');
            const productNameEl = document.querySelector('.section-heading h1') || document.querySelector('h1');
            const productImgEl = document.querySelector('.camisa__imagen') || document.querySelector('main img');

            const size = sizeSelect ? sizeSelect.value : 'Mediana';
            const qty = qtyInput && qtyInput.value ? parseInt(qtyInput.value) : 1;
            const name = productNameEl ? productNameEl.textContent.trim() : 'Camiseta Dev';
            const image = productImgEl ? productImgEl.getAttribute('src') : '/img/3.jpg';

            const existingIndex = cartState.findIndex(item => item.name === name && item.size === size);
            if (existingIndex > -1) {
                cartState[existingIndex].quantity += qty;
            } else {
                cartState.push({
                    id: String(Date.now()),
                    name: name,
                    price: 25,
                    size: (size.includes('--') || size.includes('Seleccionar')) ? 'Mediana' : size,
                    quantity: qty,
                    image: image
                });
            }

            saveCartState();
            renderCart();
            openCart();
        });
    }

    // Escuchar clicks globales en botones "Agregar al Carrito" rápido
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.js-add-to-cart');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();
            const name = addBtn.dataset.name || 'Camiseta Frontend';
            const price = parseFloat(addBtn.dataset.price || '25');
            const image = addBtn.dataset.image || '/img/1.jpg';

            const existingIndex = cartState.findIndex(item => item.name === name);
            if (existingIndex > -1) {
                cartState[existingIndex].quantity += 1;
            } else {
                cartState.push({
                    id: String(Date.now()),
                    name: name,
                    price: price,
                    size: 'Mediana',
                    quantity: 1,
                    image: image
                });
            }

            saveCartState();
            renderCart();
            openCart();
        }
    });

    // Cargar y mostrar la información del producto adecuado desde URL query params
    function initProductPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get('id');
        const nombreParam = urlParams.get('nombre') || urlParams.get('name');
        const imagenParam = urlParams.get('imagen') || urlParams.get('image');

        const productsData = {
            '1': { name: 'VueJS', image: '/img/1.jpg', price: 25 },
            '2': { name: 'AngularJS', image: '/img/2.jpg', price: 25 },
            '3': { name: 'ReactJS', image: '/img/3.jpg', price: 25 },
            '4': { name: 'Redux', image: '/img/4.jpg', price: 25 },
            '5': { name: 'Node.js', image: '/img/5.jpg', price: 25 },
            '6': { name: 'SASS', image: '/img/6.jpg', price: 25 },
            '7': { name: 'HTML5', image: '/img/7.jpg', price: 25 },
            '8': { name: 'Github', image: '/img/8.jpg', price: 25 },
            '9': { name: 'BulmaCSS', image: '/img/9.jpg', price: 25 },
            '10': { name: 'TypeScript', image: '/img/10.jpg', price: 25 },
            '11': { name: 'Drupal', image: '/img/11.jpg', price: 25 },
            '12': { name: 'JavaScript', image: '/img/12.jpg', price: 25 },
            '13': { name: 'GraphQL', image: '/img/13.jpg', price: 25 },
            '14': { name: 'WordPress', image: '/img/14.jpg', price: 25 }
        };

        let activeProduct = null;
        if (idParam && productsData[idParam]) {
            activeProduct = productsData[idParam];
        } else if (nombreParam && imagenParam) {
            activeProduct = {
                name: nombreParam,
                image: imagenParam,
                price: 25
            };
        }

        if (activeProduct) {
            const headingEl = document.querySelector('.section-heading h1') || document.querySelector('h1');
            const imageEl = document.querySelector('.camisa__imagen') || document.querySelector('main img');
            
            if (headingEl) {
                headingEl.textContent = activeProduct.name;
            }
            if (imageEl) {
                let imgPath = activeProduct.image;
                if (!imgPath.startsWith('/') && window.location.pathname.includes('/producto')) {
                    imgPath = '/' + imgPath;
                }
                imageEl.src = imgPath;
                imageEl.alt = `Camiseta ${activeProduct.name}`;
            }
            document.title = `FrontEnd Store - ${activeProduct.name}`;
        }
    }

    initProductPage();

    // Renderizar estado inicial al cargar la página
    renderCart();
});

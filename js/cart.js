/* =========================================================
   LENCHOTECH
   SISTEMA DE CARRITO
========================================================= */

"use strict";


/* =========================================================
   1. CONFIGURACIÓN
========================================================= */

const CART_STORAGE_KEY = "lenchotech-cart";

const LeNCHoTeCHCartState = {
    items: []
};


/* =========================================================
   2. UTILIDADES
========================================================= */

/**
 * Devuelve la API principal de la tienda.
 *
 * @returns {object}
 */
function getCartApp() {
    return window.LENCHOTECH_APP || {};
}


/**
 * Busca un producto mediante su ID.
 *
 * @param {number|string} productId
 * @returns {object|null}
 */
function getCartProductById(productId) {
    const app = getCartApp();

    if (typeof app.findProductById === "function") {
        return app.findProductById(productId);
    }

    const catalog = window.LENCHOTECH_PRODUCTS;

    if (!Array.isArray(catalog)) {
        return null;
    }

    const normalizedId = Number(productId);

    return catalog.find(
        product => product.id === normalizedId
    ) || null;
}


/**
 * Formatea una cantidad monetaria.
 *
 * @param {number} amount
 * @returns {string}
 */
function formatCartPrice(amount) {
    const app = getCartApp();

    if (typeof app.formatPrice === "function") {
        return app.formatPrice(amount);
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        return "$0.00";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(numericAmount);
}


/**
 * Convierte texto a HTML seguro.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeCartHTML(value) {
    const app = getCartApp();

    if (typeof app.escapeHTML === "function") {
        return app.escapeHTML(value);
    }

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/**
 * Muestra una notificación.
 *
 * @param {string} title
 * @param {string} message
 * @param {string} type
 */
function showCartToast(
    title,
    message,
    type = "default"
) {
    const app = getCartApp();

    if (typeof app.showToast === "function") {
        app.showToast(
            title,
            message,
            type
        );

        return;
    }

    console.log(`${title}: ${message}`);
}


/**
 * Crea un placeholder cuando la imagen no existe.
 *
 * @param {string} productName
 * @returns {string}
 */
function createCartPlaceholder(productName) {
    const app = getCartApp();

    if (
        typeof app.createProductPlaceholderHTML ===
        "function"
    ) {
        return app.createProductPlaceholderHTML(
            productName
        );
    }

    return `
        <div class="product-image-placeholder">
            <span class="product-image-placeholder__icon">
                📦
            </span>

            <span class="product-image-placeholder__text">
                Imagen no disponible
            </span>
        </div>
    `;
}


/* =========================================================
   3. ALMACENAMIENTO LOCAL
========================================================= */

/**
 * Guarda el carrito en el navegador.
 */
function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(
                LeNCHoTeCHCartState.items
            )
        );
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible guardar el carrito.",
            error
        );
    }
}


/**
 * Carga el carrito guardado.
 */
function loadCart() {
    try {
        const storedCart =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (!storedCart) {
            LeNCHoTeCHCartState.items = [];
            return;
        }

        const parsedCart =
            JSON.parse(storedCart);

        if (!Array.isArray(parsedCart)) {
            LeNCHoTeCHCartState.items = [];
            return;
        }

        LeNCHoTeCHCartState.items =
            parsedCart
                .map(item => ({
                    productId:
                        Number(item.productId),
                    quantity:
                        Math.max(
                            1,
                            Number(item.quantity) || 1
                        )
                }))
                .filter(item => {
                    const product =
                        getCartProductById(
                            item.productId
                        );

                    return Boolean(product);
                });

        validateCartQuantities();
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: el carrito guardado no pudo cargarse.",
            error
        );

        LeNCHoTeCHCartState.items = [];
    }
}


/**
 * Ajusta cantidades que superen el inventario actual.
 */
function validateCartQuantities() {
    LeNCHoTeCHCartState.items =
        LeNCHoTeCHCartState.items
            .map(item => {
                const product =
                    getCartProductById(
                        item.productId
                    );

                if (!product || product.stock <= 0) {
                    return null;
                }

                return {
                    productId: item.productId,
                    quantity: Math.min(
                        item.quantity,
                        product.stock
                    )
                };
            })
            .filter(Boolean);

    saveCart();
}


/* =========================================================
   4. SELECTORES
========================================================= */

/**
 * Obtiene el panel lateral del carrito.
 *
 * @returns {HTMLElement|null}
 */
function getCartDrawer() {
    return document.querySelector(
        "#cart-drawer, [data-cart-drawer]"
    );
}


/**
 * Obtiene el contenedor de productos.
 *
 * @returns {HTMLElement|null}
 */
function getCartItemsContainer() {
    return document.querySelector(
        "#cart-items, " +
        ".cart-items, " +
        "[data-cart-items]"
    );
}


/**
 * Obtiene el contador del encabezado.
 *
 * @returns {HTMLElement|null}
 */
function getCartCounter() {
    return document.querySelector(
        "#cart-count, " +
        "#cart-counter, " +
        "[data-cart-count]"
    );
}


/**
 * Obtiene el subtotal del panel.
 *
 * @returns {HTMLElement|null}
 */
function getCartSubtotalElement() {
    return document.querySelector(
        "#cart-subtotal, " +
        "[data-cart-subtotal]"
    );
}


/**
 * Obtiene el total del panel.
 *
 * @returns {HTMLElement|null}
 */
function getCartTotalElement() {
    return document.querySelector(
        "#cart-total, " +
        "[data-cart-total]"
    );
}


/**
 * Obtiene el botón de compra.
 *
 * @returns {HTMLButtonElement|null}
 */
function getCheckoutButton() {
    return document.querySelector(
        "#checkout-button, " +
        "[data-open-checkout]"
    );
}


/**
 * Obtiene el botón de vaciar carrito.
 *
 * @returns {HTMLButtonElement|null}
 */
function getClearCartButton() {
    return document.querySelector(
        "#clear-cart-button, " +
        "[data-clear-cart]"
    );
}


/**
 * Obtiene el estado vacío.
 *
 * @returns {HTMLElement|null}
 */
function getCartEmptyState() {
    return document.querySelector(
        "#cart-empty-state, " +
        ".cart-empty-state, " +
        "[data-cart-empty]"
    );
}


/* =========================================================
   5. INFORMACIÓN DEL CARRITO
========================================================= */

/**
 * Busca un artículo dentro del carrito.
 *
 * @param {number|string} productId
 * @returns {object|null}
 */
function findCartItem(productId) {
    const normalizedId = Number(productId);

    return LeNCHoTeCHCartState.items.find(
        item =>
            item.productId === normalizedId
    ) || null;
}


/**
 * Devuelve la cantidad total de unidades.
 *
 * @returns {number}
 */
function getCartItemCount() {
    return LeNCHoTeCHCartState.items.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}


/**
 * Calcula el subtotal.
 *
 * @returns {number}
 */
function getCartSubtotal() {
    return LeNCHoTeCHCartState.items.reduce(
        (subtotal, item) => {
            const product =
                getCartProductById(
                    item.productId
                );

            if (!product) {
                return subtotal;
            }

            return subtotal +
                Number(product.price) *
                item.quantity;
        },
        0
    );
}


/**
 * Devuelve los artículos con su producto completo.
 *
 * @returns {object[]}
 */
function getDetailedCartItems() {
    return LeNCHoTeCHCartState.items
        .map(item => {
            const product =
                getCartProductById(
                    item.productId
                );

            if (!product) {
                return null;
            }

            return {
                ...item,
                product,
                lineTotal:
                    Number(product.price) *
                    item.quantity
            };
        })
        .filter(Boolean);
}


/* =========================================================
   6. AÑADIR PRODUCTOS
========================================================= */

/**
 * Añade un producto al carrito.
 *
 * @param {number|string} productId
 * @param {number} quantity
 * @returns {boolean}
 */
function addToCart(
    productId,
    quantity = 1
) {
    const product =
        getCartProductById(productId);

    if (!product) {
        showCartToast(
            "Producto no encontrado",
            "No fue posible añadir este producto.",
            "danger"
        );

        return false;
    }

    if (product.stock <= 0) {
        showCartToast(
            "Producto agotado",
            `${product.name} no está disponible actualmente.`,
            "warning"
        );

        return false;
    }

    const normalizedQuantity =
        Math.max(
            1,
            Math.floor(
                Number(quantity) || 1
            )
        );

    const existingItem =
        findCartItem(product.id);

    if (existingItem) {
        const newQuantity =
            existingItem.quantity +
            normalizedQuantity;

        if (newQuantity > product.stock) {
            existingItem.quantity =
                product.stock;

            showCartToast(
                "Cantidad ajustada",
                `Solo hay ${product.stock} unidades disponibles de ${product.name}.`,
                "warning"
            );
        } else {
            existingItem.quantity =
                newQuantity;

            showCartToast(
                "Carrito actualizado",
                `Se añadió otra unidad de ${product.name}.`,
                "success"
            );
        }
    } else {
        LeNCHoTeCHCartState.items.push({
            productId: product.id,
            quantity: Math.min(
                normalizedQuantity,
                product.stock
            )
        });

        showCartToast(
            "Añadido al carrito",
            `${product.name} se añadió correctamente.`,
            "success"
        );
    }

    saveCart();
    renderCart();

    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:cart-updated",
            {
                detail: {
                    items:
                        getDetailedCartItems(),
                    itemCount:
                        getCartItemCount(),
                    subtotal:
                        getCartSubtotal()
                }
            }
        )
    );

    return true;
}


/* =========================================================
   7. MODIFICAR CANTIDADES
========================================================= */

/**
 * Cambia la cantidad de un producto.
 *
 * @param {number|string} productId
 * @param {number} quantity
 */
function setCartItemQuantity(
    productId,
    quantity
) {
    const product =
        getCartProductById(productId);

    const item =
        findCartItem(productId);

    if (!product || !item) {
        return;
    }

    const normalizedQuantity =
        Math.floor(
            Number(quantity)
        );

    if (
        !Number.isFinite(normalizedQuantity) ||
        normalizedQuantity <= 0
    ) {
        removeFromCart(productId);
        return;
    }

    if (normalizedQuantity > product.stock) {
        item.quantity = product.stock;

        showCartToast(
            "Cantidad máxima alcanzada",
            `Solo hay ${product.stock} unidades disponibles.`,
            "warning"
        );
    } else {
        item.quantity =
            normalizedQuantity;
    }

    saveCart();
    renderCart();
    dispatchCartUpdatedEvent();
}


/**
 * Aumenta una unidad.
 *
 * @param {number|string} productId
 */
function increaseCartItem(productId) {
    const item =
        findCartItem(productId);

    if (!item) {
        return;
    }

    setCartItemQuantity(
        productId,
        item.quantity + 1
    );
}


/**
 * Reduce una unidad.
 *
 * @param {number|string} productId
 */
function decreaseCartItem(productId) {
    const item =
        findCartItem(productId);

    if (!item) {
        return;
    }

    setCartItemQuantity(
        productId,
        item.quantity - 1
    );
}


/* =========================================================
   8. ELIMINAR PRODUCTOS
========================================================= */

/**
 * Elimina un producto.
 *
 * @param {number|string} productId
 */
function removeFromCart(productId) {
    const normalizedId = Number(productId);

    const product =
        getCartProductById(normalizedId);

    const originalLength =
        LeNCHoTeCHCartState.items.length;

    LeNCHoTeCHCartState.items =
        LeNCHoTeCHCartState.items.filter(
            item =>
                item.productId !== normalizedId
        );

    if (
        LeNCHoTeCHCartState.items.length ===
        originalLength
    ) {
        return;
    }

    saveCart();
    renderCart();
    dispatchCartUpdatedEvent();

    showCartToast(
        "Producto eliminado",
        product
            ? `${product.name} se eliminó del carrito.`
            : "El producto se eliminó del carrito.",
        "default"
    );
}


/**
 * Vacía completamente el carrito.
 *
 * @param {boolean} showMessage
 */
function clearCart(showMessage = true) {
    if (
        LeNCHoTeCHCartState.items.length === 0
    ) {
        return;
    }

    LeNCHoTeCHCartState.items = [];

    saveCart();
    renderCart();
    dispatchCartUpdatedEvent();

    if (showMessage) {
        showCartToast(
            "Carrito vacío",
            "Todos los productos fueron eliminados.",
            "default"
        );
    }
}


/* =========================================================
   9. CREACIÓN DEL HTML
========================================================= */

/**
 * Crea el HTML de un artículo.
 *
 * @param {object} cartEntry
 * @returns {string}
 */
function createCartItemHTML(cartEntry) {
    const {
        product,
        quantity,
        lineTotal
    } = cartEntry;

    return `
        <article
            class="drawer-item cart-item"
            data-cart-product-id="${product.id}"
        >
            <div class="drawer-item__image-wrapper">
                <img
                    class="drawer-item__image"
                    src="${escapeCartHTML(product.image)}"
                    alt="${escapeCartHTML(product.name)}"
                    data-product-name="${escapeCartHTML(product.name)}"
                    loading="lazy"
                >
            </div>

            <div class="drawer-item__content">
                <span class="drawer-item__category">
                    ${escapeCartHTML(product.brand)}
                </span>

                <h3 class="drawer-item__title">
                    ${escapeCartHTML(product.name)}
                </h3>

                <span class="drawer-item__unit-price">
                    ${formatCartPrice(product.price)}
                    por unidad
                </span>

                <div
                    class="quantity-control"
                    aria-label="Cantidad de ${escapeCartHTML(product.name)}"
                >
                    <button
                        class="quantity-control__button"
                        type="button"
                        data-cart-action="decrease"
                        data-product-id="${product.id}"
                        aria-label="Reducir cantidad"
                    >
                        −
                    </button>

                    <input
                        class="quantity-control__input"
                        type="number"
                        value="${quantity}"
                        min="1"
                        max="${product.stock}"
                        inputmode="numeric"
                        data-cart-quantity
                        data-product-id="${product.id}"
                        aria-label="Cantidad"
                    >

                    <button
                        class="quantity-control__button"
                        type="button"
                        data-cart-action="increase"
                        data-product-id="${product.id}"
                        aria-label="Aumentar cantidad"
                        ${
                            quantity >= product.stock
                                ? "disabled"
                                : ""
                        }
                    >
                        +
                    </button>
                </div>

                <small class="drawer-item__stock">
                    ${product.stock} disponibles
                </small>
            </div>

            <div class="drawer-item__aside">
                <strong class="drawer-item__price">
                    ${formatCartPrice(lineTotal)}
                </strong>

                <button
                    class="drawer-item__remove"
                    type="button"
                    data-cart-action="remove"
                    data-product-id="${product.id}"
                    aria-label="Eliminar ${escapeCartHTML(product.name)}"
                    title="Eliminar producto"
                >
                    ×
                </button>
            </div>
        </article>
    `;
}


/**
 * Crea el estado vacío.
 *
 * @returns {string}
 */
function createEmptyCartHTML() {
    return `
        <div class="empty-state cart-empty-state">
            <span
                class="empty-state__icon"
                aria-hidden="true"
            >
                🛒
            </span>

            <h3>Tu carrito está vacío</h3>

            <p>
                Añade productos del catálogo para verlos aquí.
            </p>

            <button
                class="primary-button"
                type="button"
                data-cart-action="continue-shopping"
            >
                Ver productos
            </button>
        </div>
    `;
}


/* =========================================================
   10. RENDERIZADO
========================================================= */

/**
 * Dibuja el carrito.
 */
function renderCart() {
    const container =
        getCartItemsContainer();

    const detailedItems =
        getDetailedCartItems();

    if (container) {
        if (detailedItems.length === 0) {
            container.innerHTML =
                createEmptyCartHTML();
        } else {
            container.innerHTML =
                detailedItems
                    .map(createCartItemHTML)
                    .join("");
        }
    }

    updateCartCounter();
    updateCartTotals();
    updateCartButtons();
}


/**
 * Actualiza el contador del encabezado.
 */
function updateCartCounter() {
    const counter =
        getCartCounter();

    if (!counter) {
        return;
    }

    const itemCount =
        getCartItemCount();

    counter.textContent =
        String(itemCount);

    counter.hidden =
        itemCount === 0;

    counter.setAttribute(
        "aria-label",
        `${itemCount} ${
            itemCount === 1
                ? "producto"
                : "productos"
        } en el carrito`
    );
}


/**
 * Actualiza subtotal y total.
 */
function updateCartTotals() {
    const subtotal =
        getCartSubtotal();

    const subtotalElement =
        getCartSubtotalElement();

    const totalElement =
        getCartTotalElement();

    if (subtotalElement) {
        subtotalElement.textContent =
            formatCartPrice(subtotal);
    }

    if (totalElement) {
        totalElement.textContent =
            formatCartPrice(subtotal);
    }
}


/**
 * Activa o desactiva botones.
 */
function updateCartButtons() {
    const isEmpty =
        LeNCHoTeCHCartState.items.length === 0;

    const checkoutButton =
        getCheckoutButton();

    const clearButton =
        getClearCartButton();

    if (checkoutButton) {
        checkoutButton.disabled =
            isEmpty;
    }

    if (clearButton) {
        clearButton.disabled =
            isEmpty;
    }
}


/* =========================================================
   11. EVENTOS PERSONALIZADOS
========================================================= */

/**
 * Informa que el carrito cambió.
 */
function dispatchCartUpdatedEvent() {
    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:cart-updated",
            {
                detail: {
                    items:
                        getDetailedCartItems(),
                    itemCount:
                        getCartItemCount(),
                    subtotal:
                        getCartSubtotal()
                }
            }
        )
    );
}


/* =========================================================
   12. CHECKOUT
========================================================= */

/**
 * Obtiene el modal de compra.
 *
 * @returns {HTMLElement|null}
 */
function getCheckoutModal() {
    return document.querySelector(
        "#checkout-modal, " +
        "[data-checkout-modal]"
    );
}


/**
 * Obtiene el contenedor del resumen.
 *
 * @returns {HTMLElement|null}
 */
function getCheckoutSummary() {
    return document.querySelector(
        "#checkout-summary, " +
        "[data-checkout-summary]"
    );
}


/**
 * Crea el resumen de compra.
 *
 * @returns {string}
 */
function createCheckoutSummaryHTML() {
    const items =
        getDetailedCartItems();

    const subtotal =
        getCartSubtotal();

    const itemRows = items
        .map(
            item => `
                <div class="checkout-summary__item">
                    <div>
                        <strong>
                            ${escapeCartHTML(item.product.name)}
                        </strong>

                        <span>
                            ${item.quantity}
                            ×
                            ${formatCartPrice(item.product.price)}
                        </span>
                    </div>

                    <strong>
                        ${formatCartPrice(item.lineTotal)}
                    </strong>
                </div>
            `
        )
        .join("");

    return `
        <div class="checkout-summary__products">
            ${itemRows}
        </div>

        <div class="checkout-summary__totals">
            <div>
                <span>Subtotal</span>

                <strong>
                    ${formatCartPrice(subtotal)}
                </strong>
            </div>

            <div>
                <span>Envío</span>

                <strong>Gratis</strong>
            </div>

            <div class="checkout-summary__total">
                <span>Total</span>

                <strong>
                    ${formatCartPrice(subtotal)}
                </strong>
            </div>
        </div>
    `;
}


/**
 * Abre el checkout.
 */
function openCheckout() {
    if (
        LeNCHoTeCHCartState.items.length === 0
    ) {
        showCartToast(
            "Carrito vacío",
            "Añade al menos un producto antes de continuar.",
            "warning"
        );

        return;
    }

    const modal =
        getCheckoutModal();

    if (!modal) {
        showCartToast(
            "Compra preparada",
            `Total: ${formatCartPrice(getCartSubtotal())}`,
            "success"
        );

        return;
    }

    const summary =
        getCheckoutSummary();

    if (summary) {
        summary.innerHTML =
            createCheckoutSummaryHTML();
    }

    const app = getCartApp();

    if (typeof app.openModal === "function") {
        app.openModal(modal);
    } else {
        modal.hidden = false;
    }
}


/**
 * Procesa la compra simulada.
 *
 * @param {HTMLFormElement} form
 */
function submitCheckout(form) {
    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
            "Procesando compra...";
    }

    window.setTimeout(
        () => {
            const orderNumber =
                `LT-${Date.now()
                    .toString()
                    .slice(-8)}`;

            clearCart(false);
            form.reset();

            const modal =
                getCheckoutModal();

            const app =
                getCartApp();

            if (
                modal &&
                typeof app.closeModal ===
                "function"
            ) {
                app.closeModal(modal);
            } else if (modal) {
                modal.hidden = true;
            }

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    "Completar compra";
            }

            showCartToast(
                "Compra completada",
                `Orden ${orderNumber} registrada correctamente.`,
                "success"
            );
        },
        1000
    );
}


/* =========================================================
   13. EVENTOS
========================================================= */

/**
 * Procesa los botones del carrito.
 *
 * @param {HTMLElement} actionElement
 */
function handleCartAction(actionElement) {
    const action =
        actionElement.dataset.cartAction;

    const productId =
        actionElement.dataset.productId;

    if (action === "increase") {
        increaseCartItem(productId);
        return;
    }

    if (action === "decrease") {
        decreaseCartItem(productId);
        return;
    }

    if (action === "remove") {
        removeFromCart(productId);
        return;
    }

    if (action === "continue-shopping") {
        const app = getCartApp();

        if (
            typeof app.closeAllDrawers ===
            "function"
        ) {
            app.closeAllDrawers();
        }

        if (
            typeof app.scrollToCatalog ===
            "function"
        ) {
            app.scrollToCatalog();
        }
    }
}


/**
 * Inicializa los eventos del carrito.
 */
function initializeCartEvents() {
    document.addEventListener(
        "lenchotech:add-to-cart",
        event => {
            const productId =
                event.detail?.productId;

            if (productId) {
                addToCart(productId);
            }
        }
    );

    document.addEventListener(
        "click",
        event => {
            const cartAction =
                event.target.closest(
                    "[data-cart-action]"
                );

            if (cartAction) {
                handleCartAction(cartAction);
            }

            const clearButton =
                event.target.closest(
                    "#clear-cart-button, " +
                    "[data-clear-cart]"
                );

            if (clearButton) {
                clearCart();
            }

            const checkoutButton =
                event.target.closest(
                    "#checkout-button, " +
                    "[data-open-checkout]"
                );

            if (checkoutButton) {
                openCheckout();
            }
        }
    );

    document.addEventListener(
        "change",
        event => {
            const input =
                event.target;

            if (
                input instanceof HTMLInputElement &&
                input.matches(
                    "[data-cart-quantity]"
                )
            ) {
                setCartItemQuantity(
                    input.dataset.productId,
                    input.value
                );
            }
        }
    );

    document.addEventListener(
        "submit",
        event => {
            const form =
                event.target;

            if (
                form instanceof HTMLFormElement &&
                form.matches(
                    "#checkout-form, " +
                    "[data-checkout-form]"
                )
            ) {
                event.preventDefault();
                submitCheckout(form);
            }
        }
    );
}


/* =========================================================
   14. IMÁGENES ROTAS
========================================================= */

/**
 * Activa los placeholders del carrito.
 */
function initializeCartImageFallbacks() {
    document.addEventListener(
        "error",
        event => {
            const image =
                event.target;

            if (
                !(
                    image instanceof
                    HTMLImageElement
                ) ||
                !image.matches(
                    ".drawer-item__image"
                )
            ) {
                return;
            }

            const wrapper =
                image.closest(
                    ".drawer-item__image-wrapper"
                );

            if (!wrapper) {
                image.hidden = true;
                return;
            }

            wrapper.innerHTML =
                createCartPlaceholder(
                    image.dataset.productName ||
                    image.alt ||
                    "Producto"
                );
        },
        true
    );
}


/* =========================================================
   15. INICIALIZACIÓN
========================================================= */

/**
 * Inicializa el sistema.
 */
function initializeCart() {
    loadCart();
    initializeCartEvents();
    initializeCartImageFallbacks();
    renderCart();

    console.log(
        `LeNCHoTeCH Cart iniciado con ${
            getCartItemCount()
        } unidades.`
    );
}


/* =========================================================
   16. API GLOBAL
========================================================= */

window.LENCHOTECH_CART = {
    state: LeNCHoTeCHCartState,

    add: addToCart,
    remove: removeFromCart,
    clear: clearCart,

    increase: increaseCartItem,
    decrease: decreaseCartItem,
    setQuantity: setCartItemQuantity,

    getItems: getDetailedCartItems,
    getItemCount: getCartItemCount,
    getSubtotal: getCartSubtotal,

    render: renderCart,
    openCheckout
};


/* =========================================================
   17. EJECUCIÓN
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCart
    );
} else {
    initializeCart();
}
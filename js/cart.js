/* =========================================================
   LENCHOTECH
   SISTEMA DE CARRITO
========================================================= */

"use strict";

import {
    db
} from "./firebase-config.js";

import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";


/* =========================================================
   1. CONFIGURACIÓN
========================================================= */

const CART_STORAGE_KEY = "lenchotech-cart";

const LeNCHoTeCHCartState = {
    items: []
};

let authenticatedUser = null;

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
 * Obtiene una traducción para el carrito.
 *
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
function getCartTranslation(
    key,
    fallback
) {
    const language =
        document.documentElement.lang === "en"
            ? "en"
            : "es";

    const translatedText =
        window.LENCHOTECH_I18N
            ?.getTranslation?.(
                language,
                key
            );

    return translatedText || fallback;
}

/**
 * Obtiene una traducción y reemplaza
 * variables como {name}, {price} o {stock}.
 *
 * @param {string} key
 * @param {string} fallback
 * @param {Record<string, string|number>} variables
 * @returns {string}
 */
function getCartTranslationWithVariables(
    key,
    fallback,
    variables = {}
) {
    let translatedText =
        getCartTranslation(
            key,
            fallback
        );

    Object.entries(variables).forEach(
        ([variableName, variableValue]) => {
            translatedText =
                translatedText.replaceAll(
                    `{${variableName}}`,
                    String(variableValue)
                );
        }
    );

    return translatedText;
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
async function loadCart() {

    /*
        USUARIO CON SESIÓN:
        cargar su carrito privado desde Firestore.
    */

    if (authenticatedUser) {
        try {
            const cartSnapshot =
                await getDocs(
                    collection(
                        db,
                        "users",
                        authenticatedUser.uid,
                        "cart"
                    )
                );

            LeNCHoTeCHCartState.items =
                cartSnapshot.docs
                    .map(cartDocument => {
                        const data =
                            cartDocument.data();

                        return {
                            productId: Number(
                                data.productId ??
                                cartDocument.id
                            ),

                            quantity: Math.max(
                                1,
                                Number(
                                    data.quantity
                                ) || 1
                            )
                        };
                    })
                    .filter(item => {
                        const product =
                            getCartProductById(
                                item.productId
                            );

                        return (
                            Number.isFinite(
                                item.productId
                            ) &&
                            Boolean(product)
                        );
                    });

            validateCartQuantities(false);

            return;
        } catch (error) {
            console.error(
                "LeNCHoTeCH: no fue posible cargar el carrito de Firestore.",
                error
            );

            LeNCHoTeCHCartState.items = [];

            return;
        }
    }


    /*
        INVITADO:
        cargar su carrito temporal desde localStorage.
    */

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
                            Number(
                                item.quantity
                            ) || 1
                        )
                }))
                .filter(item => {
                    const product =
                        getCartProductById(
                            item.productId
                        );

                    return (
                        Number.isFinite(
                            item.productId
                        ) &&
                        Boolean(product)
                    );
                });

        validateCartQuantities();
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: el carrito local no pudo cargarse.",
            error
        );

        LeNCHoTeCHCartState.items = [];
    }
}

/**
 * Guarda o actualiza un artículo del carrito
 * en la cuenta del usuario.
 *
 * @param {{productId: number, quantity: number}} item
 */
async function saveCartItemToFirestore(item) {
    if (!authenticatedUser || !item) {
        return;
    }

    try {
        await setDoc(
            doc(
                db,
                "users",
                authenticatedUser.uid,
                "cart",
                String(item.productId)
            ),
            {
                productId: item.productId,
                quantity: item.quantity,
                updatedAt: serverTimestamp()
            },
            {
                merge: true
            }
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no fue posible sincronizar el producto del carrito.",
            error
        );

        showCartToast(
            getCartTranslation(
                "cart.syncErrorTitle",
                "Error de sincronización"
            ),
            getCartTranslation(
                "cart.saveSyncErrorMessage",
                "El carrito cambió en la pantalla, pero no pudo guardarse en tu cuenta."
            ),
            "danger"
        );
    }
}


/**
 * Elimina un artículo del carrito de Firestore.
 *
 * @param {number} productId
 */
async function deleteCartItemFromFirestore(
    productId
) {
    if (!authenticatedUser) {
        return;
    }

    try {
        await deleteDoc(
            doc(
                db,
                "users",
                authenticatedUser.uid,
                "cart",
                String(productId)
            )
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no fue posible eliminar el producto del carrito en Firestore.",
            error
        );

        showCartToast(
            getCartTranslation(
                "cart.syncErrorTitle",
                "Error de sincronización"
            ),
            getCartTranslation(
                "cart.deleteSyncErrorMessage",
                "El producto desapareció de la pantalla, pero no pudo eliminarse de tu cuenta."
            ),
            "danger"
        );
    }
}


/**
 * Elimina todos los artículos del carrito
 * guardado en Firestore.
 */
async function clearFirestoreCart() {
    if (!authenticatedUser) {
        return;
    }

    try {
        const cartSnapshot =
            await getDocs(
                collection(
                    db,
                    "users",
                    authenticatedUser.uid,
                    "cart"
                )
            );

        await Promise.all(
            cartSnapshot.docs.map(
                cartDocument =>
                    deleteDoc(
                        cartDocument.ref
                    )
            )
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no fue posible vaciar el carrito de Firestore.",
            error
        );

        showCartToast(
            getCartTranslation(
                "cart.syncErrorTitle",
                "Error de sincronización"
            ),
            getCartTranslation(
                "cart.clearSyncErrorMessage",
                "El carrito se vació en la pantalla, pero no pudo actualizarse completamente en tu cuenta."
            ),
            "danger"
        );
    }
}


/**
 * Ajusta cantidades que superen el inventario actual.
 */
function validateCartQuantities(
    saveAfterValidation = true
) {
    LeNCHoTeCHCartState.items =
        LeNCHoTeCHCartState.items
            .map(item => {
                const product =
                    getCartProductById(
                        item.productId
                    );

                if (
                    !product ||
                    product.stock <= 0
                ) {
                    return null;
                }

                return {
                    productId:
                        item.productId,

                    quantity:
                        Math.min(
                            item.quantity,
                            product.stock
                        )
                };
            })
            .filter(Boolean);

    if (saveAfterValidation) {
        saveCart();
    }
}


/* =========================================================
   4. SELECTORES
========================================================= */

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
 * Indica si un producto está actualmente
 * dentro del carrito.
 *
 * @param {number|string} productId
 * @returns {boolean}
 */
function isProductInCart(productId) {
    return Boolean(
        findCartItem(productId)
    );
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
            getCartTranslation(
                "cart.productNotFoundTitle",
                "Producto no encontrado"
            ),
            getCartTranslation(
                "cart.productNotFoundMessage",
                "No fue posible añadir este producto."
            ),
            "danger"
        );

        return false;
    }

    if (product.stock <= 0) {
        showCartToast(
            getCartTranslation(
                "cart.outOfStockTitle",
                "Producto agotado"
            ),
            getCartTranslationWithVariables(
                "cart.outOfStockMessage",
                "{name} no está disponible actualmente.",
                {
                    name:
                        getCartApp()
                            .getTranslatedProductName?.(
                                product
                            ) ||
                        product.name
                }
            ),
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
                getCartTranslation(
                    "cart.quantityAdjustedTitle",
                    "Cantidad ajustada"
                ),
                getCartTranslationWithVariables(
                    "cart.quantityAdjustedMessage",
                    "Solo hay {stock} unidades disponibles de {name}.",
                    {
                        stock: product.stock,
                        name:
                            getCartApp()
                                .getTranslatedProductName?.(
                                    product
                                ) ||
                            product.name
                    }
                ),
                "warning"
            );
        } else {
            existingItem.quantity =
                newQuantity;

            showCartToast(
                getCartTranslation(
                    "cart.cartUpdatedTitle",
                    "Carrito actualizado"
                ),
                getCartTranslationWithVariables(
                    "cart.cartUpdatedMessage",
                    "Se añadió otra unidad de {name}.",
                    {
                        name:
                            getCartApp()
                                .getTranslatedProductName?.(
                                    product
                                ) ||
                            product.name
                    }
                ),
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
            getCartTranslation(
                "cart.addedTitle",
                "Añadido al carrito"
            ),
            getCartTranslationWithVariables(
                "cart.addedMessage",
                "{name} se añadió correctamente.",
                {
                    name:
                        getCartApp()
                            .getTranslatedProductName?.(
                                product
                            ) ||
                        product.name
                }
            ),
            "success"
        );
    }

    const updatedItem =
        findCartItem(product.id);

    if (authenticatedUser) {
        saveCartItemToFirestore(
            updatedItem
        );
    } else {
        saveCart();
    }

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

/**
 * Añade o elimina un producto según
 * su estado actual en el carrito.
 *
 * @param {number|string} productId
 * @param {number} quantity
 * @returns {boolean}
 */
function toggleCartProduct(
    productId,
    quantity = 1
) {
    if (isProductInCart(productId)) {
        removeFromCart(productId);

        return false;
    }

    addToCart(
        productId,
        quantity
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
            getCartTranslation(
                "cart.maximumQuantityTitle",
                "Cantidad máxima alcanzada"
            ),
            getCartTranslationWithVariables(
                "cart.maximumQuantityMessage",
                "Solo hay {stock} unidades disponibles.",
                {
                    stock: product.stock
                }
            ),
            "warning"
        );
    } else {
        item.quantity =
            normalizedQuantity;
    }

    if (authenticatedUser) {
        saveCartItemToFirestore(item);
    } else {
        saveCart();
    }

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

    if (authenticatedUser) {
        deleteCartItemFromFirestore(
            normalizedId
        );
    } else {
        saveCart();
    }

    renderCart();
    dispatchCartUpdatedEvent();

    showCartToast(
        getCartTranslation(
            "cart.removedTitle",
            "Producto eliminado"
        ),
        product
            ? getCartTranslationWithVariables(
                "cart.removedMessage",
                "{name} se eliminó del carrito.",
                {
                    name:
                        getCartApp()
                            .getTranslatedProductName?.(
                                product
                            ) ||
                        product.name
                }
            )
            : getCartTranslation(
                "cart.removedGenericMessage",
                "El producto se eliminó del carrito."
            ),
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

    if (authenticatedUser) {
        clearFirestoreCart();
    } else {
        saveCart();
    }

    renderCart();
    dispatchCartUpdatedEvent();

    if (showMessage) {
        showCartToast(
            getCartTranslation(
                "cart.clearedTitle",
                "Carrito vacío"
            ),
            getCartTranslation(
                "cart.clearedMessage",
                "Todos los productos fueron eliminados."
            ),
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

    const app =
        getCartApp();

    const visibleProductName =
        typeof app.getTranslatedProductName ===
        "function"
            ? app.getTranslatedProductName(
                product
            )
            : product.name;

    return `
        <article
            class="drawer-item cart-item"
            data-cart-product-id="${product.id}"
        >
            <div class="drawer-item__image-wrapper">
                <img
                    class="drawer-item__image"
                    src="${escapeCartHTML(product.image)}"
                    alt="${escapeCartHTML(
                        visibleProductName
                    )}"
                    data-product-name="${escapeCartHTML(
                        visibleProductName
                    )}"
                    loading="lazy"
                >
            </div>

            <div class="drawer-item__content">
                <span class="drawer-item__category">
                    ${escapeCartHTML(product.brand)}
                </span>

                <h3 class="drawer-item__title">
                    ${escapeCartHTML(
                        visibleProductName
                    )}
                </h3>

                <span class="drawer-item__unit-price">
                    ${escapeCartHTML(
                        getCartTranslationWithVariables(
                            "cart.unitPrice",
                            "{price} por unidad",
                            {
                                price:
                                    formatCartPrice(
                                        product.price
                                    )
                            }
                        )
                    )}
                </span>

                <div
                    class="quantity-control"
                    aria-label="${escapeCartHTML(
                        getCartTranslationWithVariables(
                            "cart.quantityFor",
                            "Cantidad de {name}",
                            {
                                name: visibleProductName
                            }
                        )
                    )}"
                >
                    <button
                        class="quantity-control__button"
                        type="button"
                        data-cart-action="decrease"
                        data-product-id="${product.id}"
                        aria-label="${escapeCartHTML(
                            getCartTranslation(
                                "cart.decreaseQuantity",
                                "Reducir cantidad"
                            )
                        )}"
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
                        aria-label="${escapeCartHTML(
                            getCartTranslation(
                                "cart.quantity",
                                "Cantidad"
                            )
                        )}"
                    >

                    <button
                        class="quantity-control__button"
                        type="button"
                        data-cart-action="increase"
                        data-product-id="${product.id}"
                        aria-label="${escapeCartHTML(
                            getCartTranslation(
                                "cart.increaseQuantity",
                                "Aumentar cantidad"
                            )
                        )}"
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
                    ${escapeCartHTML(
                        getCartTranslationWithVariables(
                            "cart.availableStock",
                            "{stock} disponibles",
                            {
                                stock: product.stock
                            }
                        )
                    )}
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
                    aria-label="${escapeCartHTML(
                        getCartTranslationWithVariables(
                            "cart.removeProductLabel",
                            "Eliminar {name}",
                            {
                                name: visibleProductName
                            }
                        )
                    )}"
                    title="${escapeCartHTML(
                        getCartTranslation(
                            "cart.removeProductTitle",
                            "Eliminar producto"
                        )
                    )}"
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

            <h3>
                ${escapeCartHTML(
                    getCartTranslation(
                        "cart.emptyTitle",
                        "Tu carrito está vacío"
                    )
                )}
            </h3>

            <p>
                ${escapeCartHTML(
                    getCartTranslation(
                        "cart.emptyDescription",
                        "Añade productos del catálogo para verlos aquí."
                    )
                )}
            </p>

            <button
                class="primary-button"
                type="button"
                data-cart-action="continue-shopping"
            >
                ${escapeCartHTML(
                    getCartTranslation(
                        "cart.viewProducts",
                        "Ver productos"
                    )
                )}
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
    synchronizeCartProductButtons();
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
        itemCount === 1
            ? getCartTranslation(
                "cart.counterSingle",
                "1 producto en el carrito"
            )
            : getCartTranslationWithVariables(
                "cart.counterPlural",
                "{count} productos en el carrito",
                {
                    count: itemCount
                }
            )
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
        clearButton.hidden =
            isEmpty;

        clearButton.disabled =
            isEmpty;
    }
}

/**
 * Sincroniza todos los botones para añadir
 * o eliminar productos del carrito.
 */
function synchronizeCartProductButtons() {
    document
        .querySelectorAll(
            '[data-action="add-to-cart"]'
        )
        .forEach(button => {
            const productId =
                Number(
                    button.dataset.productId
                );

            if (!Number.isFinite(productId)) {
                return;
            }

            const product =
                getCartProductById(productId);

            if (!product) {
                return;
            }

            const app =
                getCartApp();

            const visibleProductName =
                typeof app.getTranslatedProductName ===
                "function"
                    ? app.getTranslatedProductName(
                        product
                    )
                    : product.name;

            const isInCart =
                isProductInCart(productId);

            const language =
                document.documentElement.lang ===
                "en"
                    ? "en"
                    : "es";

            const getTranslation =
                window.LENCHOTECH_I18N
                    ?.getTranslation;

            const translationKey =
                isInCart
                    ? (
                        button.closest(
                            ".quick-view-layout"
                        )
                            ? "quickView.removeFromCart"
                            : "productCard.removeFromCart"
                    )
                    : (
                        button.closest(
                            ".quick-view-layout"
                        )
                            ? "quickView.addToCart"
                            : "productCard.add"
                    );

            const fallbackText =
                isInCart
                    ? "Eliminar del carrito"
                    : "Añadir al carrito";

            const buttonText =
                typeof getTranslation ===
                "function"
                    ? (
                        getTranslation(
                            language,
                            translationKey
                        ) || fallbackText
                    )
                    : fallbackText;

            const labelKey =
                isInCart
                    ? "productCard.removeFromCartLabel"
                    : "productCard.addToCartLabel";

            const labelFallback =
                isInCart
                    ? "Eliminar {name} del carrito"
                    : "Añadir {name} al carrito";

            let accessibleLabel =
                typeof getTranslation ===
                "function"
                    ? (
                        getTranslation(
                            language,
                            labelKey
                        ) || labelFallback
                    )
                    : labelFallback;

            accessibleLabel =
                accessibleLabel.replaceAll(
                    "{name}",
                    visibleProductName
                );

            button.textContent =
                buttonText;

            button.setAttribute(
                "aria-label",
                accessibleLabel
            );

            button.title =
                buttonText;

            button.classList.toggle(
                "is-in-cart",
                isInCart
            );

            button.dataset.cartState =
                isInCart
                    ? "added"
                    : "available";

            button.disabled =
                product.stock <= 0 &&
                !isInCart;
        });
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
            getCartTranslation(
                "cart.clearedTitle",
                "Carrito vacío"
            ),
            getCartTranslation(
                "cart.emptyCheckoutMessage",
                "Añade al menos un producto antes de continuar."
            ),
            "warning"
        );

        return;
    }

    const modal =
        getCheckoutModal();

    if (!modal) {
        showCartToast(
            getCartTranslation(
                "cart.preparedTitle",
                "Compra preparada"
            ),
            getCartTranslationWithVariables(
                "cart.preparedMessage",
                "Total: {total}",
                {
                    total:
                        formatCartPrice(
                            getCartSubtotal()
                        )
                }
            ),
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
                getCartTranslation(
                    "cart.completedTitle",
                    "Compra completada"
                ),
                getCartTranslationWithVariables(
                    "cart.completedMessage",
                    "Orden {order} registrada correctamente.",
                    {
                        order: orderNumber
                    }
                ),
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
        "lenchotech:toggle-cart",
        event => {
            const productId =
                event.detail?.productId;

            if (productId) {
                toggleCartProduct(
                    productId
                );
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
    toggle: toggleCartProduct,
    has: isProductInCart,
    clear: clearCart,

    increase: increaseCartItem,
    decrease: decreaseCartItem,
    setQuantity: setCartItemQuantity,

    getItems: getDetailedCartItems,
    getItemCount: getCartItemCount,
    getSubtotal: getCartSubtotal,

    render: renderCart,

    synchronize:
        synchronizeCartProductButtons,

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

window.addEventListener(
    "lenchotech-auth-changed",
    async event => {
        authenticatedUser =
            event.detail?.user || null;

        await loadCart();

        renderCart();
        dispatchCartUpdatedEvent();
    }
);

document.addEventListener(
    "lenchotech:language-changed",
    () => {
        renderCart();
    }
);
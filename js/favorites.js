/* =========================================================
   LENCHOTECH
   SISTEMA DE FAVORITOS
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

const FAVORITES_STORAGE_KEY =
    "lenchotech-favorites";

const LeNCHoTeCHFavoritesState = {
    productIds: []
};

let authenticatedUser = null;

/* =========================================================
   2. UTILIDADES GENERALES
========================================================= */

/**
 * Devuelve la API principal de la tienda.
 *
 * @returns {object}
 */
function getFavoritesApp() {
    return window.LENCHOTECH_APP || {};
}


/**
 * Busca un producto mediante su ID.
 *
 * @param {number|string} productId
 * @returns {object|null}
 */
function getFavoriteProductById(productId) {
    const app = getFavoritesApp();

    if (
        typeof app.findProductById ===
        "function"
    ) {
        return app.findProductById(productId);
    }

    const products =
        window.LENCHOTECH_PRODUCTS;

    if (!Array.isArray(products)) {
        return null;
    }

    const normalizedId =
        Number(productId);

    return products.find(
        product =>
            Number(product.id) === normalizedId
    ) || null;
}


/**
 * Formatea un precio.
 *
 * @param {number} amount
 * @returns {string}
 */
function formatFavoritePrice(amount) {
    const app = getFavoritesApp();

    if (
        typeof app.formatPrice ===
        "function"
    ) {
        return app.formatPrice(amount);
    }

    const numericAmount =
        Number(amount);

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
function escapeFavoriteHTML(value) {
    const app = getFavoritesApp();

    if (
        typeof app.escapeHTML ===
        "function"
    ) {
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
 * Obtiene una traducción para el sistema
 * de favoritos.
 *
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
function getFavoriteTranslation(
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
 * Obtiene una traducción y reemplaza variables
 * como {stock} o {name}.
 *
 * @param {string} key
 * @param {string} fallback
 * @param {Record<string, string|number>} variables
 * @returns {string}
 */
function getFavoriteTranslationWithVariables(
    key,
    fallback,
    variables = {}
) {
    let translatedText =
        getFavoriteTranslation(
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
function showFavoriteToast(
    title,
    message,
    type = "default"
) {
    const app = getFavoritesApp();

    if (
        typeof app.showToast ===
        "function"
    ) {
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
 * Devuelve el HTML del placeholder de imagen.
 *
 * @param {string} productName
 * @returns {string}
 */
function createFavoritePlaceholder(
    productName
) {
    const app = getFavoritesApp();

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
            <span
                class="product-image-placeholder__icon"
                aria-hidden="true"
            >
                📦
            </span>

            <span
                class="product-image-placeholder__text"
            >
                Imagen no disponible
            </span>
        </div>
    `;
}


/* =========================================================
   3. ALMACENAMIENTO LOCAL
========================================================= */

/**
 * Guarda los favoritos en el navegador.
 */
function saveFavorites() {
    try {
        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(
                LeNCHoTeCHFavoritesState.productIds
            )
        );
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible guardar los favoritos.",
            error
        );
    }
}


/**
 * Carga los favoritos guardados.
 */
async function loadFavorites() {

    /*
        USUARIO CON SESIÓN:
        cargar sus favoritos privados desde Firestore.
    */

    if (authenticatedUser) {
        try {
            const favoritesSnapshot =
                await getDocs(
                    collection(
                        db,
                        "users",
                        authenticatedUser.uid,
                        "favorites"
                    )
                );

            const firestoreProductIds =
                favoritesSnapshot.docs
                    .map(favoriteDocument =>
                        Number(
                            favoriteDocument.id
                        )
                    )
                    .filter(
                        (
                            productId,
                            index,
                            array
                        ) => {
                            const product =
                                getFavoriteProductById(
                                    productId
                                );

                            return (
                                Number.isFinite(
                                    productId
                                ) &&
                                Boolean(product) &&
                                array.indexOf(
                                    productId
                                ) === index
                            );
                        }
                    );

            LeNCHoTeCHFavoritesState.productIds =
                firestoreProductIds;

            return;
        } catch (error) {
            console.error(
                "LeNCHoTeCH: no fue posible cargar los favoritos de Firestore.",
                error
            );

            LeNCHoTeCHFavoritesState.productIds =
                [];

            return;
        }
    }


    /*
        INVITADO:
        cargar favoritos temporales desde localStorage.
    */

    try {
        const storedFavorites =
            localStorage.getItem(
                FAVORITES_STORAGE_KEY
            );

        if (!storedFavorites) {
            LeNCHoTeCHFavoritesState.productIds =
                [];

            return;
        }

        const parsedFavorites =
            JSON.parse(storedFavorites);

        if (!Array.isArray(parsedFavorites)) {
            LeNCHoTeCHFavoritesState.productIds =
                [];

            return;
        }

        LeNCHoTeCHFavoritesState.productIds =
            parsedFavorites
                .map(productId =>
                    Number(productId)
                )
                .filter(
                    (
                        productId,
                        index,
                        array
                    ) => {
                        const product =
                            getFavoriteProductById(
                                productId
                            );

                        return (
                            Number.isFinite(
                                productId
                            ) &&
                            Boolean(product) &&
                            array.indexOf(
                                productId
                            ) === index
                        );
                    }
                );

        saveFavorites();
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible cargar los favoritos locales.",
            error
        );

        LeNCHoTeCHFavoritesState.productIds =
            [];
    }
}

/**
 * Guarda un producto favorito en Firestore.
 *
 * @param {number} productId
 */
async function saveFavoriteToFirestore(
    productId
) {
    if (!authenticatedUser) {
        return;
    }

    try {
        await setDoc(
            doc(
                db,
                "users",
                authenticatedUser.uid,
                "favorites",
                String(productId)
            ),
            {
                productId,
                addedAt: serverTimestamp()
            }
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no fue posible guardar el favorito en Firestore.",
            error
        );

        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.saveErrorTitle",
                "Error al guardar"
            ),
            getFavoriteTranslation(
                "favorites.saveErrorMessage",
                "El favorito se mostró en la página, pero no pudo sincronizarse con tu cuenta."
            ),
            "danger"
        );
    }
}


/**
 * Elimina un producto favorito de Firestore.
 *
 * @param {number} productId
 */
async function deleteFavoriteFromFirestore(
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
                "favorites",
                String(productId)
            )
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no fue posible eliminar el favorito de Firestore.",
            error
        );

        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.syncErrorTitle",
                "Error al sincronizar"
            ),
            getFavoriteTranslation(
                "favorites.deleteSyncErrorMessage",
                "El favorito se eliminó de la pantalla, pero no pudo borrarse de tu cuenta."
            ),
            "danger"
        );
    }
}


/**
 * Elimina todos los favoritos del usuario en Firestore.
 */
async function clearFirestoreFavorites() {
    if (!authenticatedUser) {
        return;
    }

    try {
        const favoritesSnapshot =
            await getDocs(
                collection(
                    db,
                    "users",
                    authenticatedUser.uid,
                    "favorites"
                )
            );

        await Promise.all(
            favoritesSnapshot.docs.map(
                favoriteDocument =>
                    deleteDoc(
                        favoriteDocument.ref
                    )
            )
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no fue posible vaciar los favoritos de Firestore.",
            error
        );

        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.syncErrorTitle",
                "Error al sincronizar"
            ),
            getFavoriteTranslation(
                "favorites.clearSyncErrorMessage",
                "La lista se vació en la pantalla, pero no pudo actualizarse completamente en tu cuenta."
            ),
            "danger"
        );
    }
}

/* =========================================================
   4. SELECTORES DEL DOM
========================================================= */

/**
 * Obtiene el contenedor de productos favoritos.
 *
 * @returns {HTMLElement|null}
 */
function getFavoritesItemsContainer() {
    return document.querySelector(
        "#favorites-items, " +
        ".favorites-items, " +
        "[data-favorites-items]"
    );
}

/**
 * Obtiene el pie del panel de favoritos.
 *
 * @returns {HTMLElement|null}
 */
function getFavoritesFooter() {
    return document.querySelector(
        "#favorites-footer, " +
        "[data-favorites-footer]"
    );
}


/**
 * Obtiene el contador del encabezado.
 *
 * @returns {HTMLElement|null}
 */
function getFavoritesCounter() {
    return document.querySelector(
        "#favorites-count, " +
        "#favorite-count, " +
        "[data-favorites-count]"
    );
}


/**
 * Obtiene todos los botones que controlan favoritos.
 *
 * @returns {HTMLElement[]}
 */
function getAllFavoriteButtons() {
    return Array.from(
        document.querySelectorAll(
            "[data-favorite-button], " +
            "[data-action='favorite'], " +
            "[data-action='toggle-favorite'], " +
            "[data-product-favorite], " +
            ".favorite-button"
        )
    );
}


/* =========================================================
   5. INFORMACIÓN DE FAVORITOS
========================================================= */

/**
 * Comprueba si un producto está en favoritos.
 *
 * @param {number|string} productId
 * @returns {boolean}
 */
function isFavorite(productId) {
    const normalizedId =
        Number(productId);

    return LeNCHoTeCHFavoritesState
        .productIds
        .includes(normalizedId);
}


/**
 * Devuelve la cantidad de favoritos.
 *
 * @returns {number}
 */
function getFavoritesCount() {
    return LeNCHoTeCHFavoritesState
        .productIds
        .length;
}


/**
 * Devuelve los productos favoritos completos.
 *
 * @returns {object[]}
 */
function getFavoriteProducts() {
    return LeNCHoTeCHFavoritesState
        .productIds
        .map(productId =>
            getFavoriteProductById(productId)
        )
        .filter(Boolean);
}


/* =========================================================
   6. AÑADIR FAVORITOS
========================================================= */

/**
 * Añade un producto a favoritos.
 *
 * @param {number|string} productId
 * @param {boolean} showMessage
 * @returns {boolean}
 */
function addFavorite(
    productId,
    showMessage = true
) {
    const product =
        getFavoriteProductById(productId);

    if (!product) {
        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.productNotFoundTitle",
                "Producto no encontrado"
            ),
            getFavoriteTranslation(
                "favorites.favoriteNotFoundMessage",
                "No fue posible añadir este producto a favoritos."
            ),
            "danger"
        );

        return false;
    }

    if (isFavorite(product.id)) {
        return false;
    }

    LeNCHoTeCHFavoritesState
        .productIds
        .push(product.id);

    if (authenticatedUser) {
        saveFavoriteToFirestore(product.id);
    } else {
        saveFavorites();
    }

    renderFavorites();
    dispatchFavoritesUpdatedEvent();

    if (showMessage) {
        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.addedTitle",
                "Añadido a favoritos"
            ),
            getFavoriteTranslationWithVariables(
                "favorites.addedMessage",
                "{name} se guardó en tu lista.",
                {
                    name:
                        getFavoritesApp()
                            .getTranslatedProductName?.(
                                product
                            ) ||
                        product.name
                }
            ),
            "success"
        );
    }

    return true;
}


/* =========================================================
   7. ELIMINAR FAVORITOS
========================================================= */

/**
 * Elimina un producto de favoritos.
 *
 * @param {number|string} productId
 * @param {boolean} showMessage
 * @returns {boolean}
 */
function removeFavorite(
    productId,
    showMessage = true
) {
    const normalizedId =
        Number(productId);

    const product =
        getFavoriteProductById(
            normalizedId
        );

    const originalLength =
        LeNCHoTeCHFavoritesState
            .productIds
            .length;

    LeNCHoTeCHFavoritesState.productIds =
        LeNCHoTeCHFavoritesState
            .productIds
            .filter(
                storedId =>
                    storedId !== normalizedId
            );

    if (
        originalLength ===
        LeNCHoTeCHFavoritesState
            .productIds
            .length
    ) {
        return false;
    }

    if (authenticatedUser) {
        deleteFavoriteFromFirestore(
            normalizedId
        );
    } else {
        saveFavorites();
    }

    renderFavorites();
    dispatchFavoritesUpdatedEvent();

    if (showMessage) {
        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.removedTitle",
                "Eliminado de favoritos"
            ),
            product
                ? getFavoriteTranslationWithVariables(
                    "favorites.removedMessage",
                    "{name} se eliminó de tu lista.",
                    {
                        name:
                            getFavoritesApp()
                                .getTranslatedProductName?.(
                                    product
                                ) ||
                            product.name
                    }
                )
                : getFavoriteTranslation(
                    "favorites.removedGenericMessage",
                    "El producto se eliminó de favoritos."
                ),
            "default"
        );
    }

    return true;
}


/**
 * Vacía toda la lista de favoritos.
 *
 * @param {boolean} showMessage
 */
function clearFavorites(
    showMessage = true
) {
    if (
        LeNCHoTeCHFavoritesState
            .productIds
            .length === 0
    ) {
        return;
    }

    LeNCHoTeCHFavoritesState.productIds =
        [];

    if (authenticatedUser) {
        clearFirestoreFavorites();
    } else {
        saveFavorites();
    }

    renderFavorites();
    dispatchFavoritesUpdatedEvent();

    if (showMessage) {
        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.clearedTitle",
                "Favoritos eliminados"
            ),
            getFavoriteTranslation(
                "favorites.clearedMessage",
                "La lista de favoritos quedó vacía."
            ),
            "default"
        );
    }
}


/* =========================================================
   8. ALTERNAR FAVORITOS
========================================================= */

/**
 * Añade o elimina un favorito.
 *
 * @param {number|string} productId
 * @returns {boolean}
 */
function toggleFavorite(productId) {
    const normalizedId =
        Number(productId);

    if (isFavorite(normalizedId)) {
        removeFavorite(normalizedId);

        return false;
    }

    addFavorite(normalizedId);

    return true;
}


/* =========================================================
   9. CREACIÓN DEL HTML
========================================================= */

/**
 * Genera el HTML de un producto favorito.
 *
 * @param {object} product
 * @returns {string}
 */
function createFavoriteItemHTML(product) {
    const app =
        getFavoritesApp();

    const visibleProductName =
        typeof app.getTranslatedProductName ===
        "function"
            ? app.getTranslatedProductName(
                product
            )
            : product.name;
            
    const stockText =
        Number(product.stock) > 0
            ? getFavoriteTranslationWithVariables(
                "favorites.availableStock",
                "{stock} disponibles",
                {
                    stock: product.stock
                }
            )
            : getFavoriteTranslation(
                "favorites.outOfStock",
                "Producto agotado"
            );

    const stockClass =
        Number(product.stock) > 0
            ? "is-in-stock"
            : "is-out-of-stock";

    const addToCartDisabled =
        Number(product.stock) <= 0
            ? "disabled"
            : "";

    return `
        <article
            class="drawer-item favorite-item"
            data-favorite-product-id="${product.id}"
        >
            <div
                class="drawer-item__image-wrapper"
            >
                <img
                    class="drawer-item__image favorite-item__image"
                    src="${escapeFavoriteHTML(product.image)}"
                    alt="${escapeFavoriteHTML(
                        visibleProductName
                    )}"
                    data-product-name="${escapeFavoriteHTML(
                        visibleProductName
                    )}"
                    loading="lazy"
                >
            </div>

            <div class="drawer-item__content">
                <span class="drawer-item__category">
                    ${escapeFavoriteHTML(product.brand)}
                </span>

                <h3 class="drawer-item__title">
                    ${escapeFavoriteHTML(
                        visibleProductName
                    )}
                </h3>

                <strong class="favorite-item__price">
                    ${formatFavoritePrice(product.price)}
                </strong>

                <span
                    class="favorite-item__stock ${stockClass}"
                >
                    ${escapeFavoriteHTML(stockText)}
                </span>

                <div class="favorite-item__actions">
                    <button
                        type="button"
                        class="primary-button favorite-item__cart-button"
                        data-favorites-action="add-to-cart"
                        data-product-id="${product.id}"
                        ${addToCartDisabled}
                    >
                        ${escapeFavoriteHTML(
                            getFavoriteTranslation(
                                "favorites.addToCart",
                                "Añadir al carrito"
                            )
                        )}
                    </button>

                    <button
                        type="button"
                        class="secondary-button favorite-item__view-button"
                        data-favorites-action="quick-view"
                        data-product-id="${product.id}"
                    >
                        ${escapeFavoriteHTML(
                            getFavoriteTranslation(
                                "favorites.quickView",
                                "Vista rápida"
                            )
                        )}
                    </button>
                </div>
            </div>

            <div class="drawer-item__aside">
                <button
                    type="button"
                    class="drawer-item__remove"
                    data-favorites-action="remove"
                    data-product-id="${product.id}"
                    aria-label="${escapeFavoriteHTML(
                        getFavoriteTranslationWithVariables(
                            "favorites.removeLabel",
                            "Eliminar {name} de favoritos",
                            {
                                name: visibleProductName
                            }
                        )
                    )}"
                    title="${escapeFavoriteHTML(
                        getFavoriteTranslation(
                            "favorites.removeTitle",
                            "Eliminar de favoritos"
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
 * Genera el estado vacío.
 *
 * @returns {string}
 */
function createEmptyFavoritesHTML() {
    return `
        <div class="empty-state favorites-empty-state">
            <span
                class="empty-state__icon"
                aria-hidden="true"
            >
                ♡
            </span>

            <h3>
                ${escapeFavoriteHTML(
                    getFavoriteTranslation(
                        "favorites.emptyTitle",
                        "No tienes favoritos"
                    )
                )}
            </h3>

            <p>
                ${escapeFavoriteHTML(
                    getFavoriteTranslation(
                        "favorites.emptyDescription",
                        "Guarda los productos que más te interesen para encontrarlos rápidamente."
                    )
                )}
            </p>

            <button
                type="button"
                class="primary-button"
                data-favorites-action="continue-shopping"
            >
                ${escapeFavoriteHTML(
                    getFavoriteTranslation(
                        "favorites.exploreProducts",
                        "Explorar productos"
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
 * Dibuja el contenido del panel de favoritos.
 */
function renderFavorites() {
    const container =
        getFavoritesItemsContainer();

    const products =
        getFavoriteProducts();

    if (container) {
        if (products.length === 0) {
            container.innerHTML =
                createEmptyFavoritesHTML();
        } else {
            container.innerHTML =
                products
                    .map(
                        createFavoriteItemHTML
                    )
                    .join("");
        }
    }

    const footer =
        getFavoritesFooter();

    if (footer) {
        footer.hidden =
            products.length === 0;
    }

    updateFavoritesCounter();
    synchronizeFavoriteButtons();
}


/**
 * Actualiza el contador del encabezado.
 */
function updateFavoritesCounter() {
    const counter =
        getFavoritesCounter();

    if (!counter) {
        return;
    }

    const count =
        getFavoritesCount();

    counter.textContent =
        String(count);

    counter.hidden =
        count === 0;

    counter.setAttribute(
        "aria-label",
        count === 1
            ? getFavoriteTranslation(
                "favorites.counterSingle",
                "1 producto favorito"
            )
            : getFavoriteTranslationWithVariables(
                "favorites.counterPlural",
                "{count} productos favoritos",
                {
                    count
                }
            )
    );
}


/* =========================================================
   11. SINCRONIZACIÓN DE BOTONES
========================================================= */

/**
 * Obtiene el ID de producto asociado a un botón.
 *
 * @param {HTMLElement} button
 * @returns {number|null}
 */
function getFavoriteButtonProductId(button) {
    const possibleValues = [
        button.dataset.productId,
        button.dataset.favoriteProductId,
        button.dataset.productFavorite,
        button.closest(
            "[data-product-id]"
        )?.dataset.productId,
        button.closest(
            "[data-product-card]"
        )?.dataset.productId
    ];

    const matchedValue =
        possibleValues.find(
            value =>
                value !== undefined &&
                value !== null &&
                value !== ""
        );

    const numericId =
        Number(matchedValue);

    return Number.isFinite(numericId)
        ? numericId
        : null;
}


/**
 * Actualiza visualmente un botón de favorito.
 *
 * @param {HTMLElement} button
 * @param {boolean} active
 */
function updateFavoriteButtonState(
    button,
    active
) {
    button.classList.toggle(
        "is-favorite",
        active
    );

    button.classList.toggle(
        "is-active",
        active
    );

    button.setAttribute(
        "aria-pressed",
        String(active)
    );

    const productId =
        getFavoriteButtonProductId(button);

    const product =
        productId !== null
            ? getFavoriteProductById(productId)
            : null;

    const productName =
        product?.name ||
        getFavoriteTranslation(
            "favorites.genericProduct",
            "este producto"
        );

    button.setAttribute(
        "aria-label",
        active
            ? getFavoriteTranslationWithVariables(
                "favorites.removeLabel",
                "Eliminar {name} de favoritos",
                {
                    name: productName
                }
            )
            : getFavoriteTranslationWithVariables(
                "favorites.addLabel",
                "Añadir {name} a favoritos",
                {
                    name: productName
                }
            )
    );

    button.setAttribute(
        "title",
        active
            ? getFavoriteTranslation(
                "favorites.removeTitle",
                "Eliminar de favoritos"
            )
            : getFavoriteTranslation(
                "favorites.addTitle",
                "Añadir a favoritos"
            )
    );

    const icon =
        button.querySelector(
            "[data-favorite-icon], " +
            ".favorite-button__icon, " +
            ".product-card__favorite-icon"
        );

    if (icon) {
        icon.textContent =
            active ? "♥" : "♡";
    }

    const text =
        button.querySelector(
            "[data-favorite-text]"
        );

    if (text) {
        const isQuickViewButton =
            Boolean(
                button.closest(
                    "#quick-view-modal"
                )
            );

        if (isQuickViewButton) {
            text.textContent =
                active
                    ? getFavoriteTranslation(
                        "quickView.favoriteActive",
                        "Eliminar de favoritos"
                    )
                    : getFavoriteTranslation(
                        "quickView.favorite",
                        "Favorito"
                    );

            return;
        }

        text.textContent =
            active
                ? getFavoriteTranslation(
                    "favorites.saved",
                    "Guardado"
                )
                : getFavoriteTranslation(
                    "favorites.favorite",
                    "Favorito"
                );
    }
}


/**
 * Sincroniza todos los botones de favoritos.
 */
function synchronizeFavoriteButtons() {
    const buttons =
        getAllFavoriteButtons();

    buttons.forEach(button => {
        const productId =
            getFavoriteButtonProductId(button);

        if (productId === null) {
            return;
        }

        updateFavoriteButtonState(
            button,
            isFavorite(productId)
        );
    });
}


/* =========================================================
   12. INTEGRACIÓN CON EL CARRITO
========================================================= */

/**
 * Añade un favorito al carrito.
 *
 * @param {number|string} productId
 */
function addFavoriteToCart(productId) {
    const product =
        getFavoriteProductById(productId);

    if (!product) {
        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.productNotFoundTitle",
                "Producto no encontrado"
            ),
            getFavoriteTranslation(
                "favorites.cartNotFoundMessage",
                "No fue posible añadir el producto al carrito."
            ),
            "danger"
        );

        return;
    }

    if (Number(product.stock) <= 0) {
        showFavoriteToast(
            getFavoriteTranslation(
                "favorites.outOfStockTitle",
                "Producto agotado"
            ),
            getFavoriteTranslationWithVariables(
                "favorites.outOfStockMessage",
                "{name} no está disponible actualmente.",
                {
                    name:
                        getFavoritesApp()
                            .getTranslatedProductName?.(
                                product
                            ) ||
                        product.name
                }
            ),
            "warning"
        );

        return;
    }

    if (
        window.LENCHOTECH_CART &&
        typeof window.LENCHOTECH_CART.add ===
            "function"
    ) {
        window.LENCHOTECH_CART.add(
            product.id
        );

        return;
    }

    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:add-to-cart",
            {
                detail: {
                    productId:
                        product.id
                }
            }
        )
    );
}


/* =========================================================
   13. VISTA RÁPIDA
========================================================= */

/**
 * Abre la vista rápida de un producto.
 *
 * @param {number|string} productId
 */
function openFavoriteQuickView(productId) {
    const app =
        getFavoritesApp();

    if (
        typeof app.openQuickView ===
        "function"
    ) {
        app.openQuickView(productId);

        return;
    }

    if (
        typeof app.showQuickView ===
        "function"
    ) {
        app.showQuickView(productId);

        return;
    }

    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:open-quick-view",
            {
                detail: {
                    productId:
                        Number(productId)
                }
            }
        )
    );
}


/* =========================================================
   14. EVENTOS PERSONALIZADOS
========================================================= */

/**
 * Informa que la lista de favoritos cambió.
 */
function dispatchFavoritesUpdatedEvent() {
    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:favorites-updated",
            {
                detail: {
                    productIds: [
                        ...LeNCHoTeCHFavoritesState
                            .productIds
                    ],
                    products:
                        getFavoriteProducts(),
                    count:
                        getFavoritesCount()
                }
            }
        )
    );
}


/* =========================================================
   15. ACCIONES DEL PANEL
========================================================= */

/**
 * Procesa una acción del panel de favoritos.
 *
 * @param {HTMLElement} actionElement
 */
function handleFavoritesAction(
    actionElement
) {
    const action =
        actionElement.dataset
            .favoritesAction;

    const productId =
        actionElement.dataset.productId;

    if (action === "remove") {
        removeFavorite(productId);

        return;
    }

    if (action === "add-to-cart") {
        addFavoriteToCart(productId);

        return;
    }

    if (action === "quick-view") {
        openFavoriteQuickView(productId);

        return;
    }

    if (action === "clear") {
        clearFavorites();

        return;
    }

    if (
        action ===
        "continue-shopping"
    ) {
        const app =
            getFavoritesApp();

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
        } else {
            document
                .querySelector(
                    "#catalog, " +
                    "#products, " +
                    "[data-catalog]"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }
    }
}


/* =========================================================
   16. EVENTOS DEL DOCUMENTO
========================================================= */

/**
 * Inicializa los eventos de favoritos.
 */
function initializeFavoritesEvents() {
    document.addEventListener(
        "lenchotech:toggle-favorite",
        event => {
            const productId =
                event.detail?.productId;

            if (
                productId !== undefined &&
                productId !== null
            ) {
                toggleFavorite(productId);
            }
        }
    );

    document.addEventListener(
        "click",
        event => {
            const target =
                event.target;

            if (
                !(
                    target instanceof
                    Element
                )
            ) {
                return;
            }

            const favoritesAction =
                target.closest(
                    "[data-favorites-action]"
                );

            if (favoritesAction) {
                handleFavoritesAction(
                    favoritesAction
                );
    
            }

            
        }
    );

    document.addEventListener(
        "lenchotech:products-rendered",
        () => {
            synchronizeFavoriteButtons();
        }
    );

    document.addEventListener(
        "lenchotech:catalog-rendered",
        () => {
            synchronizeFavoriteButtons();
        }
    );

    document.addEventListener(
        "lenchotech:quick-view-opened",
        () => {
            synchronizeFavoriteButtons();
        }
    );
}


/* =========================================================
   17. OBSERVADOR DEL CATÁLOGO
========================================================= */

/**
 * Observa cambios en el catálogo para sincronizar corazones.
 */
function initializeFavoritesObserver() {
    const catalog =
        document.querySelector(
            "#product-grid, " +
            ".product-grid, " +
            "[data-product-grid]"
        );

    if (!catalog) {
        return;
    }

    let synchronizationPending =
        false;

    const observer =
        new MutationObserver(() => {
            if (synchronizationPending) {
                return;
            }

            synchronizationPending =
                true;

            window.requestAnimationFrame(
                () => {
                    synchronizeFavoriteButtons();

                    synchronizationPending =
                        false;
                }
            );
        });

    observer.observe(
        catalog,
        {
            childList: true,
            subtree: true
        }
    );
}


/* =========================================================
   18. IMÁGENES FALTANTES
========================================================= */

/**
 * Activa el placeholder cuando una imagen no existe.
 */
function initializeFavoriteImageFallbacks() {
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
                    ".favorite-item__image"
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
                createFavoritePlaceholder(
                    image.dataset.productName ||
                    image.alt ||
                    "Producto"
                );
        },
        true
    );
}


/* =========================================================
   19. INICIALIZACIÓN
========================================================= */

/**
 * Inicializa el módulo de favoritos.
 */
function initializeFavorites() {
    loadFavorites();
    initializeFavoritesEvents();
    initializeFavoritesObserver();
    initializeFavoriteImageFallbacks();
    renderFavorites();

    console.log(
        `LeNCHoTeCH Favorites iniciado con ${
            getFavoritesCount()
        } productos.`
    );
}


/* =========================================================
   20. API GLOBAL
========================================================= */

window.LENCHOTECH_FAVORITES = {
    state:
        LeNCHoTeCHFavoritesState,

    add:
        addFavorite,

    remove:
        removeFavorite,

    toggle:
        toggleFavorite,

    clear:
        clearFavorites,

    has:
        isFavorite,

    getIds() {
        return [
            ...LeNCHoTeCHFavoritesState
                .productIds
        ];
    },

    getProducts:
        getFavoriteProducts,

    getCount:
        getFavoritesCount,

    render:
        renderFavorites,

    synchronize:
        synchronizeFavoriteButtons
};


/* =========================================================
   21. EJECUCIÓN
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeFavorites
    );
} else {
    initializeFavorites();
}

window.addEventListener(
    "lenchotech-auth-changed",
    async event => {
        authenticatedUser =
            event.detail?.user || null;

        await loadFavorites();

        renderFavorites();
        synchronizeFavoriteButtons();
    }
);

document.addEventListener(
    "lenchotech:language-changed",
    () => {
        renderFavorites();
        synchronizeFavoriteButtons();
    }
);
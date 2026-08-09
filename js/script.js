/* =========================================================
   LENCHOTECH
   MOTOR PRINCIPAL DE LA TIENDA
========================================================= */

"use strict";


/* =========================================================
   1. ESTADO PRINCIPAL
========================================================= */

const LeNCHoTeCHState = {
    products: [],
    filteredProducts: [],

    filters: {
        search: "",
        category: "all",
        subcategories: [],
        brands: [],
        availability: "all",
        maxPrice: Infinity,
        offersOnly: false
    },

    sort: "featured",
    activeModal: null,
    activeDrawer: null,
    quickViewProductId: null
};


/* =========================================================
   2. SELECTORES GENERALES
========================================================= */

const DOM = {};


/**
 * Busca un elemento usando varios selectores posibles.
 *
 * Esto hace que el proyecto sea más resistente si se cambia
 * ligeramente algún ID o clase en el HTML.
 *
 * @param {...string} selectors
 * @returns {HTMLElement|null}
 */
function selectFirst(...selectors) {
    for (const selector of selectors) {
        const element = document.querySelector(selector);

        if (element) {
            return element;
        }
    }

    return null;
}


/**
 * Guarda los elementos principales del documento.
 */
function cacheDOMElements() {
    DOM.body = document.body;

    DOM.productsGrid = selectFirst(
        "#products-grid",
        ".products-grid",
        "[data-products-grid]"
    );

    DOM.emptyState = selectFirst(
        "#products-empty-state",
        "#empty-state",
        ".empty-state"
    );

    DOM.emptyStateResetButton = selectFirst(
        "#empty-state-reset-button"
    );

    DOM.resultsText = selectFirst(
        "#results-text",
        "#product-results-text",
        ".results-text"
    );

    DOM.sortSelect = selectFirst(
        "#sort-select",
        "#product-sort",
        "[data-sort-products]"
    );

    DOM.searchForm = selectFirst(
        "#search-form",
        ".search-box"
    );

    DOM.searchInput = selectFirst(
        "#search-input",
        ".search-box__input",
        "[data-search-input]"
    );

    DOM.searchClearButton = selectFirst(
        "#search-clear-button",
        ".search-box__clear",
        "[data-clear-search]"
    );

    DOM.searchSuggestions = selectFirst(
        "#search-suggestions",
        ".search-suggestions"
    );

    DOM.themeButton = selectFirst(
        "#theme-toggle",
        "#theme-button",
        "[data-theme-toggle]"
    );

    DOM.languageButton = selectFirst(
        "#language-button"
    );

    DOM.languageMenu = selectFirst(
        "#language-menu"
    );

    DOM.languageLabel = selectFirst(
        "#language-button-label"
    );

    DOM.languageOptions = [
        ...document.querySelectorAll(
            ".language-menu__option"
        )
    ];

    DOM.themeIcon = selectFirst(
        "#theme-icon",
        "[data-theme-icon]"
    );

    DOM.mobileMenuButton = selectFirst(
        "#mobile-menu-button",
        ".mobile-menu-button"
    );

    DOM.navigationMenu = selectFirst(
        "#navigation-menu",
        ".navigation-menu"
    );

    DOM.categoriesDropdown = selectFirst(
        "#categories-dropdown",
        ".navigation-dropdown"
    );

    DOM.categoriesDropdownButton = DOM.categoriesDropdown
        ? DOM.categoriesDropdown.querySelector(
            ".navigation-dropdown__button, [data-dropdown-toggle]"
        )
        : null;

    DOM.filtersSidebar = selectFirst(
        "#filters-sidebar",
        ".filters-sidebar"
    );

    DOM.openFiltersButton = selectFirst(
        "#open-filters-button",
        ".filter-mobile-button"
    );

    DOM.closeFiltersButton = selectFirst(
        "#close-filters-button",
        ".filters-sidebar .close-button"
    );

    DOM.clearFiltersButton = selectFirst(
        "#reset-filters-button",
        "#clear-filters-button",
        "[data-clear-filters]"
    );

    DOM.activeFilters = selectFirst(
        "#active-filters",
        ".active-filters"
    );

    DOM.categoryFilterContainer = selectFirst(
        "#category-filter-options",
        "#category-filters",
        "[data-category-filters]"
    );

    DOM.subcategoryFilterContainer = selectFirst(
        "#subcategory-filter-options",
        "#subcategory-filters",
        "[data-subcategory-filters]"
    );

    DOM.brandFilterContainer = selectFirst(
        "#brand-filter-options",
        "#brand-filters",
        "[data-brand-filters]"
    );

    DOM.inStockFilter = selectFirst(
        "#in-stock-filter"
    );

    DOM.priceRange = selectFirst(
        "#price-range",
        "#maximum-price",
        "[data-price-range]"
    );

    DOM.priceValue = selectFirst(
        "#price-range-value",
        "#maximum-price-value",
        "[data-price-value]"
    );

    DOM.drawerOverlay = selectFirst(
        "#drawer-overlay",
        ".drawer-overlay"
    );

    DOM.cartDrawer = selectFirst(
        "#cart-drawer",
        "[data-cart-drawer]"
    );

    DOM.favoritesDrawer = selectFirst(
        "#favorites-drawer",
        "[data-favorites-drawer]"
    );

    DOM.openCartButton = selectFirst(
        "#cart-button",
        "#open-cart-button",
        "[data-open-cart]"
    );

    DOM.openFavoritesButton = selectFirst(
        "#favorites-button",
        "#open-favorites-button",
        "[data-open-favorites]"
    );

    DOM.quickViewModal = selectFirst(
        "#quick-view-modal",
        "[data-quick-view-modal]"
    );

    DOM.quickViewContent = selectFirst(
        "#quick-view-content",
        "[data-quick-view-content]"
    );

    DOM.compareModal = selectFirst(
        "#compare-modal",
        "[data-compare-modal]"
    );

    DOM.checkoutModal = selectFirst(
        "#checkout-modal",
        "[data-checkout-modal]"
    );

    DOM.toastContainer = selectFirst(
        "#toast-container",
        ".toast-container"
    );

    DOM.backToTopButton = selectFirst(
        "#back-to-top-button",
        ".back-to-top-button"
    );

    DOM.footerBackToTopLink = selectFirst(
        "#footer-back-to-top-link"
    );

    DOM.logoImage = selectFirst(
        "#brand-logo",
        ".brand__logo"
    );

    DOM.logoFallback = selectFirst(
        "#brand-logo-fallback",
        ".brand__fallback"
    );

    DOM.currentYear = selectFirst(
        "#current-year",
        "[data-current-year]"
    );

    DOM.offersButton = selectFirst(
        "#offers-navigation-button"
    );

    DOM.footerOffersButton = selectFirst(
        "#footer-offers-button"
    );
}


/* =========================================================
   3. UTILIDADES
========================================================= */

/**
 * Obtiene las utilidades declaradas en products.js.
 *
 * @returns {object}
 */
function getProductUtils() {
    return window.LENCHOTECH_PRODUCT_UTILS || {};
}


/**
 * Convierte texto a un formato seguro para HTML.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/**
 * Formatea un precio.
 *
 * @param {number} amount
 * @returns {string}
 */
function formatProductPrice(amount) {
    const utils = getProductUtils();

    if (typeof utils.formatPrice === "function") {
        return utils.formatPrice(amount);
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
 * Normaliza texto para comparaciones y búsquedas.
 *
 * @param {unknown} value
 * @returns {string}
 */
function normalizeText(value) {
    const utils = getProductUtils();

    if (typeof utils.normalizeProductText === "function") {
        return utils.normalizeProductText(value);
    }

    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


/**
 * Busca un producto por ID.
 *
 * @param {number|string} productId
 * @returns {object|null}
 */
function findProductById(productId) {
    const utils = getProductUtils();

    if (typeof utils.getProductById === "function") {
        return utils.getProductById(productId);
    }

    const normalizedId = Number(productId);

    return LeNCHoTeCHState.products.find(
        product => product.id === normalizedId
    ) || null;
}


/**
 * Devuelve el texto completo usado para buscar un producto.
 *
 * @param {object} product
 * @returns {string}
 */
function getSearchableProductText(product) {
    const utils =
        getProductUtils();

    const originalSearchText =
        typeof utils
            .getProductSearchText ===
            "function"
            ? utils.getProductSearchText(
                product
            )
            : "";

    const translatedSpecifications =
        Object.entries(
            product.specifications || {}
        )
            .map(
                ([key, value]) =>
                    `${
                        getTranslatedSpecificationName(
                            key
                        )
                    } ${
                        getTranslatedSpecificationValue(
                            value
                        )
                    }`
            )
            .join(" ");

    return normalizeText(
        [
            originalSearchText,

            getTranslatedProductName(
                product
            ),

            product.brand,

            getTranslatedCategoryName(
                product.category
            ),

            getTranslatedSubcategoryName(
                product.subcategory
            ),

            getTranslatedProductDescription(
                product
            ),

            translatedSpecifications
        ].join(" ")
    );
}


/**
 * Genera un nombre seguro para usarlo como identificador.
 *
 * @param {string} value
 * @returns {string}
 */
function createSlug(value) {
    return normalizeText(value)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


/**
 * Obtiene valores únicos y los ordena.
 *
 * @param {Array<unknown>} values
 * @returns {string[]}
 */
function getUniqueSortedValues(values) {
    return [
        ...new Set(
            values
                .filter(Boolean)
                .map(value => String(value))
        )
    ].sort(
        (first, second) =>
            first.localeCompare(
                second,
                "es",
                {
                    sensitivity: "base"
                }
            )
    );
}


/* =========================================================
   4. PLACEHOLDERS DE IMÁGENES
========================================================= */

/**
 * Devuelve el HTML del placeholder de un producto.
 *
 * @param {string} productName
 * @returns {string}
 */
function createProductPlaceholderHTML(productName) {
    return `
        <div
            class="product-image-placeholder"
            role="img"
            aria-label="Imagen no disponible para ${escapeHTML(productName)}"
        >
            <span class="product-image-placeholder__logo">
                LeNCHoTeCH
            </span>

            <span
                class="product-image-placeholder__icon"
                aria-hidden="true"
            >
                📦
            </span>

            <span class="product-image-placeholder__text">
                Imagen próximamente
            </span>
        </div>
    `;
}


/**
 * Reemplaza una imagen que no pudo cargarse.
 *
 * @param {HTMLImageElement} image
 */
function replaceBrokenProductImage(image) {
    if (
        !image ||
        image.dataset.placeholderApplied === "true"
    ) {
        return;
    }

    image.dataset.placeholderApplied = "true";

    const wrapper = image.closest(
        ".product-card__image-wrapper, " +
        ".quick-view__image-wrapper, " +
        ".drawer-item__image-wrapper"
    );

    const productName =
        image.dataset.productName ||
        image.alt ||
        "Producto";

    if (wrapper) {
        wrapper.innerHTML =
            createProductPlaceholderHTML(productName);
        return;
    }

    image.hidden = true;
}


/**
 * Activa el manejo global de imágenes rotas.
 */
function initializeImageFallbacks() {
    document.addEventListener(
        "error",
        event => {
            const target = event.target;

            if (
                target instanceof HTMLImageElement &&
                target.matches(
                    ".product-card__image, " +
                    ".quick-view__image, " +
                    ".drawer-item__image"
                )
            ) {
                replaceBrokenProductImage(target);
            }
        },
        true
    );

    if (DOM.logoImage) {
        DOM.logoImage.addEventListener(
            "error",
            handleBrokenLogo,
            {
                once: true
            }
        );

        if (
            DOM.logoImage.complete &&
            DOM.logoImage.naturalWidth === 0
        ) {
            handleBrokenLogo();
        }
    }
}


/**
 * Muestra el respaldo textual del logo.
 */
function handleBrokenLogo() {
    if (DOM.logoImage) {
        DOM.logoImage.classList.add("is-hidden");
        DOM.logoImage.setAttribute("aria-hidden", "true");
    }

    if (DOM.logoFallback) {
        DOM.logoFallback.classList.add("is-visible");
        DOM.logoFallback.removeAttribute("aria-hidden");
    }
}


/* =========================================================
   5. CREACIÓN DE ESTRELLAS
========================================================= */

/**
 * Genera una representación visual de la valoración.
 *
 * @param {number} rating
 * @returns {string}
 */
function createRatingStars(rating) {
    const numericRating = Math.max(
        0,
        Math.min(5, Number(rating) || 0)
    );

    const roundedRating = Math.round(numericRating);
    const fullStars = "★".repeat(roundedRating);
    const emptyStars = "☆".repeat(5 - roundedRating);

    return `${fullStars}${emptyStars}`;
}


/* =========================================================
   6. TARJETAS DE PRODUCTOS
========================================================= */

/**
 * Genera las especificaciones rápidas.
 *
 * @param {object} product
 * @returns {string}
 */
function createQuickSpecificationsHTML(product) {
    const utils = getProductUtils();

    const specifications =
        typeof utils.getQuickSpecifications === "function"
            ? utils.getQuickSpecifications(product, 4)
            : Object.entries(
                product.specifications || {}
            ).slice(0, 4);

    return specifications
        .map(
            ([label, value]) => `
                <div class="quick-spec">
                    <span class="quick-spec__label">
                        ${escapeHTML(
                            getTranslatedSpecificationName(
                                label
                            )
                        )}
                    </span>

                    <strong class="quick-spec__value">
                        ${escapeHTML(
                            getTranslatedSpecificationValue(
                                value
                            )
                        )}
                    </strong>
                </div>
            `
        )
        .join("");
}


/**
 * Genera el texto de existencia.
 *
 * @param {object} product
 * @returns {{className: string, text: string}}
 */
function getStockInformation(product) {
    const stock =
        Number(product.stock) || 0;

    if (stock <= 0) {
        return {
            className:
                "product-card__stock--out",

            text:
                getAppTranslation(
                    "productCard.outOfStock",
                    "Producto agotado"
                )
        };
    }

    if (stock <= 5) {
        return {
            className:
                "product-card__stock--low",

            text:
                getAppTranslationWithVariables(
                    "productCard.lowStock",
                    "Solo quedan {stock}",
                    {
                        stock
                    }
                )
        };
    }

    return {
        className: "",

        text:
            getAppTranslationWithVariables(
                "productCard.availableStock",
                "{stock} disponibles",
                {
                    stock
                }
            )
    };
}


/**
 * Crea el HTML de una tarjeta.
 *
 * @param {object} product
 * @returns {string}
 */
function createProductCardHTML(product) {
    const stockInformation =
        getStockInformation(product);

    const visibleProductName =
        getTranslatedProductName(product);

    const visibleProductDescription =
        getTranslatedProductDescription(
            product
        );

    const visibleProductBadge =
        getTranslatedProductBadge(product);

    const hasOldPrice =
        Number(product.oldPrice) >
        Number(product.price);

    const badgeHTML = visibleProductBadge
        ? `
            <span
                class="product-card__badge ${
                    product.badgeType
                        ? `product-card__badge--${escapeHTML(
                            product.badgeType
                        )}`
                        : ""
                }"
            >
                ${escapeHTML(visibleProductBadge)}
            </span>
        `
        : "";

    const oldPriceHTML = hasOldPrice
        ? `
            <span class="product-card__old-price">
                ${formatProductPrice(product.oldPrice)}
            </span>
        `
        : "";

    const imageAlternative =
        getAppTranslationWithVariables(
            "productCard.imageAlternative",
            "{name} de la marca {brand}",
            {
                name: visibleProductName,
                brand: product.brand
            }
        );

    return `
        <article
            class="product-card is-entering"
            data-product-id="${product.id}"
            data-category="${escapeHTML(product.category)}"
            data-subcategory="${escapeHTML(product.subcategory)}"
        >
            ${badgeHTML}

            <button
                class="product-card__favorite"
                type="button"
                data-action="toggle-favorite"
                data-product-id="${product.id}"
                aria-label="${escapeHTML(
                    getAppTranslationWithVariables(
                        "productCard.addFavoriteLabel",
                        "Agregar {name} a favoritos",
                        {
                            name: visibleProductName
                        }
                    )
                )}"
                aria-pressed="false"
                title="${escapeHTML(
                    getAppTranslation(
                        "productCard.addFavoriteTitle",
                        "Agregar a favoritos"
                    )
                )}"
            >
                ♡
            </button>

            <div class="product-card__image-wrapper">
                <img
                    class="product-card__image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(imageAlternative)}"
                    data-product-name="${escapeHTML(
                        visibleProductName
                    )}"
                    loading="lazy"
                >

                <div class="product-card__quick-specs">
                    ${createQuickSpecificationsHTML(product)}
                </div>
            </div>

            <div class="product-card__content">
                <span class="product-card__category">
                    ${escapeHTML(
                        getTranslatedCategoryName(
                            product.category
                        )
                    )}
                    ·
                    ${escapeHTML(
                        getTranslatedSubcategoryName(
                            product.subcategory
                        )
                    )}
                </span>

                <h3 class="product-card__name">
                    ${escapeHTML(
                        visibleProductName
                    )}
                </h3>

                <p class="product-card__description">
                    ${escapeHTML(
                        visibleProductDescription
                    )}
                </p>

                <div
                    class="product-card__rating-row"
                    aria-label="${escapeHTML(
                        getAppTranslationWithVariables(
                            "productCard.ratingLabel",
                            "Valoración de {rating} de 5",
                            {
                                rating: product.rating
                            }
                        )
                    )}"
                >
                    <span
                        class="product-card__stars"
                        aria-hidden="true"
                    >
                        ${createRatingStars(product.rating)}
                    </span>

                    <span class="product-card__reviews">
                        ${Number(product.rating).toFixed(1)}
                        (${Number(product.reviews) || 0})
                    </span>
                </div>

                <div class="product-card__price-row">
                    <span class="product-card__price">
                        ${formatProductPrice(product.price)}
                    </span>

                    ${oldPriceHTML}
                </div>

                <div
                    class="
                        product-card__stock
                        ${stockInformation.className}
                    "
                >
                    ${escapeHTML(stockInformation.text)}
                </div>

                <div class="product-card__actions">
                    <button
                        class="secondary-button"
                        type="button"
                        data-action="quick-view"
                        data-product-id="${product.id}"
                    >
                        ${escapeHTML(
                            getAppTranslation(
                                "productCard.quickView",
                                "Vista rápida"
                            )
                        )}
                    </button>

                    <button
                        class="primary-button"
                        type="button"
                        data-action="add-to-cart"
                        data-product-id="${product.id}"
                        ${product.stock <= 0 ? "disabled" : ""}
                    >
                        ${
                            product.stock <= 0
                                ? escapeHTML(
                                    getAppTranslation(
                                        "productCard.soldOut",
                                        "Agotado"
                                    )
                                )
                                : escapeHTML(
                                    getAppTranslation(
                                        "productCard.add",
                                        "Añadir"
                                    )
                                )
                        }
                    </button>
                </div>

                <label class="product-card__compare">
                    <input
                        type="checkbox"
                        data-action="toggle-compare"
                        data-product-id="${product.id}"
                    >

                    <span>
                        ${escapeHTML(
                            getAppTranslation(
                                "productCard.compare",
                                "Comparar producto"
                            )
                        )}
                    </span>
                </label>
            </div>
        </article>
    `;
}


/**
 * Dibuja el catálogo.
 *
 * @param {object[]} productList
 */
function renderProducts(productList) {
    if (!DOM.productsGrid) {
        console.error(
            "LeNCHoTeCH: no se encontró el contenedor del catálogo."
        );

        return;
    }

    DOM.productsGrid.innerHTML = "";

    if (!Array.isArray(productList) || productList.length === 0) {
        showEmptyProductState();
        updateResultsText(0);
        return;
    }

    hideEmptyProductState();

    const fragment = document.createDocumentFragment();
    const temporaryContainer = document.createElement("div");

    productList.forEach(product => {
        temporaryContainer.innerHTML =
            createProductCardHTML(product);

        const card = temporaryContainer.firstElementChild;

        if (card) {
            fragment.appendChild(card);
        }
    });

    DOM.productsGrid.appendChild(fragment);
    updateResultsText(productList.length);

    window.setTimeout(
        () => {
            DOM.productsGrid
                .querySelectorAll(".product-card.is-entering")
                .forEach(card => {
                    card.classList.remove("is-entering");
                });
        },
        600
    );

    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:products-rendered",
            {
                detail: {
                    products: productList
                }
            }
        )
    );
}


/**
 * Muestra el estado vacío.
 */
function showEmptyProductState() {
    if (DOM.productsGrid) {
        DOM.productsGrid.hidden = true;
    }

    if (DOM.emptyState) {
        DOM.emptyState.hidden = false;
    }
}


/**
 * Oculta el estado vacío.
 */
function hideEmptyProductState() {
    if (DOM.productsGrid) {
        DOM.productsGrid.hidden = false;
    }

    if (DOM.emptyState) {
        DOM.emptyState.hidden = true;
    }
}


/**
 * Actualiza la cantidad de resultados.
 *
 * @param {number} amount
 */
function updateResultsText(amount) {
    if (!DOM.resultsText) {
        return;
    }

    const total =
        LeNCHoTeCHState.products.length;

    if (amount === total) {
        DOM.resultsText.textContent =
            getAppTranslationWithVariables(
                "catalog.allProductsAvailable",
                "{total} productos disponibles",
                {
                    total
                }
            );

        return;
    }

    DOM.resultsText.textContent =
        getAppTranslationWithVariables(
            "catalog.partialProducts",
            "{amount} de {total} productos",
            {
                amount,
                total
            }
        );
}


/* =========================================================
   7. FILTROS DINÁMICOS
========================================================= */

/**
 * Cuenta los productos que coinciden con una propiedad.
 *
 * @param {string} property
 * @param {string} value
 * @returns {number}
 */
function countProductsByProperty(property, value) {
    return LeNCHoTeCHState.products.filter(
        product => String(product[property]) === String(value)
    ).length;
}


/**
 * Crea una opción de filtro.
 *
 * @param {object} configuration
 * @returns {string}
 */
function createFilterOptionHTML(configuration) {
    const {
        type,
        value,
        label,
        count,
        checked = false
    } = configuration;

    const safeValue = escapeHTML(value);
    const inputId =
        `filter-${createSlug(type)}-${createSlug(value)}`;

    return `
        <label
            class="checkbox-option"
            for="${inputId}"
        >
            <input
                id="${inputId}"
                type="${
                    type === "category"
                        ? "radio"
                        : "checkbox"
                }"
                name="filter-${escapeHTML(type)}"
                value="${safeValue}"
                data-filter-type="${escapeHTML(type)}"
                ${checked ? "checked" : ""}
            >

            <span>${escapeHTML(label)}</span>

            ${
                Number.isFinite(count)
                    ? `
                        <span class="filter-option-count">
                            ${count}
                        </span>
                    `
                    : ""
            }
        </label>
    `;
}


/**
 * Genera los filtros de categorías.
 */
function renderCategoryFilters() {
    if (!DOM.categoryFilterContainer) {
        return;
    }

    const categories = getUniqueSortedValues(
        LeNCHoTeCHState.products.map(
            product => product.category
        )
    );

    const allOption = createFilterOptionHTML({
        type: "category",
        value: "all",
        label: getAppTranslation(
            "catalog.allCategories",
            "Todas las categorías"
        ),
        count: LeNCHoTeCHState.products.length,
        checked:
            LeNCHoTeCHState.filters.category ===
            "all"
    });

    const categoryOptions = categories
        .map(
            category =>
                createFilterOptionHTML({
                    type: "category",
                    value: category,
                    label:
                        getTranslatedCategoryName(
                            category
                        ),
                    count: countProductsByProperty(
                        "category",
                        category
                    ),
                    checked:
                        LeNCHoTeCHState.filters.category ===
                        category
                })
        )
        .join("");

    DOM.categoryFilterContainer.innerHTML =
        allOption + categoryOptions;
}


/**
 * Genera los filtros de subcategorías.
 */
function renderSubcategoryFilters() {
    if (!DOM.subcategoryFilterContainer) {
        return;
    }

    const selectedCategory =
        LeNCHoTeCHState.filters.category;

    const productsForSubcategories =
        selectedCategory === "all"
            ? LeNCHoTeCHState.products
            : LeNCHoTeCHState.products.filter(
                product =>
                    product.category === selectedCategory
            );

    const subcategories = getUniqueSortedValues(
        productsForSubcategories.map(
            product => product.subcategory
        )
    );

    DOM.subcategoryFilterContainer.innerHTML =
        subcategories
            .map(subcategory => {
                const count =
                    productsForSubcategories.filter(
                        product =>
                            product.subcategory === subcategory
                    ).length;

                const checked =
                    LeNCHoTeCHState.filters.subcategories
                        .includes(subcategory);

                return createFilterOptionHTML({
                    type: "subcategory",
                    value: subcategory,
                    label:
                        getTranslatedSubcategoryName(
                            subcategory
                        ),
                    count,
                    checked
                });
            })
            .join("");

    if (subcategories.length === 0) {
        DOM.subcategoryFilterContainer.innerHTML = `
            <p class="filter-empty-message">
                ${escapeHTML(
                    getAppTranslation(
                        "catalog.noSubcategories",
                        "No hay subcategorías disponibles."
                    )
                )}
            </p>
        `;
    }
}


/**
 * Genera los filtros de marcas.
 */
function renderBrandFilters() {
    if (!DOM.brandFilterContainer) {
        return;
    }

    const brands = getUniqueSortedValues(
        LeNCHoTeCHState.products.map(
            product => product.brand
        )
    );

    DOM.brandFilterContainer.innerHTML =
        brands
            .map(
                brand =>
                    createFilterOptionHTML({
                        type: "brand",
                        value: brand,
                        label: brand,
                        count: countProductsByProperty(
                            "brand",
                            brand
                        ),
                        checked:
                            LeNCHoTeCHState.filters.brands
                                .includes(brand)
                    })
            )
            .join("");
}


/**
 * Configura el rango máximo de precios.
 */
function initializePriceFilter() {
    if (!DOM.priceRange) {
        return;
    }

    const highestPrice = Math.ceil(
        Math.max(
            ...LeNCHoTeCHState.products.map(
                product => Number(product.price) || 0
            )
        )
    );

    DOM.priceRange.min = "0";
    DOM.priceRange.max = String(highestPrice);
    DOM.priceRange.value = String(highestPrice);
    DOM.priceRange.step = "10";

    LeNCHoTeCHState.filters.maxPrice = highestPrice;

    updatePriceRangeText();
}


/**
 * Actualiza el precio que aparece junto al control.
 */
function updatePriceRangeText() {
    if (!DOM.priceRange || !DOM.priceValue) {
        return;
    }

    DOM.priceValue.textContent =
        formatProductPrice(
            Number(DOM.priceRange.value)
        );
}


/**
 * Inicializa todos los filtros.
 */
function initializeFilters() {
    renderCategoryFilters();
    renderSubcategoryFilters();
    renderBrandFilters();
    initializePriceFilter();
}


/* =========================================================
   8. APLICACIÓN DE FILTROS
========================================================= */

/**
 * Determina si un producto cumple los filtros.
 *
 * @param {object} product
 * @returns {boolean}
 */
function productMatchesFilters(product) {
    const {
        search,
        category,
        subcategories,
        brands,
        availability,
        maxPrice,
        offersOnly
    } = LeNCHoTeCHState.filters;

    if (search) {
        const searchableText =
            getSearchableProductText(product);

        const searchTerms = search
            .split(" ")
            .filter(Boolean);

        const searchableWords = searchableText
            .split(/[^a-z0-9]+/)
            .filter(Boolean);

        const matchesSearch = searchTerms.every(term => {
           /*
            * Las búsquedas cortas, como LG, HP o G5,
            * deben coincidir con una palabra completa.
            *
            * Esto evita que LG coincida accidentalmente
            * con palabras como "pulgadas".
            */
            if (term.length <= 2) {
                return searchableWords.includes(term);
            }

           /*
            * Para términos más largos se permite
            * una coincidencia parcial.
            *
            * Por ejemplo:
            * "ultra" encuentra "UltraGear".
            */
            return searchableText.includes(term);
        });

        if (!matchesSearch) {
            return false;
        }
    }

    if (
        category !== "all" &&
        product.category !== category
    ) {
        return false;
    }

    if (
        subcategories.length > 0 &&
        !subcategories.includes(product.subcategory)
    ) {
        return false;
    }

    if (
        brands.length > 0 &&
        !brands.includes(product.brand)
    ) {
        return false;
    }

    if (
        Number(product.price) >
        Number(maxPrice)
    ) {
        return false;
    }

    if (
        availability === "available" &&
        product.stock <= 0
    ) {
        return false;
    }

    if (
        offersOnly &&
        !(
            Number(product.oldPrice) >
            Number(product.price)
        )
    ) {
        return false;
    }

    return true;
}


/**
 * Ordena los productos.
 *
 * @param {object[]} productList
 * @returns {object[]}
 */
function sortProducts(productList) {
    const sortedProducts = [...productList];

    const currentLanguage =
        document.documentElement.lang === "en"
            ? "en"
            : "es";

    switch (LeNCHoTeCHState.sort) {
        case "price-asc":
            sortedProducts.sort(
                (first, second) =>
                    first.price - second.price
            );
            break;

        case "price-desc":
            sortedProducts.sort(
                (first, second) =>
                    second.price - first.price
            );
            break;

        case "rating-desc":
            sortedProducts.sort(
                (first, second) =>
                    second.rating - first.rating
            );
            break;

        case "name-asc":
            sortedProducts.sort(
                (first, second) =>
                    first.name.localeCompare(
                        second.name,
                        currentLanguage,
                        {
                            sensitivity: "base"
                        }
                    )
            );
            break;

        case "name-desc":
            sortedProducts.sort(
                (first, second) =>
                    second.name.localeCompare(
                        first.name,
                        currentLanguage,
                        {
                            sensitivity: "base"
                        }
                    )
            );
            break;

        case "featured":
        default:
            sortedProducts.sort(
                (first, second) => {
                    const featuredDifference =
                        Number(second.featured) -
                        Number(first.featured);

                    if (featuredDifference !== 0) {
                        return featuredDifference;
                    }

                    return second.rating - first.rating;
                }
            );
            break;
    }

    return sortedProducts;
}


/**
 * Filtra, ordena y dibuja los productos.
 */
function applyProductFilters() {
    const filteredProducts =
        LeNCHoTeCHState.products.filter(
            productMatchesFilters
        );

    LeNCHoTeCHState.filteredProducts =
        sortProducts(filteredProducts);

    renderProducts(
        LeNCHoTeCHState.filteredProducts
    );

    renderActiveFilters();
}


/**
 * Limpia todos los filtros.
 */
function clearAllFilters() {
    LeNCHoTeCHState.filters = {
        search: "",
        category: "all",
        subcategories: [],
        brands: [],
        availability: "all",
        maxPrice: DOM.priceRange
            ? Number(DOM.priceRange.max)
            : Infinity,
        offersOnly: false
    };

    LeNCHoTeCHState.sort = "featured";

    if (DOM.offersButton) {
        DOM.offersButton.classList.remove(
            "active"
        );
    }

    if (DOM.searchInput) {
        DOM.searchInput.value = "";
    }

    if (DOM.sortSelect) {
        DOM.sortSelect.value = "featured";
    }

    if (DOM.inStockFilter) {
        DOM.inStockFilter.checked = false;
    }

    if (DOM.priceRange) {
        DOM.priceRange.value =
            DOM.priceRange.max;
        updatePriceRangeText();
    }

    document
        .querySelectorAll("[data-filter-type]")
        .forEach(input => {
            if (
                input.dataset.filterType === "category"
            ) {
                input.checked =
                    input.value === "all";
            } else {
                input.checked = false;
            }
        });

    renderSubcategoryFilters();
    applyProductFilters();
    updateActiveCategoryCards();

    showToast(
        getAppTranslation(
            "catalog.filtersClearedTitle",
            "Filtros eliminados"
        ),
        getAppTranslation(
            "catalog.filtersClearedMessage",
            "Se están mostrando todos los productos."
        ),
        "success"
    );
}


/* =========================================================
   9. FILTROS ACTIVOS
========================================================= */

/**
 * Crea una etiqueta para eliminar un filtro activo.
 *
 * @param {string} type
 * @param {string} value
 * @param {string} label
 * @returns {string}
 */
function createActiveFilterChip(
    type,
    value,
    label
) {
    return `
        <button
            type="button"
            class="active-filter-chip"
            data-remove-filter="${escapeHTML(type)}"
            data-filter-value="${escapeHTML(value)}"
            aria-label="${escapeHTML(
                getAppTranslationWithVariables(
                    "catalog.removeFilterLabel",
                    "Eliminar filtro {label}",
                    {
                        label
                    }
                )
            )}"
            title="${escapeHTML(
                getAppTranslation(
                    "catalog.removeFilter",
                    "Eliminar filtro"
                )
            )}"
        >
            <span class="active-filter-chip__label">
                ${escapeHTML(label)}
            </span>

            <span
                class="active-filter-chip__remove"
                aria-hidden="true"
            >
                ×
            </span>
        </button>
    `;
}


/**
 * Genera el resumen de filtros activos.
 */

function renderActiveFilters() {
    if (!DOM.activeFilters) {
        return;
    }

    const filterChips = [];

    if (
        LeNCHoTeCHState.filters.offersOnly
    ) {
        filterChips.push(
            createActiveFilterChip(
                "offers",
                "true",
                getAppTranslation(
                    "catalog.offersFilter",
                    "Ofertas"
                )
            )
        );
    }

    if (LeNCHoTeCHState.filters.search) {
        const searchLabel = DOM.searchInput
            ? DOM.searchInput.value.trim()
            : LeNCHoTeCHState.filters.search;

        filterChips.push(
            createActiveFilterChip(
                "search",
                LeNCHoTeCHState.filters.search,
                getAppTranslationWithVariables(
                    "catalog.searchFilter",
                    "Búsqueda: “{search}”",
                    {
                        search: searchLabel
                    }
                )
            )
        );
    }

    if (
        LeNCHoTeCHState.filters.category !== "all"
    ) {
        const selectedCategory =
            LeNCHoTeCHState.filters.category;

        filterChips.push(
            createActiveFilterChip(
                "category",
                selectedCategory,
                getAppTranslationWithVariables(
                    "catalog.categoryFilter",
                    "Categoría: {category}",
                    {
                        category:
                            getTranslatedCategoryName(
                                selectedCategory
                            )
                    }
                )
            )
        );
    }

    LeNCHoTeCHState.filters.subcategories
        .forEach(subcategory => {
            filterChips.push(
                createActiveFilterChip(
                    "subcategory",
                    subcategory,
                    getTranslatedSubcategoryName(
                        subcategory
                    )
                )
            );
        });

    LeNCHoTeCHState.filters.brands
        .forEach(brand => {
            filterChips.push(
                createActiveFilterChip(
                    "brand",
                    brand,
                    brand
                )
            );
        });

    if (
        LeNCHoTeCHState.filters.availability ===
        "available"
    ) {
        filterChips.push(
            createActiveFilterChip(
                "availability",
                "available",
                getAppTranslation(
                    "catalog.inStockOnly",
                    "Solo productos disponibles"
                )
            )
        );
    }

    if (
        DOM.priceRange &&
        Number(LeNCHoTeCHState.filters.maxPrice) <
        Number(DOM.priceRange.max)
    ) {
        filterChips.push(
            createActiveFilterChip(
                "price",
                String(
                    LeNCHoTeCHState.filters.maxPrice
                ),
                getAppTranslationWithVariables(
                    "catalog.maximumPriceFilter",
                    "Hasta {price}",
                    {
                        price: formatProductPrice(
                            LeNCHoTeCHState.filters
                                .maxPrice
                        )
                    }
                ) 
            )
        );
    }

    if (filterChips.length === 0) {
        DOM.activeFilters.textContent =
            getAppTranslation(
                "catalog.noActiveFilters",
                "No hay filtros activos."
            );

        return;
    }

    DOM.activeFilters.innerHTML = `
        <span class="active-filters__title">
            ${escapeHTML(
                getAppTranslation(
                    "catalog.activeFiltersTitle",
                    "Filtros activos:"
                )
            )}
        </span>

        <div class="active-filters__list">
            ${filterChips.join("")}
        </div>
    `;
}

/**
 * Elimina solamente el filtro seleccionado.
 *
 * @param {string} filterType
 * @param {string} filterValue
 */
function removeActiveFilter(
    filterType,
    filterValue
) {
    
    if (filterType === "search") {
        LeNCHoTeCHState.filters.search = "";

        if (DOM.searchInput) {
            DOM.searchInput.value = "";
        }

        if (DOM.searchSuggestions) {
            DOM.searchSuggestions.hidden = true;
        }
    }

    if (filterType === "category") {
        LeNCHoTeCHState.filters.category = "all";

        document
            .querySelectorAll(
                '[data-filter-type="category"]'
            )
            .forEach(input => {
                input.checked =
                    input.value === "all";
            });

        renderSubcategoryFilters();
        updateActiveCategoryCards();
    }

    if (filterType === "subcategory") {
        LeNCHoTeCHState.filters.subcategories =
            LeNCHoTeCHState.filters.subcategories
                .filter(
                    subcategory =>
                        subcategory !== filterValue
                );

        document
            .querySelectorAll(
                '[data-filter-type="subcategory"]'
            )
            .forEach(input => {
                input.checked =
                    LeNCHoTeCHState.filters
                        .subcategories
                        .includes(input.value);
            });
    }

    if (filterType === "brand") {
        LeNCHoTeCHState.filters.brands =
            LeNCHoTeCHState.filters.brands
                .filter(
                    brand => brand !== filterValue
                );

        document
            .querySelectorAll(
                '[data-filter-type="brand"]'
            )
            .forEach(input => {
                input.checked =
                    LeNCHoTeCHState.filters.brands
                        .includes(input.value);
            });
    }

    if (filterType === "availability") {
        LeNCHoTeCHState.filters.availability =
            "all";

        if (DOM.inStockFilter) {
            DOM.inStockFilter.checked = false;
        }
    }

    if (filterType === "price") {
        const maximumPrice = DOM.priceRange
            ? Number(DOM.priceRange.max)
            : Infinity;

        LeNCHoTeCHState.filters.maxPrice =
            maximumPrice;

        if (DOM.priceRange) {
            DOM.priceRange.value =
                DOM.priceRange.max;

            updatePriceRangeText();
        }
    }

    if (filterType === "offers") {
        LeNCHoTeCHState.filters.offersOnly =
            false;

        if (DOM.offersButton) {
            DOM.offersButton.classList.remove(
                "active"
            );
        }
    }

    applyProductFilters();
}

/* =========================================================
   10. EVENTOS DE FILTROS
========================================================= */

/**
 * Procesa un cambio en los filtros.
 *
 * @param {HTMLInputElement} input
 */
function handleFilterInputChange(input) {
    const filterType = input.dataset.filterType;
    const value = input.value;

    if (filterType === "category") {
        LeNCHoTeCHState.filters.category = value;
        LeNCHoTeCHState.filters.subcategories = [];

        renderSubcategoryFilters();
        updateActiveCategoryCards();
    }

    if (filterType === "subcategory") {
        const selectedSubcategories = [
            ...document.querySelectorAll(
                '[data-filter-type="subcategory"]:checked'
            )
        ].map(element => element.value);

        LeNCHoTeCHState.filters.subcategories =
            selectedSubcategories;
    }

    if (filterType === "brand") {
        const selectedBrands = [
            ...document.querySelectorAll(
                '[data-filter-type="brand"]:checked'
            )
        ].map(element => element.value);

        LeNCHoTeCHState.filters.brands =
            selectedBrands;
    }

    applyProductFilters();
    scrollToCatalog();
}


/**
 * Activa una categoría desde tarjetas, navegación o menú.
 *
 * @param {string} category
 * @param {string|null} subcategory
 */
function activateCategory(
    category,
    subcategory = null
) {
    disableOffersMode();

    LeNCHoTeCHState.filters.category =
        category || "all";

    LeNCHoTeCHState.filters.subcategories =
        subcategory ? [subcategory] : [];

    const categoryRadio = [
        ...document.querySelectorAll(
            '[data-filter-type="category"]'
        )
    ].find(
        input =>
            input.value ===
            LeNCHoTeCHState.filters.category
    );

    if (categoryRadio) {
        categoryRadio.checked = true;
    }

    renderSubcategoryFilters();

    if (subcategory) {
        const subcategoryCheckbox = [
            ...document.querySelectorAll(
                '[data-filter-type="subcategory"]'
            )
        ].find(
            input => input.value === subcategory
        );

        if (subcategoryCheckbox) {
            subcategoryCheckbox.checked = true;
        }
    }

    applyProductFilters();
    updateActiveCategoryCards();
    scrollToCatalog();
    closeNavigationMenus();
}


/**
 * Marca visualmente la categoría seleccionada.
 */
function updateActiveCategoryCards() {
    document
        .querySelectorAll(
            ".category-card[data-category], " +
            ".category-card[data-category-filter]"
        )
        .forEach(card => {
            const cardCategory =
                card.dataset.category ||
                card.dataset.categoryFilter;

            const cardSubcategory =
                card.dataset.subcategory ||
                null;

            const activeSubcategories =
                LeNCHoTeCHState.filters.subcategories;

            const categoryMatches =
                cardCategory ===
                LeNCHoTeCHState.filters.category;

            const subcategoryMatches =
                cardSubcategory
                    ? activeSubcategories.includes(
                        cardSubcategory
                    )
                    : activeSubcategories.length === 0;

            card.classList.toggle(
                "is-active",
                categoryMatches &&
                subcategoryMatches
            );
        });
}

/**
 * Traduce los contadores visibles de
 * las tarjetas de categorías.
 */
function updateCategoryCardCounts() {
    document
        .querySelectorAll(
            ".category-card__count[data-category-count]"
        )
        .forEach(element => {
            const count =
                Number(
                    element.dataset.categoryCount
                );

            if (!Number.isFinite(count)) {
                return;
            }

            element.textContent =
                count === 1
                    ? getAppTranslation(
                        "categoryCards.productsSingle",
                        "1 producto"
                    )
                    : getAppTranslationWithVariables(
                        "categoryCards.productsPlural",
                        "{count} productos",
                        {
                            count
                        }
                    );
        });
}

/**
 * Desplaza la pantalla hasta el catálogo.
 */
function scrollToCatalog() {
    const catalogSection = selectFirst(
        "#products",
        "#catalog",
        ".products-section"
    );

    if (catalogSection) {
        catalogSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function showOffers() {
    LeNCHoTeCHState.filters.offersOnly =
        true;

    document
        .querySelectorAll("[data-navigation]")
        .forEach(link => {
            link.classList.remove("active");
        });

    if (DOM.offersButton) {
        DOM.offersButton.classList.add(
            "active"
        );
    }

    applyProductFilters();
    scrollToCatalog();
    closeNavigationMenus();
}

function disableOffersMode() {
    LeNCHoTeCHState.filters.offersOnly =
        false;

    if (DOM.offersButton) {
        DOM.offersButton.classList.remove(
            "active"
        );
    }

    applyProductFilters();
}

/* =========================================================
   11. VISTA RÁPIDA
========================================================= */

/**
 * Genera las especificaciones completas.
 *
 * @param {object} product
 * @returns {string}
 */
function createFullSpecificationsHTML(product) {
    return Object.entries(
        product.specifications || {}
    )
        .map(
            ([label, value]) => `
                <div class="quick-view__spec">
                    <span>
                        ${escapeHTML(
                            getTranslatedSpecificationName(
                                label
                            )
                        )}
                    </span>

                    <strong>
                        ${escapeHTML(
                            getTranslatedSpecificationValue(
                                value
                            )
                        )}
                    </strong>
                </div>
            `
        )
        .join("");
}


/**
 * Abre la vista rápida.
 *
 * @param {number|string} productId
 */
function openQuickView(productId) {
    const product = findProductById(productId);

    if (!product || !DOM.quickViewModal) {
        return;
    }

    const visibleProductName =
        getTranslatedProductName(product);

    const visibleProductDescription =
        getTranslatedProductDescription(
            product
        );

    LeNCHoTeCHState.quickViewProductId =
        product.id;

    const contentTarget =
        DOM.quickViewContent ||
        DOM.quickViewModal.querySelector(
            ".modal__content--product"
        );

    if (!contentTarget) {
        return;
    }

    const stockInformation =
        getStockInformation(product);

    const productHTML = `
        <div class="quick-view-layout">
            <div class="quick-view__image-wrapper">
                <img
                    class="quick-view__image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(
                        visibleProductName
                    )}"
                    data-product-name="${escapeHTML(
                        visibleProductName
                    )}"
                >
            </div>

            <div class="quick-view__information">
                <span class="quick-view__category">
                    ${escapeHTML(
                        getTranslatedCategoryName(
                            product.category
                        )
                    )}
                    ·
                    ${escapeHTML(
                        getTranslatedSubcategoryName(
                            product.subcategory
                        )
                    )}
                </span>

                <h2 class="quick-view__title">
                    ${escapeHTML(
                        visibleProductName
                    )}
                </h2>

                <div class="product-card__rating-row">
                    <span
                        class="product-card__stars"
                        aria-hidden="true"
                    >
                        ${createRatingStars(product.rating)}
                    </span>

                    <span class="product-card__reviews">
                        ${Number(product.rating).toFixed(1)}
                        (${escapeHTML(
                            getAppTranslationWithVariables(
                                "quickView.reviews",
                                "{count} reseñas",
                                {
                                    count:
                                        Number(product.reviews) ||
                                        0
                                }
                            )
                        )})
                    </span>
                </div>

                <p class="quick-view__description">
                    ${escapeHTML(
                        visibleProductDescription
                    )}
                </p>

                <strong class="quick-view__price">
                    ${formatProductPrice(product.price)}
                </strong>

                <div
                    class="
                        product-card__stock
                        ${stockInformation.className}
                    "
                >
                    ${escapeHTML(stockInformation.text)}
                </div>

                <div class="quick-view__specs">
                    ${createFullSpecificationsHTML(product)}
                </div>

                <div class="product-card__actions">
                    <button
                        class="secondary-button"
                        type="button"
                        data-action="toggle-favorite"
                        data-product-id="${product.id}"
                        aria-label="${escapeHTML(
                            getAppTranslationWithVariables(
                                "quickView.favoriteLabel",
                                "Agregar {name} a favoritos",
                                {
                                    name: visibleProductName
                                }
                            )
                        )}"
                        aria-pressed="false"
                        title="${escapeHTML(
                            getAppTranslation(
                                "favorites.addTitle",
                                "Añadir a favoritos"
                            )
                        )}"
                    >
                        <span
                            data-favorite-icon
                            aria-hidden="true"
                        >
                            ♡
                        </span>

                        <span data-favorite-text>
                            ${escapeHTML(
                                getAppTranslation(
                                    "quickView.favorite",
                                    "Favorito"
                                )
                            )}
                        </span>
                    </button>

                    <button
                        class="primary-button"
                        type="button"
                        data-action="add-to-cart"
                        data-product-id="${product.id}"
                        ${product.stock <= 0 ? "disabled" : ""}
                    >
                        ${
                            product.stock <= 0
                                ? escapeHTML(
                                    getAppTranslation(
                                        "quickView.soldOut",
                                        "Producto agotado"
                                    )
                                )
                                : escapeHTML(
                                    getAppTranslation(
                                        "quickView.addToCart",
                                        "Añadir al carrito"
                                    )
                                )
                        }
                    </button>
                </div>
            </div>
        </div>
    `;

    contentTarget.innerHTML = productHTML;

    if (
        window.LENCHOTECH_FAVORITES &&
        typeof window
            .LENCHOTECH_FAVORITES
            .synchronize ===
            "function"
    ) {
        window
            .LENCHOTECH_FAVORITES
            .synchronize();
    }

    if (
        window.LENCHOTECH_CART &&
        typeof window
            .LENCHOTECH_CART
            .synchronize ===
            "function"
    ) {
        window
            .LENCHOTECH_CART
            .synchronize();
    }

    openModal(DOM.quickViewModal);
}


/* =========================================================
   12. MODALES
========================================================= */

/**
 * Abre un modal.
 *
 * @param {HTMLElement} modal
 */
function openModal(modal) {
    if (!modal) {
        return;
    }

    closeAllDrawers();

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    LeNCHoTeCHState.activeModal = modal;

    updateBodyScrollLock();

    const firstFocusableElement =
        modal.querySelector(
            "button, input, select, textarea, a[href]"
        );

    if (firstFocusableElement) {
        window.setTimeout(
            () => firstFocusableElement.focus(),
            50
        );
    }
}


/**
 * Cierra un modal.
 *
 * @param {HTMLElement} modal
 */
function closeModal(modal) {
    if (!modal || modal.hidden) {
        return;
    }

    modal.classList.add("is-closing");

    window.setTimeout(
        () => {
            modal.hidden = true;
            modal.classList.remove("is-closing");
            modal.setAttribute("aria-hidden", "true");

            if (
                LeNCHoTeCHState.activeModal === modal
            ) {
                LeNCHoTeCHState.activeModal = null;
            }

            updateBodyScrollLock();
        },
        210
    );
}


/**
 * Cierra todos los modales.
 */
function closeAllModals() {
    document
        .querySelectorAll(".modal:not([hidden])")
        .forEach(closeModal);
}


/* =========================================================
   13. DRAWERS
========================================================= */

/**
 * Abre un panel lateral.
 *
 * @param {HTMLElement} drawer
 */
function openDrawer(drawer) {
    if (!drawer) {
        return;
    }

    closeAllModals();
    closeAllDrawers();

    if (DOM.drawerOverlay) {
        DOM.drawerOverlay.hidden = false;
    }

    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");

    LeNCHoTeCHState.activeDrawer = drawer;

    updateBodyScrollLock();
}


/**
 * Cierra un panel lateral.
 *
 * @param {HTMLElement} drawer
 */
function closeDrawer(drawer) {
    if (!drawer || !drawer.classList.contains("is-open")) {
        return;
    }

    drawer.classList.add("is-closing");

    window.setTimeout(
        () => {
            drawer.classList.remove(
                "is-open",
                "is-closing"
            );

            drawer.setAttribute(
                "aria-hidden",
                "true"
            );

            if (
                LeNCHoTeCHState.activeDrawer === drawer
            ) {
                LeNCHoTeCHState.activeDrawer = null;
            }

            if (
                DOM.drawerOverlay &&
                !document.querySelector(
                    ".side-drawer.is-open"
                )
            ) {
                DOM.drawerOverlay.hidden = true;
            }

            updateBodyScrollLock();
        },
        270
    );
}


/**
 * Cierra todos los paneles laterales.
 */
function closeAllDrawers() {
    document
        .querySelectorAll(".side-drawer.is-open")
        .forEach(closeDrawer);
}


/**
 * Bloquea el desplazamiento cuando sea necesario.
 */
function updateBodyScrollLock() {
    const hasOpenModal =
        Boolean(
            document.querySelector(
                ".modal:not([hidden])"
            )
        );

    const hasOpenDrawer =
        Boolean(
            document.querySelector(
                ".side-drawer.is-open"
            )
        );

    DOM.body.classList.toggle(
        "no-scroll",
        hasOpenModal || hasOpenDrawer
    );
}


/* =========================================================
   14. TEMA CLARO Y OSCURO
========================================================= */

const THEME_STORAGE_KEY =
    "lenchotech-theme";

const LANGUAGE_STORAGE_KEY =
    "lenchotech-language";


/**
 * Obtiene el tema guardado.
 *
 * @returns {"light"|"dark"}
 */
function getInitialTheme() {
    const storedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);

    if (
        storedTheme === "light" ||
        storedTheme === "dark"
    ) {
        return storedTheme;
    }

    return window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches
        ? "dark"
        : "light";
}

function getAppTranslation(
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
 * como {total}, {amount} o {name}.
 *
 * @param {string} key
 * @param {string} fallback
 * @param {Record<string, string|number>} variables
 * @returns {string}
 */
function getAppTranslationWithVariables(
    key,
    fallback,
    variables = {}
) {
    let translatedText =
        getAppTranslation(
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
 * Devuelve el nombre visible de una categoría
 * sin cambiar su identificador interno.
 *
 * @param {string} category
 * @returns {string}
 */
function getTranslatedCategoryName(category) {
    const translationKeys = {
        Displays:
            "categoryNames.displays",

        Cables:
            "categoryNames.cables",

        RAM:
            "categoryNames.ram",

        Storage:
            "categoryNames.storage",

        Components:
            "categoryNames.components",

        "Power Supplies":
            "categoryNames.powerSupplies",

        Printers:
            "categoryNames.printers",

        Maintenance:
            "categoryNames.maintenance"
    };

    const translationKey =
        translationKeys[category];

    if (!translationKey) {
        return category;
    }

    return getAppTranslation(
        translationKey,
        category
    );
}

/**
 * Devuelve el nombre visible de una
 * subcategoría sin cambiar su identificador.
 *
 * @param {string} subcategory
 * @returns {string}
 */
function getTranslatedSubcategoryName(
    subcategory
) {
    const translationKeys = {
        Touchscreen:
            "subcategoryNames.touchscreen",

        Copper:
            "subcategoryNames.copper",

        Fiber:
            "subcategoryNames.fiber",

        Storage:
            "subcategoryNames.storage",

        Connectors:
            "subcategoryNames.connectors",

        "Expansion Cards":
            "subcategoryNames.expansionCards",

        Cooling:
            "subcategoryNames.cooling",

        "Power Supplies":
            "subcategoryNames.powerSupplies",

        Multifunction:
            "subcategoryNames.multifunction",

        "Maintenance Kits":
            "subcategoryNames.maintenanceKits",

        Removable:
            "subcategoryNames.removable",

        Optical:
            "subcategoryNames.optical",

        Ink:
            "subcategoryNames.ink",

        Toner:
            "subcategoryNames.toner"
    };

    const translationKey =
        translationKeys[subcategory];

    if (!translationKey) {
        return subcategory;
    }

    return getAppTranslation(
        translationKey,
        subcategory
    );
}

/**
 * Devuelve el nombre visible de una
 * especificación sin modificar su clave original.
 *
 * @param {string} specificationName
 * @returns {string}
 */
function getTranslatedSpecificationName(
    specificationName
) {
    const translationKeys = {
        ADF: "specificationNames.adf",
        Altavoces: "specificationNames.speakers",
        Altura: "specificationNames.height",
        "Ancho de banda": "specificationNames.bandwidth",
        Blindaje: "specificationNames.shielding",
        Cableado: "specificationNames.cabling",
        Caché: "specificationNames.cache",
        Capacidad: "specificationNames.capacity",
        Certificación: "specificationNames.certification",
        Chipset: "specificationNames.chipset",
        Color: "specificationNames.color",
        Colores: "specificationNames.colors",
        Compatibilidad: "specificationNames.compatibility",
        Conectividad: "specificationNames.connectivity",
        Conector: "specificationNames.connector",
        Conectores: "specificationNames.connectors",
        Conexiones: "specificationNames.connections",
        Configuración: "specificationNames.configuration",
        Contenido: "specificationNames.content",
        "Corrección de errores":
            "specificationNames.errorCorrection",
        Curvatura: "specificationNames.curvature",
        Datos: "specificationNames.data",
        Dúplex: "specificationNames.duplex",
        ECC: "specificationNames.ecc",
        Entrada: "specificationNames.input",
        Escritura: "specificationNames.write",
        Formato: "specificationNames.format",
        Frecuencia: "specificationNames.frequency",
        "Fuente recomendada":
            "specificationNames.recommendedPowerSupply",
        Funciones: "specificationNames.functions",
        GPU: "specificationNames.gpu",
        Grabación: "specificationNames.recording",
        HDR: "specificationNames.hdr",
        Impedancia: "specificationNames.impedance",
        "Impresión móvil":
            "specificationNames.mobilePrinting",
        Incluye: "specificationNames.includes",
        Instalación: "specificationNames.installation",
        Interfaz: "specificationNames.interface",
        Latencia: "specificationNames.latency",
        Lectura: "specificationNames.read",
        Longitud: "specificationNames.length",
        Material: "specificationNames.material",
        Memoria: "specificationNames.memory",
        Núcleo: "specificationNames.core",
        Original: "specificationNames.original",
        "Plug and Play":
            "specificationNames.plugAndPlay",
        Potencia: "specificationNames.power",
        Protecciones: "specificationNames.protections",
        Protección: "specificationNames.protection",
        "Puntos táctiles":
            "specificationNames.touchPoints",
        "Ranuras M.2":
            "specificationNames.m2Slots",
        Rendimiento: "specificationNames.performance",
        Resolución: "specificationNames.resolution",
        "Resolución máxima":
            "specificationNames.maximumResolution",
        Salida: "specificationNames.output",
        Salidas: "specificationNames.outputs",
        Seguro: "specificationNames.secure",
        Socket: "specificationNames.socket",
        "Socket AMD": "specificationNames.amdSocket",
        "Socket Intel": "specificationNames.intelSocket",
        Tamaño: "specificationNames.size",
        "Tamaño de papel":
            "specificationNames.paperSize",
        Tecnología: "specificationNames.technology",
        "Tiempo de respuesta":
            "specificationNames.responseTime",
        Tipo: "specificationNames.type",
        "Tipo de panel":
            "specificationNames.panelType",
        Uso: "specificationNames.use",
        Velocidad: "specificationNames.speed",
        Ventilador: "specificationNames.fan",
        Ventiladores: "specificationNames.fans",
        Versión: "specificationNames.version",
        Voltaje: "specificationNames.voltage",
        "Wi-Fi": "specificationNames.wifi"
    };

    const translationKey =
        translationKeys[specificationName];

    if (!translationKey) {
        return specificationName;
    }

    return getAppTranslation(
        translationKey,
        specificationName
    );
}

/**
 * Traduce valores textuales comunes de las
 * especificaciones. Los valores técnicos se
 * mantienen intactos.
 *
 * @param {unknown} value
 * @returns {string}
 */
function getTranslatedSpecificationValue(value) {
    const originalValue =
        String(value);

    if (
        document.documentElement.lang !==
        "en"
    ) {
        return originalValue;
    }

    const exactTranslations = {
        "A color": "Color",
        "Aluminio": "Aluminum",
        "Automático": "Automatic",
        "Azul": "Blue",
        "Compatible": "Compatible",
        "Completamente modular": "Fully modular",
        "Doble": "Double",
        "Enfriamiento por aire": "Air cooling",
        "Externo": "External",
        "Fusor y rodillos": "Fuser and rollers",
        "Hogar": "Home",
        "Imprimir, copiar, escanear y fax":
            "Print, copy, scan, and fax",
        "Integrados": "Built-in",
        "Kit de mantenimiento": "Maintenance kit",
        "Láser": "Laser",
        "Mantenimiento preventivo":
            "Preventive maintenance",
        "Manual": "Manual",
        "Modelos Brother seleccionados":
            "Selected Brother models",
        "Monocromática": "Monochrome",
        "Multimodo OM3": "OM3 multimode",
        "Negro": "Black",
        "Negro, cian, magenta y amarillo":
            "Black, cyan, magenta, and yellow",
        "No": "No",
        "Nylon trenzado": "Braided nylon",
        "Recto a recto": "Straight-through",
        "Retráctil": "Retractable",
        "USB-C a USB-C": "USB-C to USB-C",
        "LC a LC":
            "LC to LC",

        "4K a 120 Hz":
            "4K at 120 Hz",

        "75 ohmios":
            "75 ohms",

        "HP LaserJet seleccionadas":
            "Selected HP LaserJet models",

        "HP OfficeJet seleccionadas":
            "Selected HP OfficeJet models",
        "Servidor": "Server",
        "Sí": "Yes",
        "Técnica": "Technical",
        "Tinta": "Ink",
       "Tóner": "Toner",

        "TV, cable y satélite":
            "TV, cable, and satellite",

        "Windows y macOS":
            "Windows and macOS",

        "HDMI y DisplayPort":
            "HDMI and DisplayPort",

        "HDMI, DisplayPort y DVI":
            "HDMI, DisplayPort, and DVI",

        "USB-C, HDMI y DisplayPort":
            "USB-C, HDMI, and DisplayPort",

        "Wi-Fi y USB":
            "Wi-Fi and USB",

        "Wi-Fi, Ethernet y USB":
            "Wi-Fi, Ethernet, and USB",

        "CD y DVD":
            "CD and DVD",

        "HDD y SSD":
            "HDD and SSD",

        "OVP, OCP y SCP":
            "OVP, OCP, and SCP",

        "IPS táctil":
            "Touchscreen IPS"
        };

    if (
        Object.prototype.hasOwnProperty.call(
            exactTranslations,
            originalValue
        )
    ) {
        return exactTranslations[
            originalValue
        ];
    }

    return originalValue
        .replace(
            /^Hasta\s+/,
            "Up to "
        )
        .replace(
            /^Aproximadamente\s+/,
            "Approximately "
        )
        .replace(
            /(\d+(?:\.\d+)?)\s+pulgadas\b/g,
            "$1 inches"
        )
        .replace(
            /(\d+(?:\.\d+)?)\s+pies\b/g,
            "$1 ft"
        )
        .replace(
            /(\d+(?:\.\d+)?)\s+metros\b/g,
            "$1 meters"
        )
        .replace(
            /(\d+)\s+páginas\b/g,
            "$1 pages"
        )
        .replace(
            /(\d+)\s+cartuchos\b/g,
            "$1 cartridges"
        );
}

/**
 * Devuelve el nombre visible de un producto.
 *
 * Solo existen traducciones específicas para
 * nombres que contienen texto dependiente
 * del idioma.
 *
 * @param {object} product
 * @returns {string}
 */
function getTranslatedProductName(product) {
    if (!product) {
        return "";
    }

    return getAppTranslation(
        `productContent.names.${product.id}`,
        product.name
    );
}

/**
 * Devuelve la descripción traducida de un producto.
 *
 * @param {object} product
 * @returns {string}
 */
function getTranslatedProductDescription(
    product
) {
    if (!product) {
        return "";
    }

    return getAppTranslation(
        `productContent.descriptions.${product.id}`,
        product.description
    );
}

/**
 * Devuelve el texto traducido de un badge.
 *
 * @param {object} product
 * @returns {string}
 */
function getTranslatedProductBadge(product) {
    if (!product?.badge) {
        return "";
    }

    const badgeTranslationKeys = {
        Oferta:
            "productContent.badges.sale",

        Popular:
            "productContent.badges.popular",

        Premium:
            "productContent.badges.premium",

        Nuevo:
            "productContent.badges.new",

        "8K":
            "productContent.badges.eightK",

        Laptop:
            "productContent.badges.laptop",

        Servidor:
            "productContent.badges.server",

        "Alto rendimiento":
            "productContent.badges.highPerformance",

        Gaming:
            "productContent.badges.gaming",

        Silencioso:
            "productContent.badges.quiet",

        "80 Plus Gold":
            "productContent.badges.gold",

        Hogar:
            "productContent.badges.home",

        Multifunción:
            "productContent.badges.multifunction",

        Paquete:
            "productContent.badges.pack",

        Servicio:
            "productContent.badges.service"
    };

    const translationKey =
        badgeTranslationKeys[
            product.badge
        ];

    if (!translationKey) {
        return product.badge;
    }

    return getAppTranslation(
        translationKey,
        product.badge
    );
}

/**
 * Aplica un tema.
 *
 * @param {"light"|"dark"} theme
 */
function applyTheme(theme) {
    const darkTheme = theme === "dark";

    DOM.body.classList.toggle(
        "dark-theme",
        darkTheme
    );

    DOM.body.dataset.theme = theme;

    localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
    );

    if (DOM.themeButton) {
        DOM.themeButton.setAttribute(
            "aria-pressed",
            String(darkTheme)
        );

        DOM.themeButton.title =
            darkTheme
                ? getAppTranslation(
                    "header.themeToLight",
                    "Cambiar al tema claro"
                )
                : getAppTranslation(
                    "header.themeToDark",
                    "Cambiar al tema oscuro"
                );

        DOM.themeButton.setAttribute(
            "aria-label",
            darkTheme
                ? getAppTranslation(
                    "header.themeToLightLabel",
                    "Activar tema claro"
                )
                : getAppTranslation(
                    "header.themeToDarkLabel",
                    "Activar tema oscuro"
                )
        );
    }

    if (DOM.themeIcon) {
        DOM.themeIcon.textContent =
            darkTheme ? "☀️" : "🌙";
    }
}


/**
 * Cambia el tema actual.
 */
function toggleTheme() {
    const currentTheme =
        DOM.body.classList.contains("dark-theme")
            ? "dark"
            : "light";

    applyTheme(
        currentTheme === "dark"
            ? "light"
            : "dark"
    );
}


/**
 * Inicializa el tema.
 */
function initializeTheme() {
    applyTheme(getInitialTheme());
}

/* =========================================================
   15. SELECTOR DE IDIOMA
========================================================= */

/**
 * Devuelve el idioma guardado o el idioma predeterminado.
 *
 * @returns {"es"|"en"}
 */
function getInitialLanguage() {
    try {
        const storedLanguage =
            localStorage.getItem(
                LANGUAGE_STORAGE_KEY
            );

        if (
            storedLanguage === "es" ||
            storedLanguage === "en"
        ) {
            return storedLanguage;
        }
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible leer el idioma guardado.",
            error
        );
    }

    return "es";
}


/**
 * Cierra el menú de idioma.
 */
function closeLanguageMenu() {
    if (
        !DOM.languageMenu ||
        !DOM.languageButton
    ) {
        return;
    }

    DOM.languageMenu.hidden = true;

    DOM.languageButton.setAttribute(
        "aria-expanded",
        "false"
    );
}


/**
 * Abre el menú de idioma.
 */
function openLanguageMenu() {
    if (
        !DOM.languageMenu ||
        !DOM.languageButton
    ) {
        return;
    }

    DOM.languageMenu.hidden = false;

    DOM.languageButton.setAttribute(
        "aria-expanded",
        "true"
    );
}


/**
 * Abre o cierra el menú de idioma.
 */
function toggleLanguageMenu() {
    if (!DOM.languageMenu) {
        return;
    }

    if (DOM.languageMenu.hidden) {
        openLanguageMenu();
    } else {
        closeLanguageMenu();
    }
}


/**
 * Actualiza visualmente el idioma seleccionado.
 *
 * @param {"es"|"en"} language
 */
function updateLanguageControls(language) {
    if (DOM.languageLabel) {
        DOM.languageLabel.textContent =
            language.toUpperCase();
    }

    DOM.languageOptions.forEach(option => {
        const isActive =
            option.dataset.language ===
            language;

        option.classList.toggle(
            "is-active",
            isActive
        );

        option.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });
}


/**
 * Guarda y aplica la selección del idioma.
 *
 * La traducción real se añadirá en el próximo paso.
 *
 * @param {string} language
 */
function selectLanguage(language) {
    if (
        language !== "es" &&
        language !== "en"
    ) {
        return;
    }

    try {
        localStorage.setItem(
            LANGUAGE_STORAGE_KEY,
            language
        );
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible guardar el idioma.",
            error
        );
    }

    document.documentElement.lang =
        language;

    updateLanguageControls(language);

    if (
        window.LENCHOTECH_I18N &&
        typeof window
            .LENCHOTECH_I18N
            .applyTranslations ===
            "function"
    ) {
        window
            .LENCHOTECH_I18N
            .applyTranslations(
                language
            );

        updateCategoryCardCounts();
        
        updateResultsText(
            LeNCHoTeCHState.filteredProducts.length
        );

        renderCategoryFilters();
        renderSubcategoryFilters();
        renderActiveFilters();

        renderProducts(
            LeNCHoTeCHState.filteredProducts
        );

        if (
            LeNCHoTeCHState.activeModal ===
                DOM.quickViewModal &&
            LeNCHoTeCHState.quickViewProductId !==
                null
        ) {
            openQuickView(
                LeNCHoTeCHState.quickViewProductId
            );
        }

        applyTheme(
            DOM.body.classList.contains(
                "dark-theme"
            )
                ? "dark"
                : "light"
        );
    }

    closeLanguageMenu();

    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:language-changed",
            {
                detail: {
                    language
                }
            }
        )
    );
}


/**
 * Inicializa el selector de idioma.
 */
function initializeLanguageSelector() {
    const initialLanguage =
        getInitialLanguage();

    document.documentElement.lang =
        initialLanguage;

    updateLanguageControls(
        initialLanguage
    );

    if (
        window.LENCHOTECH_I18N &&
        typeof window
            .LENCHOTECH_I18N
            .applyTranslations ===
            "function"
    ) {
        window
            .LENCHOTECH_I18N
            .applyTranslations(
                initialLanguage
            );

        updateCategoryCardCounts();
    }
}

/* =========================================================
   15. MENÚS
========================================================= */

/**
 * Abre o cierra el menú móvil.
 */
function toggleMobileNavigation() {
    if (
        !DOM.navigationMenu ||
        !DOM.mobileMenuButton
    ) {
        return;
    }

    const isOpen =
        DOM.navigationMenu.classList.toggle(
            "is-open"
        );

    DOM.mobileMenuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}


/**
 * Abre o cierra el mega menú.
 */
function toggleCategoriesDropdown() {
    if (!DOM.categoriesDropdown) {
        return;
    }

    const isOpen =
        DOM.categoriesDropdown.classList.toggle(
            "is-open"
        );

    if (DOM.categoriesDropdownButton) {
        DOM.categoriesDropdownButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }
}


/**
 * Cierra los menús de navegación.
 */
function closeNavigationMenus() {
    if (DOM.navigationMenu) {
        DOM.navigationMenu.classList.remove(
            "is-open"
        );
    }

    if (DOM.mobileMenuButton) {
        DOM.mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    if (DOM.categoriesDropdown) {
        DOM.categoriesDropdown.classList.remove(
            "is-open"
        );
    }

    if (DOM.categoriesDropdownButton) {
        DOM.categoriesDropdownButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}


/* =========================================================
   16. FILTROS MÓVILES
========================================================= */

/**
 * Abre el panel de filtros móvil.
 */
function openMobileFilters() {
    if (!DOM.filtersSidebar) {
        return;
    }

    DOM.filtersSidebar.classList.add("is-open");

    if (DOM.drawerOverlay) {
        DOM.drawerOverlay.hidden = false;
    }

    DOM.body.classList.add("no-scroll");
}


/**
 * Cierra el panel de filtros móvil.
 */
function closeMobileFilters() {
    if (!DOM.filtersSidebar) {
        return;
    }

    DOM.filtersSidebar.classList.remove("is-open");

    if (
        DOM.drawerOverlay &&
        !document.querySelector(
            ".side-drawer.is-open"
        )
    ) {
        DOM.drawerOverlay.hidden = true;
    }

    updateBodyScrollLock();
}


/* =========================================================
   17. NOTIFICACIONES
========================================================= */

/**
 * Muestra una notificación.
 *
 * @param {string} title
 * @param {string} message
 * @param {"default"|"success"|"warning"|"danger"} type
 * @param {number} duration
 */
function showToast(
    title,
    message,
    type = "default",
    duration = 3200
) {
    if (!DOM.toastContainer) {
        console.log(`${title}: ${message}`);
        return;
    }

    const toast = document.createElement("div");

    const icons = {
        default: "ℹ️",
        success: "✅",
        warning: "⚠️",
        danger: "❌"
    };

    toast.className =
        type === "default"
            ? "toast"
            : `toast toast--${type}`;

    toast.setAttribute("role", "status");

    toast.innerHTML = `
        <span
            class="toast__icon"
            aria-hidden="true"
        >
            ${icons[type] || icons.default}
        </span>

        <div class="toast__content">
            <strong class="toast__title">
                ${escapeHTML(title)}
            </strong>

            <p class="toast__message">
                ${escapeHTML(message)}
            </p>
        </div>
    `;

    DOM.toastContainer.appendChild(toast);

    window.setTimeout(
        () => {
            toast.classList.add("is-removing");

            window.setTimeout(
                () => toast.remove(),
                250
            );
        },
        duration
    );
}


/* =========================================================
   18. ANIMACIONES AL DESPLAZARSE
========================================================= */

/**
 * Activa las animaciones de aparición.
 */
function initializeScrollAnimations() {
    const elements = document.querySelectorAll(
        ".reveal-on-scroll, .reveal-left, .reveal-right"
    );

    if (
        elements.length === 0 ||
        !("IntersectionObserver" in window)
    ) {
        elements.forEach(
            element =>
                element.classList.add("is-revealed")
        );

        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "is-revealed"
                );

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach(
        element => observer.observe(element)
    );
}


/* =========================================================
   19. BOTÓN VOLVER ARRIBA
========================================================= */

/**
 * Actualiza la visibilidad del botón.
 */
function updateBackToTopVisibility() {
    if (!DOM.backToTopButton) {
        return;
    }

    DOM.backToTopButton.hidden =
        window.scrollY < 500;
}


/**
 * Regresa al principio de la página.
 */
function scrollBackToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   20. BÚSQUEDA BÁSICA
========================================================= */

/**
 * Aplica la búsqueda escrita.
 */
function applySearchFromInput() {
    if (!DOM.searchInput) {
        return;
    }

    LeNCHoTeCHState.filters.search =
        normalizeText(
            DOM.searchInput.value
        );

    applyProductFilters();
    scrollToCatalog();

    if (DOM.searchSuggestions) {
        DOM.searchSuggestions.hidden = true;
    }
}


/**
 * Limpia la búsqueda.
 */
function clearSearch() {
    if (DOM.searchInput) {
        DOM.searchInput.value = "";
        DOM.searchInput.focus();
    }

    LeNCHoTeCHState.filters.search = "";

    if (DOM.searchSuggestions) {
        DOM.searchSuggestions.hidden = true;
    }

    applyProductFilters();
}


/* =========================================================
   21. EVENTOS DE PRODUCTOS
========================================================= */

/**
 * Procesa acciones hechas desde las tarjetas.
 *
 * @param {HTMLElement} actionElement
 */
function handleProductAction(actionElement) {
    const action = actionElement.dataset.action;
    const productId =
        actionElement.dataset.productId;

    if (!action || !productId) {
        return;
    }

    const product = findProductById(productId);

    if (!product) {
        return;
    }

    if (action === "quick-view") {
        openQuickView(productId);
        return;
    }

    if (action === "add-to-cart") {
        document.dispatchEvent(
            new CustomEvent(
                "lenchotech:toggle-cart",
                {
                    detail: {
                        productId: Number(productId)
                    }
                }
            )
        );

        /*
            Este mensaje se mostrará mientras cart.js todavía
            no haya sido creado. Cuando cart.js esté conectado,
            escuchará el evento y manejará el producto.
        */

        if (
            typeof window.LENCHOTECH_CART ===
            "undefined"
        ) {
            const visibleProductName =
                getTranslatedProductName(
                    product
                );

            showToast(
                getAppTranslation(
                    "fallback.cartSelectedTitle",
                    "Producto seleccionado"
                ),
                getAppTranslationWithVariables(
                    "fallback.cartSelectedMessage",
                    "{name} está preparado para añadirse al carrito.",
                    {
                        name:
                            visibleProductName
                    }
                ),
                "success"
            );
        }

        animateHeaderButton(DOM.openCartButton);
        return;
    }

    if (action === "toggle-favorite") {
        document.dispatchEvent(
            new CustomEvent(
                "lenchotech:toggle-favorite",
                {
                    detail: {
                        productId: Number(productId),
                        sourceElement: actionElement
                    }
                }
            )
        );

        if (
            typeof window.LENCHOTECH_FAVORITES ===
            "undefined"
        ) {
            const currentlyActive =
                actionElement.classList.toggle(
                    "is-active"
                );

            actionElement.textContent =
                currentlyActive ? "♥" : "♡";

            actionElement.setAttribute(
                "aria-pressed",
                String(currentlyActive)
            );

            actionElement.classList.add(
                "is-animating"
            );

            window.setTimeout(
                () =>
                    actionElement.classList.remove(
                        "is-animating"
                    ),
                400
            );

            showToast(
                currentlyActive
                    ? getAppTranslation(
                        "fallback.favoriteAddedTitle",
                        "Añadido a favoritos"
                    )
                    : getAppTranslation(
                        "fallback.favoriteRemovedTitle",
                        "Eliminado de favoritos"
                    ),
                getTranslatedProductName(
                    product
                ),
                currentlyActive
                    ? "success"
                    : "default"
            );
        }

        animateHeaderButton(
            DOM.openFavoritesButton
        );
        return;
    }

    if (action === "toggle-compare") {
        document.dispatchEvent(
            new CustomEvent(
                "lenchotech:toggle-compare",
                {
                    detail: {
                        productId: Number(productId),
                        checked:
                            actionElement.checked
                    }
                }
            )
        );

        if (
            typeof window.LENCHOTECH_COMPARE ===
            "undefined"
        ) {
            const visibleProductName =
                getTranslatedProductName(
                    product
                );

            showToast(
                actionElement.checked
                    ? getAppTranslation(
                        "fallback.compareSelectedTitle",
                        "Producto seleccionado"
                    )
                    : getAppTranslation(
                        "fallback.compareRemovedTitle",
                        "Producto retirado"
                    ),
                actionElement.checked
                    ? getAppTranslationWithVariables(
                        "fallback.compareSelectedMessage",
                        "{name} se añadió al comparador.",
                        {
                            name:
                                visibleProductName
                        }
                    )
                    : getAppTranslationWithVariables(
                        "fallback.compareRemovedMessage",
                        "{name} se eliminó del comparador.",
                        {
                            name:
                                visibleProductName
                        }
                    ),
                "default"
            );
        }
    }
}


/**
 * Anima un botón del encabezado.
 *
 * @param {HTMLElement|null} button
 */
function animateHeaderButton(button) {
    if (!button) {
        return;
    }

    button.classList.remove("is-animating");

    void button.offsetWidth;

    button.classList.add("is-animating");

    window.setTimeout(
        () =>
            button.classList.remove(
                "is-animating"
            ),
        380
    );
}


/* =========================================================
   22. EVENTOS GLOBALES
========================================================= */

/**
 * Configura los eventos directos.
 */
function initializeDirectEvents() {
    if (DOM.themeButton) {
        DOM.themeButton.addEventListener(
            "click",
            toggleTheme
        );
    }

    if (DOM.languageButton) {
        DOM.languageButton.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                toggleLanguageMenu();
            }
        );
    }


    if (DOM.languageMenu) {
        DOM.languageMenu.addEventListener(
            "click",
            event => {
                const target =
                    event.target;

                if (!(target instanceof Element)) {
                    return;
                }

                const languageOption =
                    target.closest(
                        ".language-menu__option"
                    );

                if (!languageOption) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                const selectedLanguage =
                    languageOption.dataset.language;

                selectLanguage(
                    selectedLanguage
                );
            }
        );
    }

    if (DOM.mobileMenuButton) {
        DOM.mobileMenuButton.addEventListener(
            "click",
            toggleMobileNavigation
        );
    }

    if (DOM.categoriesDropdownButton) {
        DOM.categoriesDropdownButton.addEventListener(
            "click",
            toggleCategoriesDropdown
        );
    }

    if (DOM.searchForm) {
        DOM.searchForm.addEventListener(
            "submit",
            event => {
                event.preventDefault();
                applySearchFromInput();
            }
        );
    }

    if (DOM.searchClearButton) {
        DOM.searchClearButton.addEventListener(
            "click",
            clearSearch
        );
    }

    if (DOM.sortSelect) {
        DOM.sortSelect.addEventListener(
            "change",
            () => {
                LeNCHoTeCHState.sort =
                    DOM.sortSelect.value;

                applyProductFilters();
            }
        );
    }

    if (DOM.inStockFilter) {
        DOM.inStockFilter.addEventListener(
            "change",
            () => {
                LeNCHoTeCHState.filters.availability =
                    DOM.inStockFilter.checked
                        ? "available"
                        : "all";

                applyProductFilters();
                scrollToCatalog();
            }
        );
    }

    if (DOM.priceRange) {
        DOM.priceRange.addEventListener(
            "input",
            () => {
                LeNCHoTeCHState.filters.maxPrice =
                    Number(DOM.priceRange.value);

                updatePriceRangeText();
                applyProductFilters();
            }
        );
    }

    if (DOM.clearFiltersButton) {
        DOM.clearFiltersButton.addEventListener(
            "click",
            clearAllFilters
        );
    }

    if (DOM.emptyStateResetButton) {
        DOM.emptyStateResetButton.addEventListener(
            "click",
            () => {
                clearAllFilters();
                scrollToCatalog();
            }
        );
    }

    if (DOM.openFiltersButton) {
        DOM.openFiltersButton.addEventListener(
            "click",
            openMobileFilters
        );
    }

    if (DOM.closeFiltersButton) {
        DOM.closeFiltersButton.addEventListener(
            "click",
            closeMobileFilters
        );
    }

    if (DOM.drawerOverlay) {
        DOM.drawerOverlay.addEventListener(
            "click",
            () => {
                closeAllDrawers();
                closeMobileFilters();
            }
        );
    }

    if (DOM.openCartButton) {
        DOM.openCartButton.addEventListener(
            "click",
            () => openDrawer(DOM.cartDrawer)
        );
    }

    if (DOM.openFavoritesButton) {
        DOM.openFavoritesButton.addEventListener(
            "click",
            () =>
                openDrawer(
                    DOM.favoritesDrawer
                )
        );
    }

    if (DOM.backToTopButton) {
        DOM.backToTopButton.addEventListener(
            "click",
            scrollBackToTop
        );
    }

    if (DOM.footerBackToTopLink) {
        DOM.footerBackToTopLink.addEventListener(
            "click",
            event => {
                event.preventDefault();
                scrollBackToTop();
            }
        );
    }
    
    if (DOM.offersButton) {
        DOM.offersButton.addEventListener(
            "click",
            showOffers
        );
    }

    if (DOM.footerOffersButton) {
        DOM.footerOffersButton.addEventListener(
            "click",
            showOffers
        );
    }

    window.addEventListener(
        "scroll",
        updateBackToTopVisibility,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > 980) {
                closeNavigationMenus();
                closeMobileFilters();
            }
        }
    );

    const acceptCheckoutButton = document.getElementById(
        "accept-checkout-message-button"
    );

    if (acceptCheckoutButton) {
        acceptCheckoutButton.addEventListener(
            "click",
            () => {
                closeModal(DOM.checkoutModal);
            }
        );
    }
}


/**
 * Configura la delegación de eventos.
 */
function initializeDelegatedEvents() {
    document.addEventListener(
        "click",
        event => {
            if (
                !event.target.closest(
                    ".language-selector"
                )
            ) {
                closeLanguageMenu();
            }

            const removeFilterButton =
                event.target.closest(
                    "[data-remove-filter]"
                );

            if (removeFilterButton) {
                event.preventDefault();

                removeActiveFilter(
                    removeFilterButton.dataset
                        .removeFilter,
                    removeFilterButton.dataset
                        .filterValue || ""
                );

                return;
            }
            const navigationLink = event.target.closest(
                "[data-navigation]"
            );

            if (navigationLink) {
                event.preventDefault();

                disableOffersMode();

                const destination =
                    navigationLink.dataset.navigation;

                document
                    .querySelectorAll("[data-navigation]")
                    .forEach(link => {
                        link.classList.remove("active");
                    });

                navigationLink.classList.add("active");

                if (destination === "home") {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }

                if (destination === "products") {
                    scrollToCatalog();
                }

                closeNavigationMenus();
            }

            const actionElement =
                event.target.closest("[data-action]");

            if (actionElement) {
                handleProductAction(actionElement);
            }

            const categoryElement =
                event.target.closest(
                    "[data-category], [data-category-filter]"
                );

            if (
                categoryElement &&
                !categoryElement.classList.contains(
                    "product-card"
                )
            ) {
                const category =
                    categoryElement.dataset.category ||
                    categoryElement.dataset.categoryFilter;

                const subcategory =
                    categoryElement.dataset.subcategory ||
                    null;

                if (category) {
                    event.preventDefault();

                    activateCategory(
                        category,
                        subcategory
                    );

                    closeNavigationMenus();
                }
            }

            const subcategoryLink =
                event.target.closest(
                    ".subcategory-link"
                );

            if (subcategoryLink) {
                event.preventDefault();

                const category =
                    subcategoryLink.dataset.category;

                const subcategory =
                    subcategoryLink.dataset.subcategory ||
                    subcategoryLink.textContent.trim();

                if (category) {
                    activateCategory(
                        category,
                        subcategory
                    );
                }
            }

            const modalCloseElement =
                event.target.closest(
                    "[data-close-modal], .modal__close"
                );

            if (modalCloseElement) {
                const modal =
                    modalCloseElement.closest(
                        ".modal"
                    );

                closeModal(modal);
            }

            const modalOverlay =
                event.target.closest(
                    ".modal__overlay"
                );

            if (modalOverlay) {
                closeModal(
                    modalOverlay.closest(".modal")
                );
            }

            const drawerCloseButton =
                event.target.closest(
                    "[data-close-drawer], " +
                    ".side-drawer .close-button"
                );

            if (drawerCloseButton) {
                closeDrawer(
                    drawerCloseButton.closest(
                        ".side-drawer"
                    )
                );
            }

            if (
                !event.target.closest(
                    ".navigation-dropdown"
                ) &&
                !event.target.closest(
                    ".mobile-menu-button"
                )
            ) {
                if (DOM.categoriesDropdown) {
                    DOM.categoriesDropdown.classList.remove(
                        "is-open"
                    );
                }
            }
        }
    );

    document.addEventListener(
        "change",
        event => {
            const input = event.target;

            if (
                input instanceof HTMLInputElement &&
                input.dataset.filterType
            ) {
                handleFilterInputChange(input);
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key !== "Escape") {
                return;
            }

            closeAllModals();
            closeAllDrawers();
            closeMobileFilters();
            closeNavigationMenus();
            closeLanguageMenu();
        }
    );
}


/* =========================================================
   23. FORMULARIO DE CONTACTO
========================================================= */

/**
 * Activa la simulación del formulario.
 */
function initializeContactForm() {
    const form = selectFirst(
        "#contact-form",
        ".contact-form"
    );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        event => {
            event.preventDefault();

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent =
                    getAppTranslation(
                        "contact.sending",
                        "Enviando..."
                    );
            }

            window.setTimeout(
                () => {
                    form.reset();

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent =
                            getAppTranslation(
                                "contact.send",
                                "Enviar mensaje"
                            );
                    }

                    showToast(
                        getAppTranslation(
                            "contact.sentTitle",
                            "Mensaje enviado"
                        ),
                        getAppTranslation(
                            "contact.sentMessage",
                            "El formulario simulado se procesó correctamente."
                        ),
                        "success"
                    );
                },
                700
            );
        }
    );
}


/* =========================================================
   24. AÑO DEL FOOTER
========================================================= */

/**
 * Actualiza el año automáticamente.
 */
function updateCurrentYear() {
    if (DOM.currentYear) {
        DOM.currentYear.textContent =
            String(new Date().getFullYear());
    }
}


/* =========================================================
   25. INICIALIZACIÓN
========================================================= */

/**
 * Comprueba que products.js se haya cargado.
 *
 * @returns {boolean}
 */
function loadProductCatalog() {
    const catalog =
        window.LENCHOTECH_PRODUCTS;

    if (!Array.isArray(catalog)) {
        console.error(
            "LeNCHoTeCH: no se pudo cargar el catálogo. " +
            "Verifica que products.js aparezca antes de script.js."
        );

        showToast(
            getAppTranslation(
                "catalog.errorTitle",
                "Error de catálogo"
            ),
            getAppTranslation(
                "catalog.errorMessage",
                "No fue posible cargar los productos."
            ),
            "danger"
        );

        return false;
    }

    LeNCHoTeCHState.products =
        [...catalog];

    LeNCHoTeCHState.filteredProducts =
        [...catalog];

    return true;
}


/**
 * Inicializa toda la tienda.
 */
function initializeLeNCHoTeCH() {
    cacheDOMElements();
    initializeTheme();
    initializeLanguageSelector();
    initializeImageFallbacks();
    initializeDirectEvents();
    initializeDelegatedEvents();
    initializeScrollAnimations();
    initializeContactForm();
    updateCurrentYear();
    updateBackToTopVisibility();

    const catalogLoaded =
        loadProductCatalog();

    if (catalogLoaded) {
        initializeFilters();
        applyProductFilters();
    }

    window.requestAnimationFrame(
        () => {
            DOM.body.classList.add(
                "page-loaded"
            );
        }
    );

    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:ready",
            {
                detail: {
                    productCount:
                        LeNCHoTeCHState.products.length
                }
            }
        )
    );

    console.log(
        `LeNCHoTeCH iniciado con ${
            LeNCHoTeCHState.products.length
        } productos.`
    );
}


/* =========================================================
   26. API GLOBAL
========================================================= */

/*
    Los próximos archivos podrán utilizar estas funciones
    sin duplicar la lógica del proyecto.
*/

window.LENCHOTECH_APP = {
    state: LeNCHoTeCHState,
    dom: DOM,

    findProductById,
    renderProducts,
    applyProductFilters,
    activateCategory,
    getTranslatedCategoryName,
    getTranslatedSubcategoryName,
    getTranslatedSpecificationName,
    getTranslatedSpecificationValue,
    getTranslatedProductName,
    getTranslatedProductDescription,
    getTranslatedProductBadge,

    scrollToCatalog,
    openQuickView,

    openModal,
    closeModal,
    closeAllModals,

    openDrawer,
    closeDrawer,
    closeAllDrawers,

    showToast,
    formatPrice: formatProductPrice,
    escapeHTML,
    createProductPlaceholderHTML
};


/* =========================================================
   27. EJECUCIÓN
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeLeNCHoTeCH
    );
} else {
    initializeLeNCHoTeCH();
}
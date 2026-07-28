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
        maxPrice: Infinity
    },

    sort: "featured",
    activeModal: null,
    activeDrawer: null
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
            ".navigation-link--button, [data-dropdown-toggle]"
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

    DOM.availabilityFilterContainer = selectFirst(
        "#availability-filter-options",
        "[data-availability-filters]"
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
    const utils = getProductUtils();

    if (typeof utils.getProductSearchText === "function") {
        return utils.getProductSearchText(product);
    }

    const specifications = Object.entries(
        product.specifications || {}
    )
        .map(([key, value]) => `${key} ${value}`)
        .join(" ");

    return normalizeText(
        [
            product.name,
            product.brand,
            product.category,
            product.subcategory,
            product.description,
            specifications
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
                        ${escapeHTML(label)}
                    </span>

                    <strong class="quick-spec__value">
                        ${escapeHTML(value)}
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
    const stock = Number(product.stock) || 0;

    if (stock <= 0) {
        return {
            className: "product-card__stock--out",
            text: "Producto agotado"
        };
    }

    if (stock <= 5) {
        return {
            className: "product-card__stock--low",
            text: `Solo quedan ${stock}`
        };
    }

    return {
        className: "",
        text: `${stock} disponibles`
    };
}


/**
 * Crea el HTML de una tarjeta.
 *
 * @param {object} product
 * @returns {string}
 */
function createProductCardHTML(product) {
    const stockInformation = getStockInformation(product);
    const hasOldPrice =
        Number(product.oldPrice) > Number(product.price);

    const badgeHTML = product.badge
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
                ${escapeHTML(product.badge)}
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
        `${product.name} de la marca ${product.brand}`;

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
                aria-label="Agregar ${escapeHTML(product.name)} a favoritos"
                aria-pressed="false"
                title="Agregar a favoritos"
            >
                ♡
            </button>

            <div class="product-card__image-wrapper">
                <img
                    class="product-card__image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(imageAlternative)}"
                    data-product-name="${escapeHTML(product.name)}"
                    loading="lazy"
                >

                <div class="product-card__quick-specs">
                    ${createQuickSpecificationsHTML(product)}
                </div>
            </div>

            <div class="product-card__content">
                <span class="product-card__category">
                    ${escapeHTML(product.category)}
                    ·
                    ${escapeHTML(product.subcategory)}
                </span>

                <h3 class="product-card__name">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-card__description">
                    ${escapeHTML(product.description)}
                </p>

                <div
                    class="product-card__rating-row"
                    aria-label="Valoración de ${product.rating} de 5"
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
                        Vista rápida
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
                                ? "Agotado"
                                : "Añadir"
                        }
                    </button>
                </div>

                <label class="product-card__compare">
                    <input
                        type="checkbox"
                        data-action="toggle-compare"
                        data-product-id="${product.id}"
                    >

                    <span>Comparar producto</span>
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

    const total = LeNCHoTeCHState.products.length;

    DOM.resultsText.textContent =
        amount === total
            ? `${total} productos disponibles`
            : `${amount} de ${total} productos`;
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
                    type === "category" ||
                    type === "availability"
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
        label: "Todas las categorías",
        count: LeNCHoTeCHState.products.length,
        checked: true
    });

    const categoryOptions = categories
        .map(
            category =>
                createFilterOptionHTML({
                    type: "category",
                    value: category,
                    label: category,
                    count: countProductsByProperty(
                        "category",
                        category
                    )
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
                    label: subcategory,
                    count,
                    checked
                });
            })
            .join("");

    if (subcategories.length === 0) {
        DOM.subcategoryFilterContainer.innerHTML = `
            <p class="filter-empty-message">
                No hay subcategorías disponibles.
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
 * Genera el filtro de disponibilidad.
 */
function renderAvailabilityFilters() {
    if (!DOM.availabilityFilterContainer) {
        return;
    }

    const availableCount =
        LeNCHoTeCHState.products.filter(
            product => product.stock > 0
        ).length;

    const lowStockCount =
        LeNCHoTeCHState.products.filter(
            product =>
                product.stock > 0 &&
                product.stock <= 5
        ).length;

    const outOfStockCount =
        LeNCHoTeCHState.products.filter(
            product => product.stock <= 0
        ).length;

    DOM.availabilityFilterContainer.innerHTML = [
        {
            value: "all",
            label: "Todos",
            count: LeNCHoTeCHState.products.length,
            checked: true
        },
        {
            value: "available",
            label: "Disponibles",
            count: availableCount
        },
        {
            value: "low",
            label: "Pocas unidades",
            count: lowStockCount
        },
        {
            value: "out",
            label: "Agotados",
            count: outOfStockCount
        }
    ]
        .map(option =>
            createFilterOptionHTML({
                type: "availability",
                ...option
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
    renderAvailabilityFilters();
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
        maxPrice
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
        availability === "low" &&
        !(product.stock > 0 && product.stock <= 5)
    ) {
        return false;
    }

    if (
        availability === "out" &&
        product.stock > 0
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

    switch (LeNCHoTeCHState.sort) {
        case "price-low":
            sortedProducts.sort(
                (first, second) =>
                    first.price - second.price
            );
            break;

        case "price-high":
            sortedProducts.sort(
                (first, second) =>
                    second.price - first.price
            );
            break;

        case "rating":
            sortedProducts.sort(
                (first, second) =>
                    second.rating - first.rating
            );
            break;

        case "name":
            sortedProducts.sort(
                (first, second) =>
                    first.name.localeCompare(
                        second.name,
                        "es",
                        {
                            sensitivity: "base"
                        }
                    )
            );
            break;

        case "newest":
            sortedProducts.sort(
                (first, second) =>
                    second.id - first.id
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
            : Infinity
    };

    LeNCHoTeCHState.sort = "featured";

    if (DOM.searchInput) {
        DOM.searchInput.value = "";
    }

    if (DOM.sortSelect) {
        DOM.sortSelect.value = "featured";
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
                input.dataset.filterType === "category" ||
                input.dataset.filterType === "availability"
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
        "Filtros eliminados",
        "Se están mostrando todos los productos.",
        "success"
    );
}


/* =========================================================
   9. FILTROS ACTIVOS
========================================================= */

/**
 * Genera el resumen de filtros activos.
 */
function renderActiveFilters() {
    if (!DOM.activeFilters) {
        return;
    }

    const filterLabels = [];

    if (LeNCHoTeCHState.filters.search) {
        filterLabels.push(
            `Búsqueda: “${escapeHTML(
                DOM.searchInput
                    ? DOM.searchInput.value.trim()
                    : LeNCHoTeCHState.filters.search
            )}”`
        );
    }

    if (
        LeNCHoTeCHState.filters.category !== "all"
    ) {
        filterLabels.push(
            escapeHTML(
                LeNCHoTeCHState.filters.category
            )
        );
    }

    filterLabels.push(
        ...LeNCHoTeCHState.filters.subcategories.map(
            escapeHTML
        )
    );

    filterLabels.push(
        ...LeNCHoTeCHState.filters.brands.map(
            escapeHTML
        )
    );

    if (
        LeNCHoTeCHState.filters.availability !== "all"
    ) {
        const availabilityLabels = {
            available: "Disponibles",
            low: "Pocas unidades",
            out: "Agotados"
        };

        filterLabels.push(
            availabilityLabels[
                LeNCHoTeCHState.filters.availability
            ]
        );
    }

    if (filterLabels.length === 0) {
        DOM.activeFilters.innerHTML =
            "No hay filtros activos.";
        return;
    }

    DOM.activeFilters.innerHTML = `
        <strong>Filtros activos:</strong>
        ${filterLabels.join(" · ")}
    `;
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

    if (filterType === "availability") {
        LeNCHoTeCHState.filters.availability =
            value;
    }

    applyProductFilters();
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

            card.classList.toggle(
                "is-active",
                cardCategory ===
                    LeNCHoTeCHState.filters.category
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
                    <span>${escapeHTML(label)}</span>
                    <strong>${escapeHTML(value)}</strong>
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
        <button
            class="modal__close"
            type="button"
            data-close-modal
            aria-label="Cerrar vista rápida"
        >
            ×
        </button>

        <div class="quick-view-layout">
            <div class="quick-view__image-wrapper">
                <img
                    class="quick-view__image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    data-product-name="${escapeHTML(product.name)}"
                >
            </div>

            <div class="quick-view__information">
                <span class="quick-view__category">
                    ${escapeHTML(product.category)}
                    ·
                    ${escapeHTML(product.subcategory)}
                </span>

                <h2 class="quick-view__title">
                    ${escapeHTML(product.name)}
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
                        (${Number(product.reviews) || 0} reseñas)
                    </span>
                </div>

                <p class="quick-view__description">
                    ${escapeHTML(product.description)}
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
                    >
                        ♡ Favorito
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
                                ? "Producto agotado"
                                : "Añadir al carrito"
                        }
                    </button>
                </div>
            </div>
        </div>
    `;

    contentTarget.innerHTML = productHTML;

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

        DOM.themeButton.title = darkTheme
            ? "Cambiar al tema claro"
            : "Cambiar al tema oscuro";
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
                "lenchotech:add-to-cart",
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
            showToast(
                "Producto seleccionado",
                `${product.name} está preparado para añadirse al carrito.`,
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
                    ? "Añadido a favoritos"
                    : "Eliminado de favoritos",
                product.name,
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
            showToast(
                actionElement.checked
                    ? "Producto seleccionado"
                    : "Producto retirado",
                `${product.name} ${
                    actionElement.checked
                        ? "se añadió al comparador."
                        : "se eliminó del comparador."
                }`,
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
}


/**
 * Configura la delegación de eventos.
 */
function initializeDelegatedEvents() {
    document.addEventListener(
        "click",
        event => {
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
                    "Enviando...";
            }

            window.setTimeout(
                () => {
                    form.reset();

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent =
                            "Enviar mensaje";
                    }

                    showToast(
                        "Mensaje enviado",
                        "La demostración registró el formulario correctamente.",
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
            "Error de catálogo",
            "No fue posible cargar los productos.",
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
    scrollToCatalog,

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
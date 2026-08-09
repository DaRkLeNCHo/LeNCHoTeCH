/* =========================================================
   LENCHOTECH
   SISTEMA DE COMPARACIÓN DE PRODUCTOS
========================================================= */

"use strict";


/* =========================================================
   1. CONFIGURACIÓN
========================================================= */

const COMPARE_STORAGE_KEY =
    "lenchotech-compare";

const COMPARE_MAX_PRODUCTS = 3;

const LeNCHoTeCHCompareState = {
    productIds: []
};


/* =========================================================
   2. UTILIDADES GENERALES
========================================================= */

/**
 * Devuelve la API principal de la tienda.
 *
 * @returns {object}
 */
function getCompareApp() {
    return window.LENCHOTECH_APP || {};
}


/**
 * Busca un producto por su ID.
 *
 * @param {number|string} productId
 * @returns {object|null}
 */
function getCompareProductById(productId) {
    const app = getCompareApp();

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

    return (
        products.find(
            product =>
                Number(product.id) ===
                normalizedId
        ) || null
    );
}


/**
 * Convierte contenido a HTML seguro.
 *
 * @param {unknown} value
 * @returns {string}
 */
function escapeCompareHTML(value) {
    const app = getCompareApp();

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
 * Obtiene una traducción para el comparador.
 *
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
function getCompareTranslation(
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
 * variables como {name}, {count} o {position}.
 *
 * @param {string} key
 * @param {string} fallback
 * @param {Record<string, string|number>} variables
 * @returns {string}
 */
function getCompareTranslationWithVariables(
    key,
    fallback,
    variables = {}
) {
    let translatedText =
        getCompareTranslation(
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
 * Formatea precios.
 *
 * @param {number} amount
 * @returns {string}
 */
function formatComparePrice(amount) {
    const app = getCompareApp();

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
 * Muestra una notificación.
 *
 * @param {string} title
 * @param {string} message
 * @param {string} type
 */
function showCompareToast(
    title,
    message,
    type = "default"
) {
    const app = getCompareApp();

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
 * Cierra otros paneles o modales cuando sea necesario.
 */
function closeCompareInterfaces() {
    const app = getCompareApp();

    if (
        typeof app.closeAllDrawers ===
        "function"
    ) {
        app.closeAllDrawers();
    }
}


/* =========================================================
   3. ALMACENAMIENTO LOCAL
========================================================= */

/**
 * Guarda la selección de comparación.
 */
function saveCompareProducts() {
    try {
        localStorage.setItem(
            COMPARE_STORAGE_KEY,
            JSON.stringify(
                LeNCHoTeCHCompareState.productIds
            )
        );
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible guardar la comparación.",
            error
        );
    }
}


/**
 * Carga la comparación desde localStorage.
 */
function loadCompareProducts() {
    try {
        const storedData =
            localStorage.getItem(
                COMPARE_STORAGE_KEY
            );

        if (!storedData) {
            LeNCHoTeCHCompareState.productIds =
                [];

            return;
        }

        const parsedData =
            JSON.parse(storedData);

        if (!Array.isArray(parsedData)) {
            LeNCHoTeCHCompareState.productIds =
                [];

            return;
        }

        LeNCHoTeCHCompareState.productIds =
            parsedData
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
                            getCompareProductById(
                                productId
                            );

                        return (
                            Boolean(product) &&
                            array.indexOf(productId) ===
                                index
                        );
                    }
                )
                .slice(
                    0,
                    COMPARE_MAX_PRODUCTS
                );

        saveCompareProducts();
    } catch (error) {
        console.warn(
            "LeNCHoTeCH: no fue posible cargar la comparación.",
            error
        );

        LeNCHoTeCHCompareState.productIds =
            [];
    }
}


/* =========================================================
   4. SELECTORES DEL DOM
========================================================= */

/**
 * Devuelve la barra inferior de comparación.
 *
 * @returns {HTMLElement|null}
 */
function getCompareBar() {
    return document.querySelector(
        "#compare-bar, " +
        ".compare-bar, " +
        "[data-compare-bar]"
    );
}


/**
 * Devuelve el contenedor de productos de la barra.
 *
 * @returns {HTMLElement|null}
 */
function getCompareBarItems() {
    return document.querySelector(
        "#compare-items, " +
        ".compare-bar__items, " +
        "[data-compare-items]"
    );
}


/**
 * Devuelve el contador de comparación.
 *
 * @returns {HTMLElement|null}
 */
function getCompareCountElement() {
    return document.querySelector(
        "#compare-count, " +
        "[data-compare-count]"
    );
}


/**
 * Devuelve el botón para abrir la comparación.
 *
 * @returns {HTMLElement|null}
 */
function getOpenCompareButton() {
    return document.querySelector(
        "#open-compare-button, " +
        "[data-compare-action='open']"
    );
}


/**
 * Devuelve el modal comparativo.
 *
 * @returns {HTMLElement|null}
 */
function getCompareModal() {
    return document.querySelector(
        "#compare-modal, " +
        ".compare-modal, " +
        "[data-compare-modal]"
    );
}


/**
 * Devuelve el cuerpo de la tabla comparativa.
 *
 * @returns {HTMLElement|null}
 */
function getCompareTableContainer() {
    return document.querySelector(
        "#compare-table-container, " +
        "#compare-table, " +
        ".compare-table-container, " +
        "[data-compare-table]"
    );
}


/**
 * Obtiene todos los botones de comparar.
 *
 * @returns {HTMLElement[]}
 */
function getAllCompareButtons() {
    return Array.from(
        document.querySelectorAll(
            "[data-compare-button], " +
            "[data-action='compare'], " +
            "[data-action='toggle-compare'], " +
            "[data-product-compare], " +
            ".compare-button"
        )
    );
}


/* =========================================================
   5. INFORMACIÓN DE LA COMPARACIÓN
========================================================= */

/**
 * Comprueba si un producto está seleccionado.
 *
 * @param {number|string} productId
 * @returns {boolean}
 */
function isProductCompared(productId) {
    return LeNCHoTeCHCompareState
        .productIds
        .includes(Number(productId));
}


/**
 * Devuelve los productos completos seleccionados.
 *
 * @returns {object[]}
 */
function getComparedProducts() {
    return LeNCHoTeCHCompareState
        .productIds
        .map(productId =>
            getCompareProductById(productId)
        )
        .filter(Boolean);
}


/**
 * Devuelve la cantidad de productos seleccionados.
 *
 * @returns {number}
 */
function getCompareCount() {
    return LeNCHoTeCHCompareState
        .productIds
        .length;
}


/* =========================================================
   6. AÑADIR PRODUCTOS
========================================================= */

/**
 * Añade un producto a la comparación.
 *
 * @param {number|string} productId
 * @param {boolean} showMessage
 * @returns {boolean}
 */
function addProductToCompare(
    productId,
    showMessage = true
) {
    const product =
        getCompareProductById(productId);

    if (!product) {
        showCompareToast(
            getCompareTranslation(
                "compare.productNotFoundTitle",
                "Producto no encontrado"
            ),
            getCompareTranslation(
                "compare.productNotFoundMessage",
                "No fue posible añadir el producto a la comparación."
            ),
            "danger"
        );

        return false;
    }

    if (isProductCompared(product.id)) {
        return false;
    }

    if (
        getCompareCount() >=
        COMPARE_MAX_PRODUCTS
    ) {
        showCompareToast(
            getCompareTranslation(
                "compare.limitReachedTitle",
                "Límite alcanzado"
            ),
            getCompareTranslationWithVariables(
                "compare.limitReachedMessage",
                "Solo puedes comparar hasta {count} productos a la vez.",
                {
                    count:
                        COMPARE_MAX_PRODUCTS
                }
            ),
            "warning"
        );

        synchronizeCompareButtons();

        return false;
    }

    LeNCHoTeCHCompareState
        .productIds
        .push(Number(product.id));

    saveCompareProducts();
    renderCompareInterface();
    dispatchCompareUpdatedEvent();

    if (showMessage) {
        showCompareToast(
            getCompareTranslation(
                "compare.addedTitle",
                "Añadido a comparación"
            ),
            getCompareTranslationWithVariables(
                "compare.addedMessage",
                "{name} está listo para comparar.",
                {
                    name:
                        getCompareApp()
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
   7. ELIMINAR PRODUCTOS
========================================================= */

/**
 * Elimina un producto de la comparación.
 *
 * @param {number|string} productId
 * @param {boolean} showMessage
 * @returns {boolean}
 */
function removeProductFromCompare(
    productId,
    showMessage = true
) {
    const normalizedId =
        Number(productId);

    const product =
        getCompareProductById(
            normalizedId
        );

    const originalLength =
        getCompareCount();

    LeNCHoTeCHCompareState.productIds =
        LeNCHoTeCHCompareState
            .productIds
            .filter(
                storedId =>
                    storedId !== normalizedId
            );

    if (
        originalLength ===
        getCompareCount()
    ) {
        return false;
    }

    saveCompareProducts();
    renderCompareInterface();
    dispatchCompareUpdatedEvent();

    if (showMessage) {
        showCompareToast(
            getCompareTranslation(
                "compare.removedTitle",
                "Eliminado de comparación"
            ),
            product
                ? getCompareTranslationWithVariables(
                    "compare.removedMessage",
                    "{name} fue retirado.",
                    {
                        name:
                            getCompareApp()
                                .getTranslatedProductName?.(
                                    product
                                ) ||
                            product.name
                    }
                )
                : getCompareTranslation(
                    "compare.removedGenericMessage",
                    "El producto fue retirado."
                ),
            "default"
        );
    }

    return true;
}


/**
 * Vacía toda la comparación.
 *
 * @param {boolean} showMessage
 */
function clearCompareProducts(
    showMessage = true
) {
    if (getCompareCount() === 0) {
        return;
    }

    LeNCHoTeCHCompareState.productIds =
        [];

    saveCompareProducts();
    renderCompareInterface();
    closeCompareModal();
    dispatchCompareUpdatedEvent();

    if (showMessage) {
        showCompareToast(
            getCompareTranslation(
                "compare.clearedTitle",
                "Comparación eliminada"
            ),
            getCompareTranslation(
                "compare.clearedMessage",
                "La lista de comparación quedó vacía."
            ),
            "default"
        );
    }
}


/* =========================================================
   8. ALTERNAR PRODUCTOS
========================================================= */

/**
 * Añade o elimina un producto.
 *
 * @param {number|string} productId
 * @returns {boolean}
 */
function toggleCompareProduct(productId) {
    const normalizedId =
        Number(productId);

    if (
        isProductCompared(normalizedId)
    ) {
        removeProductFromCompare(
            normalizedId
        );

        return false;
    }

    return addProductToCompare(
        normalizedId
    );
}


/* =========================================================
   9. ELEMENTOS DE LA BARRA
========================================================= */

/**
 * Genera el HTML de un producto en la barra.
 *
 * @param {object} product
 * @returns {string}
 */
function createCompareBarItemHTML(product) {
    const app =
        getCompareApp();

    const visibleProductName =
        typeof app.getTranslatedProductName ===
        "function"
            ? app.getTranslatedProductName(
                product
            )
            : product.name;

    return `
        <article
            class="compare-bar__item"
            data-compare-product-id="${product.id}"
        >
            <div class="compare-bar__image-wrapper">
                <img
                    class="compare-bar__image"
                    src="${escapeCompareHTML(product.image)}"
                    alt="${escapeCompareHTML(
                        visibleProductName
                    )}"
                    data-compare-product-name="${escapeCompareHTML(
                        visibleProductName
                    )}"
                    loading="lazy"
                >
            </div>

            <div class="compare-bar__item-content">
                <span class="compare-bar__brand">
                    ${escapeCompareHTML(product.brand)}
                </span>

                <strong class="compare-bar__product-name">
                    ${escapeCompareHTML(
                        visibleProductName
                    )}
                </strong>
            </div>

            <button
                type="button"
                class="compare-bar__remove"
                data-compare-action="remove"
                data-product-id="${product.id}"
                aria-label="${escapeCompareHTML(
                    getCompareTranslationWithVariables(
                        "compare.removeProductLabel",
                        "Eliminar {name} de la comparación",
                        {
                            name: visibleProductName
                        }
                    )
                )}"
                title="${escapeCompareHTML(
                    getCompareTranslation(
                        "compare.removeFromComparison",
                        "Eliminar de la comparación"
                    )
                )}"
            >
                ×
            </button>
        </article>
    `;
}

/* =========================================================
   10. RENDERIZAR LA BARRA
========================================================= */

/**
 * Actualiza la barra inferior.
 */
function renderCompareBar() {
    const bar =
        getCompareBar();

    const itemsContainer =
        getCompareBarItems();

    const products =
        getComparedProducts();

    if (bar) {
        const shouldShow =
            products.length > 0;

        bar.hidden = !shouldShow;

        bar.classList.toggle(
            "is-visible",
            shouldShow
        );

        bar.setAttribute(
            "aria-hidden",
            String(!shouldShow)
        );
    }

    if (itemsContainer) {
        const productItems =
            products
                .map(
                    createCompareBarItemHTML
                )
                .join("");

        itemsContainer.innerHTML =
            productItems;
    }

    updateCompareCounter();
    updateOpenCompareButton();
}


/**
 * Actualiza el contador.
 */
function updateCompareCounter() {
    const countElement =
        getCompareCountElement();

    if (!countElement) {
        return;
    }

    const count =
        getCompareCount();

    countElement.textContent =
        String(count);

    countElement.setAttribute(
        "aria-label",
        count === 1
            ? getCompareTranslation(
                "compare.counterSingle",
                "1 producto seleccionado"
            )
            : getCompareTranslationWithVariables(
                "compare.counterPlural",
                "{count} productos seleccionados",
                {
                    count
                }
            )
    );
}


/**
 * Activa o desactiva el botón de comparar.
 */
function updateOpenCompareButton() {
    const button =
        getOpenCompareButton();

    if (!button) {
        return;
    }

    const count =
        getCompareCount();

    /*
     * Para que una comparación tenga sentido,
     * se requieren al menos dos productos.
     */
    button.disabled =
        count < 2;

    button.setAttribute(
        "aria-disabled",
        String(count < 2)
    );

    if (count < 2) {
        button.title =
            getCompareTranslation(
                "compare.selectTwoTitle",
                "Selecciona al menos dos productos"
            );
    } else {
        button.title =
            getCompareTranslation(
                "compare.openComparison",
                "Abrir comparación"
            );
    }
}


/* =========================================================
   11. ESPECIFICACIONES
========================================================= */

/**
 * Obtiene todas las especificaciones distintas.
 *
 * @param {object[]} products
 * @returns {string[]}
 */
function getAllSpecificationNames(products) {
    const specificationNames =
        new Set();

    products.forEach(product => {
        const specifications =
            product.specifications;

        if (
            !specifications ||
            typeof specifications !==
                "object"
        ) {
            return;
        }

        Object.keys(
            specifications
        ).forEach(name => {
            specificationNames.add(name);
        });
    });

    return Array.from(
        specificationNames
    );
}


/**
 * Obtiene una especificación concreta.
 *
 * @param {object} product
 * @param {string} specificationName
 * @returns {string}
 */
function getProductSpecification(
    product,
    specificationName
) {
    const specifications =
        product.specifications;

    if (
        !specifications ||
        typeof specifications !==
            "object"
    ) {
        return getCompareTranslation(
            "compare.notSpecified",
            "No especificado"
        );
    }

    const value =
        specifications[
            specificationName
        ];

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return getCompareTranslation(
            "compare.notSpecified",
            "No especificado"
        );
    }

    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "boolean") {
        return value
            ? getCompareTranslation(
                "compare.yes",
                "Sí"
            )
            : getCompareTranslation(
                "compare.no",
                "No"
            );
    }

    return String(value);
}


/* =========================================================
   12. TABLA DE COMPARACIÓN
========================================================= */

/**
 * Genera la cabecera de productos.
 *
 * @param {object[]} products
 * @returns {string}
 */
function createCompareTableHeader(products) {
    return `
        <thead>
            <tr>
                <th scope="col">
                    ${escapeCompareHTML(
                        getCompareTranslation(
                            "compare.feature",
                            "Característica"
                        )
                    )}
                </th>

                ${products
                    .map(product => {
                        const app =
                            getCompareApp();

                        const visibleProductName =
                            typeof app
                                .getTranslatedProductName ===
                                "function"
                                ? app
                                    .getTranslatedProductName(
                                        product
                                    )
                                : product.name;

                        return `
                            <th
                                scope="col"
                                class="compare-table__product-column"
                            >
                                <button
                                    type="button"
                                    class="compare-table__remove-product"
                                    data-compare-action="remove"
                                    data-product-id="${product.id}"
                                    aria-label="${escapeCompareHTML(
                                        getCompareTranslationWithVariables(
                                            "compare.removeProductLabel",
                                            "Eliminar {name} de la comparación",
                                            {
                                                name:
                                                    visibleProductName
                                            }
                                        )
                                    )}"
                                >
                                    ×
                                </button>

                                <div class="compare-table__product-image-wrapper">
                                    <img
                                        class="compare-table__product-image"
                                        src="${escapeCompareHTML(
                                            product.image
                                        )}"
                                        alt="${escapeCompareHTML(
                                            visibleProductName
                                        )}"
                                        data-compare-product-name="${escapeCompareHTML(
                                            visibleProductName
                                        )}"
                                        loading="lazy"
                                    >
                                </div>

                                <span class="compare-table__brand">
                                    ${escapeCompareHTML(
                                        product.brand
                                    )}
                                </span>

                                <strong class="compare-table__product-name">
                                    ${escapeCompareHTML(
                                        visibleProductName
                                    )}
                                </strong>
                            </th>
                        `;
                    })
                    .join("")}
            </tr>
        </thead>
    `;
}


/**
 * Genera las filas principales.
 *
 * @param {object[]} products
 * @returns {string}
 */
function createComparePrimaryRows(products) {
    const app =
        getCompareApp();

    const rows = [
        {
            label:
                getCompareTranslation(
                    "compare.price",
                    "Precio"
                ),

            getValue: product =>
                formatComparePrice(
                    product.price
                )
        },
        {
            label:
                getCompareTranslation(
                    "compare.category",
                    "Categoría"
                ),

            getValue: product =>
                product.category
                    ? app
                        .getTranslatedCategoryName(
                            product.category
                        )
                    : getCompareTranslation(
                        "compare.notSpecifiedFeminine",
                        "No especificada"
                    )
        },
        {
            label:
                getCompareTranslation(
                    "compare.subcategory",
                    "Subcategoría"
                ),

            getValue: product =>
                product.subcategory
                    ? app
                        .getTranslatedSubcategoryName(
                            product.subcategory
                        )
                    : getCompareTranslation(
                        "compare.notSpecifiedFeminine",
                        "No especificada"
                    )
        },
        {
            label:
                getCompareTranslation(
                    "compare.availability",
                    "Disponibilidad"
                ),

            getValue: product =>
                Number(product.stock) > 0
                    ? getCompareTranslationWithVariables(
                        "compare.availableStock",
                        "{stock} disponibles",
                        {
                            stock: product.stock
                        }
                    )
                    : getCompareTranslation(
                        "compare.soldOut",
                        "Agotado"
                    )
        },
        {
            label:
                getCompareTranslation(
                    "compare.rating",
                    "Calificación"
                ),

            getValue: product =>
                Number.isFinite(
                    Number(product.rating)
                )
                    ? getCompareTranslationWithVariables(
                        "compare.ratingValue",
                        "{rating} de 5",
                        {
                            rating:
                                product.rating
                        }
                    )
                    : getCompareTranslation(
                        "compare.noRating",
                        "Sin calificación"
                    )
        }
    ];

    return rows
        .map(
            row => `
                <tr>
                    <th scope="row">
                        ${escapeCompareHTML(row.label)}
                    </th>

                    ${products
                        .map(
                            product => `
                                <td>
                                    ${escapeCompareHTML(
                                        row.getValue(
                                            product
                                        )
                                    )}
                                </td>
                            `
                        )
                        .join("")}
                </tr>
            `
        )
        .join("");
}


/**
 * Genera las filas de especificaciones.
 *
 * @param {object[]} products
 * @returns {string}
 */
function createCompareSpecificationRows(
    products
) {
    const specificationNames =
        getAllSpecificationNames(
            products
        );

    if (
        specificationNames.length ===
        0
    ) {
        return `
            <tr>
                <th scope="row">
                    ${escapeCompareHTML(
                        getCompareTranslation(
                            "compare.specifications",
                            "Especificaciones"
                        )
                    )}
                </th>

                <td colspan="${products.length}">
                    ${escapeCompareHTML(
                        getCompareTranslation(
                            "compare.noAdditionalSpecifications",
                            "No hay especificaciones adicionales disponibles."
                        )
                    )}
                </td>
            </tr>
        `;
    }

    return specificationNames
        .map(
            specificationName => `
                <tr>
                    <th scope="row">
                        ${escapeCompareHTML(
                            getCompareApp()
                                .getTranslatedSpecificationName(
                                    specificationName
                                )
                        )}
                    </th>

                    ${products
                        .map(
                            product => `
                                <td>
                                    ${escapeCompareHTML(
                                        getCompareApp()
                                            .getTranslatedSpecificationValue(
                                                getProductSpecification(
                                                    product,
                                                    specificationName
                                                )
                                            )
                                    )}
                                </td>
                            `
                        )
                        .join("")}
                </tr>
            `
        )
        .join("");
}


/**
 * Genera la tabla completa.
 *
 * @param {object[]} products
 * @returns {string}
 */
function createCompareTableHTML(products) {
    return `
        <div class="compare-table-scroll">
            <table class="compare-table">
                ${createCompareTableHeader(
                    products
                )}

                <tbody>
                    ${createComparePrimaryRows(
                        products
                    )}

                    ${createCompareSpecificationRows(
                        products
                    )}
                </tbody>
            </table>
        </div>
    `;
}


/**
 * Genera el estado insuficiente.
 *
 * @returns {string}
 */
function createCompareInsufficientHTML() {
    return `
        <div class="empty-state compare-empty-state">
            <span
                class="empty-state__icon"
                aria-hidden="true"
            >
                ⇄
            </span>

            <h3>
                ${escapeCompareHTML(
                    getCompareTranslation(
                        "compare.insufficientTitle",
                        "Selecciona al menos dos productos"
                    )
                )}
            </h3>

            <p>
                ${escapeCompareHTML(
                    getCompareTranslation(
                        "compare.insufficientDescription",
                        "Añade productos desde el catálogo para comparar sus precios y características."
                    )
                )}
            </p>

            <button
                type="button"
                class="primary-button"
                data-compare-action="continue-shopping"
            >
                ${escapeCompareHTML(
                    getCompareTranslation(
                        "compare.exploreProducts",
                        "Explorar productos"
                    )
                )}
            </button>
        </div>
    `;
}


/**
 * Renderiza el contenido del modal.
 */
function renderCompareTable() {
    const container =
        getCompareTableContainer();

    if (!container) {
        return;
    }

    const products =
        getComparedProducts();

    if (products.length < 2) {
        container.innerHTML =
            createCompareInsufficientHTML();

        return;
    }

    container.innerHTML =
        createCompareTableHTML(products);
}


/* =========================================================
   13. MODAL
========================================================= */

/**
 * Abre el modal comparativo.
 */
function openCompareModal() {
    const products =
        getComparedProducts();

    if (products.length < 2) {
        showCompareToast(
            getCompareTranslation(
                "compare.incompleteTitle",
                "Comparación incompleta"
            ),
            getCompareTranslation(
                "compare.incompleteMessage",
                "Selecciona al menos dos productos para comparar."
            ),
            "warning"
        );

        return;
    }

    const modal =
        getCompareModal();

    if (!modal) {
        showCompareToast(
            getCompareTranslation(
                "compare.modalUnavailableTitle",
                "Modal no disponible"
            ),
            getCompareTranslation(
                "compare.modalUnavailableMessage",
                "No se encontró el área de comparación."
            ),
            "danger"
        );

        return;
    }

    closeCompareInterfaces();
    renderCompareTable();

    modal.hidden = false;

    modal.classList.add(
        "is-open"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

    const closeButton =
        modal.querySelector(
            "[data-compare-action='close'], " +
            ".close-button"
        );

    window.setTimeout(
        () => {
            closeButton?.focus();
        },
        50
    );
}


/**
 * Cierra el modal.
 */
function closeCompareModal() {
    const modal =
        getCompareModal();

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "is-open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    modal.hidden = true;

    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   14. SINCRONIZACIÓN DE BOTONES
========================================================= */

/**
 * Obtiene el ID asociado a un botón.
 *
 * @param {HTMLElement} button
 * @returns {number|null}
 */
function getCompareButtonProductId(button) {
    const possibleValues = [
        button.dataset.productId,
        button.dataset.compareProductId,
        button.dataset.productCompare,
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
 * Actualiza el estado visual de un botón.
 *
 * @param {HTMLElement} button
 * @param {boolean} active
 */
function updateCompareButtonState(
    button,
    active
) {
    button.classList.toggle(
        "is-compared",
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

    if (
        button instanceof HTMLInputElement &&
        button.type === "checkbox"
    ) {
        button.checked = active;

        const comparisonIsFull =
            getCompareCount() >=
            COMPARE_MAX_PRODUCTS;

        button.disabled =
            comparisonIsFull &&
            !active;
    }

    const productId =
        getCompareButtonProductId(button);

    const product =
        productId !== null
            ? getCompareProductById(
                  productId
              )
            : null;

    const productName =
        product
            ? (
                getCompareApp()
                    .getTranslatedProductName?.(
                        product
                    ) ||
                product.name
            )
            : getCompareTranslation(
                "compare.genericProduct",
                "este producto"
            );

    const hasComparedProducts =
        getCompareCount() > 0;

    let visibleText;
    let accessibleLabel;
    let titleText;

    if (active) {
        visibleText =
            getCompareTranslation(
                "compare.removeAction",
                "Eliminar de comparación"
            );

        accessibleLabel =
            getCompareTranslationWithVariables(
                "compare.removeProductLabel",
                "Eliminar {name} de la comparación",
                {
                    name: productName
                }
            );

        titleText =
            visibleText;
    } else if (hasComparedProducts) {
        visibleText =
            getCompareTranslation(
                "compare.addAction",
                "Añadir a comparación"
            );
 
        accessibleLabel =
            getCompareTranslationWithVariables(
                "compare.addProductLabel",
                "Añadir {name} a la comparación",
                {
                    name: productName
                }
            );

        titleText =
            visibleText;
    } else {
        visibleText =
            getCompareTranslation(
                "compare.idleAction",
                "Comparar"
            );

        accessibleLabel =
            getCompareTranslationWithVariables(
                "compare.idleProductLabel",
                "Comparar {name}",
                {
                    name: productName
                }
            );

        titleText =
            visibleText;
    }

    button.setAttribute(
        "aria-label",
        accessibleLabel
    );

    button.setAttribute(
        "title",
        titleText
    );

    const text =
        button
            .closest(".product-card__compare")
            ?.querySelector("span");

    if (text) {
        text.textContent =
            visibleText;
    }
}


/**
 * Sincroniza todos los botones.
 */
function synchronizeCompareButtons() {
    getAllCompareButtons()
        .forEach(button => {
            const productId =
                getCompareButtonProductId(
                    button
                );

            if (productId === null) {
                return;
            }

            updateCompareButtonState(
                button,
                isProductCompared(
                    productId
                )
            );
        });
}


/* =========================================================
   15. RENDERIZADO GENERAL
========================================================= */

/**
 * Actualiza toda la interfaz.
 */
function renderCompareInterface() {
    renderCompareBar();
    renderCompareTable();
    synchronizeCompareButtons();
}


/* =========================================================
   16. ACCIONES INTERNAS
========================================================= */

/**
 * Procesa botones exclusivos de la comparación.
 *
 * @param {HTMLElement} actionElement
 */
function handleCompareAction(
    actionElement
) {
    const action =
        actionElement.dataset
            .compareAction;

    const productId =
        actionElement.dataset.productId;

    switch (action) {
        case "open":
            openCompareModal();
            break;

        case "close":
            closeCompareModal();
            break;

        case "remove":
            removeProductFromCompare(
                productId
            );
            break;

        case "clear":
            clearCompareProducts();
            break;

        case "continue-shopping": {
            closeCompareModal();

            const catalog =
                document.querySelector(
                    "#catalog, " +
                    "#products, " +
                    "[data-catalog]"
                );

            catalog?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            break;
        }

        default:
            break;
    }
}


/* =========================================================
   17. EVENTOS PERSONALIZADOS
========================================================= */

/**
 * Emite información cuando cambia la comparación.
 */
function dispatchCompareUpdatedEvent() {
    document.dispatchEvent(
        new CustomEvent(
            "lenchotech:compare-updated",
            {
                detail: {
                    productIds: [
                        ...LeNCHoTeCHCompareState
                            .productIds
                    ],

                    products:
                        getComparedProducts(),

                    count:
                        getCompareCount(),

                    maximum:
                        COMPARE_MAX_PRODUCTS
                }
            }
        )
    );
}


/* =========================================================
   18. EVENTOS DEL DOCUMENTO
========================================================= */

/**
 * Inicializa los eventos.
 */
function initializeCompareEvents() {
    /*
     * Este es el único evento que recibe las solicitudes
     * procedentes de los botones de las tarjetas.
     *
     * compare.js NO vuelve a detectar directamente esos
     * botones, evitando una ejecución doble.
     */
    document.addEventListener(
        "lenchotech:toggle-compare",
        event => {
            const productId =
                event.detail?.productId;

            if (
                productId === undefined ||
                productId === null
            ) {
                return;
            }

            toggleCompareProduct(
                productId
            );
        }
    );

    /*
     * Solo procesa acciones internas de la barra
     * y del modal comparativo.
     */
    document.addEventListener(
        "click",
        event => {
            const target =
                event.target;

            if (!(target instanceof Element)) {
                return;
            }

            const actionElement =
                target.closest(
                    "[data-compare-action]"
                );

            if (!actionElement) {
                return;
            }

            handleCompareAction(
                actionElement
            );
        }
    );

    /*
     * Cierra el modal al presionar Escape.
     */
    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeCompareModal();
            }
        }
    );

    /*
     * Sincroniza botones cuando el catálogo cambia.
     */
    document.addEventListener(
        "lenchotech:products-rendered",
        synchronizeCompareButtons
    );

    document.addEventListener(
        "lenchotech:catalog-rendered",
        synchronizeCompareButtons
    );

    document.addEventListener(
        "lenchotech:quick-view-opened",
        synchronizeCompareButtons
    );
}


/* =========================================================
   19. OBSERVADOR DEL CATÁLOGO
========================================================= */

/**
 * Observa cambios en las tarjetas del catálogo.
 */
function initializeCompareObserver() {
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
                    synchronizeCompareButtons();

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
   20. IMÁGENES FALTANTES
========================================================= */

/**
 * Coloca un placeholder cuando una imagen falla.
 */
function initializeCompareImageFallbacks() {
    document.addEventListener(
        "error",
        event => {
            const image =
                event.target;

            if (
                !(
                    image instanceof
                    HTMLImageElement
                )
            ) {
                return;
            }

            if (
                !image.matches(
                    ".compare-bar__image, " +
                    ".compare-table__product-image"
                )
            ) {
                return;
            }

            const wrapper =
                image.parentElement;

            if (!wrapper) {
                image.hidden = true;

                return;
            }

            const productName =
                image.dataset
                    .compareProductName ||
                image.alt ||
                getCompareTranslation(
                    "compare.genericProductName",
                    "Producto"
                );

            wrapper.innerHTML = `
                <div
                    class="product-image-placeholder"
                    aria-label="${escapeCompareHTML(
                        getCompareTranslationWithVariables(
                            "compare.imageUnavailableLabel",
                            "Imagen no disponible para {name}",
                            {
                                name: productName
                            }
                        )
                    )}"
                >
                    <span
                        class="product-image-placeholder__icon"
                        aria-hidden="true"
                    >
                        📦
                    </span>
                </div>
            `;
        },
        true
    );
}


/* =========================================================
   21. INICIALIZACIÓN
========================================================= */

/**
 * Inicializa el módulo.
 */
function initializeCompare() {
    loadCompareProducts();
    initializeCompareEvents();
    initializeCompareObserver();
    initializeCompareImageFallbacks();
    renderCompareInterface();

    console.log(
        `LeNCHoTeCH Compare iniciado con ${getCompareCount()} productos.`
    );
}


/* =========================================================
   22. API GLOBAL
========================================================= */

window.LENCHOTECH_COMPARE = {
    state:
        LeNCHoTeCHCompareState,

    maximum:
        COMPARE_MAX_PRODUCTS,

    add:
        addProductToCompare,

    remove:
        removeProductFromCompare,

    toggle:
        toggleCompareProduct,

    clear:
        clearCompareProducts,

    has:
        isProductCompared,

    getIds() {
        return [
            ...LeNCHoTeCHCompareState
                .productIds
        ];
    },

    getProducts:
        getComparedProducts,

    getCount:
        getCompareCount,

    open:
        openCompareModal,

    close:
        closeCompareModal,

    render:
        renderCompareInterface,

    synchronize:
        synchronizeCompareButtons
};

document.addEventListener(
    "lenchotech:language-changed",
    () => {
        renderCompareInterface();
    }
);

/* =========================================================
   23. EJECUCIÓN
========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCompare
    );
} else {
    initializeCompare();
}
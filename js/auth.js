/* =========================================================
   LENCHOTECH
   SISTEMA DE AUTENTICACIÓN
========================================================= */

"use strict";


/* =========================================================
   1. FIREBASE
========================================================= */

import {
    auth,
    db
} from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";


/* =========================================================
   2. ELEMENTOS DEL DOM
========================================================= */

const authButton =
    document.getElementById("auth-button");

const authButtonLabel =
    document.getElementById("auth-button-label");

const authModal =
    document.getElementById("auth-modal");

const authModalOverlay =
    document.getElementById("auth-modal-overlay");

const closeAuthModalButton =
    document.getElementById(
        "close-auth-modal-button"
    );

const authTabButtons =
    document.querySelectorAll("[data-auth-tab]");

const authPanels =
    document.querySelectorAll("[data-auth-panel]");

const passwordToggleButtons =
    document.querySelectorAll(
        "[data-password-toggle]"
    );

const loginForm =
    document.getElementById("login-form");

const registerForm =
    document.getElementById("register-form");

const loginEmailInput =
    document.getElementById("login-email");

const loginPasswordInput =
    document.getElementById("login-password");

const registerNameInput =
    document.getElementById("register-name");

const registerEmailInput =
    document.getElementById("register-email");

const registerPasswordInput =
    document.getElementById("register-password");

const registerPasswordConfirmationInput =
    document.getElementById(
        "register-password-confirmation"
    );

const registerTermsInput =
    document.getElementById("register-terms");

const loginMessage =
    document.getElementById("login-message");

const registerMessage =
    document.getElementById("register-message");

const loginSubmitButton =
    document.getElementById("login-submit-button");

const registerSubmitButton =
    document.getElementById(
        "register-submit-button"
    );

const forgotPasswordButton =
    document.getElementById(
        "forgot-password-button"
    );

    const accountMenu =
    document.getElementById("account-menu");

const accountMenuOverlay =
    document.getElementById(
        "account-menu-overlay"
    );

const closeAccountMenuButton =
    document.getElementById(
        "close-account-menu-button"
    );

const accountUserName =
    document.getElementById(
        "account-user-name"
    );

const accountUserEmail =
    document.getElementById(
        "account-user-email"
    );

const accountAvatarLetter =
    document.getElementById(
        "account-avatar-letter"
    );

const accountEmailStatus =
    document.getElementById(
        "account-email-status"
    );

const resendVerificationButton =
    document.getElementById(
        "resend-verification-button"
    );

const logoutButton =
    document.getElementById("logout-button");

const adminPanelButton =
    document.getElementById(
        "admin-panel-button"
    );

    const adminModal =
    document.getElementById("admin-modal");

const adminModalOverlay =
    document.getElementById(
        "admin-modal-overlay"
    );

const closeAdminModalButton =
    document.getElementById(
        "close-admin-modal-button"
    );

const refreshAdminUsersButton =
    document.getElementById(
        "refresh-admin-users-button"
    );

const adminUsersMessage =
    document.getElementById(
        "admin-users-message"
    );

const adminUsersList =
    document.getElementById(
        "admin-users-list"
    );

const adminTotalUsers =
    document.getElementById(
        "admin-total-users"
    );

const adminVerifiedUsers =
    document.getElementById(
        "admin-verified-users"
    );

const adminUnverifiedUsers =
    document.getElementById(
        "admin-unverified-users"
    );

const adminTotalLogins =
    document.getElementById(
        "admin-total-logins"
    );

let currentUser = null;

let currentUserRole = "guest";

let isAdministrator = false;


/* =========================================================
   3. MENSAJES
========================================================= */

function showAuthMessage(
    element,
    message,
    type = "error"
) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.hidden = false;

    element.classList.toggle(
        "is-success",
        type === "success"
    );
}


function clearAuthMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = "";
    element.hidden = true;
    element.classList.remove("is-success");
}


function getFirebaseErrorMessage(error) {
    const errorMessages = {
        "auth/email-already-in-use":
            getAuthTranslation(
                "authentication.firebaseEmailInUse",
                "Ya existe una cuenta registrada con ese correo."
            ),

        "auth/invalid-email":
            getAuthTranslation(
                "authentication.firebaseInvalidEmail",
                "El correo electrónico no es válido."
            ),

        "auth/weak-password":
            getAuthTranslation(
                "authentication.firebaseWeakPassword",
                "La contraseña debe tener al menos 6 caracteres."
            ),

        "auth/invalid-credential":
            getAuthTranslation(
                "authentication.firebaseInvalidCredential",
                "El correo o la contraseña son incorrectos."
            ),

        "auth/user-disabled":
            getAuthTranslation(
                "authentication.firebaseUserDisabled",
                "Esta cuenta fue deshabilitada."
            ),

        "auth/too-many-requests":
            getAuthTranslation(
                "authentication.firebaseTooManyRequests",
                "Se realizaron demasiados intentos. Inténtalo más tarde."
            ),

        "auth/network-request-failed":
            getAuthTranslation(
                "authentication.firebaseNetworkError",
                "No fue posible conectar con Firebase. Revisa tu conexión."
            ),

        "auth/missing-password":
            getAuthTranslation(
                "authentication.firebaseMissingPassword",
                "Escribe tu contraseña."
            ),

        "auth/missing-email":
            getAuthTranslation(
                "authentication.firebaseMissingEmail",
                "Escribe tu correo electrónico."
            )
    };

    return (
        errorMessages[error?.code] ||
        getAuthTranslation(
            "authentication.firebaseUnexpectedError",
            "Ocurrió un error inesperado. Inténtalo nuevamente."
        )
    );
}


/* =========================================================
   4. ESTADO DE LOS BOTONES
========================================================= */

function setSubmitButtonLoading(
    button,
    isLoading,
    normalText,
    loadingText
) {
    if (!button) {
        return;
    }

    button.disabled = isLoading;
    button.textContent =
        isLoading ? loadingText : normalText;
}


/* =========================================================
   5. ABRIR Y CERRAR EL MODAL
========================================================= */

function openAuthModal() {
    if (!authModal) {
        return;
    }

    authModal.hidden = false;
    document.body.classList.add("no-scroll");

    const activeInput =
        authModal.querySelector(
            ".auth-panel.is-active input"
        );

    window.setTimeout(() => {
        activeInput?.focus();
    }, 100);
}


function closeAuthModal() {
    if (!authModal) {
        return;
    }

    authModal.hidden = true;
    document.body.classList.remove("no-scroll");

    clearAuthMessage(loginMessage);
    clearAuthMessage(registerMessage);

    authButton?.focus();
}


/* =========================================================
   6. PESTAÑAS
========================================================= */

function activateAuthTab(tabName) {
    clearAuthMessage(loginMessage);
    clearAuthMessage(registerMessage);

    authTabButtons.forEach(button => {
        const isActive =
            button.dataset.authTab === tabName;

        button.classList.toggle(
            "is-active",
            isActive
        );

        button.setAttribute(
            "aria-selected",
            String(isActive)
        );
    });

    authPanels.forEach(panel => {
        const isActive =
            panel.dataset.authPanel === tabName;

        panel.classList.toggle(
            "is-active",
            isActive
        );

        panel.hidden = !isActive;
    });

    const activePanel =
        document.querySelector(
            `[data-auth-panel="${tabName}"]`
        );

    activePanel
        ?.querySelector("input")
        ?.focus();
}


/* =========================================================
   7. VISIBILIDAD DE CONTRASEÑAS
========================================================= */

function togglePasswordVisibility(button) {
    const inputId =
        button.dataset.passwordToggle;

    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }

    const shouldShow =
        input.type === "password";

    input.type =
        shouldShow ? "text" : "password";

    const buttonText =
        shouldShow
            ? getAuthTranslation(
                "authentication.hidePassword",
                "Ocultar contraseña"
            )
            : getAuthTranslation(
                "authentication.showPassword",
                "Mostrar contraseña"
            );

    button.setAttribute(
        "aria-label",
        buttonText
    );

    button.setAttribute(
        "title",
        buttonText
    );
}


/* =========================================================
   8. CREAR CUENTA
========================================================= */

async function handleRegister(event) {
    event.preventDefault();

    clearAuthMessage(registerMessage);

    const name =
        registerNameInput?.value.trim() || "";

    const email =
        registerEmailInput?.value.trim() || "";

    const password =
        registerPasswordInput?.value || "";

    const passwordConfirmation =
        registerPasswordConfirmationInput?.value ||
        "";

    if (name.length < 2) {
        showAuthMessage(
            registerMessage,
            getAuthTranslation(
                "authentication.nameTooShort",
                "Escribe un nombre de al menos 2 caracteres."
            )
        );

        registerNameInput?.focus();
        return;
    }

    if (!email) {
        showAuthMessage(
            registerMessage,
            getAuthTranslation(
                "authentication.emailRequired",
                "Escribe tu correo electrónico."
            )
        );

        registerEmailInput?.focus();
        return;
    }

    if (password.length < 6) {
        showAuthMessage(
            registerMessage,
            getAuthTranslation(
                "authentication.passwordTooShort",
                "La contraseña debe tener al menos 6 caracteres."
            )
        );

        registerPasswordInput?.focus();
        return;
    }

    if (password !== passwordConfirmation) {
        showAuthMessage(
            registerMessage,
            getAuthTranslation(
                "authentication.passwordsDoNotMatch",
                "Las contraseñas no coinciden."
            )
        );

        registerPasswordConfirmationInput?.focus();
        return;
    }

    if (!registerTermsInput?.checked) {
        showAuthMessage(
            registerMessage,
            getAuthTranslation(
                "authentication.termsRequired",
                "Debes aceptar el uso educativo de la cuenta."
            )
        );

        registerTermsInput?.focus();
        return;
    }

    setSubmitButtonLoading(
        registerSubmitButton,
        true,
        getAuthTranslation(
            "authentication.registerSubmit",
            "Crear cuenta"
        ),
        getAuthTranslation(
            "authentication.creatingAccount",
            "Creando cuenta..."
        )
    );

    try {
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateProfile(
            userCredential.user,
            {
                displayName: name
            }
        );

        await setDoc(
            doc(
                db,
                "users",
                userCredential.user.uid
            ),
            {
                displayName: name,
                email: userCredential.user.email,
                role: "user",
                emailVerified:
                    userCredential.user.emailVerified,
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                loginCount: 1
            }
        );

        await sendEmailVerification(
            userCredential.user
        );

        registerForm?.reset();

        showAuthMessage(
            registerMessage,
            getAuthTranslation(
                "authentication.accountCreated",
                "Cuenta creada. Te enviamos un correo para verificar tu dirección."
            ),
                "success"
        );

        window.setTimeout(() => {
            closeAuthModal();
        }, 2800);
    } catch (error) {
        console.error(
            "LeNCHoTeCH: error al crear la cuenta.",
            error
        );

        showAuthMessage(
            registerMessage,
            getFirebaseErrorMessage(error)
        );
    } finally {
        setSubmitButtonLoading(
            registerSubmitButton,
            false,
            getAuthTranslation(
                "authentication.registerSubmit",
                "Crear cuenta"
            ),
            getAuthTranslation(
                "authentication.creatingAccount",
                "Creando cuenta..."
            )
        );
    }
}


/* =========================================================
   9. INICIAR SESIÓN
========================================================= */

async function handleLogin(event) {
    event.preventDefault();

    clearAuthMessage(loginMessage);

    const email =
        loginEmailInput?.value.trim() || "";

    const password =
        loginPasswordInput?.value || "";

    if (!email || !password) {
        showAuthMessage(
            loginMessage,
            getAuthTranslation(
                "authentication.loginCredentialsRequired",
                "Escribe tu correo y contraseña."
            )
        );

        return;
    }

    setSubmitButtonLoading(
        loginSubmitButton,
        true,
        getAuthTranslation(
            "authentication.loginSubmit",
            "Iniciar sesión"
        ),
        getAuthTranslation(
            "authentication.loggingIn",
            "Iniciando..."
        )
    );

    try {
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateDoc(
            doc(
                db,
                "users",
                userCredential.user.uid
            ),
            {
                lastLoginAt: serverTimestamp(),
                loginCount: increment(1),
                emailVerified:
                    userCredential.user.emailVerified
            }
        );

        loginForm?.reset();

        const visibleLoginName =
            userCredential.user.displayName ||
            getAuthTranslation(
                "authentication.genericUser",
                "usuario"
            );

        showAuthMessage(
            loginMessage,
            getAuthTranslation(
                "authentication.welcomeUser",
                "Bienvenido, {name}."
            ).replace(
                "{name}",
                visibleLoginName
            ),
            "success"
        );

        window.setTimeout(() => {
            closeAuthModal();
        }, 1200);
    } catch (error) {
        console.error(
            "LeNCHoTeCH: error al iniciar sesión.",
            error
        );

        showAuthMessage(
            loginMessage,
            getFirebaseErrorMessage(error)
        );
    } finally {
        setSubmitButtonLoading(
            loginSubmitButton,
            false,
            getAuthTranslation(
                "authentication.loginSubmit",
                "Iniciar sesión"
            ),
            getAuthTranslation(
                "authentication.loggingIn",
                "Iniciando..."
            )
        );
    }
}


/* =========================================================
   10. RECUPERAR CONTRASEÑA
========================================================= */

async function handlePasswordReset() {
    clearAuthMessage(loginMessage);

    const email =
        loginEmailInput?.value.trim() || "";

    if (!email) {
        showAuthMessage(
            loginMessage,
            getAuthTranslation(
                "authentication.resetEmailRequired",
                "Primero escribe tu correo electrónico."
            )
        );

        loginEmailInput?.focus();
        return;
    }

    try {
        await sendPasswordResetEmail(
            auth,
            email
        );

        showAuthMessage(
            loginMessage,
            getAuthTranslation(
                "authentication.resetEmailSent",
                "Te enviamos un correo para restablecer tu contraseña."
            ),
            "success"
        );
    } catch (error) {
        console.error(
            "LeNCHoTeCH: error al recuperar la contraseña.",
            error
        );

        showAuthMessage(
            loginMessage,
            getFirebaseErrorMessage(error)
        );
    }
}

/* =========================================================
   11. MENÚ DE CUENTA
========================================================= */

function openAccountMenu() {
    if (!accountMenu || !currentUser) {
        return;
    }

    const visibleName =
        currentUser.displayName?.trim() ||
        currentUser.email?.split("@")[0] ||
        "Usuario";

    if (accountUserName) {
        accountUserName.textContent =
            visibleName;
    }

    if (accountUserEmail) {
        accountUserEmail.textContent =
            currentUser.email || "";
    }

    if (accountAvatarLetter) {
        accountAvatarLetter.textContent =
            visibleName.charAt(0).toUpperCase();
    }

    const isVerified =
        currentUser.emailVerified;

    if (accountEmailStatus) {
        accountEmailStatus.textContent =
            isVerified
                ? getAuthTranslation(
                    "accountMenu.verified",
                    "Verificado"
                )
                : getAuthTranslation(
                    "accountMenu.unverified",
                    "Sin verificar"
                );

        accountEmailStatus.classList.toggle(
            "is-verified",
            isVerified
        );
    }

    if (resendVerificationButton) {
        resendVerificationButton.hidden =
            isVerified;
    }

    accountMenu.hidden = false;
    document.body.classList.add("no-scroll");
}


function closeAccountMenu() {
    if (!accountMenu) {
        return;
    }

    accountMenu.hidden = true;
    document.body.classList.remove("no-scroll");

    authButton?.focus();
}


async function handleLogout() {
    try {
        await signOut(auth);

        closeAccountMenu();

        if (
            window.LENCHOTECH_APP &&
            typeof window.LENCHOTECH_APP
                .showToast === "function"
        ) {
            window.LENCHOTECH_APP.showToast(
                getAuthTranslation(
                    "accountMenu.logoutTitle",
                    "Sesión cerrada"
                ),
                getAuthTranslation(
                    "accountMenu.logoutMessage",
                    "Cerraste sesión correctamente."
                ),
                "success"
            );
        }
    } catch (error) {
        console.error(
            "LeNCHoTeCH: error al cerrar sesión.",
            error
        );
    }
}


async function handleResendVerification() {
    if (!currentUser) {
        return;
    }

    try {
        await sendEmailVerification(
            currentUser
        );

        if (accountEmailStatus) {
            accountEmailStatus.textContent =
                getAuthTranslation(
                    "accountMenu.verificationResent",
                    "Correo reenviado"
                );
        }

        if (
            window.LENCHOTECH_APP &&
            typeof window.LENCHOTECH_APP
                .showToast === "function"
        ) {
            window.LENCHOTECH_APP.showToast(
                getAuthTranslation(
                    "accountMenu.verificationSentTitle",
                    "Verificación enviada"
                ),
                getAuthTranslation(
                    "accountMenu.verificationSentMessage",
                    "Revisa tu correo electrónico."
                ),
                "success"
            );
        }
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no se pudo reenviar la verificación.",
            error
        );
    }
}

/* =========================================================
   11. ESTADO DE LA SESIÓN
========================================================= */

function getAuthTranslation(
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

function updateAuthButton(user) {
    if (!authButton || !authButtonLabel) {
        return;
    }

    if (user) {
        const visibleName =
            user.displayName?.trim() ||
            user.email?.split("@")[0] ||
            getAuthTranslation(
                "header.myAccount",
                "Mi cuenta"
            );

        authButtonLabel.textContent =
            visibleName;

        authButton.title =
            getAuthTranslation(
                "header.accountTitle",
                "Cuenta de {name}"
            ).replace(
                "{name}",
                visibleName
            );

        authButton.setAttribute(
            "aria-label",
            getAuthTranslation(
                "header.accountLabel",
                "Abrir cuenta de {name}"
            ).replace(
                "{name}",
                visibleName
            )
        );

        authButton.classList.add(
            "is-authenticated"
        );

        return;
    }

    authButtonLabel.textContent =
        getAuthTranslation(
            "header.signIn",
            "Iniciar sesión"
        );

    authButton.title =
        getAuthTranslation(
            "header.signIn",
            "Iniciar sesión"
        );

    authButton.setAttribute(
        "aria-label",
        getAuthTranslation(
            "header.signInLabel",
            "Iniciar sesión o crear una cuenta"
        )
    );

    authButton.classList.remove(
        "is-authenticated"
    );
}

async function loadCurrentUserRole(user) {

    currentUserRole = "guest";

    isAdministrator = false;

    if (!user) {
        return;
    }

    try {

        const userDocument =
            await getDoc(
                doc(
                    db,
                    "users",
                    user.uid
                )
            );

        if (!userDocument.exists()) {
            return;
        }

        const data =
            userDocument.data();

        currentUserRole =
            data.role ?? "user";

        isAdministrator =
            currentUserRole === "admin";

        console.log(
            "LeNCHoTeCH Role:",
            currentUserRole
        );

    } catch (error) {

        console.error(
            "No se pudo obtener el rol.",
            error
        );

    }

}

function updateAdminControls() {
    if (!adminPanelButton) {
        return;
    }

    adminPanelButton.hidden =
        !isAdministrator;
}

/* =========================================================
   PANEL DE ADMINISTRACIÓN
========================================================= */

function escapeAdminHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatFirestoreDate(timestamp) {
    if (
        !timestamp ||
        typeof timestamp.toDate !== "function"
    ) {
        return getAuthTranslation(
            "admin.noInformation",
            "Sin información"
        );
    }

    const locale =
        document.documentElement.lang === "en"
            ? "en-US"
            : "es-PR";

    return new Intl.DateTimeFormat(
        locale,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(timestamp.toDate());
}


function setAdminMessage(
    message,
    isError = false
) {
    if (!adminUsersMessage) {
        return;
    }

    adminUsersMessage.textContent =
        message;

    adminUsersMessage.hidden = false;

    adminUsersMessage.classList.toggle(
        "is-error",
        isError
    );
}


function updateAdminStatistics(users) {
    const totalUsers =
        users.length;

    const verifiedUsers =
        users.filter(
            user => user.emailVerified === true
        ).length;

    const unverifiedUsers =
        totalUsers - verifiedUsers;

    const totalLogins =
        users.reduce(
            (total, user) =>
                total +
                Number(user.loginCount || 0),
            0
        );

    if (adminTotalUsers) {
        adminTotalUsers.textContent =
            String(totalUsers);
    }

    if (adminVerifiedUsers) {
        adminVerifiedUsers.textContent =
            String(verifiedUsers);
    }

    if (adminUnverifiedUsers) {
        adminUnverifiedUsers.textContent =
            String(unverifiedUsers);
    }

    if (adminTotalLogins) {
        adminTotalLogins.textContent =
            String(totalLogins);
    }
}


function renderAdminUsers(users) {
    if (!adminUsersList) {
        return;
    }

    if (users.length === 0) {
        adminUsersList.innerHTML = "";

        setAdminMessage(
            getAuthTranslation(
                "admin.noUsers",
                "Todavía no hay usuarios registrados."
            )
        );

        return;
    }

    adminUsersMessage.hidden = true;

    adminUsersList.innerHTML =
        users.map(user => {
            const verified =
                user.emailVerified === true;

            const roleLabel =
                user.role === "admin"
                    ? getAuthTranslation(
                        "admin.administrator",
                        "Administrador"
                    )
                    : getAuthTranslation(
                        "admin.user",
                        "Usuario"
                    );

            return `
                <article class="admin-user-card">

                    <div class="admin-user-card__identity">
                        <strong>
                            ${escapeAdminHTML(
                                user.displayName ||
                                getAuthTranslation(
                                    "admin.unnamedUser",
                                    "Usuario sin nombre"
                                )
                            )}
                        </strong>

                        <span>
                            ${escapeAdminHTML(
                                user.email ||
                                getAuthTranslation(
                                    "admin.unavailableEmail",
                                    "Correo no disponible"
                                )
                            )}
                        </span>
                    </div>

                    <div class="admin-user-card__item">
                        <span>
                            ${escapeAdminHTML(
                                getAuthTranslation(
                                    "admin.lastAccess",
                                    "Último acceso"
                                )
                            )}
                        </span>

                        <strong>
                            ${escapeAdminHTML(
                                formatFirestoreDate(
                                    user.lastLoginAt
                                )
                            )}
                        </strong>
                    </div>

                    <div class="admin-user-card__item">
                        <span>
                            ${escapeAdminHTML(
                                getAuthTranslation(
                                    "admin.status",
                                    "Estado"
                                )
                            )}
                        </span>

                        <strong
                            class="admin-user-card__status ${
                                verified
                                    ? "is-verified"
                                    : "is-unverified"
                            }"
                        >
                            ${
                                verified
                                    ? getAuthTranslation(
                                        "admin.verified",
                                        "Verificado"
                                    )
                                    : getAuthTranslation(
                                        "admin.unverified",
                                        "Sin verificar"
                                    )
                            }
                        </strong>
                    </div>

                    <div class="admin-user-card__item">
                        <span>
                            ${escapeAdminHTML(roleLabel)}
                        </span>

                        <strong>
                            ${escapeAdminHTML(
                                getAuthTranslation(
                                    "admin.accesses",
                                    "{count} accesos"
                                ).replace(
                                    "{count}",
                                    String(
                                        Number(
                                            user.loginCount || 0
                                        )
                                    )
                                )
                            )}
                        </strong>
                    </div>

                </article>
            `;
        }).join("");
}


async function loadAdminUsers() {
    if (!isAdministrator) {
        setAdminMessage(
            getAuthTranslation(
                "admin.noPermission",
                "No tienes permiso para consultar esta información."
            ),
            true
        );

        return;
    }

    if (refreshAdminUsersButton) {
        refreshAdminUsersButton.disabled =
            true;

        refreshAdminUsersButton.textContent =
            getAuthTranslation(
                "admin.refreshing",
                "Actualizando..."
            );
    }

    setAdminMessage(
        getAuthTranslation(
            "admin.loading",
            "Cargando usuarios..."
        )
    );

    try {
        const usersSnapshot =
            await getDocs(
                collection(db, "users")
            );

        const users =
            usersSnapshot.docs.map(
                userDocument => ({
                    id: userDocument.id,
                    ...userDocument.data()
                })
            );

        users.sort((firstUser, secondUser) => {
            const firstDate =
                firstUser.createdAt?.toMillis?.() ||
                0;

            const secondDate =
                secondUser.createdAt?.toMillis?.() ||
                0;

            return secondDate - firstDate;
        });

        updateAdminStatistics(users);
        renderAdminUsers(users);
    } catch (error) {
        console.error(
            "LeNCHoTeCH: no se pudieron cargar los usuarios.",
            error
        );

        setAdminMessage(
            getAuthTranslation(
                "admin.loadError",
                "No fue posible cargar los usuarios. Revisa las reglas de Firestore."
            ),
            true
        );
    } finally {
        if (refreshAdminUsersButton) {
            refreshAdminUsersButton.disabled =
                false;

            refreshAdminUsersButton.textContent =
                getAuthTranslation(
                    "admin.refresh",
                    "Actualizar"
                );
        }
    }
}


async function openAdminModal() {
    if (
        !adminModal ||
        !isAdministrator
    ) {
        return;
    }

    closeAccountMenu();

    adminModal.hidden = false;
    document.body.classList.add("no-scroll");

    await loadAdminUsers();
}


function closeAdminModal() {
    if (!adminModal) {
        return;
    }

    adminModal.hidden = true;
    document.body.classList.remove(
        "no-scroll"
    );

    adminPanelButton?.focus();
}

onAuthStateChanged(auth, async user => {
    currentUser = user;

    await loadCurrentUserRole(user);

    updateAuthButton(user);
    updateAdminControls();

    window.dispatchEvent(
        new CustomEvent(
            "lenchotech-auth-changed",
            {
                detail: {
                    user,
                    role: currentUserRole,
                    isAdministrator
                }
            }
        )
    );

    if (user) {
        console.log(
            "LeNCHoTeCH: sesión activa.",
            user.uid
        );

        console.log(
            "LeNCHoTeCH: administrador.",
            isAdministrator
        );
    }
});


/* =========================================================
   12. EVENTOS
========================================================= */

authButton?.addEventListener(
    "click",
    () => {
        if (currentUser) {
            openAccountMenu();
        } else {
            openAuthModal();
        }
    }
);


closeAuthModalButton?.addEventListener(
    "click",
    closeAuthModal
);


authModalOverlay?.addEventListener(
    "click",
    closeAuthModal
);


closeAccountMenuButton?.addEventListener(
    "click",
    closeAccountMenu
);


accountMenuOverlay?.addEventListener(
    "click",
    closeAccountMenu
);


logoutButton?.addEventListener(
    "click",
    handleLogout
);


resendVerificationButton?.addEventListener(
    "click",
    handleResendVerification
);

adminPanelButton?.addEventListener(
    "click",
    openAdminModal
);


closeAdminModalButton?.addEventListener(
    "click",
    closeAdminModal
);


adminModalOverlay?.addEventListener(
    "click",
    closeAdminModal
);


refreshAdminUsersButton?.addEventListener(
    "click",
    loadAdminUsers
);


authTabButtons.forEach(button => {
    button.addEventListener("click", () => {
        activateAuthTab(
            button.dataset.authTab
        );
    });
});


passwordToggleButtons.forEach(button => {
    button.addEventListener("click", () => {
        togglePasswordVisibility(button);
    });
});


registerForm?.addEventListener(
    "submit",
    handleRegister
);


loginForm?.addEventListener(
    "submit",
    handleLogin
);


forgotPasswordButton?.addEventListener(
    "click",
    handlePasswordReset
);


document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        authModal &&
        !authModal.hidden
    ) {
        closeAuthModal();
    }

    if (
        event.key === "Escape" &&
        accountMenu &&
        !accountMenu.hidden
    ) {
        closeAccountMenu();
    }

    if (
        event.key === "Escape" &&
        adminModal &&
        !adminModal.hidden
    ) {
        closeAdminModal();
    }
});

document.addEventListener(
    "lenchotech:language-changed",
    () => {
        updateAuthButton(currentUser);

        if (
            currentUser &&
            accountMenu &&
            !accountMenu.hidden
        ) {
            openAccountMenu();
        }

        if (
            adminModal &&
            !adminModal.hidden &&
            isAdministrator
        ) {
            loadAdminUsers();
        }
    }
);
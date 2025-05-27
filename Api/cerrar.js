console.log("✅ cerrar.js ha sido cargado correctamente");

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM completamente cargado");

    const logoutButton = document.getElementById("confirmLogout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("🔹 Cerrando sesión...");
            localStorage.removeItem("userId");
            localStorage.removeItem("user_id"); // Elimina ambas claves
            window.location.href = "../../index.html";
        });
    } else {
        console.error("❌ No se encontró el botón con ID confirmLogout");
    }

    // Validar si el usuario tiene sesión activa
    const userId = localStorage.getItem("userId");
    const user_id = localStorage.getItem("user_id");

    if (!userId && !user_id) { // Verifica ambas variables
        console.log("❌ Acceso denegado. Redirigiendo...");
        window.location.href = "../../index.html";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("No se encontró el formulario de inicio de sesión.");
        return;
    }

    // Verificar si el usuario ya está autenticado
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole"); // Nuevo para rol

    if (userId && userRole !== null) {
        console.log("🔹 Sesión activa. Usuario:", userId, "Rol:", userRole);
        
        // Redirigir según el rol
        if (userRole === "0") {
            window.location.href = "../products/gestion_productos.html";
        } else if (userRole === "1") {
            window.location.href = "../Admin/Admins.html";
        }
        return;
    }

    // Evento de inicio de sesión
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost/microservicio_autenticacion/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "login",
                    email: email,
                    password: password
                })
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (result.estado === "correcto" && result.usuario?.id_usuario !== undefined) {
                const userId = result.usuario.id_usuario;
                const userRole = result.usuario.id_rol; // Obtener el rol

                console.log("✅ ID usuario recibido:", userId);
                console.log("✅ ID rol recibido:", userRole);

                // Guardar ID y rol en localStorage
                localStorage.setItem("userId", userId);
                localStorage.setItem("userRole", userRole);

                // Mostrar el modal para ingresar el código 2FA
                $("#authModal").modal("show");
            } else {
                alert("❌ Error en el inicio de sesión: " + (result.msg || "Credenciales incorrectas"));
            }
        } catch (error) {
            console.error("❌ Error al conectar con la API:", error);
            alert("❌ Error al conectar con el servidor.");
        }
    });

    // 📌 Validar token 2FA
    document.addEventListener("click", async function (event) {
        if (event.target && event.target.id === "verifyToken") {
            console.log("✅ Botón de validación presionado.");

            const authCode = document.getElementById("authCode").value;
            if (!authCode) {
                alert("❌ Por favor, ingresa el código de verificación.");
                return;
            }

            // 🔹 Recuperar userId y rol desde localStorage
            const userId = localStorage.getItem("userId");
            const userRole = localStorage.getItem("userRole");

            if (!userId || userRole === null) {
                alert("❌ Error: No se encontró el ID del usuario o rol. Inicia sesión nuevamente.");
                return;
            }

            console.log(`Validando código: ${authCode} para usuario: ${userId}`);

            try {
                const response = await fetch("http://localhost/microservicio_autenticacion/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "validar_token_2fa",
                        id_usuario: userId,
                        token_2fa: authCode
                    })
                });

                const responseText = await response.text();
                console.log("🔹 Respuesta de validación (texto):", responseText);

                const result = JSON.parse(responseText);
                console.log("🔹 Respuesta de validación (JSON):", result);

                if (result.message && result.message.includes("exitosa")) {
                    alert("✅ Autenticación exitosa.");

                    // Redirigir según el rol del usuario
                    if (userRole === "0") {
                        window.location.href = "../products/gestion_productos.html";
                    } else if (userRole === "1") {
                        window.location.href = "../Admin/Admin.html";
                    }
                } else {
                    alert("❌ Código incorrecto. Intenta de nuevo.");
                }
            } catch (error) {
                console.error("❌ Error al validar el token:", error);
                alert("❌ Error al conectar con el servidor.");
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerButton").addEventListener("click", async function () {
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value.trim();

        if (!email || !password) {
            alert("⚠️ Por favor, completa todos los campos.");
            return;
        }

        console.log(`🔹 Enviando registro para: ${email}`);

        try {
            const response = await fetch("http://localhost/microservicio_autenticacion/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "registrar",
                    email: email,
                    password: password
                })
            });

            const result = await response.json();
            console.log("🔹 Respuesta del servidor:", result);

            // Verificamos si la respuesta contiene los datos esperados
            if (result && result.estado === "correcto" && result.usuario && result.usuario.id_usuario) {
                const userId = result.usuario.id_usuario;
                const userEmail = result.usuario.email;

                // Guardamos los datos en localStorage
                localStorage.setItem("user_id", userId);
                localStorage.setItem("user_email", userEmail);

                alert(`✅ Registro exitoso. `);
                $("#registerModal").modal("hide"); // Cierra el modal
                
                // Redirigir al siguiente paso del registro
                window.location.href = "../Users/signup.html"; 
            } else {
                alert("⚠️ Error en la respuesta del servidor: " + JSON.stringify(result));
            }
        } catch (error) {
            console.error("❌ Error al conectar con la API:", error);
            alert("❌ Error al conectar con el servidor.");
        }
    });
});

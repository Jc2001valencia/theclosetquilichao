let vendedorActual = null; // Variable global para guardar el vendedor actual

document.addEventListener("DOMContentLoaded", function () {
    const idUsuario = localStorage.getItem("user_id") || localStorage.getItem("userId");

    if (!idUsuario) {
        console.error("No se encontró user_id ni userId en localStorage.");
        return;
    }

    fetch("http://localhost/microservicio_autenticacion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listar_vendedores" }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data || !Array.isArray(data)) {
            console.error("Respuesta inválida del servidor.");
            return;
        }

        const vendedor = data.find((v) => v.id_usu === parseInt(idUsuario, 10));

        if (!vendedor) {
            console.error("No se encontró un vendedor con este id_usu.");
            return;
        }

        // Guardamos en variable global
        vendedorActual = vendedor;

        // Mostrar información en la tarjeta
        document.getElementById("nombreTiendaTexto").textContent = vendedor.nombre;
        document.getElementById("direccionTexto").textContent = vendedor.ubicacion;
        document.getElementById("telefonoTexto").textContent = vendedor.telefono;
        document.getElementById("correoTexto").textContent = vendedor.correo || "No disponible";
        document.getElementById("descripcionTexto").textContent = vendedor.descripcion;

        const imagenPerfil = document.getElementById("imagenTienda");
        if (imagenPerfil && vendedor.imagen) {
            imagenPerfil.setAttribute("src", `../../porfiles/${vendedor.imagen}`);
        } else {
            console.warn("No se encontró imagen o elemento de imagen.");
        }
    })
    .catch((error) => console.error("Error al obtener datos:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const editarBtn = document.querySelector('[data-bs-target="#exampleModal"]');
    const nombreInput = document.getElementById("nombreTienda");
    const direccionInput = document.getElementById("direccion");
    const telefonoInput = document.getElementById("telefono");
    const correoInput = document.getElementById("correo");
    const descripcionInput = document.getElementById("descripcionTienda");

    editarBtn.addEventListener("click", function () {
        if (!vendedorActual) {
            console.error("No hay datos del vendedor cargados todavía.");
            return;
        }

        // Llenamos el formulario del modal con los datos actuales
        nombreInput.value = vendedorActual.nombre || "";
        direccionInput.value = vendedorActual.ubicacion || "";
        telefonoInput.value = vendedorActual.telefono || "";
        correoInput.value = vendedorActual.correo || "";
        descripcionInput.value = vendedorActual.descripcion || "";
    });
});

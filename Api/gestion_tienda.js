// Variables globales para guardar datos actuales del vendedor y tipo de tienda
let vendedorActual = null;
let tipoTiendaActual = null;

// Al cargar el DOM, obtener datos del usuario y llenar la interfaz
document.addEventListener("DOMContentLoaded", function () {
    // Obtener idUsuario desde localStorage (puede venir con diferentes claves)
    const idUsuario = localStorage.getItem("user_id") || localStorage.getItem("userId");

    if (!idUsuario) {
        console.error("No se encontró user_id ni userId en localStorage.");
        return;
    }

    // Petición al backend para listar todos los vendedores
    fetch("http://localhost/microservicio_autenticacion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "listar_vendedores" }),
    })
    .then(response => response.json())
    .then(data => {
        // Validar que la respuesta sea un array válido
        if (!data || !Array.isArray(data)) {
            console.error("Respuesta inválida del servidor.");
            return;
        }

        // Buscar el vendedor que corresponde al usuario actual
        const vendedor = data.find(v => v.id_usu === parseInt(idUsuario, 10));

        if (!vendedor) {
            console.error("No se encontró un vendedor con este id_usu.");
            return;
        }

        // Guardar en variables globales para uso posterior
        vendedorActual = vendedor;
        tipoTiendaActual = vendedor.id_tipotienda;

        // Llenar la información visible en la tarjeta/perfil
        document.getElementById("nombreTiendaTexto").textContent = vendedor.nombre;
        document.getElementById("direccionTexto").textContent = vendedor.ubicacion;
        document.getElementById("telefonoTexto").textContent = vendedor.telefono;
        document.getElementById("correoTexto").textContent = vendedor.correo || "No disponible";
        document.getElementById("descripcionTexto").textContent = vendedor.descripcion;

        // Llenar los campos del formulario para editar perfil con los datos actuales
        document.getElementById("nombreTienda").value = vendedor.nombre;
        document.getElementById("direccion").value = vendedor.ubicacion;
        document.getElementById("telefono").value = vendedor.telefono;
        document.getElementById("correo").value = vendedor.correo || "";
        document.getElementById("descripcionTienda").value = vendedor.descripcion;

        // Mostrar la imagen del vendedor si existe
        const imagenPerfil = document.getElementById("imagenTienda");
        if (imagenPerfil && vendedor.imagen) {
            imagenPerfil.setAttribute("src", `../../porfiles/${vendedor.imagen}`);
        } else {
            console.warn("No se encontró imagen o elemento de imagen.");
        }
    })
    .catch(error => console.error("Error al obtener datos:", error));
});

// Evento para manejar el envío del formulario de edición de perfil
document.getElementById("formEditarPerfil").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir que se recargue la página

    // Obtener los valores actualizados de los inputs
    const nombre = document.getElementById("nombreTienda").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const descripcion = document.getElementById("descripcionTienda").value;

    // Obtener el archivo seleccionado en el input file (si hay)
    const imagenInput = document.getElementById("fotoTienda");
    const imagen = imagenInput.files[0]?.name || vendedorActual.imagen;

    // Construir objeto con los datos a enviar al backend para actualizar
    const datosActualizar = {
        action: "actualizar_vendedor",
        id_vendedor: vendedorActual.id_vendedor,
        nombre: nombre,
        descripcion: descripcion,
        telefono: telefono,
        correo: correo,
        id_usu: vendedorActual.id_usu,
        id_tipotienda: tipoTiendaActual,
        imagen: imagen,
        // Si tienes id_ubicacion usarlo, si no usa la dirección nueva
        ubicacion: vendedorActual.id_ubicacion || direccion
    };

    console.log("Datos que se enviarán al servidor:", datosActualizar);

    // Enviar la actualización al backend vía POST
    fetch("http://localhost/microservicio_autenticacion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizar),
    })
    .then(res => res.json())
    .then(res => {
        console.log("Respuesta completa del servidor:", res);
        if (res.message) {
            alert("Perfil actualizado correctamente");
            location.reload(); // Recargar para mostrar datos actualizados
        } else {
            console.error("Error:", res.error || res);
            alert("Hubo un error al actualizar: " + (res.error || "Datos incompletos"));
        }
    })
    .catch(err => console.error("Error al enviar datos:", err));
});

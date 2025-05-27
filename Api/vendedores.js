document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registroForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita el envío automático del formulario

        let nombre = document.getElementById("nombre").value.trim();
        let tipoVendedor = document.getElementById("tipoVendedor").value;
        let telefono = document.getElementById("telefono").value;
        let ubicacion = document.getElementById("ubicacion").value;

        // Obtener id_usu desde localStorage
        let id_usu = localStorage.getItem("user_id");

        // Obtener nombre del archivo de imagen
        let imagenInput = document.getElementById("imageInput");
        let imagen = imagenInput.files.length > 0 ? imagenInput.files[0].name : "";

        // Verificar que los datos obligatorios estén presentes
        if (!id_usu || !nombre || !tipoVendedor || !telefono || !ubicacion) {
            console.error("❌ Error: Todos los campos son obligatorios.");
            alert("Por favor, completa todos los campos.");
            return;
        }

        console.log("📤 Enviando datos:", { id_usu, nombre, tipoVendedor, telefono, ubicacion, imagen });

        try {
            let response = await fetch("http://localhost/microservicio_autenticacion/", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "crear_vendedor",
                    nombre: nombre,
                    descripcion: "Descripción de la tienda",
                    ubicacion: ubicacion,
                    telefono: telefono,
                    id_usu: id_usu,
                    id_tipotienda: tipoVendedor,
                    imagen: imagen // Solo el nombre del archivo
                })
            });

            console.log(`📡 Código de respuesta: ${response.status}`);

            if (!response.ok) {
                console.error(`❌ Error en la petición: ${response.status} ${response.statusText}`);
                alert("Error en la solicitud al servidor.");
                return;
            }

            let data = await response.json();
            console.log("📡 Respuesta del servidor:", data);

            if (data.success) {
                alert("✅ Vendedor registrado correctamente: " + data.mensaje);
                window.location.href = "../products/gestion_productos.html";
            } else {
                alert("⚠️ Error: " + (data.mensaje || "No se pudo registrar el vendedor."));
            }
        } catch (error) {
            console.error("❌ Error en la solicitud:", error);
            alert("Error en la conexión con el servidor.");
        }
    });
});
   
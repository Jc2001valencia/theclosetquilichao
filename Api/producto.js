document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get("id");

    if (idProducto) {
        obtenerProducto(idProducto);
    }
});

function obtenerProducto(id) {
    const apiUrl = `http://localhost/microservicio_producto/routes/api.php?action=obtener&id_producto=${id}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Datos obtenidos desde API:", data);

            if (data.id_producto) {
                actualizarDOMConDatos(data);
            } else {
                console.error("Producto no encontrado");
            }
        })
        .catch(error => console.error("Error al obtener el producto:", error));
}

function actualizarDOMConDatos(producto) {
    document.querySelector("h1.h2").textContent = producto.nombre;
    document.querySelector("p.h3.py-2").textContent = `$${producto.precio.toLocaleString()}`;    
    document.querySelector(".text-muted strong").textContent = "Marca Desconocida"; 
    document.querySelector("h6 + p").textContent = producto.descripcion;
    const imagenes = producto.imagenes; // del JSON
    document.querySelector("#product-detail").src = `../../assets/img/${imagenes[0]}`;
    document.querySelector("#img1").src = `../../assets/img/${imagenes[0]}`;
    document.querySelector("#img2").src = `../../assets/img/${imagenes[1]}`;
    document.querySelector("#img3").src = `../../assets/img/${imagenes[2]}`;
    
    document.querySelector("#product-detail").alt = producto.nombre;

    actualizarEnlaceWhatsApp(producto);
    actualizarCategorias(producto);
    actualizarVendedor(producto);

    
}


  

function actualizarEnlaceWhatsApp(producto) {
    const enlaceWhatsApp = document.querySelector(".btn-lg");
    const numeroWhatsApp = "573001234567"; // Reemplaza con tu número

    // Tomamos la primera imagen
    const imagenPrincipal = producto.imagenes && producto.imagenes.length > 0
        ? `https://tusitio.com/assets/img/${producto.imagenes[0]}`  // Reemplaza por tu dominio si es necesario
        : "No disponible";

    // Creamos un mensaje más completo
    const mensaje = `
¡Hola! Estoy interesado en uno de los productos de tu tienda. Me gustaría recibir más información. Aquí te dejo los detalles:

🛍️ *Producto*: ${producto.nombre}
💵 *Precio*: $${producto.precio.toLocaleString()}
📄 *Descripción*: ${producto.descripcion || "No disponible"}
🖼️ *Imagen*: ${imagenPrincipal}

¿Podrías darme más detalles sobre disponibilidad, tiempos de entrega y formas de pago?

¡Gracias!
    `.trim();

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;
    
    enlaceWhatsApp.parentElement.href = urlWhatsApp;
}


function actualizarCategorias(producto) {
    const categoriasContainer = document.getElementById("etiquetas");
    if (categoriasContainer) {
        categoriasContainer.innerHTML = `
            <div id="categ"><a href="">/ ${producto.categorias[0] || ''}</a></div>
            <div id="categ"><a href="">/ ${producto.categorias[1] || ''}</a></div>
            <div id="categ"><a href="">/ ${producto.categorias[2] || ''}</a></div>
        `;
    } else {
        console.error("No se encontró el contenedor de etiquetas");
    }
}
function actualizarVendedor(producto) {
    const vendedorContainer = document.getElementById("vendedor");

    if (!vendedorContainer) {
        console.error("No se encontró el contenedor del vendedor");
        return;
    }

    // Datos del vendedor
    const nombreVendedor = producto.vendedor_nombre || 'No disponible';
    const telefonoVendedor = (producto.vendedor_telefono || '').replace(/\s+/g, '');
    const ubicacionVendedor = producto.vendedor_ubicacion || 'No disponible';
    const imagenVendedor = producto.vendedor_imagen ? `../../porfiles/${producto.vendedor_imagen}` : '';

    const mensaje = encodeURIComponent(
        `¡Hola! Estoy interesado en comprar un producto.\n\n- Producto: ${producto.nombre}\n- Precio: $${producto.precio.toLocaleString()}\n\nPor favor, respóndeme con los detalles para proceder con la compra.`
    );

    // HTML generado
    vendedorContainer.innerHTML = `
        <div class="seller-info">
            <h2 class="h2">Información del Vendedor</h2>
            <div class="vendedordiv">
                <div class="datos">
                    <div class="card_d">
                        <p><strong>Nombre:</strong> ${nombreVendedor}</p>
                        <p>
                            <strong>WhatsApp:</strong>
                            <a id="whatsapp-link" target="_blank">
                                <button type="button" class="btn btn-success btn-sm">Contactar por WhatsApp</button>
                            </a>
                        </p>
                        ${imagenVendedor ? `<img src="${imagenVendedor}" alt="Imagen del vendedor" style="width: 150px; height: auto;">` : ''}

                        <div class="seller-rating">
                            <h3>Calificación:</h3>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </div>

                        <p>
                            <a href="./productos_tienda.html?vendedor=${producto.id_vendedor}&nombre=${encodeURIComponent(nombreVendedor)}" style="color: #ff3366;">
                                Ver todos los productos
                            </a>
                        </p>
                    </div>
                </div>
                <div class="map">
                    <h3><p><strong>Dirección:</strong> ${ubicacionVendedor}</p></h3>
                    <iframe 
                        src="https://www.google.com/maps?q=${encodeURIComponent(producto.vendedor_ubicacion || '')}&output=embed"
                        width="600" height="350" style="border:0;" allowfullscreen loading="lazy">
                    </iframe>
                </div>
            </div>
        </div>
    `;

    // Configura el enlace de WhatsApp
    document.getElementById("whatsapp-link").href = `https://api.whatsapp.com/send?phone=${telefonoVendedor}&text="Hola Quiero hacer una compra o me interesa tus productos"`;
}



   
  


document.getElementById('formComentario').addEventListener('submit', function (e) {
    e.preventDefault(); // ⛔ Detiene la recarga

    const nombre = document.getElementById('nombre').value;
    const mensaje = document.getElementById('mensaje').value;
    const calificacion = document.getElementById('calificacion').value;

    const estrellas = '★'.repeat(calificacion);

    const nuevoComentario = document.createElement('div');
    nuevoComentario.className = 'col-12 col-md-3 mb-4';
    nuevoComentario.innerHTML = `
      <div class="comentario-card">
        <p class="nombre">${nombre}</p>
        <p class="mensaje">${mensaje}</p>
        <p class="calificacion">Calificación: ${estrellas}</p>
      </div>
    `;

    document.querySelector('#comentarios .row').appendChild(nuevoComentario);

    // Limpiar el formulario
    this.reset();

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalComentario'));
    if (modal) modal.hide();
  });;


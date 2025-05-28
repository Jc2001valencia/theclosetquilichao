document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "http://localhost/microservicio_producto/routes/api.php?action=listar";
    const container = document.getElementById("productos-container");

    try {
        const response = await fetch(apiUrl);
        const productos = await response.json();

        productos.forEach((producto, index) => {
            const card = document.createElement("div");
            card.classList.add("col-12", "col-sm-6", "col-md-4", "mb-4");

            // Carousel ID único para cada producto
            const carouselId = `carousel-${index}`;
            const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : ["placeholder.png"];

            const carouselItems = imagenes.map((img, i) => `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <img src="../assets/img/${img}" class="d-block w-100" style="object-fit: cover; height: 300px;" alt="${producto.nombre}">
                </div>
            `).join("");

            // Si está agotado
            const isAgotado = producto.id_estado === 2;
            const cardOpacity = isAgotado ? 'opacity: 0.5; pointer-events: none;' : '';
            const nombreProducto = isAgotado ? `${producto.nombre} (AGOTADO)` : producto.nombre;

            card.innerHTML = `
                <div class="card h-100 border-0 shadow-sm text-center product-card" 
                    style="cursor: ${isAgotado ? 'not-allowed' : 'pointer'}; ${cardOpacity}" 
                    data-id="${producto.id_producto}">
                    
                    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            ${carouselItems}
                        </div>
                    </div>

                    <div class="card-body">
                        <h5 class="card-title text-dark mb-1">${nombreProducto}</h5>
                        <p class="text-muted small">M/L/XL</p>
                        <div class="mb-2">
                            <i class="fa fa-star text-warning"></i>
                            <i class="fa fa-star text-warning"></i>
                            <i class="fa fa-star text-warning"></i>
                            <i class="fa fa-star text-muted"></i>
                            <i class="fa fa-star text-muted"></i>
                        </div>
                        <p class="text-dark fw-bold">$${producto.precio.toLocaleString()}</p>
                    </div>
                </div>
            `;

            // Solo agregar evento de clic si el producto está disponible
            if (!isAgotado) {
                card.querySelector(".product-card").addEventListener("click", function () {
                    window.location.href = `../views/Products/producto.html?id=${producto.id_producto}`;
                });
            }

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
});

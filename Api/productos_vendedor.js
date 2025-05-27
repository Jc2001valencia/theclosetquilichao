document.addEventListener("DOMContentLoaded", async () => {
  const params        = new URLSearchParams(window.location.search);
  const idVendedor    = params.get("vendedor");
  const nombreVendedor = params.get("nombre");

  if (!idVendedor) {
    alert("No se encontró el ID del vendedor en la URL");
    return;
  }

  // 1) Mostrar nombre del vendedor
  const header     = document.getElementById("vendedor-header");
  const h2         = header.querySelector("h2");
  const imgLogo    = document.getElementById("vendedor-logo");
  h2.textContent   = nombreVendedor
    ? decodeURIComponent(nombreVendedor)
    : "Tienda";
  // opcional: si tienes un logo en la URL podrías hacer
  // imgLogo.src = `../../porfiles/${params.get("logo")}`;

  // 2) Traer productos de la API
  let productos;
  try {
    const res = await fetch(
      `http://localhost/microservicio_producto/routes/api.php?action=listarPorVendedor&id_vendedor=${idVendedor}`
    );
    productos = await res.json();
  } catch (err) {
    console.error("Error al cargar productos:", err);
    document.getElementById("productos-container").innerHTML =
      "<p class='text-danger'>No se pudieron cargar los productos.</p>";
    return;
  }

  // 3) Inyectar tarjetas
  const container = document.getElementById("productos-container");
  container.innerHTML = ""; // limpia antes

  productos.forEach((prod) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    // usa la primera imagen o placeholder
    const imgSrc = prod.imagenes?.[0]
      ? `../../assets/img/${prod.imagenes[0]}`
      : `../../assets/img/default.jpg`;

    col.innerHTML = `
      <div class="card mb-4 product-wap rounded-0">
        <div class="card rounded-0">
          <img 
            class="card-img rounded-0 img-fluid" 
            src="${imgSrc}" 
            alt="${prod.nombre}">
          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
            <ul class="list-unstyled mb-0">
              <li>
                <a class="btn btn-success text-white" href="../../views/Products/producto.html?id=${prod.id_producto}">
                  <i class="far fa-heart"></i>
                </a>
              </li>
              <li>
                <a class="btn btn-success text-white mt-2" href="../../views/Products/producto.html?id=${prod.id_producto}">
                  <i class="far fa-eye"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="card-body text-center">
          <a 
            href="../../views/Products/producto.html?id=${prod.id_producto}" 
            class="h3 text-decoration-none text-dark">
            ${prod.nombre}
          </a>
          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0 mt-2">
            <li class="pt-2">
              <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
              <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
              <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
              <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
              <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
            </li>
          </ul>
          <ul class="list-unstyled d-flex justify-content-center mb-1">
            ${[0,1,2,3,4].map(i => `
              <i class="fa fa-star ${i < 3 ? 'text-warning' : 'text-muted'}"></i>
            `).join('')}
          </ul>
          <p class="text-center mb-0">$${parseFloat(prod.precio).toLocaleString()}</p>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
});

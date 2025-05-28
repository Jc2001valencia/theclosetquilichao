document
  .getElementById("imagenesProducto")
  .addEventListener("change", function (event) {
    const previewContainer = document.getElementById("previewContainer");
    previewContainer.innerHTML = "";

    const files = event.target.files;
    if (files.length < 3) {
      alert("Debes subir al menos 3 imágenes.");
      event.target.value = "";
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "img-thumbnail m-1";
        img.style.width = "100px";
        img.style.height = "100px";
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

document
  .getElementById("formProducto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }

    // 1. Obtener el ID del vendedor con el userId
    const vendedorRes = await fetch(
      `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${userId}`
    );
    const vendedorData = await vendedorRes.json();

    if (!vendedorData.id_vendedor) {
      alert("No se pudo obtener el ID del vendedor.");
      return;
    }

    // 2. Armar los datos del formulario para enviarlos a crear
    const formData = new FormData(this);
    formData.append("id_vendedor", vendedorData.id_vendedor);

    // 3. Enviar al microservicio de productos
    fetch(
      "http://localhost/microservicio_producto/routes/api.php?action=crear",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert(data.mensaje || data.error || "Producto creado");
        document.getElementById("formProducto").reset();
        document.getElementById("previewContainer").innerHTML = "";
      })
      .catch((err) => {
        console.error("Error al guardar producto:", err);
        alert("Error al guardar el producto.");
      });
  });

document
  .getElementById("formProducto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      // 1. Obtener el ID del vendedor a partir del ID del usuario
      const vendedorRes = await fetch(
        `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${userId}`
      );
      const vendedorData = await vendedorRes.json();

      if (!vendedorData.id_vendedor) {
        alert("No se pudo obtener el ID del vendedor.");
        return;
      }

      // 2. Armar el FormData con los datos del formulario
      const formData = new FormData(this);
      formData.append("id_vendedor", vendedorData.id_vendedor);

      // 3. Enviar los datos al microservicio de productos
      const response = await fetch(
        "http://localhost/microservicio_producto/routes/api.php?action=crear",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);

      alert(data.mensaje || data.error || "Producto creado exitosamente");

      // 4. Limpiar el formulario
      document.getElementById("formProducto").reset();
      document.getElementById("previewContainer").innerHTML = "";
    } catch (err) {
      console.error("Error al guardar producto:", err);
      alert("Ocurrió un error al guardar el producto.");
    }
  });

// id segun usurio 
document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("❌ No se encontró el ID de usuario en localStorage");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${encodeURIComponent(userId)}`
    );

    const data = await response.json();

    if (data.id_vendedor) {
      localStorage.setItem("id_vendedor", data.id_vendedor);
      console.log("✅ ID del vendedor guardado en localStorage:", data.id_vendedor);
    } else {
      console.warn("⚠️ No se encontró un vendedor asociado al usuario.");
    }

  } catch (error) {
    console.error("⚠️ Error al obtener el ID del vendedor:", error);
  }
});



// listar 
document.addEventListener("DOMContentLoaded", async function () {
  const contenedor = document.getElementById("contenedor-productos");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("No se encontró el ID de usuario en localStorage");
    contenedor.innerHTML = `<p class="text-danger">Error: No se encontró el ID de usuario.</p>`;
    return;
  }

  try {
    const resVendedor = await fetch(
      `http://localhost/microservicio_producto/routes/api.php?action=obtenerIdVendedor&id_usu=${encodeURIComponent(userId)}`
    );
    const dataVendedor = await resVendedor.json();

    if (!dataVendedor.id_vendedor) {
      throw new Error("No se encontró un vendedor asociado a este usuario.");
    }

    const id_vendedor = dataVendedor.id_vendedor;

    const resProductos = await fetch(
      `http://localhost/microservicio_producto/routes/api.php?action=listarPorVendedor&id_vendedor=${id_vendedor}`
    );
    const productos = await resProductos.json();

    contenedor.innerHTML = "";

    productos.forEach((producto, index) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";

      const imagenes = producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : ["default.jpg"];
      const carouselId = `carousel${index}`;

      const carouselIndicators = imagenes.map((img, i) => `
        <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" class="${i === 0 ? "active" : ""}"
          aria-current="${i === 0 ? "true" : "false"}" aria-label="Slide ${i + 1}">
        </button>
      `).join("");

      const carouselItems = imagenes.map((img, i) => `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <img src="../../assets/img/${img}" class="d-block w-100 img-fluid"
               style="max-height: 180px; object-fit: contain;" alt="Imagen del producto">
        </div>
      `).join("");

      card.innerHTML = `
  <div class="card h-100 shadow-sm text-center p-2">
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2500" style="height: 250px;">
      <div class="carousel-indicators">
        ${carouselIndicators}
      </div>
      <div class="carousel-inner h-100">
        ${carouselItems}
      </div>
      <button class="carousel-control-prev position-absolute top-50 start-0 translate-middle-y p-1 border-0 bg-transparent shadow-none"
              type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button class="carousel-control-next position-absolute top-50 end-0 translate-middle-y p-1 border-0 bg-transparent shadow-none"
              type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>

    <div class="card-body d-flex flex-column justify-content-between">
      <h5 class="card-title">${producto.nombre}</h5>
      <p class="text-muted small">
        ${producto.categorias && producto.categorias.length > 0 
          ? producto.categorias.slice(0, 3).join(" / ") 
          : "Sin categorías"}
      </p>
      <p class="card-text">${producto.descripcion}</p>
      <p class="card-text"><strong>Precio:</strong> $${parseFloat(producto.precio).toLocaleString()}</p>
      <div class="d-flex justify-content-center gap-2 mt-auto">
        <button type="button" class="btn btn-sm btn-outline-secondary">Editar</button>
        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" data-id-producto="${producto.id_producto}">Eliminar</button>
        <button type="button" class="btn btn-sm btn-outline-warning" 
                data-id-producto="${producto.id_producto}" style="width: 100px;">
          Marcar como vendido
        </button>
      </div>
    </div>
  </div>
`;
      const btnEditar = card.querySelector(".btn-outline-secondary");

      btnEditar.addEventListener("click", () => {
        document.getElementById("editarIdProducto").value = producto.id_producto;
        document.getElementById("editarNombreProducto").value = producto.nombre;
        document.getElementById("editarDescripcionProducto").value = producto.descripcion;
        document.getElementById("editarPrecioProducto").value = producto.precio;
        
        // Si quieres llenar las categorías, deberías construir inputs dentro de este contenedor:
        const categoriasContainer = document.getElementById("checkboxCategorias");
        categoriasContainer.innerHTML = ""; // Limpia lo anterior
        
        if (producto.categorias && producto.categorias.length > 0) {
          producto.categorias.slice(0, 3).forEach(cat => {
            const div = document.createElement("div");
            div.classList.add("input-group", "mb-2");
            div.innerHTML = `
              <input type="text" class="form-control categoria-input" name="categorias[]" value="${cat}" placeholder="Nueva categoría">
              <button type="button" class="btn btn-outline-secondary eliminarCategoria">✕</button>
            `;
            categoriasContainer.appendChild(div);
          });
        }
         // Si tienes esta relación
      
        const modal = new bootstrap.Modal(document.getElementById("modalEditarProducto"));
        modal.show();
      });

      

      contenedor.appendChild(card);
    });

    // Escuchar clics en los botones Eliminar
    contenedor.addEventListener("click", async function (e) {
      if (e.target.classList.contains("btn-eliminar")) {
        const idProducto = e.target.getAttribute("data-id-producto");
        if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
          try {
            // Crear el objeto JSON que se enviará al servidor
            const requestData = {
              id_producto: idProducto
            };
    
            // Mostrar el JSON antes de enviarlo
            console.log("Datos enviados al servidor:", JSON.stringify(requestData));
    
            // Hacer la solicitud DELETE a la URL correcta
            const res = await fetch(`http://localhost/microservicio_producto/routes/api.php?action=eliminarConTodo`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(requestData) // Enviar el JSON en el cuerpo de la solicitud
            });
    
            // Analizar la respuesta
            const result = await res.json();
    
            // Mostrar la respuesta
            if (res.ok) {
              alert(result.mensaje || "Producto eliminado correctamente");
              location.reload();
            } else {
              alert("Ocurrió un error al eliminar el producto.");
            }
          } catch (err) {
            console.error("Error al eliminar el producto:", err);
            alert("Ocurrió un error al eliminar el producto.");
          }
        }
      }
    });
  } catch (err) {
    console.error("Error al cargar los productos:", err);
    contenedor.innerHTML = `<p class="text-danger">Error al cargar los productos.</p>`;
  }
});
// Delegamos el evento click a los botones "Vendido"
document.addEventListener("click", async function (event) {
  // Verificamos si el clic fue sobre un botón que tiene la clase "btn-outline-warning"
  if (event.target.classList.contains("btn-outline-warning")) {
    const boton = event.target;
    const idProducto = boton.getAttribute("data-id-producto");

    // Verificamos si el ID del producto está disponible
    if (!idProducto) {
      console.error("ID del producto no encontrado");
      return;
    }

    console.log("Producto ID:", idProducto);

    try {
      const confirmar = confirm("¿Estás seguro de marcar este producto como vendido?");
      if (!confirmar) return;
    
      const response = await fetch(`http://localhost/microservicio_producto/routes/api.php?action=productoVendido&id_producto=${idProducto}`);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        console.error("Error en la respuesta de la API:", response.status);
        alert("Hubo un problema con la solicitud al servidor.");
        return;
      }
    
      // Obtener la respuesta cruda y eliminar los posibles valores nulos o vacíos
      const responseText = await response.text();
      console.log("Respuesta cruda de la API:", responseText);
    
      // Intentar parsear el JSON, pero solo si la respuesta no es nula o vacía
      let result = null;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Error al parsear la respuesta JSON", e);
      }
    
      if (result && (result.success || result.mensaje === "Producto marcado como vendido")) {
        alert("Producto marcado como vendido correctamente.");
    
        // Cambiar estilo del botón
        boton.classList.remove("btn-outline-warning");
        boton.classList.add("btn-secondary");
        boton.textContent = "Vendido";
        boton.disabled = true;
      } else {
        alert("No se pudo marcar como vendido. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al marcar como vendido:", error);
      alert("Ocurrió un error al marcar el producto como vendido.");
    }
  }
});


// Agregar 
const form = document.getElementById("formProducto");

// Elimina el listener anterior si existe
form.removeEventListener("submit", handleFormSubmit);
form.addEventListener("submit", handleFormSubmit);

// Limita la selección de checkboxes a 3
document.querySelectorAll('.categoria-checkbox').forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    const checked = document.querySelectorAll('.categoria-checkbox:checked');
    if (checked.length > 3) {
      this.checked = false;
      alert('❌ Solo puedes seleccionar hasta 3 categorías.');
    }
  });
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const id_vendedor = localStorage.getItem("id_vendedor");

  if (!id_vendedor) {
    alert("❌ No se pudo obtener el ID del vendedor.");
    return;
  }

  const nombre = document.getElementById("nombreProducto").value.trim();
  const descripcion = document.getElementById("descripcionProducto").value.trim();
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const id_estado = 1;

  // Obtener categorías seleccionadas
  const checkedCategorias = document.querySelectorAll(".categoria-checkbox:checked");
  const categoria = {};
  checkedCategorias.forEach((input, index) => {
    categoria[`categoria${index + 1}`] = input.value.trim();
  });

  const imagenesInput = document.getElementById("imagenesProducto").files;
  const imagenes = {};
  for (let i = 0; i < imagenesInput.length && i < 3; i++) {
    imagenes[`imagen${i + 1}`] = imagenesInput[i].name;
  }

  const payload = {
    imagenes,
    categoria,
    producto: {
      nombre,
      descripcion,
      precio,
      id_estado,
      id_vendedor: parseInt(id_vendedor)
    }
  };

  console.log("Payload a enviar:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch("http://localhost/microservicio_producto/routes/api.php?action=crearTodo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Producto creado correctamente");

      // Enviar imágenes
      const formData = new FormData();
      for (let i = 0; i < imagenesInput.length && i < 3; i++) {
        formData.append("imagenes", imagenesInput[i]);
      }

      try {
        const uploadResponse = await fetch("http://localhost:3000/api/upload-images", {
          method: "POST",
          body: formData
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok) {
          console.log("✅ Imágenes copiadas a views/Products/img_productos/");
        } else {
          console.error("❌ Error al guardar imágenes en carpeta local:", uploadData);
        }
      } catch (error) {
        console.error("⚠️ Error al conectar con el servidor de imágenes:", error);
      }

      // Limpiar formulario y vista previa
      e.target.reset();
      document.getElementById("previewContainer").innerHTML = "";

      // 🔄 Recargar página tras éxito
      setTimeout(() => {
        location.reload();
      }, 1000);

    } else {
      console.error("❌ Error del servidor:", data);
      alert("❌ Error al crear el producto: " + (data.error || "Error desconocido"));
    }

  } catch (error) {
    console.error("⚠️ Error en la conexión:", error);
    alert("⚠️ No se pudo conectar al servidor.");
  }
}





// editar 
const formEditar = document.getElementById("formEditarProducto");
formEditar.removeEventListener("submit", handleEditarProducto); // Evita listeners duplicados
formEditar.addEventListener("submit", handleEditarProducto);

async function handleEditarProducto(e) {
  e.preventDefault();

  const id_producto = document.getElementById("editarIdProducto").value;
  const id_vendedor = localStorage.getItem("id_vendedor");

  if (!id_producto || !id_vendedor) {
    alert("❌ Faltan datos para editar el producto.");
    return;
  }

  const nombre = document.getElementById("editarNombreProducto").value.trim();
  const descripcion = document.getElementById("editarDescripcionProducto").value.trim();
  const precio = parseFloat(document.getElementById("editarPrecioProducto").value);
  const id_estado = 1;

  // Obtener categorías seleccionadas y garantizar 3 campos (null si no hay)
  const checkedCategorias = document.querySelectorAll("#editarCategoriasContainer .categoria-checkbox:checked");
  const categoria = {
    categoria1: checkedCategorias[0]?.value.trim() || null,
    categoria2: checkedCategorias[1]?.value.trim() || null,
    categoria3: checkedCategorias[2]?.value.trim() || null,
  };

  // Obtener imágenes seleccionadas (nuevas), siempre enviar 3 campos (null si no hay)
  const imagenesInput = document.getElementById("editarImagenesProducto").files;
  const imagenes = {
    imagen1: imagenesInput[0]?.name || null,
    imagen2: imagenesInput[1]?.name || null,
    imagen3: imagenesInput[2]?.name || null,
  };

  const payload = {
    producto: {
      nombre,
      descripcion,
      precio,
      id_estado,
      id_vendedor: parseInt(id_vendedor)
    },
    categoria,
    imagenes
  };

  console.log("📦 Payload a enviar:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(`http://localhost/microservicio_producto/routes/api.php?action=editarProductoConTodo&id_producto=${id_producto}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log("📩 Respuesta cruda:", text);

    try {
      const data = JSON.parse(text);

      if (response.ok) {
        alert(data.mensaje || "✅ Producto actualizado correctamente");

        // Subir imágenes solo si hay archivos nuevos
        if (imagenesInput.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < imagenesInput.length && i < 3; i++) {
            formData.append("imagenes", imagenesInput[i]);
          }

          try {
            const uploadResponse = await fetch("http://localhost:3000/api/upload-images", {
              method: "POST",
              body: formData
            });

            const uploadData = await uploadResponse.json();
            if (uploadResponse.ok) {
              console.log("🖼️ Imágenes actualizadas correctamente");
            } else {
              console.error("❌ Error al subir imágenes:", uploadData);
            }
          } catch (error) {
            console.error("⚠️ Error en servidor de imágenes:", error);
          }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarProducto"));
        modal.hide();
        setTimeout(() => location.reload(), 1000);

      } else {
        alert("❌ Error al actualizar: " + (data.mensaje || "Error desconocido"));
      }
    } catch (error) {
      console.error("⚠️ Respuesta no JSON:", text);
      alert("⚠️ El servidor no devolvió una respuesta válida.");
    }

  } catch (error) {
    console.error("❌ Error de conexión:", error);
    alert("❌ No se pudo conectar con el servidor.");
  }
}

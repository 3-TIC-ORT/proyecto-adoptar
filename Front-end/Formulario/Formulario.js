connect2Server();

let botonvolver = document.querySelector(".Iconovolver");
botonvolver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});

function mostrarPopup(titulo = "Aviso", mensaje = "Mensaje", onOk = null) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");
  const popupOk = document.getElementById("popup-ok");

  popupTitle.textContent = titulo;
  popupMessage.textContent = mensaje;
  popup.style.display = "flex";

  // Limpiar handlers previos
  popupOk.onclick = null;

  // Cerrar popup al hacer clic fuera
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };

  // Acción al hacer clic en OK
  popupOk.onclick = () => {
    popup.style.display = "none";
    if (typeof onOk === "function") onOk();
  };
}

let form = document.querySelector(".form-container");
let botonEnviar = document.querySelector("#botonEnviar");

// Localidades
const selectProvincia = document.getElementById("provincia");
const selectLocalidad = document.getElementById("localidad");

let publicacionActual = null;
let urlParams = new URLSearchParams(window.location.search);
let editarId = urlParams.get("editarId");

// Cargar provincias
getEvent("obtenerProvincias", (provincias) => {
  if (!selectProvincia) return;
  selectProvincia.innerHTML = '<option value="">Seleccione provincia</option>';
  provincias.forEach((prov) => {
    const opt = document.createElement("option");
    opt.value = prov.id;
    opt.textContent = prov.nombre;
    selectProvincia.appendChild(opt);
  });
});

// Cargar localidades
if (selectProvincia && selectLocalidad) {
  selectProvincia.addEventListener("change", () => {
    const idProvincia = selectProvincia.value;
    selectLocalidad.innerHTML = '<option value="">Seleccione localidad</option>';
    if (!idProvincia) return;

    postEvent("obtenerLocalidades", { provinciaId: idProvincia }, (localidades) => {
      selectLocalidad.innerHTML = '<option value="">Seleccione localidad</option>';
      localidades.forEach((loc) => {
        const opt = document.createElement("option");
        opt.value = loc.id;
        opt.textContent = loc.nombre;
        selectLocalidad.appendChild(opt);
      });
    });
  });
}

// Editar publicación
if (editarId) {
  postEvent("obtenerPublicacionPorId", { id: editarId }, (publicacion) => {
    if (publicacion) {
      publicacionActual = publicacion;
      document.querySelector("#nombreMascota").value = publicacion.nombreMascota || "";
      document.querySelector("#tipo").value = publicacion.tipo || "";
      document.querySelector("#tamano").value = publicacion.tamano || "";
      document.querySelector("#genero").value = publicacion.genero || "";
      document.querySelector("#color").value = publicacion.color || "";
      document.querySelector("#raza").value = publicacion.raza || "";
      document.querySelector("#edad").value = publicacion.edad || "";
      document.querySelector("#enfermedad").value = publicacion.enfermedad || "";
      document.querySelector("#estado").value = publicacion.estado || "";
      document.querySelector("#descripcion").value = publicacion.descripcion || "";
      document.querySelector("#telefono").value = publicacion.telefono || "";
      document.querySelector("#lugar").value = publicacion.lugar || "";
      document.querySelector("#fecha").value = publicacion.fecha || "";
    } else {
      mostrarPopup("Error", "No se encontró la publicación a editar.");
    }
  });
}

// Botón enviar
botonEnviar.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  let nombreMascota = document.querySelector("#nombreMascota").value;
  let tipo = document.querySelector("#tipo").value;
  let tamano = document.querySelector("#tamano").value;
  let genero = document.querySelector("#genero").value;
  let color = document.querySelector("#color").value;
  let raza = document.querySelector("#raza").value;
  let edad = document.querySelector("#edad").value;
  let enfermedad = document.querySelector("#enfermedad").value;
  let estado = document.querySelector("#estado").value;
  let descripcion = document.querySelector("#descripcion").value;
  let telefono = document.querySelector("#telefono").value;
  let provinciaSeleccionada = selectProvincia.options[selectProvincia.selectedIndex]?.text || "";
  let localidadSeleccionada = selectLocalidad.options[selectLocalidad.selectedIndex]?.text || "";
  let lugar = localidadSeleccionada && provinciaSeleccionada
    ? `${localidadSeleccionada}, ${provinciaSeleccionada}`
    : localidadSeleccionada || provinciaSeleccionada || "";
  let fecha = document.querySelector("#fecha").value;
  let fotoInput = document.querySelector("#foto");

  let imagenBase64 = "";
  if (fotoInput.files.length > 0) {
    imagenBase64 = await convertirImagenABase64(fotoInput.files[0]);
  } else if (publicacionActual?.foto) {
    imagenBase64 = publicacionActual.foto;
  }

  let usuario = JSON.parse(localStorage.getItem("usuarioActual")) || null;
  let creadorMail = usuario?.mail || usuario?.email || null;
  let creadorNombre = usuario?.nombre || creadorMail || "Anónimo";

  let nuevaPublicacion = {
    id: editarId || Date.now(),
    nombreMascota,
    tipo,
    tamano,
    genero,
    color,
    raza,
    edad,
    enfermedad,
    estado,
    descripcion,
    telefono,
    lugar,
    provincia: provinciaSeleccionada,
    localidad: localidadSeleccionada,
    fecha,
    foto: imagenBase64,
    creadorMail,
    creadorNombre,
  };

  let todas = JSON.parse(localStorage.getItem("publicaciones")) || [];

  if (editarId) {
    // Actualizar existente
    todas = todas.map(pub => pub.id === parseInt(editarId) ? nuevaPublicacion : pub);
    localStorage.setItem("publicaciones", JSON.stringify(todas));

    postEvent("actualizarPublicacion", nuevaPublicacion, (resp) => {
      console.log("Respuesta del servidor:", resp);
      if (resp && resp.ok) {
        mostrarPopup("¡Publicación editada con éxito!");
        setTimeout(() => {
          window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
        }, 1500);
      } else {
        mostrarPopup("Error", "Error al editar la publicación en el servidor.");
      }
    });
  } else {
    // Nueva publicación
    todas.push(nuevaPublicacion);
    localStorage.setItem("publicaciones", JSON.stringify(todas));

    postEvent("crearPublicacion", nuevaPublicacion, (resp) => {
      console.log("Respuesta del servidor:", resp);
      if (resp && resp.id) {
        mostrarPopup("¡Publicación creada con éxito!");
        setTimeout(() => {
          window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
        }, 1500);
      } else {
        mostrarPopup("Error", "Error al crear la publicación en el servidor.");
      }
    });
  }
});

// Convertir imagen a base64
function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

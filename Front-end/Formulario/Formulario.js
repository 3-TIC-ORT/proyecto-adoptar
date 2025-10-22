connect2Server();
let botonvolver = document.querySelector(".Iconovolver");
botonvolver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});
let form = document.querySelector(".form-container");
let botonEnviar = document.querySelector("#botonEnviar");

// Localidades
const selectProvincia = document.getElementById("provincia");
const selectLocalidad = document.getElementById("localidad");

let publicacionActual = null; // guardará los datos de la publicación a editar
let urlParams = new URLSearchParams(window.location.search);
let editarId = urlParams.get("editarId");

// Cargar provincias al iniciar
getEvent("obtenerProvincias", (provincias) => {
  if (!selectProvincia) return;
  selectProvincia.innerHTML = '<option value="">Seleccione provincia</option>';
  provincias.forEach((prov) => {
    const opt = document.createElement("option");
    opt.value = prov.id; // usamos el id para pedir las localidades
    opt.textContent = prov.nombre;
    selectProvincia.appendChild(opt);
  });
});

// Cuando cambia la provincia, cargar las localidades
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
      publicacionActual = publicacion; // guardo para usar la foto si no se cambia
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
      
      // Seleccionar provincia y localidad en los selects
      if (publicacion.provincia) {
        Array.from(selectProvincia.options).forEach(opt => {
          if (opt.textContent === publicacion.provincia) opt.selected = true;
        });
      }
      if (publicacion.localidad) {
        Array.from(selectLocalidad.options).forEach(opt => {
          if (opt.textContent === publicacion.localidad) opt.selected = true;
        });
      }
    } else {
      console.warn("No se encontró la publicación a editar.");
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

  // Tomar los valores del formulario
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

  // OBTENER USUARIO LOGUEADO
  let usuario = JSON.parse(localStorage.getItem("usuarioActual")) || null;
  let creadorMail = usuario?.mail || usuario?.email || null;
  let creadorNombre = usuario?.nombre || creadorMail || "Anónimo";

  // Crear el objeto publicación
  let nuevaPublicacion = {
    id: editarId || Date.now(), // mantener mismo id si es edición
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

  // Guardar en localStorage
  let todas = JSON.parse(localStorage.getItem("publicaciones")) || [];
  if (editarId) {
    // Reemplazar publicación existente
    todas = todas.map(pub => pub.id === editarId ? nuevaPublicacion : pub);
    alert("¡Publicación editada con éxito!");
  } else {
    todas.push(nuevaPublicacion);
    alert("¡Publicación creada con éxito!");
  }
  localStorage.setItem("publicaciones", JSON.stringify(todas));

  // Redirigir según el estado
  switch (estado) {
    case "Para adoptar":
      window.location.href = "../Paraadoptar/Paraadoptar.html";
      break;
    case "Para transitar":
      window.location.href = "../Paratransitar/Paratransitar.html";
      break;
    case "Perdido":
      window.location.href = "../Perdidos/Perdidos.html";
      break;
    case "Encontrado":
      window.location.href = "../Encontrados/Encontrados.html";
      break;
    default:
      window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
      break;
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

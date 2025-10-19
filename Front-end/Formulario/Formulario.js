connect2Server();
let botonvolver = document.querySelector(".Iconovolver");
botonvolver.addEventListener("click", () => {
  window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});
let form = document.querySelector(".form-container");
let botonEnviar = document.querySelector("#botonEnviar");

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
  let lugar = document.querySelector("#lugar").value;
  let fecha = document.querySelector("#fecha").value;
  let fotoInput = document.querySelector("#foto");

  let imagenBase64 = "";
  if (fotoInput.files.length > 0) {
    imagenBase64 = await convertirImagenABase64(fotoInput.files[0]);
  }

  //OBTENER USUARIO LOGUEADO
  let usuario =
    JSON.parse(localStorage.getItem("usuarioLogueado")) ||
    JSON.parse(localStorage.getItem("usuarioActual")) ||
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("usuario")) ||
    JSON.parse(localStorage.getItem("datosUsuario")) ||
    null;

  // Tomar datos del creador
  let creadorMail = usuario?.mail || usuario?.email || usuario?.correo || null;
  let creadorNombre = usuario?.nombre || "Anónimo";

  // Crear el objeto publicación
  let nuevaPublicacion = {
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
    lugar,
    fecha,
    foto: imagenBase64,
    creadorMail, 
    creadorNombre,   
  };

  // Enviar al backend
  postEvent("crearPublicacion", nuevaPublicacion, (respuesta) => {
    console.log("Publicación guardada:", respuesta);

    if (respuesta) {
      alert("¡Publicación creada con éxito!");

      let todas = JSON.parse(localStorage.getItem("publicaciones")) || [];
      todas.push(respuesta);
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
    } else {
      alert("Error: la publicación no se guardó. Revisá los campos.");
    }
  });
});

function convertirImagenABase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
//Localidades
const selectProvincia = document.getElementById("provincia");
const selectLocalidad = document.getElementById("localidad");

// Cargar provincias al iniciar
getEvent("obtenerProvincias", (provincias) => {
  if (!selectProvincia) return;
  selectProvincia.innerHTML = '<option value="">Seleccione provincia</option>';
  provincias.forEach(prov => {
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
      localidades.forEach(loc => {
        const opt = document.createElement("option");
        opt.value = loc.id;
        opt.textContent = loc.nombre;
        selectLocalidad.appendChild(opt);
      });
    });
  });
}
lugar.addEventListener("change", () => {
  const provincia = selectProvincia.options[selectProvincia.selectedIndex].text;
  const localidad = selectLocalidad.options[selectLocalidad.selectedIndex].text;
  lugar.value = `${localidad}, ${provincia}`;
});
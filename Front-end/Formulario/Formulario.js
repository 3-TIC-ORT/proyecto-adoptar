connect2Server(3000);

let form = document.querySelector(".form-container");
let botonEnviar = document.querySelector("#botonEnviar");

botonEnviar.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Tomar los valores del formulario
  let nombreMascota = document.querySelector("#sesion").value;
  let tipo = document.querySelector("#categorias").value;
  let genero = document.querySelector("#genero").value;
  let enfermedad = document.querySelector("#salud").value;
  let estado = document.querySelector("#estado").value;
  let descripcion = document.querySelector("#Espaciodescripcion").value;
  let lugar = document.querySelector("#EspacioEncontrado").value;
  let fotoInput = document.querySelector("#foto");

  let imagenBase64 = "";
  if (fotoInput.files.length > 0) {
    imagenBase64 = await convertirImagenABase64(fotoInput.files[0]);
  }

  // NOMBRES alineados con lo que el backend espera
  let nuevaPublicacion = {
    nombreMascota: nombreMascota,
    tipo: tipo,
    genero: genero,
    enfermedad: enfermedad,
    estado: estado,
    descripcion: descripcion,
    lugar: lugar,
    foto: imagenBase64
  };

  // Enviar la publicación al backend
  postEvent("crearPublicacion", nuevaPublicacion, (respuesta) => {
    console.log("Publicación guardada:", respuesta);
    if (respuesta) {
      alert("¡Publicación creada con éxito!");
      window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
    } else {
      alert("Error: la publicación no se guardó. Revisá los campos.");
    }
  });
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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

getEvent("obtenerPublicaciones", (publicaciones) => {
  const pub = publicaciones.find(p => p.id == id);
  if (!pub) return;
  document.body.innerHTML = `
    <h1>${pub.nombre}</h1>
    <img src="${pub.imagen}" alt="${pub.nombre}">
    <p><strong>Tipo:</strong> ${pub.tipo}</p>
    <p><strong>Estado:</strong> ${pub.estado}</p>
    <p><strong>Ubicación:</strong> ${pub.ubicacion}</p>
    <p><strong>Descripción:</strong> ${pub.descripcion}</p>
    <p><strong>Teléfono:</strong> ${pub.telefono}</p>
  `;
});
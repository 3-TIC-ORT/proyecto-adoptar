connect2Server(3000);

let form = document.querySelector(".form-container");
let botonEnviar = document.querySelector("#botonEnviar");

botonEnviar.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  let nombreMascota = document.querySelector("#sesion").value;
  let categoria = document.querySelector("#categorias").value;
  let genero = document.querySelector("#genero").value;
  let salud = document.querySelector("#salud").value;
  let estado = document.querySelector("#estado").value;
  let descripcion = document.querySelector("#Espaciodescripcion").value;
  let telefono = document.querySelector("#EspacioTelefono").value;
  let ubicacion = document.querySelector("#EspacioEncontrado").value;
  let fotoInput = document.querySelector("#foto");

  let imagenBase64 = "";
  if (fotoInput.files.length > 0) {
    imagenBase64 = await convertirImagenABase64(fotoInput.files[0]);
  }

  let nuevaPublicacion = {
    nombre: nombreMascota,
    tipo: categoria,
    genero: genero,
    salud: salud,
    estado: estado,
    descripcion: descripcion,
    telefono: telefono,
    ubicacion: ubicacion,
    imagen: imagenBase64,
  };
  postEvent("crearPublicacion", nuevaPublicacion, (respuesta) => {
    console.log("Publicación guardada:", respuesta);
    alert("¡Publicación creada con éxito!");
    window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
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
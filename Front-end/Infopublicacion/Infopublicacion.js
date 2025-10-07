connect2Server();

// Obtener parámetro "id" de la URL
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const boton = document.querySelector(".Boton");
const postId = getQueryParam("id");

if (postId) {
  getEvent(`obtenerPublicacionPorId?id=${encodeURIComponent(postId)}`, (pub) => {
    if (!pub) return;

    const img = document.querySelector(".foto");
    if (img && pub.foto) img.src = pub.foto;

    function setText(selector, text) {
      const node = document.querySelector(selector);
      if (node) node.textContent = text;
    }

    setText(".Nombre", `Nombre: ${pub.nombreMascota || "No especificado"}`);
    setText(".Tipo", `Tipo: ${pub.tipo || "No especificado"}`);
    setText(".Género", `Género: ${pub.genero || "No especificado"}`);
    setText(".Color", `Color: ${pub.color || "No especificado"}`);
    setText(".Raza", `Raza: ${pub.raza || "No especificada"}`);
    setText(".Edad", `Edad: ${pub.edad || "No especificada"}`);
    setText(".Enfermedad", `Enfermedad: ${pub.enfermedad || "No especificada"}`);
    setText(".Situacion", `Situación: ${pub.estado || "No especificada"}`);
    setText(".Ubicacion", `Ubicación: ${pub.lugar || "No especificada"}`);
    setText(".Descripcion", `Descripción: ${pub.descripcion || "No especificada"}`);
  });
}

if (boton) {
  boton.addEventListener("click", () => {
    boton.classList.toggle("seleccionado");
    boton.textContent = boton.classList.contains("seleccionado")
      ? "¡Interesado!"
      : "¡Me interesa!";
  });
}
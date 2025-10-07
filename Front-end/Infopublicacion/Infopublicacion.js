connect2Server();

// Helper: obtener query param
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const boton = document.querySelector('.Boton');
const postId = getQueryParam('id');

if (postId) {
  // Ahora usamos query param en el nombre del evento
  getEvent(`obtenerPublicacionPorId?id=${encodeURIComponent(postId)}`, (pub) => {
    if (!pub) return;

    const img = document.querySelector('.foto');
    if (img && pub.foto) img.src = pub.foto;

    function setText(selector, text, index = 0) {
      const nodes = document.querySelectorAll(selector);
      if (nodes.length > index) nodes[index].textContent = text;
    }

    setText('.Nombre', `Nombre: ${pub.nombreMascota || 'No especificado'}`);
    setText('.Situacion', `Situación: ${pub.estado || 'No especificado'}`);
    setText('.Descripcion', `Descripción: ${pub.descripcion || 'No especificada'}`);
    setText('.Ubicacion', `Ubicación: ${pub.lugar || 'No especificada'}`, 0);

    if (pub.tipo) setText('.Tamaño', `Tamaño: ${pub.tipo}`);
    if (pub.genero) setText('.Sexo', `Sexo: ${pub.genero}`);
    if (pub.enfermedad) setText('.Raza', `Enfermedad: ${pub.enfermedad}`);
  });
}
// Mantengo el botón
if (boton) {
  boton.addEventListener('click', () => {
    boton.classList.toggle('seleccionado'); 
    boton.textContent = boton.classList.contains('seleccionado') ? '¡Interesado!' : '¡Me interesa!';
  });
}
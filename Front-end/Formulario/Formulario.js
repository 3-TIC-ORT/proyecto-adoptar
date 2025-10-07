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
  let nombreMascota = document.querySelector("#nombreMascota").value;
  let tipo = document.querySelector("#tipo").value;
  let genero = document.querySelector("#genero").value;
  let color = document.querySelector("#color").value;
  let raza = document.querySelector("#raza").value;
  let edad = document.querySelector("#edad").value;
  let enfermedad = document.querySelector("#enfermedad").value;
  let estado = document.querySelector("#estado").value;
  let descripcion = document.querySelector("#descripcion").value;
  let telefono = document.querySelector("#telefono").value;
  let lugar = document.querySelector("#lugar").value;
  let fotoInput = document.querySelector("#foto");

  let imagenBase64 = "";
  if (fotoInput.files.length > 0) {
    imagenBase64 = await convertirImagenABase64(fotoInput.files[0]);
  }

  // Crear el objeto publicación
  let nuevaPublicacion = {
    nombreMascota,
    tipo,
    genero,
    color,
    raza,
    edad,
    enfermedad,
    estado,
    descripcion,
    telefono,
    lugar,
    foto: imagenBase64,
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
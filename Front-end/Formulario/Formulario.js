let botonEnviar = document.querySelector("#botonEnviar");
let form = document.querySelector(".form-container");

botonEnviar.addEventListener("click", (e) => {
  e.preventDefault(); // evita que se envíe de golpe

  if (form.checkValidity()) {
    // Si todos los campos required están completos
    window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
  } else {
    form.reportValidity(); // muestra los mensajes nativos del navegador
  }
});

// Detectar parámetros de la URL
const params = new URLSearchParams(window.location.search);
const modo = params.get("modo");
const id = params.get("id");

// Si es edición
if (modo === "editar" && id !== null) {
  // Cambiar título
  document.querySelector("h2").textContent = "Editar Publicación";

  // Cambiar botón
  const boton = document.querySelector("button[type='submit']");
  boton.textContent = "Guardar cambios";

  // (Ejemplo) precargar datos simulados:
  document.querySelector("#nombre").value = "Paco";
  document.querySelector("#descripcion").value = "Perro muy amigable y cariñoso.";
  // acá cargarías más campos con datos reales
}

connect2Server();

function mostrarPopup(titulo = "Aviso", mensaje = "") {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");

  popupTitle.textContent = titulo;
  popupMessage.textContent = mensaje;

  popup.style.display = "flex";

  // Cerrar popup
  document.getElementById("popup-ok").onclick = () => popup.style.display = "none";

  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}
// Referencias a los campos del formulario
let nombreInput = document.getElementById("Nombre");
let mailInput = document.getElementById("sesión");
let passwordInput = document.getElementById("password");
let fechaInput = document.getElementById("Fechanacimiento");
let telefonoInput = document.getElementById("EspacioTelefono");

// Botón para crear cuenta
let botoncrearcuenta = document.getElementById("Crear-cuenta");
botoncrearcuenta.addEventListener("click", () => {
  if (!nombreInput.value || !mailInput.value || !passwordInput.value) {
    mostrarPopup("Por favor completá nombre, correo y contraseña.");
    return;
  }

  // Crear el objeto de usuario
  let nuevoUsuario = {
    nombre: nombreInput.value,
    mail: mailInput.value,
    password: passwordInput.value,
    fotoPerfil: null,
    edad: calcularEdad(fechaInput.value),
    telefono: telefonoInput.value
  };


  postEvent("registrarUsuario", nuevoUsuario, (respuesta) => {
    if (respuesta.error) {
      mostrarPopup(respuesta.error);
    } else {
      mostrarPopup("Cuenta creada correctamente. Bienvenido " + respuesta.nombre);
      localStorage.setItem("usuarioActual", JSON.stringify(respuesta));
      window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
    }
  });
});

let iralogin = document.getElementById("Sicuenta");
iralogin.addEventListener("click", () => {
  window.location.href = "../Login/Login.html";
});

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  let hoy = new Date();
  let nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  let m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
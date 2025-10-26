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

  // Cerrar al hacer clic fuera del contenido
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
}

document.addEventListener("DOMContentLoaded", () => {
  let loginForm = document.getElementById("login-form");
  let mailInput = document.getElementById("sesion");
  let passwordInput = document.getElementById("password");

  // Evento: inicio de sesión
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let datosLogin = {
      mail: mailInput.value,
      password: passwordInput.value,
    };

    // Enviamos los datos al backend
    postEvent("loginUsuario", datosLogin, (respuesta) => {
      if (respuesta.error) {
        mostrarPopup("Error", respuesta.error);
      } else {
        mostrarPopup("Bienvenido " + respuesta.nombre);
        localStorage.setItem("usuarioActual", JSON.stringify(respuesta));

        // Redirección después de cerrar el popup
        document.getElementById("popup-ok").onclick = () => {
          document.getElementById("popup").style.display = "none";
          window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
        };
      }
    });
  });

  // Redirección a crear cuenta
  let iracrear = document.getElementById("Nocuenta");
  iracrear.addEventListener("click", () => {
    window.location.href = "../Crearcuenta/Crearcuenta.html";
  });
});
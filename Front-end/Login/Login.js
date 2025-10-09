// Conectar al servidor SoqueTIC
connect2Server();

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
        alert(respuesta.error);
      } else {
        alert("Bienvenido " + respuesta.nombre);
        localStorage.setItem("usuarioActual", JSON.stringify(respuesta));
        window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
      }
    });
  });

  // Redirección a crear cuenta
  let iracrear = document.getElementById("Nocuenta");
  iracrear.addEventListener("click", () => {
    window.location.href = "../Crearcuenta/Crearcuenta.html";
  });

  // Recuperar contraseña (placeholder)
  let olvido = document.getElementById("Olvidastecontraseña");
  olvido.addEventListener("click", () => {
    alert("🔒 Función de recuperar contraseña próximamente.");
  });
});
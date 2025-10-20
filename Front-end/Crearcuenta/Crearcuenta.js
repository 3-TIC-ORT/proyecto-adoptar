connect2Server();

// Referencias a los campos del formulario
let nombreInput = document.getElementById("Nombre");
let mailInput = document.getElementById("sesión");
let passwordInput = document.getElementById("password");
let fechaInput = document.getElementById("Fechanacimiento");
let telefonoInput = document.getElementById("EspacioTelefono");

// Botón para crear cuenta
let botoncrearcuenta = document.getElementById("Crear-cuenta");
botoncrearcuenta.addEventListener("click", () => {
  // Validar campos mínimos
  if (!nombreInput.value || !mailInput.value || !passwordInput.value) {
    alert("Por favor completá nombre, correo y contraseña.");
    return;
  }

  // Crear el objeto de usuario
  let nuevoUsuario = {
    nombre: nombreInput.value,
    mail: mailInput.value,
    password: passwordInput.value,
    fotoPerfil: null, // podrías agregarlo más adelante
    edad: calcularEdad(fechaInput.value),
    telefono: telefonoInput.value
  };

  // Enviar datos al backend usando SoqueTIC
  postEvent("registrarUsuario", nuevoUsuario, (respuesta) => {
    if (respuesta.error) {
      alert(respuesta.error);
    } else {
      alert("Cuenta creada correctamente. Bienvenido " + respuesta.nombre);
      // Guardar en localStorage si querés recordar el usuario
      localStorage.setItem("usuarioActual", JSON.stringify(respuesta));
      // Redirigir a pantalla principal
      window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
    }
  });
});

// Redirección a login
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
window.onload = function () {
  google.accounts.id.initialize({
      client_id: 'TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com',
      callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { theme: 'outline', size: 'large', width: 300 }  
  );
}

function handleCredentialResponse(response) {
 
  console.log("Token de Google:", response.credential);

  
}

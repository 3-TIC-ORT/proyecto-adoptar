// Conecta al servidor
connect2Server();
///Funciones
getEvent("Nombrecompleto","Correo","Contraseña","Fechanacimiento","Numerotelefono");
//Redirecciones
let botoncrearcuenta = document.getElementById("Crear-cuenta");
botoncrearcuenta.addEventListener("click", () => {
window.location.href = "../Pantallaprincipal/Pantallaprincipal.html";
});
let iralogin= document.getElementById("Sicuenta");
iralogin.addEventListener("click", () => {
window.location.href = "../Login/Login.html";
});
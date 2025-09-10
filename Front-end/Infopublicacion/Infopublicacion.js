const boton = document.querySelector('.Boton');

boton.addEventListener('click', () => {
  boton.classList.toggle('seleccionado'); 
  boton.textContent = boton.classList.contains('seleccionado') ? '¡Interesado!' : '¡Me interesa!';
});

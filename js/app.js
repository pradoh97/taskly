let nombre = document.getElementById('nombre-usuario');
let botonAgregarTarea = document.getElementById('agregar-tarea');
let grillaTareas = document.querySelector('.grilla-tareas');
let contadorTareas = document.getElementById('contador-tareas');
let modal;
iniciarApp();

function iniciarApp(){
  nombre.addEventListener('click', generarModal);
  botonAgregarTarea.addEventListener('click', generarModal);
  
  nombre.innerText = obtenerNombreUsuario();

  contarTareas();
  cargarTareas();
}

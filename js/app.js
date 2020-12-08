let nombre = document.getElementById('nombre-usuario');
let botonAgregarTarea = document.getElementById('agregar-tarea');
let grillaTareas = document.querySelector('.grilla-tareas');
let contadorTareas = document.getElementById('contador-tareas');
let botonAlternarColores = document.getElementById('alternar-colores');
let botonAlternarTexto = document.getElementById('alternar-texto');
let botonAlternarOpciones = document.getElementById('alternar-opciones');
let modal;

iniciarApp();

function iniciarApp(){
  nombre.addEventListener('click', generarModal);
  botonAgregarTarea.addEventListener('click', generarModal);
  botonAlternarColores.addEventListener('click', alternarColores);
  botonAlternarTexto.addEventListener('click', alternarTexto);
  botonAlternarOpciones.addEventListener('click', alternarOpciones);
  nombre.innerText = obtenerNombreUsuario();

  cargarTareas();
  alternarColores(null);
  alternarTexto(null, botonAlternarTexto);

  if(!contarTareas()) alternarOpciones();
}

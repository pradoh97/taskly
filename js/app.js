const nombre = document.getElementById('nombre-usuario');
const botonAgregarTarea = document.getElementById('agregar-tarea');
const grillaTareas = document.querySelector('.grilla-tareas');
const contadorTareas = document.getElementById('contador-tareas');
const alternadores = new Alternador();
let modal;

iniciarApp();

function iniciarApp(){
  nombre.addEventListener('click', generarModal);
  botonAgregarTarea.addEventListener('click', generarModal);
  alternadores.alternadores;
  nombre.innerText = obtenerNombreUsuario();

  //cargarTareas();
  // alternarColores(null);
  // alternarTexto(null, botonAlternarTexto);

  //if(!contarTareas()) alternarOpciones();
}

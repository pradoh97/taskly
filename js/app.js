let nombre = document.querySelector('.campo-editable[data-nombre-usuario]');
let botonAgregarTarea = document.getElementById('agregar-tarea');
let grillaTareas = document.querySelector('.grilla-tareas');
let modal;
contarTareas();

nombre.addEventListener('click', generarModal);
botonAgregarTarea.addEventListener('click', generarModal);

function contarTareas(){
  //console.log(grillaTareas.children);
}

function mostrarCantidadTareasDOM(){

}

let nombre = document.querySelector('.campo-editable[data-nombre-usuario]');
let botonAgregarTarea = document.getElementById('agregar-tarea');
let grillaTareas = document.querySelector('.grilla-tareas');
let contadorTareas = document.getElementById('contador-tareas');
let modal;

nombre.addEventListener('click', generarModal);
botonAgregarTarea.addEventListener('click', generarModal);
contarTareas();

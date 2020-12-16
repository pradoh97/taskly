const tableroPorDefecto = document.getElementById('tablero-principal');
/*
  TODO: agregar lista de botones de opcionesUsuario
  (agregar tareas por el momento).
 */
const opcionesTarea = [];
const opcionesModal = [];
let ultimaTareaActiva;

opcionesTarea['completar'] = {
  habilitado: true,
  texto: 'Completar',
  icono: null
}
opcionesTarea['eliminar'] = {
  habilitado: true,
  texto: 'Eliminar',
  icono: null
}

opcionesModal['crear tarea'] = {
  habilitado: true,
  texto: 'Crear tarea',
  icono: null
}
opcionesModal['cancelar'] = {
  habilitado: true,
  texto: 'Cancelar',
  icono: null
}


window.addEventListener('load', iniciarApp);
function iniciarApp(){
  Tarea.cargarTareas();

  document.querySelector('.opciones button').addEventListener('click', crearTarea);
  document.addEventListener('keyup', Utils.mostrarOpcionesTarea);
  document.addEventListener('click', Utils.mostrarOpcionesTarea);
}

function crearTarea(){
  let modal = new Modal('Crea una tarea nueva', 'Agregá un título', 'text', 'Tratá de que sea descriptivo :)');
  modal.mostrar();
}
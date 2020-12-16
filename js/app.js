const tableroPorDefecto = document.getElementById('tablero-principal');

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

  document.addEventListener('keyup', Utils.mostrarOpcionesTarea);
  document.addEventListener('click', Utils.mostrarOpcionesTarea);
}
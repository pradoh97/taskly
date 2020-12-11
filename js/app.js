const tableroPorDefecto = document.getElementById('tablero-principal');

const opciones = [];

opciones['completar'] = {
  habilitado: true,
  texto: 'Completar',
  icono: null
}
opciones['eliminar'] = {
  habilitado: true,
  texto: 'Eliminar',
  icono: null
}

window.addEventListener('load', iniciarApp);

function iniciarApp(){
  Tarea.cargarTareas();
}

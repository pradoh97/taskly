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

  // let tareas = [];
  // tareas.push(new Tarea(1, "a", "a"));
  // tareas.push(new Tarea(2, "b", "b"));
  // tareas.push(new Tarea(3, "c", "c"));
  // tareas.push(new Tarea(4, "d", "d"));
  // tareas.push(new Tarea(5, "e", "e"));
  //
  // for(let tarea of tareas) tarea.cargar();

}

const tableroPorDefecto = document.getElementById('tablero-principal');
/*
  TODO:
   - agregar lista de botones de opcionesUsuario (agregar tareas por el momento).
   - mover acciones de usuario a un espacio de nombres nuevo (capaz una clase
   usuario que haga de nexo para hacer cambios de nombres, agregar tareas, cambiar
   de tablero, alternar colores y demás)
 */
const opcionesTarea = [];
const opcionesModal = [];
let nombreUsuario;

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

  nombreUsuario = document.querySelector('.nombre .campo-editable');

  document.querySelector('.opciones button').addEventListener('click', crearTarea);

  document.addEventListener('keyup', Tarea.mostrarOpcionesTarea);
  document.addEventListener('click', Tarea.mostrarOpcionesTarea);
  nombreUsuario.addEventListener('click', cambiarNombreUsuario);
  nombreUsuario.addEventListener('input', cambiarNombreUsuario);

  if(obtenerNombreUsuario()){
    nombreUsuario.innerText = obtenerNombreUsuario();
  }
}

function crearTarea(){
  let modal = new Modal('Crea una tarea nueva', 'Agregá un título', 'text', 'Tratá de que sea descriptivo :)');
  modal.mostrar();
}

function cambiarNombreUsuario(e){
  if(e.type == 'input'){
    localStorage.setItem('nombre-usuario', e.target.innerText);
  }
  let nombre = Utils.obtenerDeLocalStorage('nombre-usuario');
  if(!nombre) document.execCommand('selectAll');
}

function obtenerNombreUsuario(){
  return localStorage.getItem('nombre-usuario');
}
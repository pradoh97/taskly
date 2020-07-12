function crearTarea(titulo){
  let atributoTarea;

  let tarea = {
    descripcion:'Añadí una descripción de la tarea.'
  }
  tarea.titulo = titulo;
  tarea.nodo = document.createElement('div');
  tarea.nodo.classList.add('tarea');
  tarea.nodo.innerHTML = `

  <div class="titulo">
    <h2 class="campo-editable">${titulo}</h2><i class="fas fa-pen"></i>
  </div>
  <div class="descripcion">
    <p class="campo-editable">
      ${tarea.descripcion}
    </p>
    <i class="fas fa-pen"></i>
  </div>

  <button class="exito" type="button">
    <i class="fas fa-check"></i> Marcar como completa.
  </button>`;

  tarea.nodo.querySelectorAll('.campo-editable').forEach(campo => campo.addEventListener('click', generarModal));

  tarea.id = obtenerUltimaTarea() + 1;

  atributoTarea = document.createAttribute('data-id-tarea');
  atributoTarea.value = tarea.id;

  tarea.nodo.setAttributeNode(atributoTarea);
  grillaTareas.appendChild(tarea.nodo);

  agregarTareaLS(tarea);

  contarTareas();
}

function contarTareas(){
  let cantidadTareas = 0;
  Array.from(grillaTareas.children).forEach(hijo => {
    if(hijo.classList.contains('tarea')){
      cantidadTareas++;
    }
  });

  if(cantidadTareas == 0){
    mensaje = '¿Nada para hacer? :)'
  } else if(cantidadTareas > 0){
    /*Cuando se puedan marcar comom completas, el cero pasa a ser la cantidad de completas*/
    mensaje = 0 + '/' + cantidadTareas;
  }

  contadorTareas.innerText = mensaje;
}

function agregarTareaLS(tarea){
  let claveLS = 'tarea-' + tarea.id;
  delete tarea.nodo;
  localStorage.setItem(claveLS, JSON.stringify(tarea));
}

function obtenerClaveTareaLS(claveLS){
  let idTarea;
  idTarea = localStorage.getItem(claveLS);
  idTarea = JSON.parse(idTarea);
  idTarea = idTarea.id;
  return idTarea;
}

function obtenerUltimaTarea(){
  let id = 0, regExp = /tarea/, claveLS, valorClaveLS;

  for(let i = 0; i<localStorage.length; i++){
    claveLS = localStorage.key(i);

    if(regExp.test(claveLS)){
      valorClaveLS = obtenerClaveTareaLS(claveLS);
    }
    if(valorClaveLS && valorClaveLS > id){
      id = valorClaveLS;
    }
  }
  return id;
}
// TODO: Agregar las tareas desde localStorage al DOM

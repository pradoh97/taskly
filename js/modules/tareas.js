class Tarea {
  constructor(titulo, descripcion, id, estado) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.id = id;
    this.estado = estado;
    this.nodo;
  }
  mostrarTarea(){
    let atributoTarea;
    this.nodo = document.createElement('div');
    this.nodo.classList.add('tarea');
    this.nodo.innerHTML = `

    <div class="titulo">
    <h2 class="campo-editable">${this.titulo}</h2><i class="fas fa-pen"></i>
    </div>
    <div class="descripcion">
    <p class="campo-editable">
    ${this.descripcion}
    </p>
    <i class="fas fa-pen"></i>
    </div>

    <button class="exito" type="button">
    <i class="fas fa-check"></i> Marcar como completa.
    </button>`;
    atributoTarea = document.createAttribute('data-id-tarea');
    atributoTarea.value = this.id;

    this.nodo.setAttributeNode(atributoTarea);
    grillaTareas.appendChild(this.nodo);

  }
  crearTarea(){


    if(!this.descripcion){
      this.descripcion = 'Añadí una descripción de la tarea.';
    }
    if(!this.estado){
      this.estado = 'incompleta';
    }

    if(!this.id){
      this.id = obtenerUltimaTarea() + 1;
    }

    guardarLocalStorage('tarea-' + this.id, this);

    contarTareas();
  }

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

function cargarTareas(){
  for(let i = 0; i < localStorage.length; i++){
    if(localStorage.key(i).includes('tarea')){
      let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
      let tarea = new Tarea(item.titulo, item.descripcion, item.id, item.estado);
      tarea.mostrarTarea();

    }
  }
}

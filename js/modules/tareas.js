class Tarea {
  constructor(titulo, descripcion, id, estado) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.id = id;
    this.estado = estado;
    this.nodo;
  }
  mostrarTarea(){
    let atributoTarea, estado;
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
    </div>`;
    if(this.estado === 'completa'){
      this.nodo.classList.add('completa');
      this.nodo.innerHTML += `
      <button type="button">
        <i class="fas fa-check"></i> Marcar como incompleta.
      </button>`;
    } else {
      this.nodo.innerHTML += `
      <button class="exito" type="button">
        <i class="fas fa-check"></i> Marcar como completa.
      </button>
      `
      this.nodo.querySelector('.exito').addEventListener('click', completarTarea);
    }
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
  let cantidadTareas = 0, regExp = /tarea/;

  for(let i = 0; i<localStorage.length; i++){
    claveLS = localStorage.key(i);

    if(regExp.test(claveLS)){
      cantidadTareas++;
    }
  }
  if(cantidadTareas == 0){
    mensaje = '¿Nada para hacer? :)'
  } else if(cantidadTareas > 0){
    mensaje = contarTareasCompletas() + '/' + cantidadTareas;
  }

  contadorTareas.innerText = mensaje;
}

function contarTareasCompletas(){
  /*
  TODO: Abstraer este for porque está repetido en 3 lugares.
  */
  let regExp = /tarea/;

  let cantidadCompletas = 0;
  let estadoTarea;
  for(let i = 0; i<localStorage.length; i++){
    claveLS = localStorage.key(i);
    if(regExp.test(claveLS)){
      estadoTarea = localStorage.getItem(localStorage.key(i));
      estadoTarea = JSON.parse(estadoTarea);
      estadoTarea = estadoTarea.estado;

      if(estadoTarea === 'completa'){
        cantidadCompletas++;
      }
    }
  }

  return cantidadCompletas;
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

function completarTarea(e){
  let nodo = e.target;
  nodo.classList.remove('exito');
  nodo.innerHTML = `<i class="fas fa-check"></i> Marcar como incompleta.`;
  let claveLS = 'tarea-';
  let tarea;


  while(!nodo.classList.contains('tarea')){
    nodo = nodo.parentElement;
  }

  claveLS += nodo.dataset.idTarea;

  for(let i = 0; i<localStorage.length; i++){
    if(localStorage.key(i) == claveLS){
      tarea = localStorage.getItem(claveLS);
      tarea = JSON.parse(tarea);
      tarea.estado = 'completa';
      localStorage.setItem(claveLS, JSON.stringify(tarea));
    }
  }

  contarTareas();
}

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
    let tituloPlaceholder = '';
    let descripcionPlaceholder = '';

    if(this.titulo == 'No te olvides de completarme :('){
      tituloPlaceholder = 'placeholder';
    }
    if(this.descripcion == 'No te olvides de completarme :('){
      descripcionPlaceholder = 'placeholder';
    }
    this.nodo = document.createElement('div');
    this.nodo.classList.add('tarea');
    this.nodo.innerHTML = `

    <div class="titulo">
    <h2 class="campo-editable ${tituloPlaceholder}">${this.titulo}</h2><i class="fas fa-pen"></i>
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
      this.nodo.querySelector('button').addEventListener('click', alternarTarea);
    } else {
      this.nodo.innerHTML += `
      <button class="exito" type="button">
        <i class="fas fa-check"></i> Marcar como completa.
      </button>
      `
      this.nodo.querySelector('.exito').addEventListener('click', alternarTarea);
    }

    this.nodo.querySelector('h2.campo-editable').addEventListener('click', editarTarea);
    this.nodo.querySelector('p.campo-editable').addEventListener('click', editarTarea);
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
function alternarTarea(e){
  let boton = e.target;
  let padre = boton;
  let estado = '';

  while(!padre.classList.contains('tarea')){
    padre = padre.parentElement;
  }

  if(boton.classList.contains('exito')){
    boton.classList.remove('exito');
    boton.innerHTML = `<i class="fas fa-check"></i> Marcar como incompleta.`;
    estado = 'completa';
    padre.classList.add(estado);
  } else {
    boton.classList.add('exito');
    boton.innerHTML = `<i class="fas fa-check"></i> Marcar como completa.`;
    padre.classList.remove('completa')
  }
  let claveLS = 'tarea-';
  let tarea;

  claveLS += padre.dataset.idTarea;

  for(let i = 0; i<localStorage.length; i++){
    if(localStorage.key(i) == claveLS){
      tarea = localStorage.getItem(claveLS);
      tarea = JSON.parse(tarea);
      tarea.estado = estado;
      localStorage.setItem(claveLS, JSON.stringify(tarea));
    }
  }

  contarTareas();

}

function editarTarea(e){
  let texto = e.target.innerText;
  let input = document.createElement('input');
  let contenedor = e.target.parentElement;
  contenedor.insertBefore(input,e.target);
  contenedor.removeChild(e.target);
  input.value = texto;
  input.select();
  input.addEventListener('keyup', guardarCambiosTarea);
  input.addEventListener('blur', guardarCambiosTarea);
}

function guardarCambiosTarea(e){
  let texto = e.target.value;
  let esPlaceHolder = false;
  if(!texto || texto == ''){
    texto = 'No te olvides de completarme :('
    esPlaceHolder = true;
  }
  let tarea = e.target;
  let tipoDato = tarea.parentElement;

  if(e.keyCode == 13 || e.which == 13 || e.type == 'blur'){
    let idTarea = e.target.parentElement.parentElement.dataset.idTarea;
    let tareaOriginal = JSON.parse(localStorage.getItem('tarea-' + idTarea));
    if(tarea.parentElement.classList.contains('descripcion')){
      tareaOriginal.descripcion = texto;
    } else if (tarea.parentElement.classList.contains('titulo')){
      tareaOriginal.titulo = texto;
    }
    guardarLocalStorage('tarea-' + tareaOriginal.id, tareaOriginal);
    let elemento;
    if(tipoDato.classList.contains('titulo')){
      elemento = document.createElement('h2');
    } else if (tipoDato.classList.contains('descripcion')){
      elemento = document.createElement('p');
    }
    elemento.classList.add('campo-editable');
    if(esPlaceHolder){
      elemento.classList.add('placeholder');
    }
    elemento.innerText = texto;
    elemento.addEventListener('click', editarTarea);
    tipoDato.insertBefore(elemento, tarea);
    tipoDato.removeChild(tarea);
  }
}

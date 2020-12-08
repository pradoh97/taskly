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
    <h2 class="campo-editable ${tituloPlaceholder}">${this.titulo}</h2><i class="fi-xnsuxl-pen-solid"></i>
    </div>
    <div class="descripcion">
    <p class="campo-editable">
    ${this.descripcion}
    </p>
    <i class="fi-xnsuxl-pen-solid"></i>
    </div>`;
    if(this.estado === 'completa'){
      this.nodo.classList.add('completa');
      this.nodo.innerHTML += `
      <button type="button">
        <i class="fi-xwsuxl-check"></i> Marcar como incompleta.
      </button>`;
      this.nodo.querySelector('button').addEventListener('click', alternarTarea);
    } else {
      this.nodo.innerHTML += `
      <button class="exito" type="button">
        <i class="fi-xwsuxl-check"></i> Marcar como completa.
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
    friconix_update();

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
  iterarTareas(clave => clave.includes('tarea'), () => cantidadTareas++);

  if(!cantidadTareas){
    mensaje = '¿Nada para hacer? :)'
  } else if(cantidadTareas > 0){
    mensaje = contarTareasCompletas() + '/' + cantidadTareas;
  }

  contadorTareas.innerText = mensaje;
  return cantidadTareas;
}

function iterarTareas(test, modificador){
  for(let i = 0; i<localStorage.length; i++){
    if(test(localStorage.key(i))) modificador(localStorage.key(i));
  }
}

function contarTareasCompletas(){

  let cantidadCompletas = 0;
  let estadoTarea;

  iterarTareas(
    claveLS => claveLS.includes('tarea'),
    tarea => {
      if(obtenerTarea(tarea).estado === 'completa') cantidadCompletas++;
  });
  return cantidadCompletas;
}

function cargarTareas(){
  let tareas = [];

  iterarTareas(
    claveLS => claveLS.includes('tarea'),
    tarea => {
      tarea = obtenerTarea(tarea);
      tareas.push(new Tarea(tarea.titulo, tarea.descripcion, tarea.id, tarea.estado));
  });

  tareas.sort((a,b) => a.id > b.id);
  for(tarea of tareas) tarea.mostrarTarea();

}
function alternarTarea(e){
  let boton = e.target;
  let padre = boton;
  let estado = '';

  while(!padre.classList.contains('tarea')){
    padre = padre.parentElement;
  }

  if(boton.classList.toggle('exito')){
    boton.innerHTML = `<i class="fi-xwsuxl-check"></i> Marcar como completa.`;
    estado = 'incompleta';
  }
  else {
    boton.innerHTML = `<i class="fi-xwsuxl-check"></i> Marcar como incompleta.`;
    estado = 'completa';
  }

  padre.classList.toggle('completa');

  friconix_update();

  let id = padre.dataset.idTarea;

  iterarTareas(
    claveLS => claveLS.endsWith(id),
    tarea => {
      claveLS = tarea;
      tarea = obtenerTarea(tarea);
      tarea.estado = estado;
      guardarLocalStorage(claveLS, tarea);
  });

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
    let tareaOriginal = obtenerTarea('tarea-' + idTarea);
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

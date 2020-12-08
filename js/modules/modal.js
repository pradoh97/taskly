class Modal {
  constructor(e) {
    this.llamador = e.target;
    this.textoEntrada = "";
    this.etiqueta;
    this.pista;
    this.input;
    this.nodo;
  }

  obtenerValorActual(){
    return this.input.value;
  }
  obtenerIDLlamador(){
    return this.llamador.id;
  }
  esNombreUsuario(){
    return this.obtenerIDLlamador().includes('nombre');
  }

  definirMensaje(){
    if(this.esNombreUsuario()){
      this.etiqueta = 'tu nombre.'
      this.pista = 'El que mejor te represente :)';

      if(nombreUsuarioEstablecido()){
        this.textoEntrada = this.llamador.innerText;
      }
    }
    else{
      this.etiqueta = 'el título de la tarea.';
      this.pista = 'Tratá que sea corto y representativo';
    }
  }

  mostrarModal(){
    this.nodo = document.createElement('div');

    this.nodo.classList.add('modal');
    this.nodo.innerHTML = this.crearCuerpo();
    this.agregarListeners();

    document.body.insertBefore(this.nodo, document.body.firstChild);
    this.nodo.querySelector('input').select();
  }

  crearCuerpo(textoEntrada = ""){
    let cuerpoModal;

    cuerpoModal = `
    <div class="dialogo">
      <label for="dato">
        Introducí <span>${this.etiqueta}</span>
        <em class="pista">${this.pista}</em>
      </label>
      <input id="dato" modatype="text" value="${this.textoEntrada}">
      <div class="controles">
        <button disabled class="exito" role="boton guardar cambio" type="button" id="guardar-modal"><i class="fi-xnsuxl-hard-floppy"></i> Guardar</button>
        <button type="button" role="boton descartar cambio"><i class="fi-xwsuxl-bin"></i> Descartar</button>
      </div>
    </div>`;

    return cuerpoModal;
  }

  agregarListeners(){
    this.input = this.nodo.querySelector('input');
    this.nodo.addEventListener('keyup', guardarCambiosModal);
    this.nodo.addEventListener('keyup', eliminarModal);
    this.nodo.addEventListener('click', eliminarModal);
    this.nodo.querySelector('[role="boton descartar cambio"]').addEventListener('click', eliminarModal);
    this.input.addEventListener('input', alternarGuardado);
    this.nodo.querySelector('[role="boton guardar cambio"]').addEventListener('click', guardarCambiosModal);
  }

  guardarCambiosDOM(){
    if(this.esNombreUsuario()){
      this.llamador.innerText = this.obtenerValorActual();
    } else {
      let tarea = new Tarea(this.obtenerValorActual());
      tarea.crearTarea();
      tarea.mostrarTarea();
    }
  }
}

function generarModal(e){
  modal = new Modal(e);
  modal.definirMensaje();
  modal.mostrarModal();
  friconix_update();
}

function guardarCambiosModal(e){

  if(e.keyCode == 13 || e.which == 13 || e.target.nodeName.toLowerCase() == 'button'){

    if(!modal.obtenerValorActual() || modal.obtenerValorActual() == ""){
      return;
    }

    if(modal.esNombreUsuario()){
      guardarLocalStorage(modal.obtenerIDLlamador(), modal.obtenerValorActual())
    }

    modal.guardarCambiosDOM();
    eliminarModal(0);
  }
}

function eliminarModal(e){

  if(e === 0 || e.target.classList.contains('modal') || e.keyCode == 27 || e.which == 27
    || e.target == modal.nodo.querySelector('[role="boton descartar cambio"]')){
    modal.nodo.remove();
    return;
  }
}

function alternarGuardado(e){
  if(modal.obtenerValorActual() && modal.obtenerValorActual() != ""){
    modal.nodo.querySelector('[role="boton guardar cambio"]').disabled = false;
  } else {
    modal.nodo.querySelector('[role="boton guardar cambio"]').disabled = true;
  }
}

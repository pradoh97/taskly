class Modal {
  constructor(e) {
    this.mensaje;
    this.valorPropietario;
    this.nombreAtributoPropietario;
    this.tipo;
    this.origen = e;
    this.cuerpo;
    this.nodo;
  }

  definirPropietario(){
    if(this.origen.target.nodeName.toLowerCase() != 'button'){
      let atributos = Array.from(this.origen.target.attributes);
      let propietario = this.verificarData(atributos);
      this.nombreAtributoPropietario = propietario.name;
      this.valorPropietario = propietario.value;
    }
  }

  definirMensaje(){
    if(this.nombreAtributoPropietario == 'data-nombre-usuario'){
      this.mensaje = 'tu nombre.'
      this.tipo = 'nombre';
      this.valorPropietario = nombre.innerText;
    }
    if(!this.nombreAtributoPropietario || !this.valorPropietario){
      this.mensaje = 'el título de la tarea.';
      this.tipo = 'titulo';
    }
  }

  verificarData(atributos){
    let propietario = "";
    let nombreUsuario = /nombre-usuario/, tarea = /id-tarea/;

    if(this.origen.target == botonAgregarTarea){
      propietario = botonAgregarTarea;
    } else{
      atributos.forEach(attr => {
        let regExp = /data/;
        if(regExp.test(attr.name)){
          propietario = attr;
        }
      });
    }
    return propietario;
  }

  mostrarModal(){
    let modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = this.crearCuerpo(this.nombreAtributoPropietario, this.valorPropietario);
    this.nodo = modal;

    this.agregarListeners();
    document.body.insertBefore(modal, document.body.firstChild);

    this.nodo.querySelector('input').focus();
  }

  crearCuerpo(atributo="", valor=""){

    let cuerpoModal, mensajePista;

    if(atributo && valor){
      cuerpoModal = `<div ${atributo} = "${valor}" class="dialogo">`;
    } else {
      cuerpoModal = `<div class="dialogo">`;
    }
    if(this.tipo == 'nombre'){
      mensajePista = 'El que mejor te represente :)';
    } else if(this.tipo == 'titulo'){
      mensajePista = 'Tratá que sea corto y representativo';
    } else if(this.tipo == 'descripcion'){
      mensajePista = 'Acá si, explayate y contá de qué se trata.'
    }

    cuerpoModal += `
    <label for="dato">Introducí <span>${this.mensaje}</span>
    <em class="pista">${mensajePista}</em></label>
    <input id="dato" modatype="text" value="">
    <div class="controles">
    <button disabled class="exito" role="boton guardar cambio" type="button" id="guardar-modal" name="button"><i class="fas fa-save"></i> Guardar</button>
    <button type="button" role="boton descartar cambio" name="button"><i class="fas fa-trash"></i> Descartar</button>
    </div>
    </div>`;
    return cuerpoModal;
  }

  agregarListeners(){
    this.nodo.addEventListener('keyup', guardarCambiosModal);
    this.nodo.addEventListener('keyup', eliminarModal);
    this.nodo.addEventListener('click', eliminarModal);
    this.nodo.querySelector('[role="boton descartar cambio"]').addEventListener('click', eliminarModal);
    this.nodo.querySelector('input').addEventListener('input', alternarGuardado);
    this.nodo.querySelector('[role="boton guardar cambio"]').addEventListener('click', guardarCambiosModal);
  }
  guardarCambios(valor){
    if(this.origen.target != botonAgregarTarea){
      this.origen.target.innerText = valor;
    } else {
      crearTarea(valor);
    }
  }
}

function generarModal(e){
  modal = new Modal(e);

  modal.definirPropietario();
  modal.definirMensaje();
  modal.mostrarModal();
}

function buscarModal(){

  if(document.querySelector('.modal')){
    return document.querySelector('.modal');
  }
}

function guardarCambiosModal(e){
  let input = buscarModal().querySelector('input');
  if(e.keyCode == 13 || e.which == 13 || e.target.nodeName.toLowerCase() == 'button'){
    if(!input.value || input.value == ""){
      return;
    }
    modal.guardarCambios(buscarModal().querySelector('input').value);
    eliminarModal(0);
  }
}

function eliminarModal(e){
  let botonDescarte = document.querySelector('[role="boton descartar cambio"]');
  if(e==0){
    buscarModal().remove();
    return;
  }
  if(e.target.classList.contains('modal')){
    buscarModal().remove();
    return;
  }
  else if(e.keyCode == 27 || e.which == 27 || e.target == botonDescarte){
    buscarModal().remove();
  }
}

function alternarGuardado(e){
  if(e.target.value && e.target.value != ""){
    buscarModal().querySelector('[role="boton guardar cambio"]').disabled = false;
  } else {
    buscarModal().querySelector('[role="boton guardar cambio"]').disabled = true;
  }
}

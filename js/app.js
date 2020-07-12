class Modal {
  constructor(e) {
    this.mensaje;

    /*El valorPropietario es el valor del data-* del elemento que llamó al constructor. Por otro lado, el atributo nombreAtributoPropietario es el nombre completo del data-* del elemento que llamó al constructor.

    Si el nodo del nombre de usuario es quien llama a la funcion, su valorPropietario sería (por defecto) "placeholder name" y su nombreAtributoPropietario sería data-nombre-usuario.
    */
    this.valorPropietario;
    this.nombreAtributoPropietario;
    this.origen = e;
    this.cuerpo;
    this.nodo;
  }

  definirPropietario(){
    let atributos = Array.from(this.origen.target.attributes);
    let propietario = this.verificarData(atributos);
    this.nombreAtributoPropietario = propietario.name;
    this.valorPropietario = propietario.value;
  }

  definirMensaje(){
    if(this.nombreAtributoPropietario == 'data-nombre-usuario'){
      this.mensaje = 'tu nombre.'
    }
  }

  verificarData(atributos){
    let propietario = "";
    let nombreUsuario = /nombre-usuario/;

    atributos.forEach(attr => {
      let regExp = /data/;
      if(regExp.test(attr.name)){
        propietario = attr;
      }
    });

    if(nombreUsuario.test(propietario.name)){
      return propietario;
    }
  }

  mostrarModal(){
    let modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = this.crearCuerpo();
    this.nodo = modal;

    this.agregarListeners();
    document.body.insertBefore(modal, document.body.firstChild);

    this.nodo.querySelector('input').focus();
  }
  crearCuerpo(){
    let cuerpoModal = `
    <div class="dialogo">
    <label for="dato">Introducí <span>${this.mensaje}</span></label>
    <input id="dato" modatype="text" value="">
    <div class="controles">
    <button disabled class="exito" role="boton guardar cambio" type="button" id="guardar-modal" name="button"><i class="fas fa-save"></i> Guardar</button>
    <button type="button" role="boton descartar cambio" name="button"><i class="fas fa-trash"></i> Descartar</button>
    </div>
    </div>
    `
    return cuerpoModal;
  }
  agregarListeners(){
    this.nodo.addEventListener('keyup', guardarCambiosModal);
    this.nodo.addEventListener('keyup', eliminarModal);
    this.nodo.querySelector('[role="boton descartar cambio"]').addEventListener('click', eliminarModal);
    this.nodo.querySelector('input').addEventListener('input', alternarGuardado);
    this.nodo.querySelector('[role="boton guardar cambio"]').addEventListener('click', guardarCambiosModal);
  }
}

let nombre = document.querySelector('.campo-editable[data-nombre-usuario]');

nombre.addEventListener('click', generarModal);

function generarModal(e){
  let modal = new Modal(e);

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
    nombre.innerText = buscarModal().querySelector('input').value;
    eliminarModal(0);
  }
}
function eliminarModal(e){
  if(e==0){
    buscarModal().remove();
  }
  if(e.keyCode == 27 || e.which == 27 || e.target.nodeName.toLowerCase() == 'button'){
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

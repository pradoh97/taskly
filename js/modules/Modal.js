class Modal{
    /*
    Precisa un título, que es el que va a figurar en la parte superior del modal
    y una descripción, que aparece inmediatamente abajo de este. Además, recibe
    un tipo de input para agregar y un placeholder para el mismo.
     */
    constructor(titulo = '', descripcion = '', tipoInput = 'text', placeholder = '') {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipoInput = tipoInput;
        this.placeholder = placeholder
    }

    /*
    Crea y agrega un modal en el DOM, dentro del main como segundo elemento
    (primero viene el telón).
     */
    mostrar() {
        let main = document.querySelector('main');
        let modal = document.createElement('div');

        //Se agrega el telón
        Utils.agregarTelon();

        modal.classList.add('modal', 'flotante--centrado');
        modal.innerHTML = `
            <div class="modal__encabezado">
                <h2 class="modal__titulo">${this.titulo}</h2>
                <p class="modal__descripcion">${this.descripcion}</p>
            </div>
            <div class="modal__controles">
                <input type="${this.tipoInput}" placeholder="${this.placeholder}">
                <div class="modal__botones"></div>
            </div>
        `;

        //Creo los botones para el modal con sus event listeners.
        let divBotones = modal.querySelector('.modal__botones');
        Utils.crearOpciones(opcionesModal, divBotones, 'modal');

        main.appendChild(modal);
        modal.querySelector('input').focus();
        modal.addEventListener('keydown', Modal.eventoModal);
    }

    //Oculta el modal existente y elimina el  telón.
    ocultar(){
        let main = document.querySelector('main');
        main.removeChild(document.querySelector('.modal'));
        Utils.eliminarTelon();
    }

    //Convierte el modal del DOM a un objeto de la clase Modal.
    static convertirModal(modalDOM){
        let modal = new Modal();

        //Obtiene el texto de cada elemento y lo fija como atríbuto para el objeto.
        modal.titulo = modalDOM.querySelector('h2').innerText;
        modal.descripcion = modalDOM.querySelector('p').innerText;
        modal.tipoInput = modalDOM.querySelector('input').type;
        modal.placeholder = modalDOM.querySelector('input').placeholder;

        return modal;
    }

    /*
    Devuelve el objeto y la referencia del nodo en el DOM correspondiente al
    modal que está mostrándose.
     */
    static obtenerModal(){
        let modal = [];
        modal['DOM'] = document.querySelector('.modal');
        modal['objeto'] = this.convertirModal(modal['DOM']);

        return modal;
    }

    //Define que hacer según el evento que afecte a un modal.
    static eventoModal(e){
        let modal;
        modal = Modal.obtenerModal();

        let tituloTarea = modal.DOM.querySelector('input').value;
        let tarea = new Tarea(Tarea.idTareaNueva, tituloTarea);

        console.log(e);
        if(e.keyCode == 13 || e.key == 'Enter') tarea.cargar();
        if(e.keyCode == 27 || e.key == 'Escape' || e.keyCode == 13 || e.key == 'Enter') modal.objeto.ocultar();
        switch (e.target.dataset.accion) {
            //En caso de que se presione crear tarea.
            case "crear tarea":
                tarea.cargar();
            case "cancelar":
              modal.objeto.ocultar();
        }
    }
}

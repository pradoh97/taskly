class Modal{
    constructor(titulo, descripcion, input, placeholder) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.input = input;
        this.placeholder = placeholder
    }

    mostrar() {
        let main = document.querySelector('main');
        let modal = document.createElement('div');

        Utils.agregarBackdrop();

        modal.classList.add('modal', 'flotante--centrado');
        modal.innerHTML = `
            <div class="modal__encabezado">
                <h2 class="modal__titulo">${this.titulo}</h2>
                <p class="modal__descripcion">${this.descripcion}</p>
            </div>
            <div class="modal__controles">
                <input type="${this.input}" placeholder="${this.placeholder}">
                <div class="modal__botones"></div>
            </div> 
        `;

        let divBotones = modal.querySelector('.modal__botones');
        Utils.crearOpciones(opcionesModal, divBotones, 'modal');

        main.appendChild(modal);
    }

    ocultar(){
        let main = document.querySelector('main');
        main.removeChild(document.querySelector('.modal'));
        Utils.eliminarBackdrop();
    }

    static convertirModal(modalDOM){
        let modal = new Modal();

        modal.titulo = modalDOM.querySelector('h2').innerText;
        modal.descripcion = modalDOM.querySelector('p').innerText;
        modal.input = modalDOM.querySelector('input').type;
        modal.placeholder = modalDOM.querySelector('input').placeholder;

        return modal;
    }

    static obtenerModal(){
        let modal = [];
        modal['DOM'] = document.querySelector('.modal');
        modal['objeto'] = this.convertirModal(modal['DOM']);

        return modal;
    }
}
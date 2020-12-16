class Utils {

  /* Método sin uso. Ahora se guardan los id's en el valor también.
    //Sirve para filtrar las claves de un objeto, generando un objeto nuevo con
    //claves distintas al original. Hasta ahora lo vengo usando para eliminar claves
    //de un objeto sin modicarlo. Recibe el objeto en cuestión, una función que hace
    //una prueba (por ejemplo, ver que clave debería ir) y una array de claves a
    //filtrar.
    static filtrarClavesObjeto(objeto, prueba, clavesFiltro){

      let nuevoObjeto = {};

      //Se recorren todas las claves del objeto y se guardan los /////valores en el nuevo objeto.
      for(let clave in objeto){
        if(prueba(clave, clavesFiltro)) nuevoObjeto[clave] = objeto[clave];
      }

      return nuevoObjeto;
    }
  */

  //Itera sobre localStorage y permite filtrar para obtener resultados al pasar
  //una prueba.
  static iterarLocalStorage(prueba, filtro, ordenar = true){

    let valoresFiltrados = [];

    //Guardo todas las claves.
    let claves = [];

    for(let clave in localStorage){
      claves.push(clave);
    }

    if(ordenar) claves.sort();

    for(let clave of claves){
      //Si se pasa la prueba, se aplica el filtro.
      if(prueba(clave, localStorage)) valoresFiltrados.push(filtro(clave))
    }
    return valoresFiltrados;
  }

  static eventoTarea(e){
    let tarea;
    tarea = Tarea.obtenerTarea(null, e.target);

    if(e.type == 'input'){
      if(e.target.localName == 'h2'.toLowerCase()) tarea.LS.cambiarTitulo(e.target.innerText);
      if(e.target.localName == 'p'.toLowerCase()) tarea.LS.cambiarDescripcion(e.target.innerText);
    }

    if(e.type == 'click'){
      switch (e.target.dataset.accion) {
        case "completar":
          tarea.LS.alternarEstado()
          break;
        case "eliminar":
          tarea.LS.eliminar();
          break;
      }
    }
  }

  static eventoModal(e){
    let modal;
    modal = Modal.obtenerModal();

    switch (e.target.dataset.accion) {
      case "crear tarea":
        let tituloTarea = modal.DOM.querySelector('input').value;
        let tarea = new Tarea(Tarea.idUltimaTarea() + 1, tituloTarea);
        tarea.cargar();
      default:
        modal.objeto.ocultar();
    }
  }

  //Recibe la clave de local storage. En el caso de las tareas puede recibir
  //solo el ID pero debe agregarse el último parametro para que la clave se
  //convierta correctamente. La clave es aquel atributo del objeto a modificar
  //y el valor es el nuevo valor a reemplazar.
  static guardarEnLocalStorage(claveLS, clave, valor, esTarea= false){
    let dato;

    claveLS = this.agregarPrefijoTarea(claveLS, esTarea);

    dato = this.obtenerDeLocalStorage(claveLS);
    dato[clave] = valor;
    dato = JSON.stringify(dato);
    localStorage.setItem(claveLS, dato);

  }

  //Devuelve, formateado como objeto, un item de localStorage. Recibe la clave
  //que le corresponde. Si es una tarea puede enviarse la clave como 'tarea-n'
  //o el ID y agregar el segundo atributo como true.
  static obtenerDeLocalStorage(claveLS, esTarea = false){
    return JSON.parse(localStorage.getItem(this.agregarPrefijoTarea(claveLS, esTarea)));
  }

  //Elimina un elemento de localStorage. Si es una tarea puede enviarse la clave
  //como 'tarea-n' o el ID y agregar el segundo atributo como true.
  static eliminarDeLocalStorage(claveLS, esTarea = false){
    localStorage.removeItem(this.agregarPrefijoTarea(claveLS, esTarea));
  }

  //Agrega el prefijo 'tarea-' solo si el segundo parametro es pasado como true. Sino, devuelve el id tal cual.
  static agregarPrefijoTarea(id, esTarea){
    if(esTarea) id = 'tarea-' + id;
    return id;
  }

  static eliminarBackdrop(){
    document.querySelector('main').removeChild(document.querySelector('.backdrop'));
  }

  static agregarBackdrop(){
    let backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    document.querySelector('main').appendChild(backdrop);
  }

  //Recibe una lista de opciones, un elemento al cual agregar cada opción
  //y el objeto al que corresponde (para disparar los eventos correctos).
  //Se usa para agregar botones con acciones que el usuario puede ejecutar.
  static crearOpciones(listaOpciones, elemento, objeto){

    for(let opcion in listaOpciones){
      let boton = document.createElement('button');

      boton.type="button";

      //Con el texto que está en el objeto del array opciones.
      boton.innerText = listaOpciones[opcion].texto;

      //Defino la acción que realiza el botón. Esta después es útil para cuando se
      //clickea en el botón.
      boton.dataset.accion = opcion;

      //El método eventoX se encarga de definir que sucede al clickear
      //una opción de un boton en base a qué opcion (su data-accion) disparó el evento.
      if(objeto === 'tarea') boton.addEventListener('click', Utils.eventoTarea);
      else boton.addEventListener('click', Utils.eventoModal);

      //Si hay icono, lo agrego.
      if(listaOpciones[opcion].icono) boton.innerText += listaOpciones[opcion].icono;

      elemento.appendChild(boton);
    }
  }

  static mostrarOpcionesTarea(e){
    if(e.target.localName.toLowerCase() == 'body' || e.target.localName.toLowerCase() == 'html'){
      if(ultimaTareaActiva) ultimaTareaActiva.querySelector('.tarea__opciones').classList.remove('visible');
      return;
    }

    if(ultimaTareaActiva) ultimaTareaActiva.querySelector('.tarea__opciones').classList.remove('visible');

    let tarea = Tarea.obtenerTarea(null, e.target);

    if (e.keyCode == 9 || e.type == 'click') {
      if(tarea && tarea.DOM){
        ultimaTareaActiva = tarea.DOM;
        ultimaTareaActiva.querySelector('.tarea__opciones').classList.add('visible');
      }
    }
  }

}

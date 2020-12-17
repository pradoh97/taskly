class Utils {

  /*
  Itera sobre localStorage y permite filtrar para obtener resultados al pasar
  una prueba.
  */
  static iterarLocalStorage(prueba, filtro, ordenar = true){

    let valoresFiltrados = [];

    //Guardo todas las claves.
    let claves = [];
    for(let clave in localStorage){
      claves.push(clave);
    }

    //Ordeno las claves de forma ascendente.
    if(ordenar) claves.sort();

    for(let clave of claves){
      if(prueba(clave, localStorage)) valoresFiltrados.push(filtro(clave))
    }
    return valoresFiltrados;
  }

  /*
  Recibe la clave de local storage. En el caso de las tareas puede recibir
  solo el ID pero debe agregarse el último parametro para que la clave se
  convierta correctamente. La clave es aquel atributo del objeto a modificar
  y el valor es el nuevo valor a reemplazar.
   */
  static modificarEnLocalStorage(claveLS, clave, valor, esTarea= false){
    let dato;

    claveLS = Tarea.agregarPrefijoTarea(claveLS, esTarea);

    dato = this.obtenerDeLocalStorage(claveLS);
    dato[clave] = valor;
    dato = JSON.stringify(dato);
    localStorage.setItem(claveLS, dato);
  }

  /*Devuelve, formateado como objeto, un item de localStorage. Recibe la clave
  que le corresponde. Si es una tarea puede enviarse la clave como 'tarea-n'
  o el ID y agregar el segundo atributo como true.
   */
  static obtenerDeLocalStorage(claveLS, esTarea = false){
    return JSON.parse(localStorage.getItem(Tarea.agregarPrefijoTarea(claveLS, esTarea)));
  }

  /*
  Elimina un elemento de localStorage. Si es una tarea puede enviarse la clave
  como 'tarea-n' o el ID y agregar el segundo atributo como true.
   */
  static eliminarDeLocalStorage(claveLS, esTarea = false){
    localStorage.removeItem(Tarea.agregarPrefijoTarea(claveLS, esTarea));
  }

  static eliminarTelon(){
    document.querySelector('main').removeChild(document.querySelector('.telon'));
  }

  static agregarTelon(){
    let telon = document.createElement('div');
    telon.classList.add('telon');
    document.querySelector('main').appendChild(telon);
  }

  /*
  Recibe una lista de opciones, un elemento al cual agregar cada opción
  y el objeto al que corresponde (para disparar los eventos correctos).
  Se usa para agregar botones con acciones que el usuario puede ejecutar.
   */
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
      if(objeto === 'tarea') boton.addEventListener('click', Tarea.eventoTarea);
      else boton.addEventListener('click', Modal.eventoModal);

      //Si hay icono, lo agrego.
      if(listaOpciones[opcion].icono) boton.innerText += listaOpciones[opcion].icono;

      elemento.appendChild(boton);
    }
  }
}

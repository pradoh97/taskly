/*
  TODO: crear método cambiarTitulo, cambiarDescripcion, guardarEnLocalStorage
  y obtenerDeLocalStorage. Los dos primeros modifican el atributo correspondiente
  del objeto, ademas, se van a apoyar en los dos últimos (que quizas sea buena
  idea tenerlos en Utils) que traen los datos de la tarea y la actualizan en LS.
  Y por último, estos dos primeros métodos, van a modificar el contenido del nodo
  en el DOM.
*/
class Tarea {
  constructor(id, titulo, descripcion, completa = false, tablero = tableroPorDefecto) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.completa = completa;
    this.tablero = tablero;
  }

  //Elimina una tarea de localStorage y del DOM
  eliminar(){

    //Obtiene la tarea en el DOM.
    let tareaDOM = Tarea.obtenerTarea(Tarea.extraerIDNumerico(this.id)).DOM;

    //Si existe, la borra.
    if(tareaDOM) tareaDOM.parentElement.removeChild(tareaDOM);

    //Borra de localStorage (si no existe no hace nada).
    localStorage.removeItem('tarea-' + this.id);
  }

  //Carga/actualiza la tarea en local storage y en el DOM
  cargar(){
    //valor es el valor de la tarea en localStorage.
    let valor = {};

    //Es la tarea en el DOM
    let tareaDOM = Tarea.obtenerTarea(this.id).DOM;

    //Es el elemento que se va a agregar/actualizar en el DOM.
    let html = document.createElement('div');
    html.classList.add('tarea');

    if(this.completa) html.classList.add('tarea--completa');
    else html.classList.remove('tarea--completa');

    html.innerHTML = `
      <h2 contenteditable="true" class="tarea__titulo">${this.titulo}</h2>
      <p contenteditable="true" class="tarea__descripcion">${this.descripcion}</p>
    `;

    //Si hay opciones que agregar a la tarea (sería raro que no), las agrega.
    if(Object.keys(opciones).length){

      let opcionesTarea = document.createElement('div')
      opcionesTarea.classList.add('tarea__opciones');

      //Agrega un botón por opción
      for(let opcion in opciones){
        let boton = document.createElement('button');

        boton.type="button";

        //Con el texto que está en el objeto del array opciones.
        boton.innerText = opciones[opcion].texto;

        //Defino la acción que realiza el botón. Esta después es útil para cuando se
        //clickea en el botón.
        boton.dataset.accion = opcion;

        //El método eventoTarea se encarga de definir que sucede al clickear
        //una opción de una tarea en base a qué opcion (su data-accion) disparó el evento.
        boton.addEventListener('click', Utils.eventoTarea);

        //Si hay icono, lo agrego.
        if(opciones[opcion].icono) boton.innerText += opciones[opcion].icono;

        opcionesTarea.appendChild(boton);
      }

      html.appendChild(opcionesTarea);
    }

    //Se añade el atributo data-id-tarea=n (n es el idNunmerico).
    html.dataset['idTarea'] = this.id;

    //Si el tablero no fué seleccionado, se crea por defecto en el tablero principal.
    if(!Object.keys(this.tablero).length) this.tablero = tableroPorDefecto;

    //Si el tablero viene de localStorage, solo se guarda el id.
    if(typeof this.tablero == 'string') this.tablero = document.getElementById(this.tablero);

    //Si la tarea ya existe, la elimino del tablero.
    if(tareaDOM) this.tablero.removeChild(tareaDOM);

    //Y agrego la nueva
    this.tablero.appendChild(html);

    /* Todo esto era para el método Utils.filtrarClavesObjeto pero ya no se usa. Los ID's van también al valor de cada clave de localStorage.

      //La tarea en localStorage no lleva como valor el ID, ya que este se usa para identificarla de entre el resto (mediante la key de localStorage). Así que esa clave no tiene que ser publicada.
      let clavesParaEliminar = ['id'];

      //Para eso defino un filtro que en este caso define qué claves quedan en localStorage como valor y cuales no.
      let filtro = function (clave, clavesParaEliminar){

        //La intención de esta prueba aceptar todas las claves que no formen parte del array de clavesParaEliminar.
        return !clavesParaEliminar.includes(clave);
      }


      Método sin uso, se guarda el id en el valor de localStorage también.
      //valor es el valor de la tarea en localStorage.
      valor = Utils.filtrarClavesObjeto(this, filtro, clavesParaEliminar);
    */

    //Se guarda el id del tablero
    this.tablero = this.tablero.id;

    //Se crea/modifica una entrada en localStorage que tiene como clave el id de la tarea y como valor el resto de las claves del objeto tarea.
    localStorage.setItem("tarea-" + this.id, JSON.stringify(this));
  }

  //Alterna el estado de una tarea en localStorage, memoria y en el DOM.
  alternarEstado(){
    this.completa = !this.completa;
    this.cargar();
  }

  //Las tareas se guardan con la clave 'tarea-n' siendo n el número de tarea. Esto es tanto para el DOM como para localStorage y en memoria, así que para computar el valor de la clave de una tarea nueva hace falta extraerlo del string.
  static extraerIDNumerico(id){

    //Si el id recibido es un entero (es decir, el id como número), se retorna sin modificarlo. Parece que este método no tiene mucho sentido pero está para cubrir algún caso edge, si no vale la pena, lo borro.
    if(typeof id != "string") return id;

    //Si el id recibido es un string y contiene la frase 'tarea', entonces se divide el string (que tiene la pinta de 'tarea-n') con el caracter '-' como separador. De, array resultante ([tarea, n]) se retorna el segundo elemento (el número de tarea).
    if(id.includes('tarea')) return parseInt(id.split('-')[1]);
  }

  //Obtiene el id de la última tarea, se puede usar al momento de crear una nueva tarea para saber que ID le corresponde.
  static idUltimaTarea(){

    //Si no hay elementos en el localStorage entonces no hay tareas.
    if(!localStorage.length) return 0;

    //El id de la última tarea (el valor a retornar). Está fijado en cero por si no hay tareas en localStorage pero hay otros elementos. La primer tarea siempre debe ser 1.
    let id = 0;

    //Puede pasar que el usuario elimine tareas, en ese caso los id libres se van a reutilizar. idTareaAnterior es una bandera para saber si hay un salto de id's en tareas.
    let idTareaAnterior = 0;

    //Obtengo todas las claves de localStorage que sean tareas.
    let tareas = Utils.iterarLocalStorage(clave => clave.includes('tarea'), clave => clave);

    //Si no hay tareas en local storage se retorna cero, ya que no habría última tarea. Si hay, entonces se ordenan las claves.
    if(!tareas.length) return 0;

    //Si las hay, ordeno las claves.
    tareas.sort();

    //Acá se revisa cual es el primer id libre. Si resulta que todas las claves tienen id's sucesivos (que no hay saltos) entonces el id que se retorna es el de la última tarea en cuestión, de otra forma se retorna el primero que esté libre.
    for(let clave of tareas){

      //Solo hace falta el número de la tarea.
      clave = Tarea.extraerIDNumerico(clave);

      //idTareaAnterior comienza en cero. Si este + 1 es menor a la clave actual, quiere decir que hubo un salto. Por ejemplo, si idTareaAnterior fuera 1 y la clave actual entonces no se cumple, pero si idTareaAnterior fuera 1 y la clave actual 3, entonecs si se cumplirá que 2 (idTareaAnterior + 1) es menor a 3.
      if(idTareaAnterior + 1 < clave){

        //En ese caso se asigna como id el id vacío (siguiendo el ejemplo anterior: 2).
        id = idTareaAnterior + 1;
      }

      //Si no hay salto de id, entonces se asigna el id de esta tarea como último id.
      else if(id < clave){
        id = clave;
      }

      //Asigno el id de la clave actual como el idTareaAnterior para la próxima iteración.
      idTareaAnterior = clave;
    }

    return parseInt(id);
  }

  //Si se la llama con un ID, trae una tarea desde localStorage y desde el DOM y
  //la devuelve como objeto, la que viene de localStorage es un objeto de clase
  //Tarea (se la convierte después de obtenerla) y la que viene del DOM se guarda
  //como referencia del nodo para poder editarlo/borrarlo.
  //Si se la llama con un nodo del DOM, buscará la tarea en la que se encuentra
  //El nodo.
  static obtenerTarea(id, nodo = null){

    let tarea = {};

    //Si quiero obtener la tarea porque se ejecutó el evento de algún
    //botón (por ejemplo, eliminar), entonces paso un id nulo y paso
    //El nodo del DOM que hizo la llamada
    if(nodo){
      let objetivo = nodo;

      while(!objetivo.dataset.idTarea){
        objetivo = objetivo.parentElement;
      }

      id = objetivo.dataset.idTarea;
    }

    /*
      //Verifico si el id que recibe el método es un string. Si lo es y no incluye la palabra 'tarea' se la agrega, esto para poder obtenerlo en base a la clave del localStorage.
      if(typeof id != 'string' && !id.toString().includes('tarea')) id = 'tarea-' + id;
    */

    //Busco la tarea en el DOM y la guardo.
    tarea.DOM = document.querySelector(`[data-id-tarea="${id}"]`);

    //Obtengo la tarea de localStorage
    tarea["LS"] = JSON.parse(localStorage.getItem("tarea-" + id));

    //Si existe esa tarea, entonces paso todos los valores del objeto de localStorage al objeto de clase Tarea (así tiene los métodos).
    if(tarea["LS"]) tarea["LS"] = Tarea.convertirTarea(tarea["LS"], id);

    return tarea;
  }

  //Obtiene todas las tareas de localStorage, se usa para refrescar todas las tareas o la carga inicial de la aplicación.
  static obtenerTareas(){
    let tareas = [];

    //Es la función que uso para encontrar tareas y convertirlas a un objeto de clase localStorage.
    let filtro = function (clave, LS){
      let tarea = JSON.parse(LS[clave]);
      tarea = Tarea.convertirTarea(tarea);
      return tarea;
    }

    //Obtengo todas las tareas ordenadas como objetos de la clase Tarea.
    tareas = Utils.iterarLocalStorage(clave => clave.includes('tarea'), filtro);

    return tareas;
  }

  //Carga todas las tareas al DOM y a localStorage. Útil para cuando inicia la aplicación.
  static cargarTareas(){
    let tareas = Tarea.obtenerTareas();

    for(let tarea of tareas){
      tarea.cargar();
    }
  }

  //Convierte una tarea extraida de localStorage a un objeto de clase Tarea.
  static convertirTarea(tareaLS, id){

    let tarea = new Tarea();

    for(let clave in tareaLS){
      tarea[clave] = tareaLS[clave];
    }

    return tarea;
  }
}

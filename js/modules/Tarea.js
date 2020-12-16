class Tarea {
  constructor(id = Tarea.idUltimaTarea() + 1, titulo = "Tarea nueva", descripcion = "Sin descripción", completa = false, tablero = tableroPorDefecto) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.completa = completa;
    this.tablero = tablero;
  }

  //Elimina una tarea de localStorage y del DOM
  eliminar(){

    //Obtiene la tarea en el DOM.
    let tareaDOM = Tarea.obtenerTarea(this.id).DOM;

    //Si existe, la borra.
    if(tareaDOM) tareaDOM.parentElement.removeChild(tareaDOM);

    //Borra de localStorage (si no existe no hace nada).
    Utils.eliminarDeLocalStorage(this.id, true);
  }

  cambiarTitulo(titulo){
    this.titulo = titulo;
    Utils.guardarEnLocalStorage(this.id, 'titulo', titulo, true);
  }

  cambiarDescripcion(descripcion){
    this.descripcion = descripcion;
    Utils.guardarEnLocalStorage(this.id, 'descripcion', descripcion, true);
  }
  //Carga la tarea en local storage y en el DOM
  cargar() {
    //Es el elemento que se va a agregar en el DOM.
    let html = document.createElement('div');
    html.classList.add('tarea');
    if (this.completa) html.classList.add('tarea--completa');
    html.innerHTML = `
      <h2 contenteditable="true" class="tarea__titulo">${this.titulo}</h2>
      <p contenteditable="true" class="tarea__descripcion">${this.descripcion}</p>
    `;

    //Si hay opciones que agregar a la tarea (sería raro que no), las agrega.
    if (Object.keys(opcionesTarea).length) {

      let opciones = document.createElement('div')
      opciones.classList.add('tarea__opciones');

      //Agrega un botón por opción
      Utils.crearOpciones(opcionesTarea, opciones, 'tarea');

      html.appendChild(opciones);
    }

    //Se añade el atributo data-id-tarea=n (n es el idNunmerico).
    html.dataset['idTarea'] = this.id;

    //Si el tablero viene de localStorage, solo se guarda el id.
    if (typeof this.tablero == 'string') this.tablero = document.getElementById(this.tablero);

    html.querySelector('h2').addEventListener('input', Utils.eventoTarea);
    html.querySelector('p').addEventListener('input', Utils.eventoTarea);

    this.tablero.appendChild(html);

    //Se guarda el id del tablero
    this.tablero = this.tablero.id;

    //Se crea/modifica una entrada en localStorage que tiene como clave el id de la tarea y como valor el resto de las claves del objeto tarea.
    localStorage.setItem("tarea-" + this.id, JSON.stringify(this));
  }

  //Alterna el estado de una tarea en localStorage, memoria y en el DOM.
  alternarEstado(){
    this.completa = !this.completa;
    Utils.guardarEnLocalStorage(this.id, 'completa', this.completa, true);

    let tareaDOM = Tarea.obtenerTarea(this.id).DOM;
    tareaDOM.classList.toggle('tarea--completa');
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

      //Busca el padre, esto se puede hacer con recursividad.
      while(!objetivo.dataset.idTarea){

        objetivo = objetivo.parentElement;

        //Verifica si se llegó a la raiz del documento y no se encontró una
        //tarea (o al body en el mejor de los casos)
        if(objetivo == document.body || objetivo == document.documentElement){
          return null;
        }
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
    tarea["LS"] = Utils.obtenerDeLocalStorage(id, true);

    //Si existe esa tarea, entonces paso todos los valores del objeto de localStorage al objeto de clase Tarea (así tiene los métodos).
    if(tarea["LS"]) tarea["LS"] = Tarea.convertirTarea(tarea["LS"]);

    return tarea;
  }

  //Obtiene todas las tareas de localStorage, se usa para refrescar todas las tareas o la carga inicial de la aplicación.
  static obtenerTareas(){
    //Es la función que uso para encontrar tareas y convertirlas a un objeto de clase localStorage.
    let filtro = function (clave){
      let tarea = Utils.obtenerDeLocalStorage(clave);
      tarea = Tarea.convertirTarea(tarea);
      return tarea;
    }

    //Obtengo todas las tareas ordenadas como objetos de la clase Tarea.
    return Utils.iterarLocalStorage(clave => clave.includes('tarea'), filtro);
  }

  //Carga todas las tareas al DOM y a localStorage. Útil para cuando inicia la aplicación.
  static cargarTareas(){
    let tareas = Tarea.obtenerTareas();
    for(let tarea of tareas){
      tarea.cargar();
    }
  }

  //Convierte una tarea extraida de localStorage a un objeto de clase Tarea.
  static convertirTarea(tareaLS){

    let tarea = new Tarea();

    for(let clave in tareaLS){
      tarea[clave] = tareaLS[clave];
    }

    return tarea;
  }
}

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
      if(prueba(clave, localStorage)) valoresFiltrados.push(filtro(clave, localStorage))
    }

    return valoresFiltrados;
  }

  static eventoTarea(e){
    let tarea;
    tarea = Tarea.obtenerTarea(null, e.target);

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

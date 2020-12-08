class LS{
  guardar(clave, valor){
    if(typeof valor === 'object'){
      localStorage.setItem(clave, JSON.stringify(valor));
      return;
    } else {
      localStorage.setItem(clave, valor);
    }
  }

  obtenerTarea(clave){
    return JSON.parse(localStorage.getItem(clave));
  }
}

function obtenerClaveTarea(claveLS){
  let idTarea;
  idTarea = localStorage.getItem(claveLS);
  idTarea = JSON.parse(idTarea);
  idTarea = idTarea.id;
  return idTarea;
}

function obtenerUltimaTarea(){
  let id = 0, regExp = /tarea/, claveLS, valorClaveLS;

  for(let i = 0; i<localStorage.length; i++){
    claveLS = localStorage.key(i);

    if(regExp.test(claveLS)){
      valorClaveLS = obtenerClaveTarea(claveLS);
    }
    if(valorClaveLS && valorClaveLS > id){
      id = valorClaveLS;
    }
  }
  return id;
}

function obtenerColores(){
  return localStorage.getItem('colores') == 'true';
}

function obtenerFuente(){
  return localStorage.getItem('fuente') == 'true';
}

function nombreUsuarioEstablecido(){
  return localStorage.getItem(nombre.id);
}

function obtenerNombreUsuario(){
  if(nombreUsuarioEstablecido()){
    return nombreUsuarioEstablecido();
  } else {
    return 'tu nombre podría estar acá :(';
  }
}

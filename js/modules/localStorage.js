function guardarLocalStorage(clave, valor){
  if(typeof valor === 'object'){
    localStorage.setItem(clave, JSON.stringify(valor));
    return;
  } else {
    localStorage.setItem(clave, valor);
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

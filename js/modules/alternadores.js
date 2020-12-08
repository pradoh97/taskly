class Alternador {
  get alternadores(){
    let alternadores = document.querySelectorAll('.alternador');

    for(let alternador of alternadores){
      this[alternador.id] = alternador;
      this[alternador.id].addEventListener('click', this.ejecutarAlternador);
    }
  }

  ejecutarAlternador(e){
    e.stopPropagation();
    let boton = e.target;
    console.log(boton);
    if(boton.id.contains('fuente')) console.log("asd");
  }


}
function alternarColores(e){
  let coloresAlternados = obtenerColores();

  if(e){
    coloresAlternados = !coloresAlternados;
    guardarLocalStorage('colores', coloresAlternados);
  }
  if(coloresAlternados){
    document.body.classList.add('contraste');
  } else {
    document.body.classList.remove('contraste');
  }
}

function alternarTexto(e, boton=""){
  let estiloHtml = document.querySelector('html').classList;
  let textoGrande = obtenerFuente();

  if(e){
    boton = e.target;
    textoGrande = !textoGrande;
    guardarLocalStorage('fuente', textoGrande);
  }

  if(textoGrande){
    estiloHtml.add('grande');
    boton.innerHTML = `<i class="fi-cnluxl-medium"></i> Achicar texto`
  } else {
    estiloHtml.remove('grande');
    boton.innerHTML = `<i class="fi-cnluxl-extra-large"></i> Agrandar texto`
  }
  friconix_update();
}

function alternarOpciones(e){
  let opciones = document.querySelector('.opciones-flotantes');
  opciones.classList.toggle('visibles');
}

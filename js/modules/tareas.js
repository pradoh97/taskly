function crearTarea(titulo){
  let tarea = document.createElement('div');
  tarea.classList.add('tarea');
  tarea.innerHTML = `<div class="titulo">
    <h2 class="campo-editable">${titulo}</h2><i class="fas fa-pen"></i>
  </div>
  <div class="descripcion">
    <p class="campo-editable">
      Añadí una descripción de la tarea.
    </p>
    <i class="fas fa-pen"></i>
  </div>

  <button class="exito" type="button">
    <i class="fas fa-check"></i> Marcar como completa.
  </button>`;
  grillaTareas.appendChild(tarea);
}

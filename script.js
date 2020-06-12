var btnTarea =  document.getElementById("tarea");
var tareas = [];
var creandoTarea = false;
var editantoTarea = false;
var tarea = false;

function cargaTareas(){
	if(localStorage.getItem('tareas')){
		tareas = localStorage.getItem('tareas');
		tareas = JSON.parse(tareas);
	}
	else{
		localStorage.setItem('tareas', JSON.stringify(tareas));
	}
	
	var contenedor = document.getElementById("inferior");
	contenedor.innerHTML = "";
	
	if(tareas.length > 0){
		contenedor.style.display = "block";
		document.getElementById("barra").style.display = "block";
	}
	else{
		contenedor.style.display = "none";
		document.getElementById("barra").style.display = "none";
	}
	
	for(var i = 0; i < tareas.length; i++){
		var btn = document.createElement("button");
		btn.innerHTML = tareas[i];
		btn.id = "boton"+i;
		btn.onclick = function(){editarTarea(this)};
		contenedor.appendChild(btn);
		if(i < tareas.length - 1)
			contenedor.appendChild(document.createElement("hr"));
	}
	
	editantoTarea = false;
	tarea = false;
}

function nuevaTarea(){
	var contenedor = document.getElementById("superior");
	
	var texto = document.createElement("input");
	texto.type="text";
	texto.id="texto";
	
	var guardar = document.createElement("button");
	guardar.innerHTML="Guardar";
	guardar.onclick = function(){guardarTarea(texto.value)};
	guardar.id="guarda";
	
	var cancelar = document.createElement("button");
	cancelar.innerHTML="Cancelar";
	cancelar.onclick = function(){cancelarNueva()};
	cancelar.id="cancela";
	
	contenedor.appendChild(texto);
	contenedor.appendChild(guardar);
	contenedor.appendChild(cancelar);
	texto.select();
	
	creandoTarea=true;
}

function guardarTarea(tarea){
	if(tarea.length === 0 || tarea.trim().length === 0){
		alert("Campo de tarea vacío");
	}
	else{
		tareas.push(tarea);
		cancelarNueva();
		localStorage.setItem('tareas', JSON.stringify(tareas));
		cargaTareas();
	}
}

function cancelarNueva(){
	document.getElementById("texto").remove();
	document.getElementById("guarda").remove();
	document.getElementById("cancela").remove();
	creandoTarea=false;
}

function editarTarea(boton){
	if(editantoTarea){
		cancelaEditar(tarea);
	}
	
	editantoTarea = true;
	tarea = boton;
	
	var tTarea = document.createElement("input");
	tTarea.type="text";
	tTarea.id="edTexto";
	tTarea.placeholder=boton.innerHTML;
	
	var eTarea = document.createElement("button");
	eTarea.innerHTML="Eliminar";
	eTarea.id="edEliminar";
	eTarea.onclick = function(){eliminarTarea(boton.id)};
	
	var cTarea = document.createElement("button");
	cTarea.innerHTML="Cancelar";
	cTarea.id="edCancelar";
	cTarea.onclick = function(){cancelaEditar(boton)};
	
	var gTarea = document.createElement("button");
	gTarea.innerHTML="Guardar";
	gTarea.id="edGuardar";
	gTarea.onclick = function(){guardarEdicion(boton.id, tTarea.value, boton)};
	
	boton.style.display = "none";
	
	gTarea.colocarDespues(boton);
	cTarea.colocarDespues(boton);
	eTarea.colocarDespues(boton);
	tTarea.colocarDespues(boton);
	
	tTarea.select();
}

function eliminarTarea(id){
	tareas.splice(id.slice(5), 1);
	localStorage.setItem('tareas', JSON.stringify(tareas));
	cargaTareas();
}

function cancelaEditar(boton){
	document.getElementById("edTexto").remove();
	document.getElementById("edEliminar").remove();
	document.getElementById("edCancelar").remove();
	document.getElementById("edGuardar").remove();
	boton.style.display = "block";
	editantoTarea = false;
	tarea = false;
}

function guardarEdicion(id, texto, boton){
	if(texto.length === 0 || texto.trim().length === 0){
		alert("Tarea sin modificar");
		cancelaEditar(boton);
	}
	else{
		tareas[id.slice(5, id.length)] = texto;
		//console.log(id.slice(5, id.length));
		localStorage.setItem('tareas', JSON.stringify(tareas));
		cargaTareas();
	}
}

function pruebas(text){
	alert(text.id);
}

btnTarea.onclick = function(){if(creandoTarea==false){nuevaTarea()}};
cargaTareas();

/* añade el elemento antes del elemento vecino */
Element.prototype.colocarAntes = function(element) {
  element.parentNode.insertBefore(this, element);
}, false;

/* añade el elemento después del elemento vecino */
Element.prototype.colocarDespues = function(element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}, false;

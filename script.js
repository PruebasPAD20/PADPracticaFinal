var tareas = [];
var creandoTarea = false;
var editantoTarea = false;
var tarea = false;


function cargarSW(){
	// si nuestro navegador ejecuta service workers
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./script.js').then(reg => {
                console.log('Todo bien:', reg)
            }, function (err) {
                console.log('Fallo:', err)
            })
        })
    }
}

function instalarSW(){
	var CACHE_NAME = 'pad-cache-v1';
	var urlsToCache = [
		'/',
		'/index.html',
		'/estilo.css',
		'/script.js',
		'/manifest.json'
	];

	self.addEventListener('install', function(event) {
	  // Perform install steps
	  event.waitUntil(
		caches.open(CACHE_NAME)
		  .then(function(cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		  })
	  );
	});
}

function devolYCache(){
	self.addEventListener('fetch', function(event) {
		event.respondWith(
			caches.match(event.request)
			.then(function(response) {
			// Cache hit - return response
			if (response) {
			  return response;
			}

			// IMPORTANT: Clone the request. A request is a stream and
			// can only be consumed once. Since we are consuming this
			// once by cache and once by the browser for fetch, we need
			// to clone the response.
			var fetchRequest = event.request.clone();

			return fetch(fetchRequest).then(
			  function(response) {
				// Check if we received a valid response
				if(!response || response.status !== 200 || response.type !== 'basic') {
				  return response;
				}

				// IMPORTANT: Clone the response. A response is a stream
				// and because we want the browser to consume the response
				// as well as the cache consuming the response, we need
				// to clone it so we have two streams.
				var responseToCache = response.clone();

				caches.open(CACHE_NAME)
				  .then(function(cache) {
					cache.put(event.request, responseToCache);
				  });

				return response;
			  }
			);
			})
		);
	});
}
	
function cargaTareas(){
	if(localStorage.getItem('tareas')){
		tareas = localStorage.getItem('tareas');
		tareas = JSON.parse(tareas);
	}
	else{
		localStorage.setItem('tareas', JSON.stringify(tareas));
		//alert("nohay");
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
		//console.log(btn.id);
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
	
	creandoTarea=true;
}

function guardarTarea(tarea){
	if(tarea.length === 0 || tarea.trim().length === 0){
		alert("Campo de tarea vacío");
	}
	else{
		//console.log(tarea);
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
		//document.getElementById("edCancelar").onclick;
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

cargarSW();
instalarSW();
devolYCache();
var btnTarea =  document.getElementById("tarea");
btnTarea.onclick = function(){if(creandoTarea==false){nuevaTarea()}};
cargaTareas();

/* Adds Element BEFORE NeighborElement */
Element.prototype.colocarAntes = function(element) {
  element.parentNode.insertBefore(this, element);
}, false;

/* Adds Element AFTER NeighborElement */
Element.prototype.colocarDespues = function(element) {
  element.parentNode.insertBefore(this, element.nextSibling);
}, false;

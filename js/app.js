var timeApp = (function(d) {

	'use strict';
	const URL = "http://localhost/RobertoJS/solexamen/citys/";

  	// Crear el objeto XHR y realiza la petición CORS
  	function cargaCORS(archivo, fcallback) {
  		var xhr = new XMLHttpRequest();

  		if ("withCredentials" in xhr) {
  			xhr.open('POST', URL+archivo, true);
  		} else if (typeof XDomainRequest != "undefined") {
  			xhr = new XDomainRequest();
  			xhr.open('POST', URL+archivo);
  		} else {
  			//CORS no soportado;
  			xhr = null; 
  		}
  		if (!xhr) {alert('no soporta CORS'); return;}
  		xhr.send();
  		xhr.onload = function() { };
  		xhr.onerror = function() { alert('Error de respuesta'); };
  		xhr.onloadend = function(){
  			fcallback(xhr.responseText);
  			return;
  		}
  	}

  	function getCiudadPrincipal(jsonciudades){
  		//Obteniendo datos de'ciudades.json'
  		for(let i in jsonciudades){
  			if(jsonciudades[i].hasOwnProperty('mostrar')){
  				d.querySelector('#ciudad>p>span').appendChild(d.createTextNode(jsonciudades[i]['ciudad']));
  				return jsonciudades[i]['ciudad'];
  			}
  		}
  	}

  	function getPropsCiudad(json, city){
  		for(let i in json){
  			if(json.hasOwnProperty('dias') && json.hasOwnProperty('ciudad') && (json['ciudad'].trim() != undefined) ){
  				mostrarPropsCiudadPrincipal(json, 'Madrid');
  			}else{
  				mostrarPropsOtrasCiudades(json);
  			}
  			return;
  		}
  	}

  	function mostrarPropsCiudadPrincipal(j, c){
  		console.log(c);
  		if(j.ciudad == 'Madrid'){
  			//Ciudad principal que hay que mostrar;
  			let fsalida = j.dias[0].salida;
  			let focaso = j.dias[0].puesta;

  			d.querySelector('#fecha')
  			.appendChild(
  				d.createTextNode(formatear_fecha(j.dias[0].fecha)));
  			let spans = d.querySelectorAll('#sol span');
  			let spans_1 = spans[0].textContent;
  			spans[0].appendChild(d.createTextNode(fsalida));
  			spans[1].appendChild(d.createTextNode(focaso));
  			spans[2].appendChild(d.createTextNode(diferencia_fechas((j.dias[0].fecha + ' ' + focaso), j.dias[0].fecha + ' ' + fsalida)));
  			return;
  		}
  	}

  	function mostrarPropsOtrasCiudades(j){		
		//console.log(j);
		for(let i in j){
			if(j[i].hasOwnProperty('UTC')){
				let now = ( new Date() ).getTime();
				now += (j[i]['UTC']*3600000);
				let nowformatted = new Date(now);
				let ul = d.createElement('ul');
        
        
        d.querySelector('#ciudades').style.marginTop = '20px';
        d.querySelector('#ciudades').appendChild(ul);
        let li = d.createElement('li');
        let contenido_ciudad = document.createTextNode(j[i]['ciudad']);
        let contenido_br = document.createElement('br');
        let contenido_hora = document.createTextNode( getHoraLocal(j[i]['UTC'])[0] +':'+getHoraLocal(j[i]['UTC'])[1]);
        li.appendChild(contenido_ciudad);
        li.appendChild(contenido_br);
        li.appendChild(contenido_hora);
        li.style.padding = '20px';
        d.querySelector('#ciudades > ul').appendChild(li);
      }
    }
    return;
  }

  function getHoraLocal(utc){
    let ifecha = (new Date()).getTime() + (utc*60*60*1000);
    let fecha = new Date(ifecha);
    let h = (fecha.getHours() < 10) ? ('0'+ fecha.getHours()) : fecha.getHours();
    let m = (fecha.getMinutes() < 10 ) ? ('0' + fecha.getMinutes()) : fecha.getMinutes();
    let s = (fecha.getSeconds() < 10 ) ? ('0' + fecha.getSeconds()) : fecha.getSeconds();
    return [h,m,s];
  }

  function getHoraPaises(utc){
    let fecha = (new Date()).getTime() + (utc*60*60);
    let fechapais = new Date(fecha);
    return [h,m,s];
  }


  function mostrarHoraLocal(ghl){
    d.querySelector('#reloj > p > span:nth-child(1)').innerHTML = ghl[0];
    d.querySelector('#reloj > p > span:nth-child(2)').innerHTML = ghl[1];
    d.querySelector('#reloj > p > span:nth-child(3)').innerHTML = ghl[2];

  }

  function diferencia_fechas(f1, f2){
    let fres = ((new Date(f1)).getTime() - (new Date(f2)).getTime())/1000;
    let result = formatear_hora(fres, 0);
    return ( ' '+result[0]+':'+result[1]+':'+result[2]);
  }

  function formatear_hora(hora){
    let h = Math.floor( hora / 3600 ) < 10 ? "0" + Math.floor( hora / 3600 ) : Math.floor( hora / 3600 );  
    let m = Math.floor( (hora % 3600) / 60 ) < 10 ? '0'+ Math.floor( (hora % 3600) / 60 ) :  Math.floor( (hora % 3600) / 60 );
    let s = (hora % 60) < 10 ? '0'+(hora % 60) : (hora % 60);
    return [h,m,s];
  }

  function formatear_fecha(f){
    f = new Date(f);
    let semana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return ( semana[f.getDay()].charAt(0).toUpperCase() + semana[f.getDay()].substring(1) + ', ' + f.getDate() + ' de ' + meses[f.getMonth()] + ' de ' + f.getFullYear() );
  }

  	//recoge los datos del archivo para que puedan ser tratados
  	function fcallback(json){
  		json = JSON.parse(json);
  		let ciudadppal = getCiudadPrincipal(json); // return Madrid;
  		getPropsCiudad(json, ciudadppal); // pinta las propedades de la ciudad principal;
  	}

  	function result(ciudades) {
  		cargaCORS('ciudades.json', fcallback);
  		cargaCORS('0001.json', fcallback);
  		cargaCORS('0002.json', fcallback);
  		cargaCORS('0003.json', fcallback);
  		cargaCORS('0004.json', fcallback);
  		cargaCORS('0005.json', fcallback);
  		cargaCORS('0006.json', fcallback);
  	}

  	return {
  		iniciar: function(value) {
  			setInterval(function(){
  				mostrarHoraLocal(getHoraLocal(0));
  			}, 1000);
  			return result(value);
  		}
  	};   
  })(document);
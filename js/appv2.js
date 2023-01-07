let DB;
const nombreInput = document.querySelector('#nombre');
const tutorInput = document.querySelector('#tutor');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const motivoInput = document.querySelector('#motivo');
 
// Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');
 
// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);
 
// Heading
const heading = document.querySelector('#administra');
 
 
let editando = false;
 
window.onload = () => {
    eventListeners();
 
    crearDB();
}
 
// Eventos
 
function eventListeners() {
    nombreInput.addEventListener('change', datosCita);
    tutorInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    motivoInput.addEventListener('change', datosCita);
}
 
const citaObj = {
    nombre: '',
    tutor: '',
    telefono: '',
    fecha: '',
    hora:'',
    motivo: ''
}
 
 
function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}
 
// CLasses
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
 
    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);
    }
}
 
class UI {
 
    constructor() {
        this.textoHeading();
    }
 
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }
 
        // Mensaje de error
        divMensaje.textContent = mensaje;
 
        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));
 
        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
   }
 
   imprimirCitas() { 
       
        this.limpiarHTML();
 
        this.textoHeading(citas);
 
        //Leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');
 
        const fnTextoHeading = this.textoHeading;
 
        const total = objectStore.count();
        total.onsuccess = function() {
            fnTextoHeading(total.result);
        }
 
        objectStore.openCursor().onsuccess = function(e) {
            
            const cursor = e.target.result;
 
            if (cursor) {
                const { nombre, tutor, telefono, fecha, hora, motivo, id } = cursor.value;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.classList.id = id;
 
            //Scripting de los elementos de la cita
            const nombreParrafo = document.createElement('h2');
            nombreParrafo.classList.add('card-title', 'font-weight-bolder');
            nombreParrafo.textContent = nombre;
 
            const tutorParrafo = document.createElement('p');
            tutorParrafo.innerHTML = `
            <span class"font-wight-bolder">Propietario: </span> ${tutor}
            `;
 
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class"font-wight-bolder">Teléfono: </span> ${telefono}
            `;
 
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class"font-wight-bolder">Fecha: </span> ${fecha}
            `;
 
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class"font-wight-bolder">Hora: </span> ${hora}
            `;
 
            const motivoParrafo = document.createElement('p');
            motivoParrafo.innerHTML = `
            <span class"font-wight-bolder">Síntomas: </span> ${motivo}
            `;
 
            //Botón para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ';
 
            btnEliminar.onclick = () => eliminarCita(id);
 
            //Botón para editar cita
            const btnEditar = document.createElement('button');
 
            const cita = cursor.value;
 
            btnEditar.onclick = () => cargarEdicion(cita);
 
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>'
            
            
 
            //Agregar los Parrafos a div cita
            divCita.appendChild(nombreParrafo);
            divCita.appendChild(tutorParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(motivoParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
 
            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
 
            //Ve al siguiente elemento
            cursor.continue();
            }
        }
   }
 
   textoHeading(resultado) {
        if(resultado > 0 ) {
            heading.textContent = 'Administra tus Citas '
        } else {
            heading.textContent = 'No hay Citas, comienza creando una'
        }
    }
 
   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}
 
 
const administrarCitas = new Citas();
const ui = new UI(administrarCitas);
 
function nuevaCita(e) {
    e.preventDefault();
 
    const {nombre, tutor, telefono, fecha, hora, motivo } = citaObj;
 
    // Validar
    if( nombre === '' || tutor === '' || telefono === '' || fecha === ''  || hora === '' || motivo === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')
 
        return;
    }
 
    if(editando) {
        // Estamos editando
        administrarCitas.editarCita( {...citaObj} );
 
        //Edita en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
 
        objectStore.put(citaObj);
 
        transaction.oncomplete = () => {
 
            ui.imprimirAlerta('Guardado Correctamente');
 
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    
            editando = false;
        }
        
        transaction.onerror = () => {
            console.log('ERROR')
        }
 
    } else {
        // Nuevo Registro
 
 
        // Generar un ID único
        citaObj.id = Date.now();
        
        // Añade la nueva cita
        administrarCitas.agregarCita({...citaObj});
 
        //Insertar registro en IndexDB
        const transaction = DB.transaction(['citas'], 'readwrite');
 
        //Habilitar el objectStore
        const objectStore = transaction.objectStore('citas');
 
        //Insertar en la BD
        objectStore.add(citaObj);
 
        transaction.oncomplete = function() {
            console.log('cita agregada');
 
             // Mostrar mensaje de que todo esta bien...
             ui.imprimirAlerta('Se agregó correctamente');    
        }
 
    }
 
 
    // Imprimir el HTML de citas
    ui.imprimirCitas();
 
    // Reinicia el objeto para evitar futuros problemas de validación
    reiniciarObjeto();
 
    // Reiniciar Formulario
    formulario.reset();
 
}
 
function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.nombre = '';
    citaObj.tutor = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.motivo= '';
}
 
 
function eliminarCita(id) {
    
    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');
 
    objectStore.delete(id);
 
    transaction.oncomplete = () => {
    console.log('eliminada');    
    ui.imprimirCitas();
    }
 
    transaction.onerror = () => {
        console.log('ERROR')
    }
}
 
function cargarEdicion(cita) {
 
    const {nombre, tutor, telefono, fecha, hora, motivo, id } = cita;
 
    // Reiniciar el objeto
    citaObj.nombre = nombre;
    citaObj.tutor = tutor;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.motivo = motivo;
    citaObj.id = id;
 
    // Llenar los Inputs
    nombreInput.value = nombre;
    tutorInput.value = tutor;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    motivoInput.value = motivo;
 
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
 
    editando = true;
 
}
 
function crearDB() {
    //Crear la base de datos en versión 1.0
    const crearDB = window.indexedDB.open('citas', 1);
 
    //Si hay un error
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }
 
    //Si todo sale bien
    crearDB.onsuccess = function() {
 
        DB = crearDB.result;
 
        //Mostrar citas al cargar (pero IndexDB ya esta listo)
        ui.imprimirCitas();
    }
 
    //Definir el Schema
    crearDB.onupgradeneeded = function(e) {
        const db = e.target.result;
 
        const objectStore = db.createObjectStore('citas', {
            ketPath: 'id',
            autoIncrement: true
        });
 
        //Definir todas las columnas
        objectStore.createIndex('nombre', 'nombre', {unique: false});
        objectStore.createIndex('tutor', 'tutor', {unique: false});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('motivo', 'motivo', {unique: false});
        objectStore.createIndex('id', 'id', {unique:true});
 
        console.log('ok')
    }
}
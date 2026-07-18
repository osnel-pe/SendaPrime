import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "../../Styles/ModalNEE.css";

const inicial={
    alumno_id:"",
    diagnostico:"",
    nivel:"",
    observaciones:""
};

export default function ModalNuevaNEE({

abierto,

cerrar,

guardar,

students,

alumno,

neeActual

}){

const [datos,setDatos]=useState(inicial);

const [buscar,setBuscar]=useState("");

const [mostrar,setMostrar]=useState(false);

useEffect(()=>{

    if(!abierto) return;

    setDatos(inicial);

    setBuscar("");

},[abierto]);

if(!abierto) return null;

const normalizar=(t="")=>

t.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.toLowerCase();

const lista=students.filter(a=>{

const nombre=normalizar(

`${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`

);

return nombre.includes(normalizar(buscar));

});

return createPortal(

<div className="modal-opciones">

<div className="modal-contenido modal-cita">

<h2>Nueva NEE</h2>

<label>Alumno</label>

<input

placeholder="Buscar alumno..."

value={buscar}

onFocus={()=>setMostrar(true)}

onChange={(e)=>{

setBuscar(e.target.value);

setMostrar(true);

}}

/>

{

mostrar && (

<div className="lista-alumnos-modal">

{

lista.map(alumno=>(

<div

key={alumno.id}

className="item-alumno-modal"

onClick={()=>{

setBuscar(

`${alumno.nombre} ${alumno.apellido_paterno}`

);

setDatos({

...datos,

alumno_id:alumno.id

});

setMostrar(false);

}}

>

<strong>

{alumno.nombre} {alumno.apellido_paterno}

</strong>

<br/>

<small>

{alumno.grupo}

</small>

</div>

))

}

</div>

)

}

<label>Diagnóstico</label>

<input

value={datos.diagnostico}

onChange={(e)=>setDatos({

...datos,

diagnostico:e.target.value

})}

/>

<label>Nivel</label>

<input

value={datos.nivel}

onChange={(e)=>setDatos({

...datos,

nivel:e.target.value

})}

/>

<label>Observaciones</label>

<textarea

rows={3}

value={datos.observaciones}

onChange={(e)=>setDatos({

...datos,

observaciones:e.target.value

})}

/>

<div className="modal-botones">

<button

className="btn-cancelar"

onClick={cerrar}

>

Cancelar

</button>

<button

className="btn-guardar"

onClick={()=>guardar(datos)}

>

Guardar

</button>

</div>

</div>

</div>,

document.body

);

}
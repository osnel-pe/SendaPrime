import {useEffect,useState} from "react";

import "../../Styles/ModalNEE.css";

const inicial={

alumno_id:"",

grupo:"",

titulo:"",

nota:"",

color:"verde",

fijada: false

};

export default function ModalNota({

    abierto,
    cerrar,
    guardar,
    students=[],
    notaActual,
    ocultarAlumno=false,
    soloIndividual=false,
    soloPerfil=false

}){

const [datos,setDatos]=useState(inicial);

const [buscar,setBuscar]=useState("");

const [mostrar,setMostrar]=useState(false);

const [tipo,setTipo]=useState("individual");

useEffect(()=>{

if(!abierto)return;

if(notaActual){

setTipo(

notaActual.grupo

?

"grupo"

:

"individual"

);

const alumno=students.find(

a=>a.id===notaActual.alumno_id

);

setDatos({

alumno_id:notaActual.alumno_id,

grupo:notaActual.grupo || "",

titulo:notaActual.titulo || "",

nota:notaActual.nota || "",

color:notaActual.color || "verde",

});

setBuscar(

alumno

?

`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

:

""

);

}else{

setTipo("individual");

setDatos(inicial);

setBuscar("");

}

},[abierto,notaActual]);

if(!abierto)return null;

const normalizar=(texto="")=>

texto

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.toLowerCase();

const lista=students.filter(a=>{

const nombre=normalizar(

`${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`

);

return nombre.includes(

normalizar(buscar)

);

});

return(

<div className="modal-opciones">

<div className="modal-contenido modal-cita">

<h2>

{

notaActual

?

"Editar nota"

:

"Nueva nota"

}

</h2>

{

!soloIndividual && (

<>

<label>

Tipo

</label>

<select

value={tipo}

onChange={(e)=>setTipo(e.target.value)}

>

<option value="individual">

Alumno

</option>

<option value="grupo">

Grupo completo

</option>

</select>

</>

)

}

{

tipo==="individual"

?

(

<>

{

!ocultarAlumno && (

<>

<label>

Alumno

</label>

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

`${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`

);

setDatos({

...datos,

alumno_id:alumno.id

});

setMostrar(false);

}}

>

<strong>

{alumno.nombre}

{" "}

{alumno.apellido_paterno}

{" "}

{alumno.apellido_materno}

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

</>

)

}

</>

)

:

(

<>

<label>

Grupo

</label>

<select

value={datos.grupo}

onChange={(e)=>

setDatos({

...datos,

grupo:e.target.value,

alumno_id:null

})

}

>

<option value="">

Selecciona un grupo

</option>

{

[...new Set(

    students

        .map(a => a.grupo)

        .filter(Boolean)

)]

.sort((a, b) =>

    a.localeCompare(b, undefined, {

        numeric: true,

        sensitivity: "base"

    })

)

.map(grupo => (

<option

key={grupo}

value={grupo}

>

{grupo}

</option>

))

}

</select>

</>

)

}

<label>

Título

</label>

<input

value={datos.titulo}

placeholder="Título de la nota"

onChange={(e)=>

setDatos({

...datos,

titulo:e.target.value

})

}

/>

<label>

Nota

</label>

<textarea

rows={7}

placeholder="Escribe la nota..."

value={datos.nota}

onChange={(e)=>

setDatos({

...datos,

nota:e.target.value

})

}

/>

<label>

Color

</label>

<div className="nota-colores">

<button

type="button"

className={

datos.color==="verde"

?

"color activo verde"

:

"color verde"

}

onClick={()=>

setDatos({

...datos,

color:"verde"

})

}

/>

<button

type="button"

className={

datos.color==="amarillo"

?

"color activo amarillo"

:

"color amarillo"

}

onClick={()=>

setDatos({

...datos,

color:"amarillo"

})

}

/>

<button

type="button"

className={

datos.color==="rojo"

?

"color activo rojo"

:

"color rojo"

}

onClick={()=>

setDatos({

...datos,

color:"rojo"

})

}

/>

</div>

<div className="modal-botones">

<button

className="btn-cancelar"

type="button"

onClick={cerrar}

>

Cancelar

</button>

<button

className="btn-guardar"

type="button"

onClick={()=>{

guardar({

...datos,

grupo:

tipo==="grupo"

?

datos.grupo

:

null,

alumno_id:

tipo==="individual"

?

datos.alumno_id

:

null

});

}}

>

Guardar

</button>

</div>

</div>

</div>

);

}
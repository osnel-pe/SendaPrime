import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/NEE.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";
import ModalNuevaNEE from "../components/Psicologia/ModalNuevaNEE";
import { supabase } from "../services/supabase";

import {

ArrowLeft,
House,
Search,
Plus

} from "lucide-react";

import { useState } from "react";

export default function NEE({

students,

setStudents,

cargarAlumnos,

cambiarPantalla,

seleccionarAlumno

}){

const [modalNEE,setModalNEE]=useState(false);

const [busqueda,setBusqueda]=useState("");

const guardarNEE = async(datos)=>{

    const alumno = students.find(
        a=>a.id===datos.alumno_id
    );

    const listaActual = Array.isArray(alumno.nee)
        ? alumno.nee
        : [];

    const nuevaLista = [
        ...listaActual,
        {
            diagnostico:datos.diagnostico,
            nivel:datos.nivel,
            observaciones:datos.observaciones
        }
    ];

    const { error } = await supabase
    .from("alumnos")
    .update({
        nee:nuevaLista
    })
    .eq("id",datos.alumno_id);

    if(error){
        alert(error.message);
        return;
    }

    setModalNEE(false);
    await cargarAlumnos();
};

const normalizar=(texto="")=>

texto

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.toLowerCase();

const lista=(students || [])

.filter(a=>{

if(Array.isArray(a.nee))

return a.nee.length>0;

return !!a.nee;

})

.filter(a=>{

const nombre=normalizar(

`${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`

);

return nombre.includes(

normalizar(busqueda)

);

});

return(

<>

    <div
className="app-background"
style={{
backgroundImage:`url(${fondoPsicologia})`
}}
/>

<div className="ps-app">

<div className="ps-container">

<div className="sticky-header">

<div className="page-top">

<button

className="back-btn"

onClick={()=>cambiarPantalla("psicologia")}

>

<ArrowLeft size={22}/>

</button>

<h1>

Necesidades Educativas

</h1>

<button

className="home-btn"

onClick={()=>cambiarPantalla("psicologia")}

>

<House size={20}/>

</button>

</div>

<div className="search-box">

<Search
size={18}
color="#228B52"
/>

<input

className="search-input"

placeholder="Buscar alumno..."

value={busqueda}

onChange={(e)=>setBusqueda(e.target.value)}

/>

</div>

<div className="nee-toolbar">

<button

className="nee-add"

onClick={()=>setModalNEE(true)}

>

<Plus size={18}/>

Nueva NEE

</button>

</div>

</div>

<div className="nee-lista">

{lista.length===0 ? (

<div className="nee-vacio">

No existen alumnos con NEE.

</div>

) : (

lista.map(alumno=>(

<div

key={alumno.id}

className="nee-card"

onClick={()=>{

seleccionarAlumno(alumno);

cambiarPantalla("perfilAlumnoPsico");

}}

>

<div className="nee-avatar">

{alumno.nombre.charAt(0)}

{alumno.apellido_paterno.charAt(0)}

</div>

<div className="nee-info">

<h3>

{alumno.nombre}

{" "}

{alumno.apellido_paterno}

{" "}

{alumno.apellido_materno}

</h3>

<p>

{

Array.isArray(alumno.nee)

? alumno.nee.map(n=>n.diagnostico).join(" | ")

: "Sin diagnóstico"

}

</p>

<span>

{alumno.grupo}

</span>

</div>

</div>

))

)}

</div>

</div>

</div>
<ModalNuevaNEE

abierto={modalNEE}

cerrar={()=>setModalNEE(false)}

guardar={guardarNEE}

students={students}

/>
</>

);

}
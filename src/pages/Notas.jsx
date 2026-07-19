import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/Notas.css";

import fondoPsicologia from "../assets/fondo-psicologia.jpg";

import {

ArrowLeft,
House,
Search,
Plus,
Pencil,
Trash2,
Pin

} from "lucide-react";

import {useEffect,useState} from "react";

import {supabase} from "../services/supabase";

import ModalNota from "../components/Psicologia/ModalNota";

export default function Notas({

students,

cambiarPantalla

}){

const [tipo,setTipo]=useState("individual");

const [notas,setNotas]=useState([]);

const [buscar,setBuscar]=useState("");

const [modal,setModal]=useState(false);

const [notaEditar,setNotaEditar]=useState(null);

const [notaEliminar,setNotaEliminar]=useState(null);

const [notaVista,setNotaVista]=useState(null);

const cargarNotas=async()=>{

const {data,error}=await supabase

.from("notas_psicologia")

.select("*")
.order("fijada",{ascending:false})
.order("created_at",{ascending:false});

if(error){

console.log(error);

return;

}

setNotas(data || []);

};

useEffect(()=>{

cargarNotas();

},[]);

const guardarNota=async(datos)=>{

console.log(datos);

if(notaEditar){

const {error}=await supabase

.from("notas_psicologia")

.update({

titulo:datos.titulo,

nota:datos.nota,

alumno_id:datos.alumno_id,

grupo:datos.grupo,

color:datos.color

})

.eq("id",notaEditar.id);

if(error){

alert(error.message);

return;

}

}else{

const {data,error}=await supabase

.from("notas_psicologia")

.insert({
...datos,
color:datos.color
})

.select();

console.log(error);

console.log(data);

}

setModal(false);

setNotaEditar(null);

cargarNotas();

};

const eliminarNota=async()=>{

const {error}=await supabase

.from("notas_psicologia")

.delete()

.eq("id",notaEliminar.id);

if(error){

alert(error.message);

return;

}

setNotaEliminar(null);

cargarNotas();

};

const fijarNota=async(nota)=>{

const {error}=await supabase

.from("notas_psicologia")

.update({

fijada:!nota.fijada

})

.eq("id",nota.id);

if(error){

alert(error.message);

return;

}

cargarNotas();

};

const normalizar=(texto="")=>

texto
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.toLowerCase();

const lista=notas.filter(n=>{

const alumno=students.find(
a=>a.id===n.alumno_id
);

const texto=normalizar(

`${n.titulo}
${n.nota}
${n.grupo || ""}
${alumno?.nombre || ""}
${alumno?.apellido_paterno || ""}
${alumno?.apellido_materno || ""}
${alumno?.grupo || ""}`

);

return texto.includes(

normalizar(buscar)

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

Notas

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

placeholder="Buscar nota, alumno o grupo..."

value={buscar}

onChange={(e)=>setBuscar(e.target.value)}

/>

</div>

<div className="nee-toolbar">

<button

className="nee-add"

onClick={(e)=>{

e.stopPropagation();

setNotaEditar(null);

setModal(true);

}}

>

<Plus size={18}/>

Nueva nota

</button>

</div>

</div>

<div className="notas-lista">

{

lista.length===0 ?

(

<div className="agenda-vacia">

No existen notas registradas.

</div>

)

:

lista.map(n=>{

const alumno=students.find(

a=>a.id===n.alumno_id

);

return(

<div

key={n.id}

className={`nota-card ${n.color || "verde"}`}

onClick={(e)=>{

if(
e.target.closest(".nota-acciones")
)return;

setNotaVista(n);

}}

>

<div className="nota-header">

<div className="nota-icono">

{

n.grupo

?

"👥"

:

"📝"

}

</div>

    <button

        className={
        n.fijada
        ?
        "nota-pin activo"
        :
        "nota-pin"
        }

        onClick={(e)=>{

        e.stopPropagation();

        fijarNota(n);

        }}

        >

        <Pin size={15}/>

    </button>

<div className="nota-header-info">

<h3>

{n.titulo}

</h3>

<p>

{

n.grupo

?

`Grupo ${n.grupo}`

:

`${alumno?.nombre}
${alumno?.apellido_paterno}
${alumno?.apellido_materno}`

}

</p>

</div>

</div>

<div className="nota-texto">

{

n.nota

.split(" ")

.slice(0,6)

.join(" ")

}

...

</div>

<div className="nota-fecha">

{new Date(n.created_at).toLocaleDateString("es-MX")}

</div>

<div className="nota-acciones">

<button

className="agenda-icon editar"

onClick={(e)=>{

e.stopPropagation();

setNotaEditar(n);

setModal(true);

}}

>

<Pencil size={15}/>

</button>

<button

className="agenda-icon eliminar"

onClick={(e)=>{

e.stopPropagation();

setNotaEliminar(n);

}}

>

<Trash2 size={15}/>

</button>

</div>

</div>

);

})

}

</div>

<ModalNota

abierto={modal}

cerrar={()=>{

setModal(false);

setNotaEditar(null);

}}

guardar={guardarNota}

students={students}

notaActual={notaEditar}

/>

{

notaVista && (

<div className="modal-opciones">

<div
    className={`modal-contenido nota-vista ${notaVista.color || "verde"}`}
>

<h2>

{notaVista.titulo}

</h2>

<p>

<strong>

{

notaVista.grupo

?

`Grupo ${notaVista.grupo}`

:

students.find(

a=>a.id===notaVista.alumno_id

)?.nombre

}

</strong>

</p>

<hr/>

<p
style={{

whiteSpace:"pre-wrap",

lineHeight:1.6,

marginTop:15

}}
>

{notaVista.nota}

</p>

<div className="modal-botones">

<button

className="btn-guardar"

onClick={()=>setNotaVista(null)}

>

Volver

</button>

</div>

</div>

</div>

)

}

{

notaEliminar && (

<div className="modal-opciones">

<div className="modal-contenido eliminar-modal">

<h2>

Eliminar nota

</h2>

<p>

¿Deseas eliminar esta nota?

</p>

<div className="eliminar-botones">

<button

className="btn-cancelar"

onClick={()=>setNotaEliminar(null)}

>

Cancelar

</button>

<button

className="btn-eliminar"

onClick={eliminarNota}

>

Eliminar

</button>

</div>

</div>

</div>

)

}

</div>

</div>

</>

);

}
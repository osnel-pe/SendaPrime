import "../../Styles/NotasAlumnoCard.css";

import{

StickyNote,
Plus,
Pin,
Users,
Pencil,
Trash2

}from "lucide-react";

export default function NotasAlumnoCard({

notas=[],
onAgregar,
onEditar,
onEliminar,
onVer

}){

const lista=Array.isArray(notas)?notas:[];

return(

<div className="citas-card">

<div className="citas-header">

<div className="citas-title">

<StickyNote size={22}/>

<h3>

Notas

</h3>

</div>

<button
className="citas-add"
onClick={onAgregar}
>

<Plus size={18}/>

</button>

</div>

{

lista.length===0?

<div className="citas-vacio">

No existen notas registradas.

</div>

:

lista.map(n=>(

<div

key={n.id}

className={`nota-item ${n.color || "verde"}`}

onClick={()=>onVer(n)}

>

<div className="nota-item-top">

<div className="nota-item-icono">

{

n.grupo

?

<Users size={16}/>

:

<StickyNote size={16}/>

}

</div>

<div className="nota-item-info">

<h4>

{n.titulo}

</h4>

<span>

{

n.grupo

?

`Grupo ${n.grupo}`

:

"Nota individual"

}

</span>

</div>

{

n.anclada&&

<Pin

size={14}

className="nota-pin"

/>

}

</div>

<div className="nota-preview">

{

n.nota

.split(" ")

.slice(0,8)

.join(" ")

}

...

</div>

<div className="nota-footer">

<button

className="timeline-ver"

onClick={(e)=>{

e.stopPropagation();

onEditar(n);

}}

>

<Pencil size={14}/>

Editar

</button>

<button

className="timeline-delete"

onClick={(e)=>{

e.stopPropagation();

onEliminar(n);

}}

>

<Trash2 size={14}/>

</button>

</div>

</div>

))

}

</div>

);

}
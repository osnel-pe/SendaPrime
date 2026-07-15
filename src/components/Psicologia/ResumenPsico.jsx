import "../../Styles/ResumenPsico.css";

import {
CalendarDays,
ClipboardCheck,
TriangleAlert,
Users
} from "lucide-react";

export default function ResumenPsico(){

const datos=[

{
icono:<Users size={22}/>,
numero:128,
texto:"Alumnos"
},

{
icono:<CalendarDays size={22}/>,
numero:4,
texto:"Citas hoy"
},

{
icono:<ClipboardCheck size={22}/>,
numero:12,
texto:"Evaluaciones"
},

{
icono:<TriangleAlert size={22}/>,
numero:3,
texto:"Pendientes"
}

];

return(

<div className="resumen">

<h2>

Resumen de hoy

</h2>

<div className="resumen-grid">

{datos.map((item,index)=>(

<div
key={index}
className="resumen-item"
>

<div className="resumen-icono">

{item.icono}

</div>

<h3>

{item.numero}

</h3>

<p>

{item.texto}

</p>

</div>

))}

</div>

</div>

);

}
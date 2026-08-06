import { ArrowLeft, Clock3, CircleX } from "lucide-react";

import "../../Styles/VistaDetalleAsistencia.css";

export default function VistaDetalleAsistencia({

registros,

cerrar

}){

return(

<div className="va-wrap">

<div className="va-card">

<button

className="va-back"

onClick={cerrar}

>

<ArrowLeft size={20}/>

</button>

<h2>

Detalle de asistencia

</h2>

{

registros.length===0 ?

<div className="va-vacio">

No existen incidencias este mes.

</div>

:

registros.map((r,index)=>(

<div

key={index}

className={`va-item ${

r.estado==="Tarde"

?

"tarde"

:

"falta"

}`}

>

<div className="va-icon">

{

r.estado==="Tarde"

?

<Clock3 size={16}/>

:

<CircleX size={16}/>

}

</div>

<div className="va-info">

<strong>

{r.fecha}

</strong>

<span>

{r.estado}

</span>

</div>

</div>

))

}

</div>

</div>

);

}
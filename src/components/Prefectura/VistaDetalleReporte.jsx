import {
ArrowLeft,
ShieldAlert,
AlertTriangle,
ClipboardList,
FileWarning,
Ban
} from "lucide-react";

import "../../Styles/VistaDetalleReporte.css";

export default function VistaDetalleReporte({

reporte,
cerrar

}){

if(!reporte) return null;

function icono(){

switch(reporte.tipo){

case "Aviso":
return <ShieldAlert size={28}/>;

case "Aviso de conducta":
return <AlertTriangle size={28}/>;

case "Nota de conducta":
return <ClipboardList size={28}/>;

case "Reporte de conducta":
return <FileWarning size={28}/>;

default:
return <Ban size={28}/>;

}

}

function color(){

switch(reporte.tipo){

case "Aviso":
return "detalle-azul";

case "Aviso de conducta":
return "detalle-naranja";

case "Nota de conducta":
return "detalle-morado";

case "Reporte de conducta":
return "detalle-rojo";

default:
return "detalle-gris";

}

}

return(

<div className={`detalle-reporte ${color()}`}>

    <div className="detalle-card">

        <button
            className="detalle-back"
            onClick={cerrar}
        >
            <ArrowLeft size={22}/>
        </button>

        <div className="detalle-icon">

            {icono()}

        </div>
    

<h3>

{reporte.tipo}

</h3>

<div className="detalle-grid">

<div>

<label>Fecha</label>

<p>{reporte.fecha}</p>

</div>

<div>

<label>Motivo</label>

<p>{reporte.motivo}</p>

</div>

{
reporte.tipo==="Suspensión"
&&

<div>

<label>Días</label>

<p>{reporte.dias_suspension}</p>

</div>

}

</div>

<div className="detalle-descripcion">

<label>

Descripción

</label>

<div>

{reporte.descripcion || "Sin descripción"}

</div>

</div>

</div>

</div>

);

}
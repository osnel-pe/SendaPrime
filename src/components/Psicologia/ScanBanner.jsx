import { Camera } from "lucide-react";

export default function ScanBanner({ cambiarPantalla }){

return(

<div

className="scan-banner"

onClick={()=>cambiarPantalla("scanPsicologia")}

>

<div className="scan-big-icon">

<Camera size={56}/>

</div>

<h2>

Escanear documento

</h2>

<p>

(Seleccione un archivo)

</p>

</div>

);

}
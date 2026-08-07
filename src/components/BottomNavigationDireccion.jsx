import {
    Home,
    Users,
    FileWarning
} from "lucide-react";

import "../Styles/BottomNavigation.css";

export default function BottomNavigationDireccion({

    pantalla,
    cambiarPantalla

}){

    return(

        <div className="bottom-nav">

            <button

                className={`bottom-btn ${
                    pantalla==="perfiles"
                    ? "activo"
                    : ""
                }`}

                onClick={()=>cambiarPantalla("perfiles")}

            >

                <Users size={22}/>

                <span>Perfiles</span>

            </button>

            <button

                className={`bottom-btn ${
                    pantalla==="inicio"
                    ? "activo"
                    : ""
                }`}

                onClick={()=>cambiarPantalla("inicio")}

            >

                <Home size={22}/>

                <span>Inicio</span>

            </button>

            <button

                className={`bottom-btn ${
                    pantalla==="neeReportes"
                    ? "activo"
                    : ""
                }`}

                onClick={()=>cambiarPantalla("neeReportes")}

            >

                <FileWarning size={22}/>

                <span>NEE / Reportes</span>

            </button>

        </div>

    );

}
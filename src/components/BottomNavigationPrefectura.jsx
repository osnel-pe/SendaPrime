import {
    Home,
    Users,
    ClipboardList,
    FileText,
    ListChecks
} from "lucide-react";

import "../Styles/BottomNavigation.css";

const botones = [

    {
        id:"perfiles",
        texto:"Perfiles",
        icono:Users
    },

    {
        id:"lista",
        texto:"Lista",
        icono:ListChecks
    },

    {
        id:"inicio",
        texto:"Inicio",
        icono:Home
    },

    {
        id:"reportes",
        texto:"Reportes",
        icono:ClipboardList
    },

    {
        id:"notas",
        texto:"Notas",
        icono:FileText
    }

];

export default function BottomNavigationPrefectura({

    pantalla,

    cambiarPantalla

}){

    return(

        <div className="bottom-nav">

            {

                botones.map((boton)=>{

                    const Icono = boton.icono;

                    const activo = pantalla===boton.id;

                    return(

                        <button

                            key={boton.id}

                            className={`bottom-btn ${activo?"activo":""}`}

                            onClick={()=>

                                cambiarPantalla(boton.id)

                            }

                        >

                            <Icono size={22}/>

                            <span>

                                {boton.texto}

                            </span>

                        </button>

                    );

                })

            }

        </div>

    );

}
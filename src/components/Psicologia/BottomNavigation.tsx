import {
    Home,
    Users,
    CalendarDays,
    FileText,
    Brain
} from "lucide-react";

import "../../Styles/BottomNavigation.css";
const botones = [

    {
        id:"perfiles",
        texto:"Perfiles",
        icono:Users
    },

    {
        id:"citas",
        texto:"Citas",
        icono:CalendarDays
    },

    {
        id: "inicio",
        texto: "Inicio",
        icono: Home
    },

    {
        id: "nee",
        texto: "NEE",
        icono: Brain
    },

    {
        id: "notas",
        texto: "Notas",
        icono: FileText
    }

];

type Props={

    pantalla:string;

    cambiarPantalla:(pantalla:string)=>void;

};

export default function BottomNavigation({

    pantalla,

    cambiarPantalla

}:Props){

    return(

        <div className="bottom-nav">

            {

                botones.map(

                    boton=>{

                        const Icono=boton.icono;

                        const activo=

                            pantalla===boton.id;

                        return(

                            <button

                                key={boton.id}

                                className={`bottom-btn ${activo?"activo":""}`}

                                onClick={()=>

                                    cambiarPantalla(

                                        boton.id

                                    )

                                }

                            >

                                <Icono

                                    size={22}

                                />

                                <span>

                                    {boton.texto}

                                </span>

                            </button>

                        );

                    }

                )

            }

        </div>

    );

}
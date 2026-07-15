import "../../Styles/SelectorAlumno.css";

import { Search } from "lucide-react";

export default function SelectorAlumno(){

    return(

        <div className="selector-alumno">

            <h3>

                Alumno

            </h3>

            <div className="selector-input">

                <Search size={20}/>

                <input

                    type="text"

                    placeholder="Buscar alumno por nombre..."

                />

            </div>

        </div>

    );

}
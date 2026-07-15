import "../../Styles/TarjetaAlumno.css";

import {
    UserRound,
    GraduationCap,
    Cake,
    Users,
    ShieldCheck
} from "lucide-react";

export default function TarjetaAlumno(){

    return(

        <div className="tarjeta-alumno">

            <div className="foto-alumno">

                <UserRound size={52}/>

            </div>

            <div className="datos-alumno">

                <h2>

                    Juan Pérez López

                </h2>

                <div className="dato">

                    <GraduationCap size={16}/>

                    <span>

                        3° "B"

                    </span>

                </div>

                <div className="dato">

                    <Cake size={16}/>

                    <span>

                        14 años

                    </span>

                </div>

                <div className="dato">

                    <Users size={16}/>

                    <span>

                        Tutor: María López

                    </span>

                </div>

            </div>

            <div className="estado">

                <ShieldCheck size={18}/>

                Seguimiento

            </div>

        </div>

    );

}
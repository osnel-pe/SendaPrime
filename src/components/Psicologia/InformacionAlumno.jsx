import "../../Styles/InformacionAlumno.css";

import {
    Phone,
    Mail,
    Home,
    HeartHandshake,
    School,
    BadgeCheck
} from "lucide-react";

export default function InformacionAlumno(){

    return(

        <div className="info-alumno">

            <div className="info-item">

                <Phone size={18}/>

                <div>

                    <h4>Teléfono</h4>

                    <p>999-123-4567</p>

                </div>

            </div>

            <div className="info-item">

                <Mail size={18}/>

                <div>

                    <h4>Correo</h4>

                    <p>juan@email.com</p>

                </div>

            </div>

            <div className="info-item">

                <Home size={18}/>

                <div>

                    <h4>Domicilio</h4>

                    <p>Colonia Centro</p>

                </div>

            </div>

            <div className="info-item">

                <School size={18}/>

                <div>

                    <h4>Escuela</h4>

                    <p>Primaria Benito Juárez</p>

                </div>

            </div>

            <div className="info-item">

                <HeartHandshake size={18}/>

                <div>

                    <h4>Tutor</h4>

                    <p>María López</p>

                </div>

            </div>

            <div className="info-item">

                <BadgeCheck size={18}/>

                <div>

                    <h4>Estado</h4>

                    <p>Seguimiento activo</p>

                </div>

            </div>

        </div>

    );

}
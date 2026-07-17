import { useEffect, useState } from "react";

import { obtenerArchivo } from "../share/ShareStorage";

export default function RecibirExpediente({

    students,

    cambiarPantalla

}) {

    const [archivo, setArchivo] = useState(null);

    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {

        setArchivo(obtenerArchivo());

    }, []);

    const alumnos = students.filter((alumno) => {

        const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase();

        return nombreCompleto.includes(

            busqueda.toLowerCase()

        );

    });

    return (

        <div className="screen">

            <h2>

                Asignar expediente

            </h2>

            {

                archivo &&

                <p>

                    <b>Documento:</b>

                    {" "}

                    {archivo.name}

                </p>

            }

            <input

                type="text"

                placeholder="Buscar alumno..."

                value={busqueda}

                onChange={(e)=>setBusqueda(e.target.value)}

            />

            <div>

                {

                    alumnos.map((alumno)=>(

                        <button

                            key={alumno.id}

                            style={{

                                display:"block",

                                width:"100%",

                                marginTop:10

                            }}

                        >

                            {alumno.nombre}{" "}

                            {alumno.apellido_paterno}{" "}

                            {alumno.apellido_materno}

                        </button>

                    ))

                }

            </div>

        </div>

    );

}
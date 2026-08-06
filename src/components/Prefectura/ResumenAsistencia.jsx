import "../../Styles/ResumenAsistencia.css";

export default function ResumenAsistencia({

    resumen={}

}){

    const grupos=Object.keys(resumen).sort();

    return(

        <div className="ra-container">

            <h3>

                Resumen del día:

            </h3>

            {

                grupos.length===0

                ?

                <div className="ra-vacio">

                    No existen incidencias hoy.

                </div>

                :

                grupos.map(grupo=>(

                    <div
                        key={grupo}
                        className="ra-grupo"
                    >

                        <h3>

                            {grupo}

                        </h3>

                        {

                            resumen[grupo].map(alumno=>(

                                <div

                                    key={alumno.id}

                                    className={`ra-item ${alumno.estatus}`}

                                >

                                    <span>

                                        {alumno.nombre}{" "}
                                        {alumno.apellido_paterno}

                                    </span>

                                    <strong>

                                        {

                                            alumno.estatus==="falta"

                                            ?

                                            "Ausente"

                                            :

                                            "Tardanza"

                                        }

                                    </strong>

                                </div>

                            ))

                        }

                    </div>

                ))

            }

        </div>

    );

}
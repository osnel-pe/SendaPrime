import { useEffect, useState } from "react";

import "../../Styles/ModalCita.css";

export default function ModalSeguimientoGrupo({

    abierto,

    cerrar,

    guardar

}){

    const datosIniciales={

        fecha:new Date().toISOString().slice(0,10),

        tema:"",

        objetivo:"",

        actividades:"",

        observaciones:""

    };

    const [datos,setDatos]=useState(datosIniciales);

    useEffect(()=>{

        if(abierto){

            setDatos(datosIniciales);

        }

    },[abierto]);

    if(!abierto) return null;

    return(

        <div className="modal-opciones">

            <div className="modal-contenido modal-cita">

                <h2>

                    Seguimiento grupal

                </h2>

                <label>

                    Fecha

                </label>

                <input

                    type="date"

                    value={datos.fecha}

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            fecha:e.target.value

                        })

                    }

                />

                <label>

                    Tema

                </label>

                <input

                    value={datos.tema}

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            tema:e.target.value

                        })

                    }

                />

                <label>

                    Objetivo

                </label>

                <textarea

                    rows={3}

                    value={datos.objetivo}

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            objetivo:e.target.value

                        })

                    }

                />

                <label>

                    Actividades realizadas

                </label>

                <textarea

                    rows={4}

                    value={datos.actividades}

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            actividades:e.target.value

                        })

                    }

                />

                <label>

                    Observaciones

                </label>

                <textarea

                    rows={3}

                    value={datos.observaciones}

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            observaciones:e.target.value

                        })

                    }

                />

                <div className="modal-botones">

                    <button

                        className="btn-cancelar"

                        onClick={cerrar}

                    >

                        Cancelar

                    </button>

                    <button

                        className="btn-guardar"

                        onClick={()=>guardar(datos)}

                    >

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}
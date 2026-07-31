import { useEffect, useState } from "react";

import "../../Styles/ModalNEE.css";

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

        <div className="modal-overlay">

            <div className="modal-nee">

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

                    placeholder="Ej. Prevención del acoso escolar"

                    value={datos.tema}

                    onChange={(e)=>

                        setDatos({

                            ...datos,

                            tema:e.target.value

                        })

                    }
                    autofocus

                />

                <label>

                    Objetivo

                </label>

                <textarea

                    placeholder="Objetivo del seguimiento..."

                    rows={4}

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

                    placeholder="Describe las actividades realizadas..."

                    rows={6}

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

                  placeholder="Observaciones adicionales..."

                    rows={4}

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

                        onClick={()=>{

                            if(!datos.tema.trim()) return;

                            guardar({

                                ...datos,

                                tema:datos.tema.trim(),

                                objetivo:datos.objetivo.trim(),

                                actividades:datos.actividades.trim(),

                                observaciones:datos.observaciones.trim()

                            });

                        }}

                    >

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}
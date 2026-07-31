import { useState, useEffect } from "react";
import "../Styles/ModalNEE.css";

export default function ModalNEE({
    abierto,
    cerrar,
    guardar,
    nee
}) {

    const [diagnostico, setDiagnostico] = useState("");
    const [nivel, setNivel] = useState("Leve");
    const [observaciones, setObservaciones] = useState("");

    useEffect(()=>{

        if(nee){

            setDiagnostico(

                nee.diagnostico || ""

            );

            setNivel(

                nee.nivel || "Leve"

            );

            setObservaciones(

                nee.observaciones || ""

            );

        }

        else{

            setDiagnostico("");

            setNivel("Leve");

            setObservaciones("");

        }

    },[nee,abierto]);

    if (!abierto) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-nee">

                <h2>

                    {

                        nee

                        ?

                        "Editar NEE"

                        :

                        "Nueva NEE"

                    }

                </h2>

                <label>Diagnóstico</label>

                <input
                    value={diagnostico}
                    onChange={(e)=>setDiagnostico(e.target.value)}
                    placeholder="Ej. TDAH"
                    onKeyDown={(e)=>{

                        if(e.key==="Enter"){

                            guardar({

                                diagnostico:diagnostico.trim(),

                                nivel,

                                observaciones:observaciones.trim()

                            });

                        }

                    }}
                    autoFocus
                />

                <label>Nivel</label>

                <select
                    value={nivel}
                    onChange={(e)=>setNivel(e.target.value)}
                >

                    <option>Leve</option>

                    <option>Moderado</option>

                    <option>Severo</option>

                </select>

                <label>Observaciones</label>

                <textarea
                    rows={4}
                    value={observaciones}
                    onChange={(e)=>setObservaciones(e.target.value)}
                    placeholder="Observaciones..."
                />

                <div className="modal-botones">

                    <button
                        className="btn-cancelar"
                        onClick={cerrar}
                    >

                        Cancelar

                    </button>

                    <button

                        type="button"

                        className="btn-guardar"

                        onClick={()=>{

                            if(!diagnostico.trim()) return;

                            guardar({

                                diagnostico:diagnostico.trim(),

                                nivel,

                                observaciones:observaciones.trim()

                            });

                        }}

                    >

                        {

                            nee

                            ?

                            "Actualizar"

                            :

                            "Guardar"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}
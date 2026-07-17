import { useState, useEffect } from "react";
import "../Styles/ModalNEE.css";

export default function ModalNEE({
    abierto,
    cerrar,
    guardar,
    neeActual
}) {

    const [diagnostico, setDiagnostico] = useState("");
    const [nivel, setNivel] = useState("Leve");
    const [observaciones, setObservaciones] = useState("");

    useEffect(() => {

        if (neeActual) {

            setDiagnostico(neeActual.diagnostico || "");
            setNivel(neeActual.nivel || "Leve");
            setObservaciones(neeActual.observaciones || "");

        } else {

            setDiagnostico("");
            setNivel("Leve");
            setObservaciones("");

        }

    }, [neeActual, abierto]);

    if (!abierto) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-nee">

                <h2>

                    Necesidad Educativa Especial

                </h2>

                <label>Diagnóstico</label>

                <input
                    value={diagnostico}
                    onChange={(e)=>setDiagnostico(e.target.value)}
                    placeholder="Ej. TDAH"
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
                        className="btn-guardar"
                        onClick={()=>guardar({
                            diagnostico,
                            nivel,
                            observaciones
                        })}
                    >

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}
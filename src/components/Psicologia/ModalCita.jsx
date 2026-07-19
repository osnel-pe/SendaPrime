import "../../Styles/ModalCita.css";

import { useState, useEffect } from "react";

export default function ModalCita({

    abierto,

    cerrar,

    guardar,

    citaActual

}) {

    const [vista, setVista] = useState({

        fecha: "",

        tipo: "Seguimiento",

        motivo: "",

        intervencion: "",

        acuerdos: ""

    });

    useEffect(() => {

        if (!abierto) return;

        if (citaActual) {

            setVista({

                fecha: citaActual.fecha || "",

                tipo: citaActual.tipo || "Seguimiento",

                motivo: citaActual.motivo || "",

                intervencion: citaActual.intervencion || "",

                acuerdos: citaActual.acuerdos || ""

            });

        } else {

            setVista({

                fecha: new Date()
                    .toISOString()
                    .split("T")[0],

                tipo: "Seguimiento",

                motivo: "",

                intervencion: "",

                acuerdos: ""

            });

        }

    }, [citaActual, abierto]);

    if (!abierto) return null;

    return (

        <div className="modal-opciones">

            <div className="modal-contenido modal-cita">

                <h2>

                    Seguimiento

                </h2>

                <input

                    type="date"

                    value={vista.fecha}

                    onChange={(e) => setVista({

                        ...vista,

                        fecha: e.target.value

                    })}

                />

                <select

                    value={vista.tipo}

                    onChange={(e) => setVista({

                        ...vista,

                        tipo: e.target.value

                    })}

                >

                    <option value="Entrevista inicial">

                        Entrevista inicial

                    </option>

                    <option value="Seguimiento">

                        Seguimiento

                    </option>

                    <option value="Intervención individual">

                        Intervención individual

                    </option>

                    <option value="Intervención grupal">

                        Intervención grupal

                    </option>

                    <option value="Orientación familiar">

                        Orientación familiar

                    </option>

                    <option value="Orientación docente">

                        Orientación docente

                    </option>

                    <option value="Cierre">

                        Cierre

                    </option>

                    <option value="Otro">

                        Otro

                    </option>

                </select>

                <label className="campo-label">

                    Motivo:

                </label>

                <textarea

                    rows={1}

                    value={vista.motivo}

                    onChange={(e) => setVista({

                        ...vista,

                        motivo: e.target.value

                    })}

                />

                <label className="campo-label">

                    Intervención realizada:

                </label>

                <textarea

                    rows={5}

                    value={vista.intervencion}

                    onChange={(e) => setVista({

                        ...vista,

                        intervencion: e.target.value

                    })}

                />

                <label className="campo-label">

                    Acuerdos:

                </label>

                <textarea

                    rows={5}

                    value={vista.acuerdos}

                    onChange={(e) => setVista({

                        ...vista,

                        acuerdos: e.target.value

                    })}

                />

                <div className="modal-botones">

                    <button

                        type="button"

                        className="btn-cancelar"

                        onClick={cerrar}

                    >

                        Cancelar

                    </button>

                    <button

                        type="button"

                        className="btn-guardar"

                        onClick={() => {

                            console.log(

                                "BOTÓN GUARDAR CITA"

                            );

                            console.log(

                                "DATOS DE LA CITA:",

                                vista

                            );

                            guardar(vista);

                        }}

                    >

                        Guardar

                    </button>

                </div>

            </div>

        </div>

    );

}
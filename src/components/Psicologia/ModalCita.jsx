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

        hora: "08:00",

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

                hora: citaActual.hora || "08:00",

                tipo: citaActual.tipo || "",

                motivo: citaActual.motivo || "",

                intervencion: citaActual.intervencion || "",

                acuerdos: citaActual.acuerdos || ""

            });

        } else {

            setVista({

                fecha: new Date()

                    .toISOString()

                    .split("T")[0],

                hora: "08:00",

                tipo: "Seguimiento",

                motivo: "",

                intervencion: "",

                acuerdos: ""

            });

        }

    }, [citaActual, abierto]);

    if (!abierto) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-nee">

                <h2>

                    Seguimiento

                </h2>

                <label>

                Fecha

                </label>

                <input

                    type="date"

                    value={vista.fecha}

                    onChange={(e) => setVista({

                        ...vista,

                        fecha: e.target.value

                    })}

                />

                <label>

                Hora

                </label>

                <input

                    type="time"

                    value={vista.hora}

                    onChange={(e)=>

                        setVista({

                            ...vista,

                            hora:e.target.value

                        })

                    }

                />

                <label>

                Tipo de seguimiento

                </label>

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

                <label>

                    Motivo:

                </label>

                <textarea

                    rows={3}

                    value={vista.motivo}

                    onChange={(e) => setVista({

                        ...vista,

                        motivo: e.target.value

                    })}

                />

                <label>

                    Intervención realizada:

                </label>

                <textarea

                    rows={6}

                    value={vista.intervencion}

                    onChange={(e) => setVista({

                        ...vista,

                        intervencion: e.target.value

                    })}

                />

                <label>

                    Acuerdos:

                </label>

                <textarea

                    rows={6}

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
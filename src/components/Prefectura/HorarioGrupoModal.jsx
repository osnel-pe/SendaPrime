import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    BookOpen,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    GraduationCap,
    RotateCcw,
    X
} from "lucide-react";

import { createPortal } from "react-dom";

import "../../Styles/HorarioGrupoModal.css";


const GRUPOS = [
    "1ro A",
    "1ro B",
    "1ro C",
    "2do A",
    "2do B",
    "2do C",
    "3ro A",
    "3ro B"
];


const BLOQUES = [
    "07:00-07:50",
    "07:50-08:40",
    "08:40-09:30",
    "09:30-10:20",
    "10:20-10:50",
    "10:50-11:40",
    "11:40-12:30",
    "12:30-13:20",
    "13:20-14:10"
];


const HORARIOS = {

    "1ro A": {

        lunes: [
            "Artes",
            "Artes",
            "Matemáticas",
            "Matemáticas",
            "Receso",
            "Inglés",
            "Inglés",
            "FCE",
            "FCE"
        ],

        martes: [
            "Deporte",
            "Español",
            "Español",
            "Inglés",
            "Receso",
            "Inglés",
            "Ed. Fe",
            "Matemáticas",
            "Matemáticas"
        ],

        miercoles: [
            "Inglés",
            "Inglés",
            "Geografía",
            "Español",
            "Receso",
            "Español",
            "Historia",
            "Historia",
            "Geografía"
        ],

        jueves: [
            "Matemáticas",
            "Matemáticas",
            "Biología",
            "Inglés",
            "Receso",
            "Inglés",
            "Inglés",
            "Tecnología",
            "Tecnología"
        ],

        viernes: [
            "Español",
            "Español",
            "Geografía",
            "Inglés",
            "Receso",
            "Inglés",
            "Inglés",
            "Biología",
            "Biología"
        ]

    },


    "1ro B": {

        lunes: [
            "Matemáticas",
            "Matemáticas",
            "Artes",
            "Artes",
            "Receso",
            "Biología",
            "Ed. Fe",
            "Inglés",
            "Inglés"
        ],

        martes: [
            "Inglés",
            "Inglés",
            "Inglés",
            "Geografía",
            "Receso",
            "Matemáticas",
            "Matemáticas",
            "Tecnología",
            "Tecnología"
        ],

        miercoles: [
            "Deporte",
            "Español",
            "Español",
            "Geografía",
            "Receso",
            "FCE",
            "FCE",
            "Inglés",
            "Inglés"
        ],

        jueves: [
            "Inglés",
            "Inglés",
            "Inglés",
            "Español",
            "Receso",
            "Español",
            "Geografía",
            "Historia",
            "Historia"
        ],

        viernes: [
            "Matemáticas",
            "Matemáticas",
            "Español",
            "Español",
            "Receso",
            "Biología",
            "Biología",
            "Inglés",
            "Inglés"
        ]

    },


    "1ro C": {

        lunes: [
            "Biología",
            "Inglés",
            "Inglés",
            "Inglés",
            "Receso",
            "Artes",
            "Artes",
            "Ed. Fe",
            "Geografía"
        ],

        martes: [
            "Matemáticas",
            "Matemáticas",
            "Geografía",
            "Español",
            "Receso",
            "Español",
            "Inglés",
            "Inglés",
            "Inglés"
        ],

        miercoles: [
            "Matemáticas",
            "Matemáticas",
            "Inglés",
            "Inglés",
            "Receso",
            "Tecnología",
            "Tecnología",
            "FCE",
            "FCE"
        ],

        jueves: [
            "Deporte",
            "Español",
            "Español",
            "Geografía",
            "Receso",
            "Matemáticas",
            "Matemáticas",
            "Inglés",
            "Inglés"
        ],

        viernes: [
            "Inglés",
            "Inglés",
            "Biología",
            "Biología",
            "Receso",
            "Español",
            "Español",
            "Historia",
            "Historia"
        ]

    },


    "2do A": {

        lunes: [
            "Historia",
            "Historia",
            "Español",
            "Español",
            "Receso",
            "Matemáticas",
            "Matemáticas",
            "Inglés",
            "Inglés"
        ],

        martes: [
            "Artes",
            "Artes",
            "Física",
            "Física",
            "Receso",
            "Inglés",
            "Inglés",
            "FCE",
            "FCE"
        ],

        miercoles: [
            "Inglés",
            "Inglés",
            "Física",
            "Física",
            "Receso",
            "Matemáticas",
            "Matemáticas",
            "Español",
            "Español"
        ],

        jueves: [
            "Español",
            "Español",
            "Ed. Fe",
            "Física",
            "Receso",
            "Física",
            "Inglés",
            "Inglés",
            "Inglés"
        ],

        viernes: [
            "Deporte",
            "Inglés",
            "Inglés",
            "Inglés",
            "Receso",
            "Tecnología",
            "Tecnología",
            "Matemáticas",
            "Matemáticas"
        ]

    },


    "2do B": {

        lunes: [
            "Inglés",
            "Inglés",
            "Inglés",
            "Física",
            "Receso",
            "Español",
            "Español",
            "Matemáticas",
            "Matemáticas"
        ],

        martes: [
            "Física",
            "Física",
            "Artes",
            "Artes",
            "Receso",
            "Tecnología",
            "Tecnología",
            "Inglés",
            "Inglés"
        ],

        miercoles: [
            "Ed. Fe",
            "Física",
            "Inglés",
            "Inglés",
            "Receso",
            "Inglés",
            "Deporte",
            "Matemáticas",
            "Matemáticas"
        ],

        jueves: [
            "Física",
            "Física",
            "Inglés",
            "Inglés",
            "Receso",
            "Español",
            "Español",
            "Matemáticas",
            "Matemáticas"
        ],

        viernes: [
            "FCE",
            "FCE",
            "Español",
            "Español",
            "Receso",
            "Historia",
            "Historia",
            "Inglés",
            "Inglés"
        ]

    },


    "2do C": {

        lunes: [
            "Deporte",
            "Física",
            "Física",
            "Inglés",
            "Receso",
            "Inglés",
            "Inglés",
            "Español",
            "Español"
        ],

        martes: [
            "Inglés",
            "Inglés",
            "Matemáticas",
            "Matemáticas",
            "Receso",
            "Artes",
            "Artes",
            "Español",
            "Español"
        ],

        miercoles: [
            "Física",
            "Ed. Fe",
            "Matemáticas",
            "Matemáticas",
            "Receso",
            "Física",
            "Inglés",
            "Inglés",
            "Inglés"
        ],

        jueves: [
            "Inglés",
            "Inglés",
            "Español",
            "Español",
            "Receso",
            "Historia",
            "Historia",
            "FCE",
            "FCE"
        ],

        viernes: [
            "Física",
            "Física",
            "Matemáticas",
            "Matemáticas",
            "Receso",
            "Inglés",
            "Inglés",
            "Tecnología",
            "Tecnología"
        ]

    },


    "3ro A": {

        lunes: [
            "Química",
            "Química",
            "History",
            "Inglés",
            "Receso",
            "Inglés",
            "Tecnología",
            "Tecnología",
            "Ed. Fe"
        ],

        martes: [
            "Inglés",
            "Inglés",
            "History",
            "Español",
            "Receso",
            "Español",
            "Deporte",
            "Matemáticas",
            "Matemáticas"
        ],

        miercoles: [
            "Química",
            "Química",
            "Matemáticas",
            "Matemáticas",
            "Receso",
            "Español",
            "Español",
            "Inglés",
            "Inglés"
        ],

        jueves: [
            "Artes",
            "Artes",
            "Química",
            "Inglés",
            "Receso",
            "Inglés",
            "Inglés",
            "Matemáticas",
            "Matemáticas"
        ],

        viernes: [
            "Español",
            "Español",
            "Química",
            "FCE",
            "Receso",
            "FCE",
            "Inglés",
            "Inglés",
            "Inglés"
        ]

    },


    "3ro B": {

        lunes: [
            "Español",
            "Español",
            "Química",
            "Tecnología",
            "Receso",
            "Tecnología",
            "Inglés",
            "Inglés",
            "Inglés"
        ],

        martes: [
            "Química",
            "Ed. Fe",
            "Química",
            "Matemáticas",
            "Receso",
            "Matemáticas",
            "History",
            "Inglés",
            "Inglés"
        ],

        miercoles: [
            "FCE",
            "FCE",
            "Química",
            "History",
            "Receso",
            "Inglés",
            "Inglés",
            "Matemáticas",
            "Matemáticas"
        ],

        jueves: [
            "Inglés",
            "Inglés",
            "Artes",
            "Artes",
            "Receso",
            "Matemáticas",
            "Matemáticas",
            "Español",
            "Español"
        ],

        viernes: [
            "Química",
            "Química",
            "Inglés",
            "Inglés",
            "Receso",
            "Inglés",
            "Deporte",
            "Español",
            "Español"
        ]

    }

};


function normalizarFecha(
    fecha
) {

    return new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );

}


function moverDiaEscolar(
    fecha,
    cantidad
) {

    const nueva =
        normalizarFecha(
            fecha
        );


    do {

        nueva.setDate(
            nueva.getDate()
            +
            cantidad
        );

    }
    while (
        nueva.getDay() === 0
        ||
        nueva.getDay() === 6
    );


    return nueva;

}


function obtenerClaveDia(
    fecha
) {

    const dias = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"
    ];


    return dias[
        fecha.getDay()
    ];

}


function esMismaFecha(
    a,
    b
) {

    return (
        a.getFullYear()
        ===
        b.getFullYear()
        &&
        a.getMonth()
        ===
        b.getMonth()
        &&
        a.getDate()
        ===
        b.getDate()
    );

}


function obtenerFechaEscolarInicial() {

    const hoy =
        normalizarFecha(
            new Date()
        );


    if (
        hoy.getDay() === 6
    ) {

        hoy.setDate(
            hoy.getDate() - 1
        );

    }


    if (
        hoy.getDay() === 0
    ) {

        hoy.setDate(
            hoy.getDate() + 1
        );

    }


    return hoy;

}


export default function HorarioGrupoModal({

    cerrar

}) {

    const [
        grupo,
        setGrupo
    ] = useState("1ro A");


    const [
        fecha,
        setFecha
    ] = useState(
        obtenerFechaEscolarInicial
    );


    useEffect(
        () => {

            function manejarEscape(
                e
            ) {

                if (
                    e.key
                    === "Escape"
                ) {

                    cerrar();

                }

            }


            window.addEventListener(
                "keydown",
                manejarEscape
            );


            const overflowAnterior =
                document.body.style.overflow;


            document.body.style.overflow =
                "hidden";


            return () => {

                window.removeEventListener(
                    "keydown",
                    manejarEscape
                );

                document.body.style.overflow =
                    overflowAnterior;

            };

        },
        [cerrar]
    );


    const claveDia =
        obtenerClaveDia(
            fecha
        );


    const horario =
        useMemo(
            () =>
                HORARIOS[
                    grupo
                ]?.[
                    claveDia
                ]
                || [],
            [
                grupo,
                claveDia
            ]
        );


    const hoy =
        normalizarFecha(
            new Date()
        );


    const esHoy =
        esMismaFecha(
            fecha,
            hoy
        );


    const fechaTexto =
        fecha.toLocaleDateString(
            "es-MX",
            {
                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"
            }
        );


    function irAnterior() {

        setFecha(
            actual =>
                moverDiaEscolar(
                    actual,
                    -1
                )
        );

    }


    function irSiguiente() {

        setFecha(
            actual =>
                moverDiaEscolar(
                    actual,
                    1
                )
        );

    }


    function irHoy() {

        setFecha(
            obtenerFechaEscolarInicial()
        );

    }


    return createPortal(

        <div

            className="hgm-overlay"

            onMouseDown={
                e => {

                    if (
                        e.target
                        ===
                        e.currentTarget
                    ) {

                        cerrar();

                    }

                }
            }

        >

            <section

                className="hgm-modal"

                role="dialog"

                aria-modal="true"

                aria-label="Horario del grupo"

            >

                <div className="hgm-cabecera">

                    <div className="hgm-cabecera-icono">

                        <CalendarDays
                            size={23}
                        />

                    </div>


                    <div className="hgm-cabecera-texto">

                        <span>
                            Horario escolar
                        </span>

                        <h2>
                            Horario del grupo
                        </h2>

                    </div>


                    <button

                        type="button"

                        className="hgm-cerrar"

                        onClick={
                            cerrar
                        }

                        aria-label="Cerrar horario"

                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                <div className="hgm-controles">

                    <div className="hgm-selector-grupo">

                        <GraduationCap
                            size={17}
                        />

                        <select

                            value={
                                grupo
                            }

                            onChange={
                                e =>
                                    setGrupo(
                                        e.target.value
                                    )
                            }

                        >

                            {
                                GRUPOS.map(
                                    item => (

                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>

                                    )
                                )
                            }

                        </select>

                    </div>


                    <div className="hgm-navegacion-fecha">

                        <button

                            type="button"

                            onClick={
                                irAnterior
                            }

                            aria-label="Día escolar anterior"

                        >

                            <ChevronLeft
                                size={20}
                            />

                        </button>


                        <div className="hgm-fecha-centro">

                            <strong>
                                {
                                    fechaTexto
                                }
                            </strong>

                            <span>
                                {
                                    grupo
                                }
                            </span>

                        </div>


                        <button

                            type="button"

                            onClick={
                                irSiguiente
                            }

                            aria-label="Día escolar siguiente"

                        >

                            <ChevronRight
                                size={20}
                            />

                        </button>

                    </div>


                    <button

                        type="button"

                        className={
                            esHoy
                            ?
                            "hgm-hoy activo"
                            :
                            "hgm-hoy"
                        }

                        onClick={
                            irHoy
                        }

                    >

                        <RotateCcw
                            size={15}
                        />

                        Hoy

                    </button>

                </div>


                <div className="hgm-dia-pildoras">

                    {
                        [
                            ["lunes", "L"],
                            ["martes", "M"],
                            ["miercoles", "X"],
                            ["jueves", "J"],
                            ["viernes", "V"]
                        ]
                            .map(
                                ([
                                    clave,
                                    letra
                                ]) => {

                                    const fechaObjetivo =
                                        new Date(
                                            fecha
                                        );


                                    const objetivoNumero = {
                                        lunes: 1,
                                        martes: 2,
                                        miercoles: 3,
                                        jueves: 4,
                                        viernes: 5
                                    }[
                                        clave
                                    ];


                                    fechaObjetivo.setDate(
                                        fechaObjetivo.getDate()
                                        +
                                        (
                                            objetivoNumero
                                            -
                                            fechaObjetivo.getDay()
                                        )
                                    );


                                    return (

                                        <button

                                            key={clave}

                                            type="button"

                                            className={
                                                claveDia
                                                === clave
                                                ?
                                                "activo"
                                                :
                                                ""
                                            }

                                            onClick={() =>
                                                setFecha(
                                                    normalizarFecha(
                                                        fechaObjetivo
                                                    )
                                                )
                                            }

                                        >

                                            {letra}

                                        </button>

                                    );

                                }
                            )
                    }

                </div>


                <div className="hgm-resumen-dia">

                    <BookOpen
                        size={17}
                    />

                    <div>

                        <strong>
                            {
                                horario.filter(
                                    materia =>
                                        materia
                                        !== "Receso"
                                ).length
                            } bloques académicos
                        </strong>

                        <span>
                            {
                                grupo
                            }
                            {" · "}
                            {
                                fecha.toLocaleDateString(
                                    "es-MX",
                                    {
                                        weekday:
                                            "long"
                                    }
                                )
                            }
                        </span>

                    </div>

                </div>


                <div className="hgm-horario">

                    {
                        horario.map(
                            (
                                materia,
                                indice
                            ) => {

                                const esReceso =
                                    materia
                                    === "Receso";


                                return (

                                    <div

                                        key={
                                            `${BLOQUES[indice]}-${materia}`
                                        }

                                        className={
                                            esReceso
                                            ?
                                            "hgm-bloque recreo"
                                            :
                                            "hgm-bloque"
                                        }

                                    >

                                        <div className="hgm-hora">

                                            <Clock3
                                                size={14}
                                            />

                                            <span>
                                                {
                                                    BLOQUES[
                                                        indice
                                                    ]
                                                }
                                            </span>

                                        </div>


                                        <div className="hgm-linea">

                                            <span />

                                        </div>


                                        <div className="hgm-materia">

                                            {
                                                esReceso
                                                ?
                                                <>
                                                    <strong>
                                                        Receso
                                                    </strong>

                                                    <small>
                                                        Pausa escolar
                                                    </small>
                                                </>
                                                :
                                                <>
                                                    <strong>
                                                        {materia}
                                                    </strong>

                                                    <small>
                                                        Clase
                                                    </small>
                                                </>
                                            }

                                        </div>

                                    </div>

                                );

                            }
                        )
                    }

                </div>

            </section>

        </div>,

        document.body

    );

}

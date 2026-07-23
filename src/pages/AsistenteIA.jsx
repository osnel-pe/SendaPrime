import {
    ArrowLeft,
    Send,
    Plus
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import "../Styles/AppLayout.css";
import "../Styles/Psicologia.css";
import "../Styles/AsistenteIA.css";

import {
    preguntarANeuri
} from "../ai/neuriService";

import fondoPsicologia
    from "../assets/fondo-psicologia.jpg";

import neuriCerebro
    from "../assets/neuri-cerebro.png";


export default function AsistenteIA({

    cambiarPantalla

}) {

    const inputRef =
        useRef(null);

    const mensajesRef =
        useRef(null);


    const [

        mensaje,

        setMensaje

    ] = useState("");


    const [

        pensando,

        setPensando

    ] = useState(false);


    /*
     * ID ÚNICO DE LA CONVERSACIÓN
     *
     * Se mantiene mientras el chat
     * permanezca abierto.
     */

    const [

        chatId

    ] = useState(

        () =>

            crypto.randomUUID()

    );


    const [

        mensajes,

        setMensajes

    ] = useState([

        {

            id: crypto.randomUUID(),

            tipo: "ia",

            texto:
                "Hola. ¿En qué puedo ayudarte?"

        }

    ]);


    /*
     * AJUSTE PARA TECLADO MÓVIL
     */

    useEffect(() => {

        const viewport =
            window.visualViewport;

        if (!viewport) {

            return;

        }


        const ajustarPantalla = () => {

            const diferencia =

                window.innerHeight -

                viewport.height;


            document.documentElement.style
                .setProperty(

                    "--teclado-altura",

                    `${diferencia}px`

                );

        };


        viewport.addEventListener(

            "resize",

            ajustarPantalla

        );


        viewport.addEventListener(

            "scroll",

            ajustarPantalla

        );


        ajustarPantalla();


        return () => {

            viewport.removeEventListener(

                "resize",

                ajustarPantalla

            );


            viewport.removeEventListener(

                "scroll",

                ajustarPantalla

            );

        };

    }, []);


    /*
     * MANTENER EL CHAT EN LA RESPUESTA
     *
     * Cuando llega una nueva respuesta,
     * mostramos el inicio de esa respuesta.
     */

    useEffect(() => {

        if (

            mensajes.length <= 1

        ) {

            return;

        }


        const ultimoMensaje =

            mensajes[

                mensajes.length - 1

            ];


        const elemento =

            document.getElementById(

                `mensaje-${ultimoMensaje.id}`

            );


        if (elemento) {

            elemento.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    }, [mensajes]);


    /*
     * ENVIAR MENSAJE
     */

    const enviarMensaje = async () => {

        const textoUsuario =

            mensaje.trim();


        if (

            !textoUsuario ||

            pensando

        ) {

            return;

        }


        const idUsuario =

            crypto.randomUUID();


        setMensaje("");


        setPensando(true);


        setMensajes(

            anterior => [

                ...anterior,

                {

                    id: idUsuario,

                    tipo: "usuario",

                    texto: textoUsuario

                }

            ]

        );


        try {


            /*
             * ENVIAMOS EL chatId
             *
             * Esto permite que Neuri
             * recuerde el alumno actual.
             */

            const respuestaNeuri =

                await preguntarANeuri({

                    mensaje:

                        textoUsuario,

                    chatId

                });


            const textoRespuesta =

                typeof respuestaNeuri === "string"

                    ? respuestaNeuri

                    : JSON.stringify(

                        respuestaNeuri

                    );


            setMensajes(

                anterior => [

                    ...anterior,

                    {

                        id:

                            crypto.randomUUID(),

                        tipo: "ia",

                        texto:

                            textoRespuesta

                    }

                ]

            );

        }

        catch (error) {

            console.error(

                "ERROR COMPLETO DE NEURI:",

                error

            );


            const mensajeError =

                error instanceof Error

                    ? error.message

                    : "No fue posible conectar con Neuri.";


            setMensajes(

                anterior => [

                    ...anterior,

                    {

                        id:

                            crypto.randomUUID(),

                        tipo: "ia",

                        texto:

                            mensajeError

                    }

                ]

            );

        }

        finally {

            setPensando(false);

        }

    };


    /*
     * ENTER PARA ENVIAR
     */

    const manejarTecla = (e) => {

        if (

            e.key === "Enter" &&

            !e.shiftKey

        ) {

            e.preventDefault();

            enviarMensaje();

        }

    };


    /*
     * RENDERIZAR TEXTO
     *
     * Evitamos errores si el texto
     * no llega como string.
     */

    const renderizarTexto = (texto) => {

        const textoSeguro =

            typeof texto === "string"

                ? texto

                : String(texto ?? "");


        return textoSeguro

            .split("\n")

            .map(

                (linea, indice) => (

                    <span

                        key={indice}

                    >

                        {linea}

                        <br />

                    </span>

                )

            );

    };


    return (

        <>

            <div

                className="app-background"

                style={{

                    backgroundImage:

                        `url(${fondoPsicologia})`

                }}

            />


            <div className="ps-app">


                <div

                    className=

                        "ps-container asistente-container"

                >


                    <div className="chat-header">


                        <button

                            className=

                                "chat-back-btn"

                            onClick={() =>

                                cambiarPantalla(

                                    "psicologia"

                                )

                            }

                        >

                            <ArrowLeft

                                size={22}

                            />

                        </button>


                        <div

                            className=

                                "chat-header-info"

                        >


                            <div

                                className=

                                    "chat-avatar"

                            >

                                <img

                                    src={

                                        neuriCerebro

                                    }

                                    alt="Neuri"

                                />

                            </div>


                            <div>


                                <h1>

                                    Neuri

                                </h1>


                                <p>

                                    Asistente de Psicología

                                </p>

                            </div>

                        </div>


                        <div

                            className=

                                "neuri-online"

                        >

                            <span></span>

                            En línea

                        </div>


                    </div>


                    <div

                        className=

                            "chat-mensajes"

                        ref={mensajesRef}

                    >


                        <div

                            className=

                                "chat-bienvenida"

                        >


                            <div

                                className=

                                    "bienvenida-avatar"

                            >

                                <img

                                    src={

                                        neuriCerebro

                                    }

                                    alt="Neuri"

                                />

                            </div>


                            <h2>

                                Soy Neuri

                            </h2>


                        </div>


                        {

                            mensajes.map(

                                (m) => (

                                    <div

                                        key={m.id}

                                        id={

                                            `mensaje-${m.id}`

                                        }

                                        className={

                                            `mensaje ${

                                                m.tipo ===

                                                "usuario"

                                                    ?

                                                    "mensaje-usuario"

                                                    :

                                                    "mensaje-ia"

                                            }`

                                        }

                                    >


                                        {

                                            m.tipo ===

                                            "ia" && (

                                                <div

                                                    className=

                                                        "mensaje-avatar"

                                                >

                                                    <img

                                                        src={

                                                            neuriCerebro

                                                        }

                                                        alt="Neuri"

                                                    />

                                                </div>

                                            )

                                        }


                                        <div

                                            className=

                                                "burbuja"

                                        >

                                            {

                                                renderizarTexto(

                                                    m.texto

                                                )

                                            }

                                        </div>


                                    </div>

                                )

                            )

                        }


                        {

                            pensando && (

                                <div

                                    className=

                                        "mensaje mensaje-ia"

                                >

                                    <div

                                        className=

                                            "mensaje-avatar"

                                    >

                                        <img

                                            src={

                                                neuriCerebro

                                            }

                                            alt="Neuri"

                                        />

                                    </div>


                                    <div

                                        className=

                                            "burbuja"

                                    >

                                        Estoy pensando...

                                    </div>

                                </div>

                            )

                        }


                    </div>


                    <div

                        className=

                            "chat-input-container"

                    >


                        <button

                            className=

                                "chat-plus-btn"

                            type="button"

                        >

                            <Plus size={20} />

                        </button>


                        <input

                            ref={inputRef}

                            type="text"

                            inputMode="text"

                            enterKeyHint="send"

                            placeholder=

                                "Escribe un mensaje..."

                            value={mensaje}

                            onChange={(e) =>

                                setMensaje(

                                    e.target.value

                                )

                            }

                            onKeyDown={

                                manejarTecla

                            }

                            disabled={pensando}

                        />


                        <button

                            className=

                                "chat-send-btn"

                            onClick={

                                enviarMensaje

                            }

                            disabled={pensando}

                        >

                            <Send size={20} />

                        </button>


                    </div>


                </div>

            </div>

        </>

    );

}
import { useEffect, useState } from "react";

import neuriCerebro from "../../assets/neuri-cerebro.png";


export default function BotonIA({ abrir }) {

    const [mostrarMensaje, setMostrarMensaje] = useState(true);


    useEffect(() => {

        const temporizador = setTimeout(() => {

            setMostrarMensaje(false);

        }, 3000);


        return () => clearTimeout(temporizador);

    }, []);


    return (

        <div className="neuri-boton-wrapper">


            {

                mostrarMensaje && (

                    <div className="neuri-saludo">

                        <strong>

                            Soy Neuri

                        </strong>

                        <br />

                        ¿En qué te ayudo?


                    </div>

                )

            }


            <button

                className="neuri-boton"

                onClick={abrir}

                aria-label="Abrir asistente Neuri"

            >

                <img

                    src={neuriCerebro}

                    alt="Neuri"

                />

            </button>


        </div>

    );

}
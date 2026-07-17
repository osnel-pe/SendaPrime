import { useEffect, useState } from "react";

export default function RecibirExpediente() {

    const [archivo, setArchivo] = useState(null);

    useEffect(() => {

        async function recibirArchivo() {

            if (!("launchQueue" in window)) return;

            window.launchQueue.setConsumer(async (launchParams) => {

                if (!launchParams.files.length) return;

                const file = await launchParams.files[0].getFile();

                console.log(file);

                setArchivo(file);

            });

        }

        recibirArchivo();

    }, []);

    return (

        <div className="screen">

            <h2>Asignar expediente</h2>

            {

                archivo ?

                <p>

                    Archivo recibido:

                    <br/>

                    <b>{archivo.name}</b>

                </p>

                :

                <p>

                    Esperando expediente...

                </p>

            }

        </div>

    );

}
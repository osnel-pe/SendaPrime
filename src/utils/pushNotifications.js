import { supabase }
from "../services/supabase";


function convertirVapidKey(
    base64String
) {

    const padding =
        "=".repeat(
            (
                4
                -
                base64String.length % 4
            )
            % 4
        );


    const base64 =
        (
            base64String
            + padding
        )

            .replace(
                /-/g,
                "+"
            )

            .replace(
                /_/g,
                "/"
            );


    const rawData =
        window.atob(
            base64
        );


    return Uint8Array.from(

        [...rawData].map(
            caracter =>
                caracter.charCodeAt(0)
        )

    );

}


export async function activarPushPrefectura() {

    if (
        !(
            "serviceWorker"
            in navigator
        )
        ||
        !(
            "PushManager"
            in window
        )
    ) {

        throw new Error(
            "Este dispositivo no admite notificaciones push."
        );

    }


    const permiso =
        await Notification
            .requestPermission();


    if (
        permiso !== "granted"
    ) {

        throw new Error(
            "No se concedió permiso para las notificaciones."
        );

    }


    const registro =
        await navigator
            .serviceWorker
            .ready;


    let suscripcion =
        await registro
            .pushManager
            .getSubscription();


    if (!suscripcion) {

        const publicKey =
            import.meta.env
                .VITE_VAPID_PUBLIC_KEY;


        if (!publicKey) {

            throw new Error(
                "No existe VITE_VAPID_PUBLIC_KEY."
            );

        }


        suscripcion =
            await registro
                .pushManager
                .subscribe({

                    userVisibleOnly:
                        true,

                    applicationServerKey:
                        convertirVapidKey(
                            publicKey
                        )

                });

    }


    const json =
        suscripcion.toJSON();


    const {
        error
    } = await supabase

        .from(
            "push_subscriptions"
        )

        .upsert({

            endpoint:
                json.endpoint,

            p256dh:
                json.keys?.p256dh,

            auth:
                json.keys?.auth,

            usuario_tipo:
                "prefectura"

        }, {

            onConflict:
                "endpoint"

        });


    if (error) {

        throw error;

    }


    return true;

}
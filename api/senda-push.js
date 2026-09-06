import webpush from "web-push";

import { createClient }
from "@supabase/supabase-js";


webpush.setVapidDetails(

    process.env.VAPID_SUBJECT,

    process.env.VAPID_PUBLIC_KEY,

    process.env.VAPID_PRIVATE_KEY

);


const supabase = createClient(

    process.env.SUPABASE_URL,

    process.env.SUPABASE_SERVICE_ROLE_KEY

);


export async function POST(request) {

    try {

        const body =
            await request.json();


        const titulo =
            body.title
            || "SendaPrime";


        const mensaje =
            body.body
            || "Tienes una nueva alerta de Prefectura.";


        const url =
            body.url
            || "/";


        const {
            data: suscripciones,
            error
        } = await supabase

            .from("push_subscriptions")

            .select("*")

            .eq(
                "usuario_tipo",
                "prefectura"
            );


        if (error) {

            console.error(error);

            return Response.json(
                {
                    ok: false,
                    error: error.message
                },
                {
                    status: 500
                }
            );

        }


        let enviados = 0;


        for (
            const registro
            of suscripciones || []
        ) {

            const subscription = {

                endpoint:
                    registro.endpoint,

                keys: {

                    p256dh:
                        registro.p256dh,

                    auth:
                        registro.auth

                }

            };


            try {

                await webpush.sendNotification(

                    subscription,

                    JSON.stringify({

                        title:
                            titulo,

                        body:
                            mensaje,

                        url

                    })

                );


                enviados++;

            }

            catch (errorPush) {

                console.error(
                    "Error enviando push:",
                    errorPush
                );


                /*
                La suscripción dejó de existir
                en el teléfono.
                */

                if (
                    errorPush.statusCode === 404
                    ||
                    errorPush.statusCode === 410
                ) {

                    await supabase

                        .from(
                            "push_subscriptions"
                        )

                        .delete()

                        .eq(
                            "id",
                            registro.id
                        );

                }

            }

        }


        return Response.json({

            ok: true,

            enviados

        });

    }

    catch (error) {

        console.error(error);

        return Response.json(
            {
                ok: false,
                error:
                    error.message
            },
            {
                status: 500
            }
        );

    }

}
/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

self.skipWaiting();
clientsClaim();

// Archivos generados por Vite
precacheAndRoute(self.__WB_MANIFEST);

// Escuchar cuando Android comparte un archivo
self.addEventListener("fetch", (event) => {

    const request = event.request;

    if (
        request.method === "POST" &&
        new URL(request.url).pathname === "/share"
    ) {

        event.respondWith(handleShare(event));

    }

});

async function handleShare(event) {

    const formData = await event.request.formData();

    const archivo = formData.get("pdf");
    
    console.log("Enviando archivo a React...");

    console.log("SW recibió:");

    console.log(archivo);

    if (archivo) {

    const cliente = await self.clients.openWindow("/");

    if (cliente) {

        setTimeout(() => {

            cliente.postMessage({

                type: "SHARED_PDF",

                file: archivo

            });

        }, 800);

    }

}

    return Response.redirect("/", 303);

}

/*==================================================
PUSH NOTIFICATIONS
==================================================*/

self.addEventListener(
    "push",
    event => {

        let datos = {};

        try {

            datos =
                event.data
                    ? event.data.json()
                    : {};

        }

        catch {

            datos = {
                title: "SendaPrime",
                body: "Tienes una nueva notificación."
            };

        }


        const titulo =
            datos.title
            || "SendaPrime";


        const opciones = {

            body:
                datos.body
                || "Nueva alerta de Prefectura.",

            icon:
                "/icon-192.png",

            badge:
                "/icon-192.png",

            data: {

                url:
                    datos.url
                    || "/"

            },

            tag:
                datos.tag
                || "senda-prefectura",

            renotify:
                true

        };


        event.waitUntil(

            self.registration
                .showNotification(
                    titulo,
                    opciones
                )

        );

    }
);


/*==================================================
AL TOCAR LA NOTIFICACIÓN
==================================================*/

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();


        const url =
            event.notification
                ?.data
                ?.url
            || "/";


        event.waitUntil(

            clients.matchAll({

                type: "window",

                includeUncontrolled:
                    true

            })
            .then(
                ventanas => {

                    for (
                        const ventana
                        of ventanas
                    ) {

                        if (
                            "focus"
                            in ventana
                        ) {

                            ventana.navigate(
                                url
                            );

                            return ventana.focus();

                        }

                    }


                    return clients.openWindow(
                        url
                    );

                }
            )

        );

    }
);

/*==================================================
PUSH
==================================================*/

self.addEventListener(
    "push",
    event => {

        let datos = {};

        try {

            datos =
                event.data
                    ? event.data.json()
                    : {};

        }

        catch {

            datos = {};

        }


        const titulo =
            datos.title
            || "SendaPrime";


        event.waitUntil(

            self.registration
                .showNotification(

                    titulo,

                    {

                        body:
                            datos.body
                            || "Nueva alerta de Prefectura.",

                        icon:
                            "/icon-192.png",

                        badge:
                            "/icon-192.png",

                        data: {

                            url:
                                datos.url
                                || "/"

                        },

                        tag:
                            datos.tag
                            || `senda-${Date.now()}`

                    }

                )

        );

    }
);


/*==================================================
TOCAR NOTIFICACIÓN
==================================================*/

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();


        const destino =
            event.notification
                ?.data
                ?.url
            || "/";


        event.waitUntil(

            self.clients
                .matchAll({

                    type:
                        "window",

                    includeUncontrolled:
                        true

                })
                .then(
                    ventanas => {

                        if (
                            ventanas.length
                            > 0
                        ) {

                            const ventana =
                                ventanas[0];


                            ventana.navigate(
                                destino
                            );


                            return ventana.focus();

                        }


                        return self.clients
                            .openWindow(
                                destino
                            );

                    }
                )

        );

    }
);
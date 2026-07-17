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

    if (archivo) {

        const clientList = await self.clients.matchAll({

            type: "window",
            includeUncontrolled: true

        });

        for (const client of clientList) {

            client.postMessage({

                type: "SHARED_PDF",

                file: archivo

            });

            client.focus();

        }

    }

    return Response.redirect("/", 303);

}
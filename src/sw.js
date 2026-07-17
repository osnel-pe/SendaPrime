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
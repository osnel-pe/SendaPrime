import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

  plugins: [

    react(),

    VitePWA({

      registerType: "autoUpdate",

      includeAssets: [

        "favicon.ico",

        "apple-touch-icon.png"

      ],

      manifest: {

        name: "SendaPrime",

        short_name: "SendaPrime",

        description: "Aplicación escolar",

        theme_color: "#1F6B3A",

        background_color: "#ffffff",

        display: "standalone",

        orientation: "portrait",

        start_url: "/",
        share_target: {
          action: "/share",
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            files: [
              {
                name: "pdf",
                accept: ["application/pdf"]
              }
            ]
          }
        },

        icons: [

          {

            src: "icon-192.png",

            sizes: "192x192",

            type: "image/png"

          },

          {

            src: "icon-512.png",

            sizes: "512x512",

            type: "image/png"

          },

          {

            src: "maskable-icon-512.png",

            sizes: "512x512",

            type: "image/png",

            purpose: "maskable"

          }

        ]

      }

    })

  ]

});
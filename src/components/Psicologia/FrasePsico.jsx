import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { supabase } from "../../services/supabase";

import Neuri from "./Neuri";


export default function FrasePsico() {

    const [frase, setFrase] = useState("");

    useEffect(() => {

        const cargarFraseDelDia = async () => {

            // Fecha desde la que empieza el ciclo
            const fechaInicio = new Date("2026-07-20T00:00:00");

            const hoy = new Date();

            // Comparar únicamente las fechas
            fechaInicio.setHours(0, 0, 0, 0);

            hoy.setHours(0, 0, 0, 0);

            // Diferencia entre ambas fechas
            const diferencia = hoy - fechaInicio;

            const diasTranscurridos = Math.floor(

                diferencia /

                (1000 * 60 * 60 * 24)

            );

            // Ciclo de 100 frases
            const numeroFrase =

                (diasTranscurridos % 100) + 1;


            const { data, error } = await supabase

                .from("frases")

                .select("frase")

                .eq("No", numeroFrase)

                .single();


            if (error) {

                console.log(

                    "Error cargando frase:",

                    error

                );

                return;

            }


            setFrase(data.frase);

        };


        cargarFraseDelDia();

    }, []);


    return (

        <motion.div

            className="ps-frase"

            initial={{ opacity: 0, y: 25 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: .15 }}

        >

            <div className="ps-phrase">

                <div className="ps-frase-texto">

                    <span className="ps-comillas">

                        ❝

                    </span>

                    <p>

                        {frase || "Cargando frase..."}

                    </p>

                </div>


                <div className="ps-frase-ilustracion">

                    <Neuri />

                </div>

            </div>

        </motion.div>

    );

}
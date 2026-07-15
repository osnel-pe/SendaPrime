import { motion } from "framer-motion";

import Neuri from "./Neuri";


export default function FrasePsico() {

    return (

        <motion.div
            className="ps-frase"
            initial={{ opacity:0, y:25 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:.15 }}
        >

          <div className="ps-phrase">

          <div className="ps-frase-texto">

              <span className="ps-comillas">❝</span>

              <p>
                  Cada pequeño avance en el bienestar de un alumno es un gran paso hacia su futuro.
              </p>

          </div>

          <div className="ps-frase-ilustracion">

                 <Neuri/>

            </div>

          </div>
        </motion.div>

    );

}
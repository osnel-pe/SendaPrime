import { motion } from "framer-motion";
import "./../../Styles/HeaderPsico.css";

import logoPsico from "../../assets/logo-psico.jpg";

export default function HeaderPsico() {

    return (

        <motion.div
            className="ps-header"
            initial={{ opacity:0,y:-25 }}
            animate={{ opacity:1,y:0 }}
            transition={{ duration:.45 }}
        >

            <div className="ps-header-left">

            <div className="ps-logo">

                <img
                    src={logoPsico}
                    alt="Psicología"
                    className="ps-logo-img"
                />

            </div>

                <div>

                    <h1>

                        Psicología Escolar

                    </h1>

                </div>

            </div>

        </motion.div>

    );

}
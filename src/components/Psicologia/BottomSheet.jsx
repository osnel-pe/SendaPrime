import "../../Styles/BottomSheet.css";

import { motion, AnimatePresence } from "framer-motion";

export default function BottomSheet({

    abierto,

    cerrar,

    children

}){

    return(

        <AnimatePresence>

            {

                abierto && (

                    <>

                        <motion.div

                            className="sheet-overlay"

                            initial={{opacity:0}}

                            animate={{opacity:1}}

                            exit={{opacity:0}}

                            onClick={cerrar}

                        />

                        <motion.div

                            className="bottom-sheet"

                            initial={{y:"100%"}}

                            animate={{y:0}}

                            exit={{y:"100%"}}

                            transition={{

                                type:"spring",

                                damping:25,

                                stiffness:220

                            }}

                        >

                            <div className="sheet-bar"/>

                            {children}

                        </motion.div>

                    </>

                )

            }

        </AnimatePresence>

    );

}
import { ArrowLeft } from "lucide-react";

import "../../Styles/PageHeader.css";

export default function PageHeader({

    titulo,

    volver

}){

    return(

        <header className="page-header-ios">

            <button
                className="back-btn"
                onClick={volver}
            >

                <ArrowLeft size={24}/>

            </button>

            <h1>{titulo}</h1>

        </header>

    );

}
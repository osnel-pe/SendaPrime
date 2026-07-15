import "../../Styles/HeaderScan.css";

import { ArrowLeft, ScanLine } from "lucide-react";

export default function HeaderScan({ volver }) {

    return (

        <div className="scan-header">

            <button
                className="scan-volver"
                onClick={volver}
            >
                <ArrowLeft size={20}/>
            </button>

            <div>

                <h1>

                    Scan

                </h1>

                <p>

                    Digitalización inteligente de documentos

                </p>

            </div>

            <div className="scan-logo">

                <ScanLine size={28}/>

            </div>

        </div>

    );

}
import "../../Styles/BarraProceso.css";

export default function BarraProceso(){

    return(

        <div className="barra-proceso">

            <div className="barra-header">

                <span>

                    Estado del documento

                </span>

                <span>

                    0%

                </span>

            </div>

            <div className="barra">

                <div

                    className="barra-fill"

                    style={{width:"0%"}}

                ></div>

            </div>

            <p>

                Esperando un documento para comenzar...

            </p>

        </div>

    );

}
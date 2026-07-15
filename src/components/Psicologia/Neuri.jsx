import NeuriImg from "../../assets/neuri.png";

import "../../Styles/Neuri.css";

export default function Neuri(){

    return(

        <div className="neuri-container">

            <img

                src={NeuriImg}

                alt="Neuri"

                className="neuri"

            />

        </div>

    );

}
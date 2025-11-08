import {useState, useRef} from "react";

import "./DocImages.css";

function DocImages ({setOpenImagesFlag, setSelectedImages}){

    const done = () => {

        setOpenImagesFlag(false);

    }

    return (

        <div className = "FullScreenFloatingFlag">
            <div className = "FullFlagContainer">



                <button> Import Images </button>
                <button onClick = {()=> done()}> Close </button>

            </div>
        </div>

    );

}


export default DocImages;
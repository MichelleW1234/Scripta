import {useState} from "react";

import "./DocFontStyleChanger.css";

function DocFontStyleChanger ({typeChanging, setOpenFlag, currentDocument, setCurrentDocument, allOptions}){

    const [selectedOption, setSelectedOption] = useState(currentDocument[2][typeChanging]);

    const selectOption = (index) => {

        const hex = index.toString(16);
        setSelectedOption(String(hex));

    }

    const done = () => {

        setCurrentDocument(prev => {
            let newDoc = [...prev];

            if (typeChanging === 0) {

                newDoc[2] = selectedOption + newDoc[2][1] + newDoc[2][2] + newDoc[2][3] + newDoc[2][4];

            } else if (typeChanging === 1){

                newDoc[2] = newDoc[2][0] + selectedOption + newDoc[2][2] + newDoc[2][3] + newDoc[2][4];

            } else if (typeChanging === 2){

                newDoc[2] = newDoc[2][0] + newDoc[2][1] + selectedOption + newDoc[2][3] + newDoc[2][4];

            }

            return newDoc;
        });

        setOpenFlag(false);

    }

    return (

        <div className = "FullScreenFloatingFlag" >
            <div className="FullFlagContainer">

                <h3> Select one of the options below: </h3>
                <div className="FontStyleChangerOptionsContainer">
                    {allOptions.map((option, index) => {

                        const picked = index.toString(16) === selectedOption;

                        return (

                            picked === true ? (

                                <div className="FontStyleChangerOptionActive" key = {index}> {option} </div>

                            ) : (

                                <button className="FontStyleChangerOption" key = {index} onClick={()=> selectOption(index)}> {option} </button>


                            )

                        );

                    })}
                </div>
                <button className="FlagContainerButton" onClick = {() => done()}> Done </button>
                
            </div>
        </div>

    );

}


export default DocFontStyleChanger;
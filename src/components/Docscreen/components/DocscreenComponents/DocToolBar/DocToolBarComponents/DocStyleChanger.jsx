import {useState, useEffect, useRef} from "react";

import useKeyboardShortcut from "../../../../../hooks/useKeyboardShortcut";

import "./DocStyleChanger.css";

function DocStyleChanger ({typeChanging, setOpenFlag, currentDocument, setCurrentDocument, allOptions}){

    const [activeButton, setActiveButton] = useState(Number(currentDocument[2][typeChanging]));

    const totalButtons = allOptions.length;

    const itemRefs = useRef([]);
    const doneButtonRef = useRef(null);



    useKeyboardShortcut("ArrowLeft", (event) => {

        event.preventDefault();
        setActiveButton(prev => (prev - 1 + totalButtons) % totalButtons);

    });

    useKeyboardShortcut("ArrowRight", (event) => {
        event.preventDefault();
        setActiveButton(prev => (prev + 1) % totalButtons);
    });

    useKeyboardShortcut("Enter", () => {
        done();
        doneButtonRef.current?.focus();
    });


    useEffect(() => {

        itemRefs.current[activeButton]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });

    }, [activeButton]);



    const done = () => {

        const hex = activeButton.toString(16);

        setCurrentDocument(prev => {
            let newDoc = [...prev];

            if (typeChanging === 0) {

                newDoc[2] = String(hex) + newDoc[2][1] + newDoc[2][2] + newDoc[2][3] + newDoc[2][4];

            } else if (typeChanging === 1){

                newDoc[2] = newDoc[2][0] + String(hex) + newDoc[2][2] + newDoc[2][3] + newDoc[2][4];

            } else if (typeChanging === 2){

                newDoc[2] = newDoc[2][0] + newDoc[2][1] + String(hex) + newDoc[2][3] + newDoc[2][4];

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

                        return (

                            <button ref={(el) => (itemRefs.current[index] = el)} className={activeButton === index ? "FontStyleChangerOptionActive" : "FontStyleChangerOption"} key = {index} onClick={()=> setActiveButton(index)}> {option} </button>

                        );

                    })}
                </div>
                <button className="FlagContainerButton" ref={doneButtonRef} onClick = {() => done()}> Done </button>
                
            </div>
        </div>

    );

}


export default DocStyleChanger;
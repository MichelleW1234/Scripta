import {useState} from "react";

import DocStyleChanger from "./DocToolBarComponents/DocStyleChanger.jsx";

import "./DocToolBar.css";


function DocToolBar ({currentDocument, setCurrentDocument}){

    const allFonts = ["Pixel1", "Pixel2", "Pixel3"];
    const allColors = ["black", "red", "dark red", "orange", "dark orange", "pink", "dark pink", "yellow", "dark yellow", "green", "dark green", "blue", "dark blue", "purple", "dark purple"];
    const allPageColors = ["white", "light red", "light orange", "light pink", "light yellow", "light green", "light blue", "light purple", "black"];

    const [openFontFlag, setOpenFontFlag] = useState(false);
    const [openColorFlag, setOpenColorFlag] = useState(false);
    const [openPageColorFlag, setOpenPageColorFlag] = useState(false);

    const changeImageSize = (e) => {

        const value = e.target.value;

        setCurrentDocument((prev) => {
            let newDoc = [...prev];
            newDoc[2] = newDoc[2][0] + newDoc[2][1] + newDoc[2][2] + newDoc[2][3] + value;

            return newDoc;
        })

    }

    const changeFontSize = (e) => {

        const value = e.target.value;

        setCurrentDocument((prev) => {
            let newDoc = [...prev];
            newDoc[2] = newDoc[2][0] + newDoc[2][1]  + newDoc[2][2] + value + newDoc[2][4];

            return newDoc;
        })

    }

    

    
    return (

        <>
            {openFontFlag &&
            <DocStyleChanger
                typeChanging = {0}
                setOpenFlag = {setOpenFontFlag}
                currentDocument = {currentDocument}
                setCurrentDocument = {setCurrentDocument} 
                allOptions = {allFonts}
            />}

            {openColorFlag &&
            <DocStyleChanger
                typeChanging = {1}
                setOpenFlag = {setOpenColorFlag}
                currentDocument = {currentDocument}
                setCurrentDocument = {setCurrentDocument} 
                allOptions = {allColors}
            />}

            {openPageColorFlag &&
            <DocStyleChanger
                typeChanging = {2}
                setOpenFlag = {setOpenPageColorFlag}
                currentDocument = {currentDocument}
                setCurrentDocument = {setCurrentDocument} 
                allOptions = {allPageColors}
            />}

            <div className = "NavBarContainer">
                <div className="DocToolBarChangeContainer">
                    <div className="DocToolBarChangeBox">
                        <p> Font Type: </p>
                        <p className = {`DocToolBarOptionBox DocToolBarStyle-${currentDocument[2][0]}`}> {allFonts[currentDocument[2][0]]} </p>
                    </div>
                    <button className = "DocToolBarChangeButton" onClick={() => setOpenFontFlag(true)}> Change Style </button>
                </div>
                <div className="DocToolBarChangeContainer">
                    <div className="DocToolBarChangeBox">
                        <p> Font Color: </p>
                        <p className = {`DocToolBarColorBox DocToolBarColor-${currentDocument[2][1]}`}></p>
                    </div>
                    <button className = "DocToolBarChangeButton" onClick={() => setOpenColorFlag(true)}> Change Color </button>
                </div>
                <div className="DocToolBarChangeContainer">
                    <div className="DocToolBarChangeBox">
                        <p> Page Color: </p>
                        <p className = {`DocToolBarColorBox DocToolBarPage-${currentDocument[2][2]}`}></p>
                    </div>
                    <button className = "DocToolBarChangeButton" onClick={() => setOpenPageColorFlag(true)}> Change Color </button>
                </div>
                
                <div className="DocToolBarChangeContainer">
                    <div className="DocToolBarChangeBox">
                        <p> Font Size: </p>
                        <input 
                            className = "DocToolBarSlider"
                            type="range"
                            min="0"
                            max="9"
                            value={currentDocument[2][3]}
                            onChange={changeFontSize}
                        />
                    </div>
                    <div className="DocToolBarChangeBox">
                        <p> Image Size: </p>
                        <input 
                            className = "DocToolBarSlider"
                            type="range"
                            min="0"
                            max="9"
                            value={currentDocument[2][4]}
                            onChange={changeImageSize}
                        />
                    </div>
                </div>
            </div>
        </>

    );

}


export default DocToolBar;
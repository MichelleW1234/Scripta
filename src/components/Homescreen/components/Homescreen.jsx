import { Link } from "react-router-dom";
import {useState} from "react";

import HomeDeleteWarning from "./HomescreenComponents/HomeDeleteWarning.jsx";
import HomeNavBar from "./HomescreenComponents/HomeNavbar.jsx";

import {useDocuments} from "../../../providers/DocumentsProvider.jsx";
import {useActiveDocument} from "../../../providers/ActiveDocumentProvider.jsx";

import "./Homescreen.css";

function Homescreen (){

    const {Documents} = useDocuments();
    const {setActiveDocument} = useActiveDocument();

    const [openHomeDeleteWarningFlag, setOpenHomeDeleteWarningFlag] = useState(false);
    const [indexToDelete, setIndexToDelete] = useState(-1);


    const goToDocument = (indexToActivate) => {

        setActiveDocument(indexToActivate);

    }

    const deleteWarning = (index) => {

        setOpenHomeDeleteWarningFlag(true);
        setIndexToDelete(index);

    }


    return (

        <>
            {openHomeDeleteWarningFlag &&
            <HomeDeleteWarning 
                setOpenHomeDeleteWarningFlag={setOpenHomeDeleteWarningFlag} 
                indexToDelete = {indexToDelete}
                setIndexToDelete = {setIndexToDelete}
            />}

            <HomeNavBar/>
            <div className = "HomescreenLayout">
        
                <div className = "HomescreenDocPagesContainer">
                    <Link to="/document" className = "HomeDocPageNew" onClick = {() => goToDocument(-1)}> + </Link>
                    {Documents.map((___, index) => {

                        const finalTitle = Documents[index][1].length > 30 ? Documents[index][1].slice(0, 30) + "..." 
                                                                        : Documents[index][1];
                                        
                        return (
                            <div className = "HomeDocContainer" key={index}>
                                <div className = "HomeDocPage">
                                    <h1 className = "HomeDocTitle">{finalTitle}</h1>
                                    <div className = "Options">
                                        <Link to="/document" className = "HomeDocButton" onClick = {() => goToDocument(index)}> Go to Document</Link>
                                        <button className = "HomeDocButton" onClick = {() => deleteWarning(index)}> Delete </button>
                                    </div>
                                </div>
                                <p className = "HomeDocDateAndTime">{Documents[index][3]}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>

    );

}


export default Homescreen;
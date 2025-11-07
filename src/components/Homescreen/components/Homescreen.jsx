import { Link } from 'react-router-dom';

import {useDocuments} from "../../../providers/DocumentsProvider.jsx";
import {useActiveDocument} from "../../../providers/ActiveDocumentProvider.jsx";
import {useTrash} from "../../../providers/TrashProvider.jsx";

import { deleteDocument } from '../../../helpers/Helpers.js';

import HomeNavBar from "./HomescreenComponents/HomeNavbar.jsx";

import "./Homescreen.css";

function Homescreen (){

    const {Documents, setDocuments} = useDocuments();
    const {ActiveDocument, setActiveDocument} = useActiveDocument();
    const {Trash, setTrash} = useTrash();


    const goToDocument = (indexToActivate) => {

        setActiveDocument(indexToActivate);

    }


    return (

        <>
            <HomeNavBar/>
            <div className = "HomescreenLayout">
        
                <div className = "HomescreenDocPagesContainer">
                    <Link to="/document" className = "HomeDocPageNew" onClick = {() => goToDocument(-1)}> + </Link>
                    {Documents.map((page, index) => {

                        const finalTitle = Documents[index][1].length > 30 ? Documents[index][1].slice(0, 30) + "..." 
                                                                        : Documents[index][1];
                                        
                        return (
                            <div className = "HomeDocContainer" key={index}>
                                <div className = "HomeDocPage">
                                    <h1 className = "HomeDocTitle">{finalTitle}</h1>
                                    <div className = "Options">
                                        <Link to="/document" className = "HomeDocButton" onClick = {() => goToDocument(index)}> Go to Document</Link>
                                        <button className = "HomeDocButton" onClick = {() => deleteDocument(setTrash, setDocuments, index, Documents[index])}> Delete </button>
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
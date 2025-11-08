import { Link } from 'react-router-dom';
import {useState, useRef} from "react";
import ContentEditable from "react-contenteditable";

import DocTitleChanger from "./DocscreenComponents/DocTitleChanger.jsx";
import DocToolBar from './DocscreenComponents/DocToolBar/DocToolBar.jsx';
import DocImages from "./DocscreenComponents/DocImages.jsx";

import {useDocuments} from "../../../providers/DocumentsProvider.jsx";
import {useTrash} from "../../../providers/TrashProvider.jsx";
import {useActiveDocument} from "../../../providers/ActiveDocumentProvider.jsx";

import { deleteDocument, moveToTrash } from '../../../helpers/Helpers.js';

import importedImage from "../../../Images/image 1.svg";

import "./Docscreen.css";

function Docscreen (){

    const {Documents, setDocuments} = useDocuments();
    const {ActiveDocument, setActiveDocument} = useActiveDocument();
    const {Trash, setTrash} = useTrash();

    const [openTitleFlag, setOpenTitleFlag] = useState(false);
    const [openImagesFlag, setOpenImagesFlag] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);


    const [currentDocument, setCurrentDocument] = useState(
        ActiveDocument !== -1 
            ? Documents[ActiveDocument]
            : ["", "Untitled", "0010", ""]
        );

    const editableRef = useRef();
    const handleChange = (evt) => {
        const newText = evt.target.value;
        // Uses html-formatted text:
        setCurrentDocument(prev => [newText, ...prev.slice(1)]);
 
    };

    const insertImage = () => {
        const img = document.createElement("img");
        img.src = importedImage;
        img.style.maxWidth = "10rem";

        editableRef.current.appendChild(img);

    };



    const saveProgress = (newActiveDoc) => {

        const now = new Date();
        const timeDateString = "Saved at " + now.toLocaleTimeString() + " on " + now.toLocaleDateString();
        const updatedDateAndTime = [...currentDocument.slice(0, -1), timeDateString];

        if (ActiveDocument !== -1){

            let updatedDocs = [...Documents];
            updatedDocs[ActiveDocument] = updatedDateAndTime;

            const [updatedDoc] = updatedDocs.splice(ActiveDocument, 1);

            setDocuments([updatedDoc, ...updatedDocs]);

        } else {

            setDocuments(prev => [updatedDateAndTime, ...prev]);

        }

        setActiveDocument(newActiveDoc);

    }


    const deleting = () => {

        if (ActiveDocument !== -1){

            deleteDocument(setTrash, setDocuments, ActiveDocument, currentDocument);
            setActiveDocument(-1);

        } else {

            moveToTrash(currentDocument, setTrash);

        }

    }


    return (

        <>
            {openImagesFlag === true &&
            <DocImages
                setOpenImagesFlag = {setOpenImagesFlag}
                setSelectedImages = {setSelectedImages}
            />}

            {openTitleFlag === true &&
            <DocTitleChanger
                setOpenTitleFlag = {setOpenTitleFlag}
                currentDocument={currentDocument}
                setCurrentDocument = {setCurrentDocument}
            />}

            <DocToolBar
                editableRef = {editableRef}
                currentDocument = {currentDocument}
                setCurrentDocument = {setCurrentDocument}
            />
            
            <div className = "DocscreenLayout">

                <div className = "DocComponentsContainer">

                    <h1 className = {`DocTitle DocStyle-${currentDocument[2][0]} DocColor-${currentDocument[2][1]} DocPage-${currentDocument[2][3]}`}> {currentDocument[1]} </h1>
                    <div className = "GeneralButtonsContainer">
                        <button className = "GeneralButton" onClick = {() => setOpenTitleFlag(true)}> Edit Title</button>
                        <button className = "GeneralButton" onClick = {() => setOpenImagesFlag(true)}> Select Images </button>

                        {selectedImages.length === 0 ? (

                            <button className = "placeHolderButton"> Insert Images </button>

                        ) : (

                            <button className = "GeneralButton" onClick = {() => insertImage()}> Insert Images ({selectedImages.length}) </button>

                        )}
                       
                    </div>

                    <ContentEditable
                        innerRef={editableRef}
                        html={currentDocument[0]}
                        onChange={handleChange}
                        tagName="div"
                        className={`DocPaper DocStyle-${currentDocument[2][0]} DocColor-${currentDocument[2][1]} DocSize-${currentDocument[2][2]} DocPage-${currentDocument[2][3]}`}
                    />

                    <div className = "GeneralButtonsContainer">
                        <button className = "GeneralButton" onClick = {() => saveProgress(0)}> Save </button>
                        <Link to="/home" className = "GeneralButton" onClick = {() => saveProgress(-1)}> Save + Exit </Link>
                        <Link to="/home" className = "GeneralButton" onClick = {() => deleting()}> Delete </Link>
                    </div>

                </div>

            </div>
        </>
        
    );

}


export default Docscreen;
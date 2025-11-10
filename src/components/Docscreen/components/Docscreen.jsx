import { Link } from 'react-router-dom';
import {useState, useRef} from "react";
import ContentEditable from "react-contenteditable";

import DocTitleChanger from "./DocscreenComponents/DocTitleChanger.jsx";
import DocToolBar from './DocscreenComponents/DocToolBar/DocToolBar.jsx';

import {useDocuments} from "../../../providers/DocumentsProvider.jsx";
import {useTrash} from "../../../providers/TrashProvider.jsx";
import {useActiveDocument} from "../../../providers/ActiveDocumentProvider.jsx";

import { deleteDocument, moveToTrash } from '../../../helpers/Helpers.js';


import "./Docscreen.css";

function Docscreen (){

    const {Documents, setDocuments} = useDocuments();
    const {ActiveDocument, setActiveDocument} = useActiveDocument();
    const {Trash, setTrash} = useTrash();

    const [openTitleFlag, setOpenTitleFlag] = useState(false);

    const [currentDocument, setCurrentDocument] = useState(
        ActiveDocument !== -1 
            ? Documents[ActiveDocument]
            : ["", "Untitled", "00052", ""]
        );

    const editableRef = useRef();
    const handleChange = (evt) => {
        const newText = evt.target.value;
        // Uses html-formatted text:
        setCurrentDocument(prev => [newText, ...prev.slice(1)]);
 
    };

    
    const handlePaste = (e) => {
        e.preventDefault();

        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
    };


    const handleImageImport = (event) => {

        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const imgTag = `<img src="${e.target.result}"/>`;      
            const updatedHTML = currentDocument[0] + imgTag;

            handleChange({ target: { value: updatedHTML } });
            event.target.value = null;
        };

        reader.readAsDataURL(file);

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

                    <h1 className = {`DocTitle DocStyle-${currentDocument[2][0]} DocColor-${currentDocument[2][1]} DocPage-${currentDocument[2][2]}`}> {currentDocument[1]} </h1>
                    <div className = "GeneralButtonsContainer">
                        <button className = "GeneralButton" onClick = {() => setOpenTitleFlag(true)}> Edit Title</button>
                        <label htmlFor="importImage" className = "GeneralButton">Insert Image</label>
                        <input
                            id ="importImage"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageImport}
                        />
                        
                    </div>

                    <ContentEditable
                        innerRef={editableRef}
                        html={currentDocument[0]}
                        onChange={handleChange}
                        onPaste={handlePaste}
                        tagName="div"
                        className={`DocPaper DocStyle-${currentDocument[2][0]} DocColor-${currentDocument[2][1]} DocPage-${currentDocument[2][2]} DocFontSize-${currentDocument[2][3]} DocImageSize-${currentDocument[2][4]}`}
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
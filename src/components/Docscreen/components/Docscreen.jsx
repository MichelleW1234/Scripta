import { Link } from 'react-router-dom';
import {useState, useRef} from "react";
import ContentEditable from "react-contenteditable";

import DocTitleChanger from "./DocscreenComponents/DocTitleChanger.jsx";
import DocToolBar from './DocscreenComponents/DocToolBar/DocToolBar.jsx';

import {useDocuments} from "../../../providers/DocumentsProvider.jsx";
import {useTrash} from "../../../providers/TrashProvider.jsx";
import {useActiveDocument} from "../../../providers/ActiveDocumentProvider.jsx";
import {useImportedImages} from "../../../providers/ImportedImagesProvider.jsx";

import { deleteDocument, moveToTrash, getImageCount } from '../../../helpers/Helpers.js';


import "./Docscreen.css";

function Docscreen (){

    const {Documents, setDocuments} = useDocuments();
    const {ActiveDocument, setActiveDocument} = useActiveDocument();
    const {Trash, setTrash} = useTrash();
    const {ImportedImages, setImportedImages} = useImportedImages();

    const [errorMessage, setErrorMessage] = useState("");
    const [openTitleFlag, setOpenTitleFlag] = useState(false);

    const [currentDocument, setCurrentDocument] = useState(
        ActiveDocument !== -1 
            ? Documents[ActiveDocument]
            : ["", "Untitled", "00052", ""]
        );

    const otherImagesRef = useRef(ImportedImages - getImageCount(currentDocument[0]));

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


    const handleImageImport = async (event) => {

        const input = event.target;

        // Grab file from input chooser:
        const file = input.files?.[0];

        // Immediately clear input chooser after grabbing file so that a new file can be selected:
        input.value = "";

        // Begin dealing with file:

        if (!file) return;

        // Check if image limit has been reached:
        if (otherImagesRef.current + getImageCount(currentDocument[0]) >= 250){

            setErrorMessage("You have reached the image limit. Please delete images in any of your documents or in trash to clear space.");
            setTimeout(() => setErrorMessage(""), 5000);

        } else {

            try {

                const compressedBase64 = await compressImage(file, 0.65);
                const imgTag = `<img src="${compressedBase64}" />`;
                const updatedHTML = currentDocument[0] + imgTag;

                handleChange({ target: { value: updatedHTML } });

                input.value = "";

                setErrorMessage("");

            } catch (err) {

                setErrorMessage(err.message);
                setTimeout(() => setErrorMessage(""), 5000);

            }

        }

    };


    const compressImage = (file, quality) => {

        const maxImageSize = 1000;

        return new Promise((resolve, reject) => {

            // Manually reject image file if file size is too large (to save memory):
            if (file.size > 3.5 * 1024 * 1024){

                reject(new Error("File is too large! Maximum size is 3.5 MB."));
                return;

            }

            const reader = new FileReader();
            const img = new Image();

            // Once reader is fully read, image's base64 string value is set:
            reader.onload = (e) => {
                img.src = e.target.result;
            }
            
            // In case file reading fails (catches error):
            reader.onerror = reject;
            // Starts reading the file:
            reader.readAsDataURL(file);

            // Once image is fully loaded, draw it a smaller canvas and compress image:
            img.onload = () => {

                // Manually reject image if dimensions are too large (to save memory):
                if (img.width > maxImageSize || img.height > maxImageSize) {

                    reject(new Error("Image is too large! Maximum dimensions are 1000x1000 pixels."));
                    return;

                }

                // Start compression process: 
                const scale = Math.min(1, maxImageSize/img.width);

                const canvas = document.createElement("canvas");
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

                // Freeing memory used by the canvas and the decoded image:
                canvas.width = 0;
                canvas.height = 0;
                img.src = "";

                // Returning compressed image to function caller:
                resolve(compressedBase64);

            };

            // Image fails to load (catches error):
            img.onerror = reject;

        });
    }

    
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

        setImportedImages(otherImagesRef.current + getImageCount(currentDocument[0]));

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

                    <p className={errorMessage !== "" ? "DocImageErrorSpace" : "DocImageErrorNoneSpace"}>{errorMessage}</p>

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
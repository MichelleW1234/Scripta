import { Link } from 'react-router-dom';
import {useState, useRef} from "react";
import ContentEditable from "react-contenteditable";

import DocDeleteWarning from './DocscreenComponents/DocDeleteWarning.jsx';
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
    const {setTrash} = useTrash();
    const {ImportedImages, setImportedImages} = useImportedImages();

    const [errorMessage, setErrorMessage] = useState("");
    const [openTitleFlag, setOpenTitleFlag] = useState(false);
    const [openDocDeleteWarningFlag, setOpenDocDeleteWarningFlag] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(
        ActiveDocument !== -1 
            ? Documents[ActiveDocument]
            : ["", "Untitled", "00052", ""]
        );

    const savedSelectionSpotRef = useRef(null);
    const otherImagesRef = useRef(ImportedImages - getImageCount(currentDocument[0]));
    const editableRef = useRef(null);
    const timeoutRef = useRef(null);



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


    const handleFocus = () => {

        // Gets the current selection object for the window
        const sel = window.getSelection();

        // Ensures a selection exists and at least one range (can be highlighted text or cursor position) exists in that selection:
        if (sel && sel.rangeCount > 0) {

            // Stores a copy of the first range in the selection:
            savedSelectionSpotRef.current = sel.getRangeAt(0).cloneRange();
        }
        
    };


    const handleImageImport = async (event) => {

        const input = event.target;

        // Checking that only one image file is selected for import:
        if (input.files && input.files.length > 1) {

            showErrorMessage("Please select only one image per import.");
            input.value = "";
            return;

        }

        // Grab file from input chooser:
        const file = input.files?.[0];

        // Immediately clear input chooser after grabbing file so that a new file can be selected:
        input.value = "";

        // Begin dealing with file:

        if (!file) return;

        // Check if image limit has been reached:
        if (otherImagesRef.current + getImageCount(currentDocument[0]) >= 250){

            showErrorMessage("Image limit (250) reached! Please delete images in your documents or in trash to clear space.");

        } else {

            try {

                const compressedBase64 = await compressImage(file, 0.65);

                // Creates an image element for the newly compresseed image:
                const imgTag = document.createElement("img");
                imgTag.src = compressedBase64;

                let updatedHTML;

                // Checks if there is a saved selection for image insertion (or else just insert at the end):
                if (savedSelectionSpotRef.current) {

                    // If selection is highlighted text, deletes highlighted text:
                    savedSelectionSpotRef.current.deleteContents();

                    // Inserts image element at the start of the selection:
                    savedSelectionSpotRef.current.insertNode(imgTag);

                    // Adjusts the start and end of the selection to the same cursor position (range == 1) after the inserted image node's position: 
                    savedSelectionSpotRef.current.setStartAfter(imgTag);
                    savedSelectionSpotRef.current.setEndAfter(imgTag);

                    // Sets the browser to continue with this adjusted selection:
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(savedSelectionSpotRef.current);

                    // Grabs the updated contenteditable's html with the newly inserted image element:
                    updatedHTML =  editableRef.current.innerHTML;

                } else {

                    updatedHTML = currentDocument[0] + imgTag.outerHTML;
                }

                handleChange({ target: { value: updatedHTML } });

                setErrorMessage("");

            } catch (err) {

                showErrorMessage(err.message);

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


    const showErrorMessage = (message) => {

        setErrorMessage(message);

        // Cancels any existing timers:
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Starts a fresh 3s timer:
        timeoutRef.current = setTimeout(() => {
            setErrorMessage("");
            timeoutRef.current = null;
        }, 5000);

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


    return (

        <>
            {openDocDeleteWarningFlag &&
            <DocDeleteWarning
                setOpenDocDeleteWarningFlag = {setOpenDocDeleteWarningFlag}
                currentDocument={currentDocument}
                otherImagesRef = {otherImagesRef}
            />}

            {openTitleFlag &&
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
                        onKeyUp = {handleFocus}
                        onMouseUp={handleFocus}
                        tagName="div"
                        className={`DocPaper DocStyle-${currentDocument[2][0]} DocColor-${currentDocument[2][1]} DocPage-${currentDocument[2][2]} DocFontSize-${currentDocument[2][3]} DocImageSize-${currentDocument[2][4]}`}
                    />

                    <div className = "GeneralButtonsContainer">
                        <button className = "GeneralButton" onClick = {() => saveProgress(0)}> Save </button>
                        <Link to="/home" className = "GeneralButton" onClick = {() => saveProgress(-1)}> Save + Exit </Link>
                        <button className = "GeneralButton" onClick = {() => setOpenDocDeleteWarningFlag(true)}> Delete </button>
                    </div>

                </div>

            </div>
        </>
        
    );

}


export default Docscreen;
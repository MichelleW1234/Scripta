
import { Link } from 'react-router-dom';

import {useDocuments} from "../../../../providers/DocumentsProvider.jsx";
import {useTrash} from "../../../../providers/TrashProvider.jsx";
import {useActiveDocument} from "../../../../providers/ActiveDocumentProvider.jsx";
import {useImportedImages} from "../../../../providers/ImportedImagesProvider.jsx";

import { deleteDocument, moveToTrash, getImageCount } from '../../../../helpers/Helpers.js';

function DocDeleteWarning ({setOpenDocDeleteWarningFlag, currentDocument, otherImagesRef}){

    const {Documents, setDocuments} = useDocuments();
    const {ActiveDocument, setActiveDocument} = useActiveDocument();
    const {setTrash} = useTrash();
    const {ImportedImages, setImportedImages} = useImportedImages();

    const deleting = () => {

        setImportedImages(otherImagesRef.current + getImageCount(currentDocument[0]));

        if (ActiveDocument !== -1){

            deleteDocument(setTrash, setDocuments, ActiveDocument, currentDocument);
            setActiveDocument(-1);

        } else {

            moveToTrash(currentDocument, setTrash);

        }

    }
    

    return (

        <div className = "FullScreenFloatingFlag">

            <div className = "FullFlagContainer">
                <h3>Are you sure you want to move this document to Trash?</h3>

                <div className="FullFlagButtonContainer">
                    <Link to="/home" className = "FlagContainerButton" onClick = {() => deleting()}> Yes </Link>
                    <button className = "FlagContainerButton" onClick = {() => setOpenDocDeleteWarningFlag(false)}> No </button>
                </div>

            </div>
        </div>

    );

}


export default DocDeleteWarning;
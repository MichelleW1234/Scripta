import {useDocuments} from "../../../../providers/DocumentsProvider.jsx";
import {useTrash} from "../../../../providers/TrashProvider.jsx";

import { deleteDocument } from "../../../../helpers/Helpers.js";


function HomeDeleteWarning ({setOpenHomeDeleteWarningFlag, indexToDelete, setIndexToDelete}){

    const {Documents, setDocuments} = useDocuments();
    const {setTrash} = useTrash();
    
    const yesDelete = () => {

        deleteDocument(setTrash, setDocuments, indexToDelete, Documents[indexToDelete]);
        setIndexToDelete(-1);
        setOpenHomeDeleteWarningFlag(false);

    }

    const noDelete = () => {

        setIndexToDelete(-1);
        setOpenHomeDeleteWarningFlag(false);

    }

    return (

        <div className = "FullScreenFloatingFlag">

            <div className = "FullFlagContainer">
                <h3>Are you sure you want to move this document to Trash?</h3>

                <div className="FullFlagButtonContainer">
                    <button className = "FlagContainerButton" onClick = {() => yesDelete()}> Yes </button>
                    <button className = "FlagContainerButton" onClick = {() => noDelete()}> No </button>
                </div>

            </div>
        </div>

    );

}


export default HomeDeleteWarning;
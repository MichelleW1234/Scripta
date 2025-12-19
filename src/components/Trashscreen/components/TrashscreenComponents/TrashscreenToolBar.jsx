import {useDocuments} from "../../../../providers/DocumentsProvider.jsx";
import {useTrash} from "../../../../providers/TrashProvider.jsx";
import {useImportedImages} from "../../../../providers/ImportedImagesProvider.jsx";

import { getImageCount } from '../../../../helpers/Helpers.js';


function TrashscreenToolBar ({selected, setSelected}){

    const {setDocuments} = useDocuments();
    const {Trash, setTrash} = useTrash();
    const {setImportedImages} = useImportedImages();



    const restore = () => {
    
        setTrash(prev => {
            return prev.filter((_, i) => !selected.includes(i));
        });
    
        const restoredDocuments = Trash.filter((_, i) =>
            selected.includes(i)
        );

        setDocuments(prev => {

            let updatedDocs = [...prev, ...restoredDocuments];
            return updatedDocs;

        });

        setSelected([]);

    }

    const deletePermanently = () => {

        setTrash(prev => {
            return prev.filter((_, i) => !selected.includes(i));
        });

        let deletedImageCount = 0;
        selected.forEach(document => {
            deletedImageCount += getImageCount(document[0]);
        });
        setImportedImages(prev => prev - deletedImageCount);

        setSelected([]);

    }

    const emptyTrash = () => {

        let deletedImageCount = 0;
        Trash.forEach(document => {
            deletedImageCount += getImageCount(document[0]);
        });
        setImportedImages(prev => prev - deletedImageCount);

        setTrash([]);
        setSelected([]);

    }


    
    return (

        <div className = "NavBarContainer">

            {selected.length > 0 ? (

                <>
                    <button className = "NavBarButton" onClick = {() => restore()}> Restore </button>
                    <button className = "NavBarButton"  onClick = {() => deletePermanently()}> Delete Permanently </button>
                </>

            ) : (

                <>
                    <div className = "NavBarButtonPlaceHolder" > Restore </div>
                    <div className = "NavBarButtonPlaceHolder" > Delete Permanently </div>
                </>

            )}

            <button className = {Trash.length > 0 ? "NavBarButton" : "NavBarButtonPlaceHolder"}  onClick = {() => emptyTrash()}> Empty Trash </button>

        </div>

    );

}


export default TrashscreenToolBar;
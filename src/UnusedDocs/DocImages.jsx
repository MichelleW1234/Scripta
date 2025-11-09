import {useImportedImages} from "../../../../providers/ImportedImagesProvider.jsx";

import "./DocImages.css";

function DocImages ({setOpenImagesFlag, setSelectedImages}){

    const {ImportedImages, setImportedImages} = useImportedImages();

    const done = () => {

        setOpenImagesFlag(false);

    }

    const addImage = (e) => {
        const files = Array.from(e.target.files);

        files.forEach(file => console.log("file.path:", file.path));
        
        const newImages = files
            .filter(file => !ImportedImages.some(img => img.path === file.path))
            .map(file => ({
            name: file.name,
            path: file.path
        }));

        setImportedImages(prev => [...prev, ...newImages]);
    };

    return (

        <div className = "FullScreenFloatingFlag">
            <div className = "FullFlagContainer">

                <h1> Select an image to insert: </h1>

                <div className = "ImportedImagesContainer">

                    {ImportedImages.length === 0 ? (

                        <p>No images to insert.</p>

                    ) : (

                        ImportedImages.map((img, index) => (
                            <img key={index} src={`file://${img.path}`} className = "ImportedImage"/>
                        ))

                    )}
    
                </div>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={addImage}
                    id = "importImages"
                    style={{ display: 'none' }}
                />
    
                <div className="GeneralButtonsContainer">
                    <label htmlFor= "importImages" className="ImageOptionButton">
                        Import Images to Library
                    </label>
                    <button className="ImageOptionButton" onClick = {()=> setImportedImages([])}> Clear library </button>
                </div>

                    <button className="FlagContainerButton" onClick = {()=> done()}> Close </button>
            </div>
        </div>

    );

}


export default DocImages;
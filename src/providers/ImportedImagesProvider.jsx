/*
  Keeps track of how many imported images there are over all documents (if any)
*/

import { createContext, useContext, useState, useEffect } from "react";

const ImportedImagesContext = createContext();

export function ImportedImagesProvider({ children }) {

    const [ImportedImages, setImportedImages] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("ImportedImages"));
            return stored !== null ? stored : 0; 
        } catch {
            return 0;
        }
    });

    useEffect(() => {
        localStorage.setItem("ImportedImages", JSON.stringify(ImportedImages));
    }, [ImportedImages]);

    return (
        <ImportedImagesContext.Provider value={{ ImportedImages, setImportedImages}}>
        {children}
        </ImportedImagesContext.Provider>
    );
}

export function useImportedImages() {
  return useContext(ImportedImagesContext);
}


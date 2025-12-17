/*
    Keeps track of which document is currently opened (if any)
*/

import { createContext, useContext, useState, useEffect } from "react";

const ActiveDocumentContext = createContext();

export function ActiveDocumentProvider({ children }) {

    const [ActiveDocument, setActiveDocument] = useState(() => {
        try {
            const stored = JSON.parse(sessionStorage.getItem("ActiveDocument"));
            return stored !== null ? stored : -1; 
        } catch {
            return -1;
        }
    });

    useEffect(() => {
        sessionStorage.setItem("ActiveDocument", JSON.stringify(ActiveDocument));
    }, [ActiveDocument]);

    return (
        <ActiveDocumentContext.Provider value={{ ActiveDocument, setActiveDocument}}>
        {children}
        </ActiveDocumentContext.Provider>
    );
}

export function useActiveDocument() {
  return useContext(ActiveDocumentContext);
}


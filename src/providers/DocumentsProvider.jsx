/*
  Keeps track of all the documents that the user has created (if any)
*/

import { createContext, useContext, useState, useEffect } from "react";

const DocumentsContext = createContext();

export function DocumentsProvider({ children }) {

  const [Documents, setDocuments] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("Documents"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("Documents", JSON.stringify(Documents));
  }, [Documents]);

  return (
    <DocumentsContext.Provider value={{ Documents, setDocuments }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  return useContext(DocumentsContext);
}


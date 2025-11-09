/*
*/

import { createContext, useContext, useState, useEffect } from "react";

const ImportedImagesContext = createContext();

export function ImportedImagesProvider({ children }) {

  const [ImportedImages, setImportedImages] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ImportedImages"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ImportedImages", JSON.stringify(ImportedImages));
  }, [ImportedImages]);

  return (
    <ImportedImagesContext.Provider value={{ ImportedImages, setImportedImages }}>
      {children}
    </ImportedImagesContext.Provider>
  );
}

export function useImportedImages() {
  return useContext(ImportedImagesContext);
}


/*
  Keeps track of all the documents that have been temporarily deleted (if any)
*/

import { createContext, useContext, useState, useEffect } from "react";

const TrashContext = createContext();

export function TrashProvider({ children }) {

  const [Trash, setTrash] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("Trash"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("Trash", JSON.stringify(Trash));
  }, [Trash]);

  return (
    <TrashContext.Provider value={{ Trash, setTrash }}>
      {children}
    </TrashContext.Provider>
  );
}

export function useTrash() {
  return useContext(TrashContext);
}


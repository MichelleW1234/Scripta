import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

import {DocumentsProvider} from "./providers/DocumentsProvider.jsx";
import {ImportedImagesProvider} from "./providers/ImportedImagesProvider.jsx";
import {TrashProvider} from "./providers/TrashProvider.jsx";
import {ActiveDocumentProvider} from "./providers/ActiveDocumentProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DocumentsProvider> <ImportedImagesProvider><TrashProvider><ActiveDocumentProvider>
      <App />
    </ActiveDocumentProvider></TrashProvider></ImportedImagesProvider></DocumentsProvider>
  </StrictMode>,
)

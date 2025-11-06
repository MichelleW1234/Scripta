import Homescreen from "./components/Homescreen/components/Homescreen.jsx";
import Docscreen from "./components/Docscreen/components/Docscreen.jsx";
import Trashscreen from "./components/Trashscreen/components/Trashscreen.jsx";

import NoPage from "./components/NoPage.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import {HashRouter, Routes, Route} from 'react-router-dom';
import './App.css'

function App() {

  return (
    <>
      <div>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route index element={<Homescreen/>}/>
            
            <Route path="/home" element={<Homescreen />}/>
            <Route path="/document" element={<Docscreen />}/>
            <Route path="/trash" element={<Trashscreen />}/>

            <Route path="*" element={<NoPage />} />
          </Routes>
        </HashRouter>
      </div>
    </>
  )
}

export default App

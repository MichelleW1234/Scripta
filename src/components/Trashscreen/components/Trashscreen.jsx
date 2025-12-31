import { Link } from "react-router-dom";
import {useState} from "react";

import {useTrash} from "../../../providers/TrashProvider.jsx";

import TrashscreenToolBar from "./TrashscreenComponents/TrashscreenToolBar.jsx";

import "./Trashscreen.css";

function Trashscreen (){

    const {Trash} = useTrash();

    const [selected, setSelected] = useState([]);
    

    
    const editSelected = (index) => {

        if (selected.includes(index)){

            setSelected(prev => prev.filter(item => item !== index));

        } else {

            setSelected(prev => [...prev, index]);

        }

    }


    
    return (    

        <>
            <TrashscreenToolBar
                selected = {selected}
                setSelected = {setSelected}
            />
            <div className = "TrashscreenLayout">
                <div className = "TrashOptionsContainer">

                    {Trash.length == 0 ? (

                        <h1 className = "TrashEmptyMessage">Trash is empty.</h1>
                    
                    ): (

                        Trash.map((___, index) => {

                            const finalTitle = Trash[index][1].length > 30 ? Trash[index][1].slice(0, 30) + "..." 
                                : Trash[index][1];

                            return (

                                <div className = {selected.includes(index) ? "TrashOptionPageActive" : "TrashOptionPage"} key = {index} onClick = {() => editSelected(index)}> {finalTitle} </div>

                            )

                        })

                    )}
                </div>

                <div className="GeneralButtonsContainer">
                    <Link to = "/home" className="GeneralButton"> Back to Home </Link>
                </div>
            </div>
        </>

    );

}


export default Trashscreen;
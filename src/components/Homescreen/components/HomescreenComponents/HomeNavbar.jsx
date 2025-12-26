import { Link } from 'react-router-dom';
import {useState, useRef} from "react";
import ContentEditable from "react-contenteditable";

import {useDocuments} from "../../../../providers/DocumentsProvider.jsx";
import { useActiveDocument } from '../../../../providers/ActiveDocumentProvider.jsx';

import "./HomeNavbar.css";


function HomeNavBar (){

    const {Documents} = useDocuments();
    const {setActiveDocument} = useActiveDocument();

    const [titleLookup, setTitleLookup] = useState("");
    const [matchingTitles, setMatchingTitles] = useState([])
    const [barIsActive, setBarIsActive] = useState(false);

    const editableRef = useRef(null);



    const handleChange = (evt) => {
        const newText = evt.target.value;
        const unformattedText = newText.replace(/<[^>]+>/g, "");

        // Uses non-html formatted text:
        setTitleLookup(unformattedText);
    
    };


    const findTitles = () => {

        setBarIsActive(true);
        const allDocTitles = Documents.map(innerArray => innerArray[1]);
        const filteredTitles = allDocTitles.filter(el => el.toLowerCase().includes(titleLookup.toLowerCase()));
        setMatchingTitles(filteredTitles);

    }

    const getDocument = (documentTitle) => {

        const index = Documents.findIndex(innerArray => 
            innerArray.includes(documentTitle)
        );

        setActiveDocument(index);

    }


    const closeSearchBar = () => {

        setBarIsActive(false);
        setTitleLookup("");
        setMatchingTitles([]);

    }


    return (

        <>
            <div className = "NavBarContainer">

                <ContentEditable
                    innerRef={editableRef}
                    html={titleLookup}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                    }}
                    tagName="div"
                    className="HomeNavBarLookup"
                />

                {Documents.length > 0 ? (

                    <button className="NavBarButton" onClick = {() => findTitles()}> Find Document </button>

                ) : (

                    <button className="NavBarButtonPlaceHolder"> Find Document </button>

                )}
                
                <Link to="/trash" className="NavBarButton"> Go to Trash </Link>

            </div>

            {barIsActive ? (

                <div className = "HomeNavBarSuggestionsFlag">
                    <div className="HomeNavBarSuggestionsContainer">

                        {matchingTitles.length === 0 ? (

                            <h1 className = "HomeNavBarNoSuggestions"> No results... </h1>

                        ) : (

                            matchingTitles.map((title, index) => {

                                const finalTitle = matchingTitles[index].length > 30 ? matchingTitles[index].slice(0, 30) + "..." 
                                    : matchingTitles[index];

                                return (
                                    <Link to="/document" className = "HomeNavBarSuggestionPage" key={index} onClick = {() => getDocument(title)}> {finalTitle} </Link>
                                )
                            })

                        )}
                        
                    </div>

                    <button className = "HomeNavBarCloseButton" onClick = {() => closeSearchBar()}> Close </button>
                </div>

            ) : (

                null

            )}
        </>
                                    
    );

}


export default HomeNavBar;
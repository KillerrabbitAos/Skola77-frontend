//test
import React, { useEffect } from 'react';
import { isMobile, isTablet} from 'react-device-detect';

const Hem = () => {
    useEffect(() => {
        if (isMobile && !isTablet) {
            alert('Du besöker just nu Skola77 från en mobiltelefon. Observera att sidan inte alls är utformad för den typen av användande. Vi rekommenderar starkt att du testar sidan på dator för en bättre användarupplevelse.');
        }
    }, []);



    return (
    <div>
        <p id="bodyTitle">Det här är Skola77:</p>
        <div class="foton">
        <a href="demobilder/Demobild1.png"><img src="demobilder/Demobild1.png"></img></a>
        <a href="demobilder/Demobild2.png"><img src="demobilder/Demobild2.png"></img></a>
        <a href="demobilder/Demobild3.png"><img src="demobilder/Demobild3.png"></img></a>
        <a href="demobilder/Demobild4.png"><img src="demobilder/Demobild4.png"></img></a>
        <a href="demobilder/Demobild5.png"><img src="demobilder/Demobild5.png"></img></a>


    </div>

        
    
        <h2 id="info">Skola77 gör det möjligt för dig som lärare att smidigt och snabbt göra nya bordsplaceringar på bara några sekunder!</h2>
    
    
        <h2 id="info">Klicka på "Editor" i menyn uppe till vänster för att ta dig till betan</h2>
        

        <div class="about">
    
            <h1>Varför Skola77?</h1>
    
            <ul>
    
                <li>Supersmidiga namnimporter med Excel</li>
                <li>Enkelt Gränssnitt</li>
                <li>Skräddarsydd för MacBook, iMac och iPad</li>
                <li>Slipp inloggningar - allt sparas lokalt på din dator</li>
    
    
            </ul>

            <div class="trustpilot-widget" data-locale="sv-SE" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="65f1cff6b025711eadb979d8" data-style-height="52px" data-style-width="100%">
            <a href="https://se.trustpilot.com/review/skola77.com" target="_blank" rel="noopener">Trustpilot</a>
            </div>
    
            <p id="OBS"><u>OBS: Skola77 är fortfarande under utveckling och kanske inte fungerar helt korrekt. Speciellt med mobila enheter.</u></p>
    
    
        </div>
    
    </div>
    );
  };
  
  export default Hem;

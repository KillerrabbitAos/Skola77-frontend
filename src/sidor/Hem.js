import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

const Hem = () => {
    useEffect(() => {
        if (isMobile) {
            alert('Du besöker just nu Skola77 från en mobiltelefon. Observera att sidan inte alls är utformad för den typen av användande. Vi rekommenderar starkt att du testar sidan på dator för en bättre användarupplevelse.');
        }
    }, []);



    return (
    <div>
        <p id="bodyTitle">Det här är Skola77:</p>
        <div class="foton">
        <a href="demobilder/bänkar.png"><img src="demobilder/bänkar.png"></img></a>
        <a href="demobilder/sparaKlassrum.png"><img src="demobilder/sparaKlassrum.png"></img></a>
        <a href="demobilder/ändraGridStorlek.png"><img src="demobilder/ändraGridstorlek.png"></img></a>
        <a href="demobilder/bytPerspektiv.png"><img src="demobilder/bytPerspektiv.png"></img></a>
        <a href="demobilder/klassrum.png"><img src="demobilder/klassrum.png"></img></a>


    </div>

        
    
        <h2 id="info">Skola77 gör det möjligt för dig som lärare att smidigt och snabbt göra nya bordsplaceringar på bara några sekunder!</h2>
    
    
        <h2 id="info">Klicka på "Editor" i menyn uppe till vänster för att ta dig till betan</h2>
        
    <p>Vi har nyligen genomfört förändringar på vår webbplats som tyvärr resulterade i att viss personlig data gick förlorad. Vi vill betona att vi tar din personliga integritet på största allvar och att den här händelsen är en bieffekt av vår strävan efter hög säkerhet. Tyvärr kan vi inte återställa den förlorade datan efter den systemflytt vi genomfört, vilket är en del av vårt säkerhetsfokus. Vi försäkrar dig dock om att vi arbetar för att förhindra liknande händelser i framtiden. Din information är säker hos oss, och vi uppmanar dig att kontakta oss via e-post om du har några frågor eller funderingar. Tack för att du väljer att använda vår tjänst.</p>
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

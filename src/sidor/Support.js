const Support = () => {
    return (<body>

      <div className="supportHead">
  
          <h1>Välkommen till Support!</h1>
          <p>Här finner du material och guider för användning av Skola77</p>
  
      </div>
  
      <div className="pdfs">
  
          <div className="material">
  
              <p>Snabbguide:</p>
  
              <a className="pdfLänk" href="/PDFs/Skola77 Snabbguide.pdf" target="_blank">Skola77:s snabbguide</a>
  
  
          </div>
  
          <div className="material">
  
           <p>Vilkor:</p>
  
           <a className="pdfLänk" href="/terms-of-service" target="_blank">Skola77:s vilkor</a>
       </div>



       
       <div className="material">
  
  <p>Integritetspolicy:</p>

  <a className="pdfLänk" href="/policy" target="_blank">Skola77:s policy</a>
</div>
       

       


  
       <div className="material">
  
  <p>Vårat forum:</p>

  <a className="pdfLänk" href="https://forum.skola77.com/" target="_blank">Skola77:s forum</a>


</div>
      </div>

      <hr/>

      <div>

        <h1 id="frågorOchSvarHead">Vanliga frågor och svar:</h1>

        <div className="frågorOchSvar">

        <p id="fråga">Kan jag spara mina placeringar utan att behöva ladda ner dem?</p>
        <p id="svar">Ja, det kan du. Klicka på sparaikonen högt upp på sidan och skriv in ett namn på placeringen.</p>

        <p id="fråga">Kan jag spara klassrum och klasslistor separat?</p>
        <p id="svar">Ja, det finns två "spararutor" utplacerade vid klassrumsskaparen och vid namnlistan längst ned. Mer info finns i snabbguiden vid punkt 1 och 2.</p>

        <p id="fråga">Jag har hittat ett fel i programmet, vad ska jag göra?</p>
        <p id="svar">Om du har hittat ett fel eller problem, tveka inte att kontakta oss på <a id="mail" href="mailto:feedback@skola77.com">feedback@skola77.com</a> så hjälper vi dig vidare därifrån.</p>


        </div>


      </div>
      
  </body>);
  };
  
  export default Support;
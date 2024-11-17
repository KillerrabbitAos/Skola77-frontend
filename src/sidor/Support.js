const Support = () => {
  return (
    <body>
      <div className="supportHead">
        <h1>Välkommen till Support!</h1>
        <p>
          Här finner du material, guider och information för användning av
          Skola77
        </p>
      </div>

      <div className="pdfs">
        <div className="material">
          <p>Snabbguide:</p>

          <a
            className="pdfLänk"
            href="/PDFs/Skola77 Snabbguide.pdf"
            target="_blank"
          >
            Skola77:s snabbguide
          </a>
        </div>

        <div className="material">
          <p>Villkor:</p>

          <a className="pdfLänk" href="/terms-of-service" target="_blank">
            Skola77:s villkor
          </a>
        </div>

        <div className="material">
          <p>Integritetspolicy:</p>

          <a className="pdfLänk" href="/policy" target="_blank">
            Skola77:s policy
          </a>
        </div>

        <div className="material">
          <p>Vårat forum:</p>

          <a
            className="pdfLänk"
            href="https://forum.skola77.com/"
            target="_blank"
          >
            Skola77:s forum
          </a>
        </div>
      </div>

      <hr />

      <div>
        <h1 id="frågorOchSvarHead">Vanliga frågor och svar:</h1>

        <div className="frågorOchSvar">
          <p id="fråga">
            Kan jag spara mina placeringar utan att behöva ladda ner dem?
          </p>
          <p id="svar">
            Ja, det kan du. Klicka på sparaikonen högt upp på sidan och skriv in
            ett namn på placeringen.
          </p>

          <p id="fråga">Kan jag spara klassrum och klasslistor separat?</p>
          <p id="svar">
            Ja, det finns två "spararutor" utplacerade vid klassrumsskaparen och
            vid namnlistan längst ned. Mer info finns i snabbguiden vid punkt 1
            och 2.
          </p>

          <p id="fråga">
            Jag har hittat ett fel i programmet, vad ska jag göra?
          </p>
          <p id="svar">
            Om du har hittat ett fel eller problem, tveka inte att kontakta oss
            på{" "}
            <a id="mail" href="mailto:feedback@skola77.com">
              feedback@skola77.com
            </a>{" "}
            så hjälper vi dig vidare därifrån.
          </p>
        </div>
      </div>

      <div id="omTitle">
        <h1 id="omOssHead">Om oss</h1>
      </div>

      <div id="bodyOmOss">
        <h2>
          <u>
            Skola77 är ett bordsplaceringsprogram utvecklat av en grupp
            ungdomar. Vi tycker det är självklart att lärare ska ha tillgång
            till välgjorda och effektiva verktyg för att kunna skapa trygghet
            och arbetsro i klassrummen. Det är därför vårt
            bordsplaceringsprogram är utvecklat med lärare i åtanke. Dessutom är
            vår hemsida helt gratis och utan reklam.
          </u>
        </h2>
      </div>

      <div className="mail">
        <h1 id="mailHead">Kontakt via E-post:</h1>
        <p id="mailorm">För feedback:</p>
        <a href="mailto:feedback@skola77.com" id="feedbackMail">
          feedback@skola77.com
        </a>
        <p>Övrigt:</p>
        <a href="mailto:support@skola77.com">support@skola77.com</a>
      </div>
    </body>
  );
};

export default Support;

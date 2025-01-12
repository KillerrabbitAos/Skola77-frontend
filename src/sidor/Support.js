import { useState, useEffect } from "react";

const Support = () => {

  const [engelska, setEngelska] = useState(true);

  async function checkLoginStatus() {
    try {
        const response = await fetch("https://auth.skola77.com/home", {
            credentials: "include",
        });
        const result = await response.json();

        try {
            setEngelska(JSON.parse(result.settings).engelska)

        } catch (parseError) {
            console.error("Kunde inte parsa data:", parseError);
            window.location.href = "https://auth.skola77.com?skola77";
        }
    } catch (fetchError) {
        console.error("Fel vid hämtning av data:", fetchError);
        window.location.href = "https://auth.skola77.com?skola77";
    }
  }

    useEffect(() => {
      checkLoginStatus()
    }, []);
  

  return (
    <body>
      <div className="supportHead">
        <h1>{engelska ? "Welcome to Support!" : "Välkommen till Support!"}</h1>
        <p>
          {engelska
            ? "Here you will find materials, guides, and information for using Skola77."
            : "Här finner du material, guider och information för användning av Skola77"}
        </p>
      </div>

      <div className="pdfs">
        <div className="material">
          <p>{engelska ? "Quick Guide:" : "Snabbguide:"}</p>
          <a
            className="pdfLänk"
            href="/PDFs/Skola77 Snabbguide.pdf"
            target="_blank"
          >
            {engelska ? "Skola77's Quick Guide" : "Skola77:s snabbguide"}
          </a>
        </div>

        <div className="material">
          <p>{engelska ? "Terms:" : "Villkor:"}</p>
          <a className="pdfLänk" href="/terms-of-service" target="_blank">
            {engelska ? "Skola77's Terms" : "Skola77:s villkor"}
          </a>
        </div>

        <div className="material">
          <p>{engelska ? "Privacy Policy:" : "Integritetspolicy:"}</p>
          <a className="pdfLänk" href="/policy" target="_blank">
            {engelska ? "Skola77's Privacy Policy" : "Skola77:s policy"}
          </a>
        </div>

        <div className="material">
          <p>{engelska ? "Our Forum:" : "Vårat forum:"}</p>
          <a
            className="pdfLänk"
            href="https://forum.skola77.com/"
            target="_blank"
          >
            {engelska ? "Skola77's Forum" : "Skola77:s forum"}
          </a>
        </div>
      </div>

      <hr />

      <div>
        <h1 id="frågorOchSvarHead">
          {engelska ? "Frequently Asked Questions:" : "Vanliga frågor och svar:"}
        </h1>

        <div className="frågorOchSvar">
          <p id="fråga">
            {engelska
              ? "Can I save my placements without downloading them?"
              : "Kan jag spara mina placeringar utan att behöva ladda ner dem?"}
          </p>
          <p id="svar">
            {engelska
              ? "Yes, you can. Click the save icon at the top of the page and enter a name for the placement."
              : "Ja, det kan du. Klicka på sparaikonen högt upp på sidan och skriv in ett namn på placeringen."}
          </p>

          <p id="fråga">
            {engelska
              ? "Can I save classrooms and class lists separately?"
              : "Kan jag spara klassrum och klasslistor separat?"}
          </p>
          <p id="svar">
            {engelska
              ? "Yes, there are two 'save boxes' placed at the classroom creator and at the name list at the bottom. More info is in the quick guide at points 1 and 2."
              : "Ja, det finns två \"spararutor\" utplacerade vid klassrumsskaparen och vid namnlistan längst ned. Mer info finns i snabbguiden vid punkt 1 och 2."}
          </p>

          <p id="fråga">
            {engelska
              ? "I found an error in the program, what should I do?"
              : "Jag har hittat ett fel i programmet, vad ska jag göra?"}
          </p>
          <p id="svar">
            {engelska
              ? "If you have found an error or issue, do not hesitate to contact us at "
              : "Om du har hittat ett fel eller problem, tveka inte att kontakta oss på "}
            <a id="mail" href="mailto:feedback@skola77.com">
              feedback@skola77.com
            </a>{" "}
            {engelska ? "and we will assist you further." : "så hjälper vi dig vidare därifrån."}
          </p>
        </div>
      </div>

      <div id="omTitle">
        <h1 id="omOssHead">{engelska ? "About Us" : "Om oss"}</h1>
      </div>

      <div id="bodyOmOss">
        <h2>
          <u>
            {engelska
              ? "Skola77 is a seating arrangement program developed by a group of young people. We believe that teachers should have access to well-made and effective tools to create a safe and productive classroom environment. That is why our seating arrangement program is designed with teachers in mind. Moreover, our website is completely free and ad-free."
              : "Skola77 är ett bordsplaceringsprogram utvecklat av en grupp ungdomar. Vi tycker det är självklart att lärare ska ha tillgång till välgjorda och effektiva verktyg för att kunna skapa trygghet och arbetsro i klassrummen. Det är därför vårt bordsplaceringsprogram är utvecklat med lärare i åtanke. Dessutom är vår hemsida helt gratis och utan reklam."}
          </u>
        </h2>
      </div>

      <div className="mail">
        <h1 id="mailHead">{engelska ? "Contact via Email:" : "Kontakt via E-post:"}</h1>
        <p id="mailorm">{engelska ? "For feedback:" : "För feedback:"}</p>
        <a href="mailto:feedback@skola77.com" id="feedbackMail">
          feedback@skola77.com
        </a>
        <p>{engelska ? "Other:" : "Övrigt:"}</p>
        <a href="mailto:support@skola77.com">support@skola77.com</a>
      </div>
    </body>
  );
};

export default Support;

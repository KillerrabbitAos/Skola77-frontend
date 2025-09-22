import React, { useEffect, useState } from "react";
import './policy.css';
const TermsOfService = () => {


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
            console.error("parse: ", parseError);
        }
    } catch (fetchError) {
        console.error("fetch: ", fetchError);
    }
  }



    useEffect(() => {
  
      checkLoginStatus()
  
    }, []);
  

  return (
    <div className="policy-container">
      <h1>{engelska ? "Terms of Service for Skola77" : "Användarvillkor för Skola77"}</h1>
      <p><strong>{engelska ? "Last updated:" : "Senast uppdaterad:"}</strong> [2024-09-30]</p>

      <p>
        {engelska
          ? "Welcome to Skola77. By using our service, you agree to these terms of service. Please read these terms carefully before using the service."
          : "Välkommen till Skola77. Genom att använda vår tjänst godkänner du dessa användarvillkor. Läs noggrant igenom dessa villkor innan du använder tjänsten."}
      </p>

      <h2>{engelska ? "1. Use of the Service" : "1. Användning av tjänsten"}</h2>
      <p>
        {engelska
          ? "You may use Skola77 for personal use or to manage seating arrangements in educational and event settings. You may not use the service in any way that violates laws or third-party rights."
          : "Du får använda Skola77 för personligt bruk eller för att hantera bordsplaceringar inom utbildning och evenemang. Du får inte använda tjänsten på ett sätt som bryter mot lagar eller tredje parts rättigheter."}
      </p>

      <h2>{engelska ? "2. Account Registration" : "2. Kontoregistrering"}</h2>
      <p>
        {engelska
          ? "To use Skola77, you need to create an account. You are responsible for keeping your account details secure and confidential. If you suspect that someone else has access to your account, you must contact us immediately."
          : "För att använda Skola77 behöver du skapa ett konto. Du är ansvarig för att hålla dina kontouppgifter säkra och konfidentiella. Om du misstänker att någon annan har åtkomst till ditt konto, måste du omedelbart kontakta oss."}
      </p>

      <h2>{engelska ? "3. Changes to the Service" : "3. Ändringar av tjänsten"}</h2>
      <p>
        {engelska
          ? "We reserve the right to modify, update, or discontinue the service at any time without prior notice. We strive to keep the service available but cannot guarantee uninterrupted access."
          : "Vi förbehåller oss rätten att ändra, uppdatera eller avsluta tjänsten när som helst utan föregående meddelande. Vi strävar efter att hålla tjänsten tillgänglig, men kan inte garantera att den är tillgänglig utan avbrott."}
      </p>

      <h2>{engelska ? "4. Limitation of Liability" : "4. Ansvarsbegränsning"}</h2>
      <p>
        {engelska
          ? "Skola77 is provided 'as is,' and we make no guarantees regarding its functionality, availability, or reliability. We are not responsible for any direct, indirect, or unforeseen damages arising from the use of the service."
          : "Skola77 tillhandahålls \"som den är\" och vi lämnar inga garantier för dess funktion, tillgänglighet eller tillförlitlighet. Vi ansvarar inte för direkta, indirekta, eller oförutsedda skador som uppstår vid användning av tjänsten."}
      </p>

      <h2>{engelska ? "5. Intellectual Property Rights" : "5. Immateriella rättigheter"}</h2>
      <p>
        {engelska
          ? "All rights to the content and software used in Skola77 belong to us or our licensors. You are not permitted to copy, modify, or distribute any part of the service without explicit written permission."
          : "Alla rättigheter till innehåll och programvara som används i Skola77 tillhör oss eller våra licensgivare. Du har ingen rätt att kopiera, modifiera eller distribuera delar av tjänsten utan uttryckligt skriftligt tillstånd."}
      </p>

      <h2>{engelska ? "6. Termination" : "6. Upphörande"}</h2>
      <p>
        {engelska
          ? "We reserve the right to terminate or restrict your access to the service if you violate these terms of service or if we suspect illegal activity on your account."
          : "Vi förbehåller oss rätten att avsluta eller begränsa din åtkomst till tjänsten om du bryter mot dessa användarvillkor eller om vi misstänker olaglig aktivitet på ditt konto."}
      </p>

      <h2>{engelska ? "7. Changes to the Terms of Service" : "7. Ändringar av användarvillkor"}</h2>
      <p>
        {engelska
          ? "We may update these terms of service from time to time. When we make significant changes, we will notify you via email or by publishing an updated version on our website. By continuing to use the service after the changes take effect, you agree to the updated terms."
          : "Vi kan uppdatera dessa användarvillkor från tid till annan. När vi gör betydande ändringar meddelar vi dig via e-post eller genom att publicera en uppdaterad version på vår webbplats. Genom att fortsätta använda tjänsten efter att ändringar har trätt i kraft, godkänner du de uppdaterade villkoren."}
      </p>

      <h2>{engelska ? "8. Contact Information" : "8. Kontaktinformation"}</h2>
      <p>
        {engelska
          ? "If you have questions about these terms of service, please contact us at:"
          : "Om du har frågor om dessa användarvillkor, vänligen kontakta oss på:"}
      </p>
      <p>
        {engelska ? "Email:" : "E-post:"} [<a href='mailto:support@skola77.com'>support@skola77.com</a>] <br />
      </p>
    </div>
  );
};

export default TermsOfService;

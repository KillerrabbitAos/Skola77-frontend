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
        setEngelska(JSON.parse(result.settings).engelska);
      } catch (parseError) {
        console.error("Kunde inte parsa data:", parseError);
      }
    } catch (fetchError) {
      console.error("Fel vid hämtning av data:", fetchError);
    }
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="bg-green-200 min-h-screen">
      <header className="bg-green-600 text-white py-8 shadow-md">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {engelska ? "Welcome to Support!" : "Välkommen till Support!"}
          </h1>
          <p className="mt-2 text-sm sm:text-lg">
            {engelska
              ? "Find materials, guides, and info for using Skola77."
              : "Hitta material, guider och information för användning av Skola77."}
          </p>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 space-y-10">
        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-6">
            {engelska ? "Resources" : "Resurser"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg">
              <p className="font-medium mb-2">{engelska ? "Quick Guide:" : "Snabbguide:"}</p>
              <a
                href="/PDFs/Skola77 Snabbguide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {engelska ? "Skola77's Quick Guide" : "Skola77:s snabbguide"}
              </a>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg">
              <p className="font-medium mb-2">{engelska ? "Terms:" : "Villkor:"}</p>
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {engelska ? "Skola77's Terms" : "Skola77:s villkor"}
              </a>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg">
              <p className="font-medium mb-2">{engelska ? "Privacy Policy:" : "Integritetspolicy:"}</p>
              <a
                href="/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {engelska ? "Skola77's Privacy Policy" : "Skola77:s policy"}
              </a>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg">
              <p className="font-medium mb-2">{engelska ? "Our Forum:" : "Vårat forum:"}</p>
              <a
                href="https://forum.skola77.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                {engelska ? "Skola77's Forum" : "Skola77:s forum"}
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-6">
            {engelska ? "FAQs" : "Vanliga Frågor"}
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <p className="font-medium">
                {engelska
                  ? "Can I save placements without downloading them?"
                  : "Kan jag spara placeringar utan att ladda ner dem?"}
              </p>
              <p className="text-gray-700 text-sm">
                {engelska
                  ? "Yes, click the save icon and name your placement."
                  : "Ja, klicka på sparaikonen och ge placeringen ett namn."}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <p className="font-medium">
                {engelska
                  ? "Can I save classrooms and lists separately?"
                  : "Kan jag spara klassrum och listor separat?"}
              </p>
              <p className="text-gray-700 text-sm">
                {engelska
                  ? "Yes, use the save boxes at the creator and name list."
                  : "Ja, använd sparrutorna vid skaparen och namnlistan."}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <p className="font-medium">
                {engelska
                  ? "I found an error, what should I do?"
                  : "Jag hittade ett fel, vad gör jag?"}
              </p>
              <p className="text-gray-700 text-sm">
                {engelska
                  ? "Contact us at "
                  : "Kontakta oss på "}
                <a
                  href="mailto:feedback@skola77.com"
                  className="text-green-600 hover:underline"
                >
                  feedback@skola77.com
                </a>
                {engelska ? "." : "."}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-6">
            {engelska ? "About Us" : "Om Oss"}
          </h2>
          <p className="text-gray-700 text-sm">
            {engelska
              ? "Skola77 provides tools to create productive classrooms. It’s free to use and ad-free."
              : "Skola77 erbjuder verktyg för att skapa produktiva klassrum. Det är gratis och utan reklam."}
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-green-700 mb-6">
            {engelska ? "Contact Us" : "Kontakta Oss"}
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
            <p className="font-medium">{engelska ? "Feedback:" : "Feedback:"}</p>
            <a
              href="mailto:feedback@skola77.com"
              className="text-green-600 hover:underline"
            >
              feedback@skola77.com
            </a>
            <p className="font-medium mt-2">{engelska ? "Other Inquiries:" : "Övriga frågor:"}</p>
            <a
              href="mailto:support@skola77.com"
              className="text-green-600 hover:underline"
            >
              support@skola77.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Support;

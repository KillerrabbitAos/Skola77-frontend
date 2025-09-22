import React, { useEffect, useState } from "react";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [engelska, setEngelska] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("engelska");

  async function checkLoginStatus() {
    try {
      const response = await fetch("https://auth.skola77.com/home", {
        credentials: "include",
      });
      const result = await response.json();

      try {
        const settings = JSON.parse(result.settings);
        if (!settings.engelska) {
          setEngelska(false);
          setSelectedLanguage("svenska");
        }
        setDarkMode(settings.efternamnförst);
      } catch (parseError) {
        console.error("Kunde inte parsa data:", parseError);
        window.location.href = "https://auth.skola77.com?skola77";
      }
    } catch (fetchError) {
      console.error("Fel vid hämtning av data:", fetchError);
      window.location.href = "https://auth.skola77.com?skola77";
    }
  }

  async function sparaInställningar(nyaInställningar) {
    try {
      const response = await fetch("https://auth.skola77.com/updateSettings", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nyaInställningar),
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className={`min-h-screen p-6 bg-green-50 text-gray-800`}>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 border border-green-300">
        <div className="flex">
          <div className="flex flex-grow">
            <h1 className="text-2xl font-bold mb-4 text-green-700">
              {engelska ? "Settings" : "Inställningar"}
            </h1>
          </div>
          <div
            onClick={() => {
              window.location.replace("/mittKonto");
            }}
          >
            <img
              className="bg-green-600 w-[50px] cursor-grab border-[5px] border-green-600 rounded-lg"
              src="/pil-vänster.png"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const newLanguage = e.target.value;
                setSelectedLanguage(newLanguage);
                setEngelska(newLanguage === "engelska");
              }}
            >
              <option value="engelska">
                {engelska ? "English" : "Engelska"}
              </option>
              <option value="svenska">
                {engelska ? "Swedish" : "Svenska"}
              </option>
            </select>
            <span className="text-lg">{engelska ? "Language" : "Språk"}</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-green-600"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="text-lg">
              {engelska
                ? "Spreadsheet import assumes surnames are written first."
                : "Kalkylarkimporter antar att efternamn står först."}
            </span>
          </label>
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
          onClick={async () => {
            await sparaInställningar({
              engelska: engelska,
              efternamnförst: darkMode,
            });
            window.location.reload();
          }}
        >
          {engelska ? "Save changes" : "Spara ändringar"}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

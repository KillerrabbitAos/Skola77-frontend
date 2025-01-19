import './policy.css';

import React, { useEffect, useState } from "react";

const Policy = () => {
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
                console.error("Could not parse data:", parseError);
            }
        } catch (fetchError) {
            console.error("Error fetching data:", fetchError);
        }
    }

    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div className='policy-container'>
            <h1>{engelska ? "Privacy Policy for Skola77" : "Integritetspolicy för Skola77"}</h1>
            <p><strong>{engelska ? "Last updated:" : "Senast uppdaterad:"}</strong> [2024-09-30]</p>

            <p>
                {engelska
                    ? "We at Skola77 care about your privacy and strive to protect your personal data responsibly. This privacy policy describes how we collect, use, and protect your data when you use our service."
                    : "Vi på Skola77 värnar om din integritet och strävar efter att skydda dina personuppgifter på ett ansvarsfullt sätt. Denna integritetspolicy beskriver hur vi samlar in, använder och skyddar dina uppgifter när du använder vår tjänst."}
            </p>

            <h2>{engelska ? "1. What Data We Collect" : "1. Vilka uppgifter vi samlar in"}</h2>
            <p>{engelska ? "When using Skola77, we may collect the following personal data:" : "När du använder Skola77 kan vi komma att samla in följande personuppgifter:"}</p>
            <ul>
                <li><strong>{engelska ? "Email address:" : "E-postadress:"}</strong> {engelska ? "Used to create and maintain your account, and to send important information." : "Används för att skapa och underhålla ditt konto, samt för att skicka viktig information."}</li>
                <li><strong>{engelska ? "Username:" : "Användarnamn:"}</strong> {engelska ? "Used as an identifier in the system." : "Används som identifierare i systemet."}</li>
                <li><strong>{engelska ? "Encrypted password:" : "Krypterat lösenord:"}</strong> {engelska ? "Your password is end-to-end encrypted to ensure your security." : "Ditt lösenord är änd-till-änd-krypterat för att skydda din säkerhet."}</li>
            </ul>

            <h2>{engelska ? "2. How We Use Your Data" : "2. Hur vi använder dina uppgifter"}</h2>
            <p>{engelska ? "We use the data we collect for the following purposes:" : "Vi använder de uppgifter vi samlar in för följande ändamål:"}</p>
            <ul>
                <li><strong>{engelska ? "To provide the service:" : "För att tillhandahålla tjänsten:"}</strong> {engelska ? "We use your data to create and maintain your account and enable the use of the service's features." : "Vi använder dina uppgifter för att skapa och underhålla ditt konto och möjliggöra användningen av tjänstens funktioner."}</li>
                <li><strong>{engelska ? "For communication:" : "För kommunikation:"}</strong> {engelska ? "We may use your email address to send you updates, support information, or other important messages about the service." : "Vi kan komma att använda din e-postadress för att skicka dig uppdateringar, supportinformation eller andra viktiga meddelanden om tjänsten."}</li>
                <li><strong>{engelska ? "To improve the service:" : "För att förbättra tjänsten:"}</strong> {engelska ? "Data may also be used to analyze how our service is used and to develop new features." : "Uppgifter kan också användas för att analysera hur vår tjänst används och för att utveckla nya funktioner."}</li>
            </ul>

            <h2>{engelska ? "3. Legal Basis for Processing" : "3. Rättslig grund för behandling"}</h2>
            <p>{engelska
                ? "The processing of your personal data is based on your consent when you create an account with us and use our service. You have the right to withdraw your consent at any time by contacting us or deleting your account."
                : "Behandlingen av dina personuppgifter grundar sig på ditt samtycke när du skapar ett konto hos oss och använder vår tjänst. Du har rätt att när som helst återkalla ditt samtycke genom att kontakta oss eller radera ditt konto."}
            </p>

        </div>
    );
};

export default Policy;

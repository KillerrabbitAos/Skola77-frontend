import React, { useState, useEffect } from "react";
import "./Layout.css";
import Kugghjul from "../imgs/kugghjul-removebg-preview.png";
import Footer from "../sidor/footer";

import "../test.css";
const MittKonto = () => {
  const [userData, setUserData] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [banUsername, setBanUsername] = useState("");
  const [users, setUsers] = useState("unavailable");
  const [loading, setLoading] = useState(true);
  const [engelska, setEngelska] = useState(true);

  const hashPassword = async (password) => {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        window.location.replace("/");
      } else {
        console.error("Utloggning misslyckades. Kontakta support");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const deleteUserAccount = () => {
    fetch("https://auth.skola77.com/deleteUser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "https://skola77.com";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Fel vid borttagning av konto:", error);
        alert("Något gick fel. Försök igen senare.");
      });
  };

  const handleUpdateUser = async (field, value) => {
    setStatusMessage("");
    try {
      const updatedData = {};
      if (field === "password") {
        updatedData[field] = await hashPassword(value);
      } else {
        updatedData[field] = value;
      }

      const response = await fetch("https://auth.skola77.com/editUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      if (result.success) {
        checkLoginStatus();
        setStatusMessage("Uppdatering lyckades!");
        closeModals();
      } else {
        setStatusMessage(result.message || "Något gick fel.");
      }
    } catch (error) {
      console.error("An error occurred while updating user data:", error);
      setStatusMessage("Något gick fel vid uppdateringen.");
    }
  };

  const closeModals = () => {
    setShowUsernameModal(false);
    setShowEmailModal(false);
    setShowPasswordModal(false);
    setShowDeleteAccountModal(false);
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    setConfirmationText("");
    setStatusMessage("");
  };

  async function checkLoginStatus() {
    try {
      const response = await fetch("http://localhost:5051/user/user-access", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      try {
        const user = result.user;
        const data = result.userData.oldFrontendData;
        setEngelska(user.language === "en");
        setUserData(data);
      } catch (parseError) {
        console.error("Kunde inte parsa data:", parseError);
        // window.location.href = "http://localhost:5051/login";
      }
    } catch (fetchError) {
      console.error("Fel vid hämtning av data:", fetchError);
      // window.location.href = "http://localhost:5051/login";
    }
  }
  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:5051/users", {
        credentials: "include",
      });
      const result = await response.json();
      if (result) {
        setUsers(result.users);
      } else {
        window.location.replace("/login.html");
      }
    } catch (error) {
      console.error(
        "Ett fel inträffade vid kontroll av inloggningsstatus:",
        error
      );
    }
  };

  const downloadUserData = async () => {
    try {
      const response = await fetch("http://localhost:5051/user-access", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.loggedin) {
        const blob = new Blob([data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "användardata.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert("Du är inte inloggad.");
      }
    } catch (error) {
      console.error("Fel vid nedladdning av data:", error);
      alert("Något gick fel vid nedladdningen.");
    }
  };

  const handleRefresh = () => {
    if (!sessionStorage.getItem("refreshed")) {
      sessionStorage.setItem("refreshed", "true");

      window.location.reload();
    }
  };

  const waitForValidData = async (maxRetries = 2) => {
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < maxRetries) {
      attempts++;
      try {
        // Start loading
        setLoading(true);

        const data = users; // Await the result of checkLoginStatus
        console.log("Fetched data:", data); // Log fetched data

        // Check if data can be split correctly

        if (users != "unavailable") {
          // Ensure it splits into two parts
          console.log("Data is valid:", users);
          isValid = true; // Set flag to true if data is valid
        } else {
          console.log("Data is invalid, retrying...");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        // End loading
      }

      // Wait before the next attempt if not valid yet
      if (!isValid) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 1 second
      } else {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    waitForValidData(); // Call the function when the component mounts
  }, []);
  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Kör handleRefresh endast när sidan laddas om för första gången i sessionen
    if (!sessionStorage.getItem("refreshed")) {
      handleRefresh();
    }
  }, []);
  useEffect(() => {
    if (userData && userData.admin === 1) {
      getUsers(); // Anropa getUsers om användaren är en admin
    }
  }, [userData]);
  return (
    <div className="flex flex-col items-center bg-white min-h-screen py-10">
      {/* Mitt konto */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 border border-green-200 mb-6">
        {userData ? (
          <div id="användardata">
            <div className="flex">
              <div className="flex flex-grow">
                <h1 className="text-3xl text-left font-semibold text-green-700 mb-6">
                  {engelska ? "My Account" : "Mitt Konto"}
                </h1>
              </div>
              <div
                id="snigel"
                className=""
                onClick={() => {
                  window.location.replace("/settings");
                }}
              >
                <img
                  id=""
                  className="w-[100px] cursor-pointer kugghjul"
                  src={Kugghjul}
                ></img>
              </div>
            </div>
            <div id="username" className="mb-4">
              <p className="text-sm text-gray-600">
                {engelska ? "Username:" : "Användarnamn:"}
              </p>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-lg text-green-800">{userData.username}</p>
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => setShowUsernameModal(true)}
                >
                  {engelska ? "Edit" : "Ändra"}
                </button>
              </div>
            </div>
            <div id="email" className="mb-4">
              <p className="text-sm text-gray-600">
                {engelska ? "Email Address:" : "E-postadress:"}
              </p>
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-lg text-green-800">{userData.email}</p>
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => setShowEmailModal(true)}
                >
                  {engelska ? "Edit" : "Ändra"}
                </button>
              </div>
            </div>
            <div id="password" className="mb-4">
              <p className="text-sm text-gray-600">
                {engelska ? "Password:" : "Lösenord:"}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-lg text-green-800">************</p>
                <button
                  className="text-green-600 hover:underline"
                  onClick={() => setShowPasswordModal(true)}
                >
                  {engelska ? "Change" : "Ändra"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">{loginMessage}</p>
        )}

        <div id="KontoButtons" className="mt-0 flex justify-between gap-4">
          <button
            onClick={handleLogout}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            {engelska ? "Log Out" : "Logga ut"}
          </button>
          <button
            className="bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 transition duration-300"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            {engelska ? "Delete My Account" : "Ta bort mitt konto"}
          </button>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
            onClick={downloadUserData}
          >
            {engelska ? "Download My Data" : "Ladda ned min data"}
          </button>
        </div>
      </div>


      {showUsernameModal && (
        <div className={`modal ${showUsernameModal ? "show" : ""}`}>
          <div className="modal-content">
            <h2>{engelska ? "Edit username" : "Redigera användarnamn"}</h2>
            <p id="description">
              {engelska
                ? "Change the username connected to your account."
                : "Ändra användarnamnet kopplat till ditt konto."}
            </p>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={engelska ? "New username" : "Nytt användarnamn"}
              id="modalTextInput"
            />
            <p id="status">{statusMessage}</p>
            <button
              className="mr-2"
              onClick={() => handleUpdateUser("username", newUsername)}
            >
              {engelska ? "save" : "Spara"}
            </button>
            <button onClick={closeModals}>
              {engelska ? "Cancel" : "Avbryt"}
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className={`modal ${showPasswordModal ? "show" : ""}`}>
          <div className="modal-content">
            <h2>{engelska ? "Change password" : "Ändra lösenord"}</h2>
            <p id="description">
              {engelska
                ? "Change the password connected to your account. "
                : "Ändra lösenordet kopplat till ditt konto. "}
              <u>
                {engelska
                  ? "We recommend a password with at least 6 characters."
                  : "Vi rekommenderar ett lösenord på minst 6 tecken."}
              </u>
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={engelska ? "New password" : "Nytt lösenord"}
              id="modalTextInput"
            />
            <p id="status">{statusMessage}</p>
            <button
              className="mr-2"
              onClick={() => handleUpdateUser("password", newPassword)}
            >
              {engelska ? "Save" : "Spara"}
            </button>
            <button onClick={closeModals}>
              {engelska ? "Cancel" : "Avbryt"}
            </button>
          </div>
        </div>
      )}

      {showEmailModal && (
        <div className={`modal ${showEmailModal ? "show" : ""}`}>
          <div className="modal-content">
            <h2>{engelska ? "Update email" : "Uppdatera e-postadress"}</h2>
            <p id="description">
              {engelska
                ? "Change the email connected to your account"
                : "Ändra e-postadressen kopplad till ditt konto."}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser("email", newEmail);
              }}
            >
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={engelska ? "New email" : "Ny e-postadress"}
                id="modalTextInput"
                required
              />
              <p id="status">{statusMessage}</p>
              <button className="mr-2" type="submit">
                {engelska ? "Save" : "Spara"}
              </button>
              <button type="button" onClick={closeModals}>
                {engelska ? "Cancel" : "Avbryt"}
              </button>
            </form>
          </div>
        </div>
      )}
      {showDeleteAccountModal && (
        <div className={`modal ${showDeleteAccountModal ? "show" : ""}`}>
          <div className="modal-content">
            <h2>
              {engelska
                ? "Confirm account deleation"
                : "Bekräfta borttagning av konto"}
            </h2>
            <p>
              {engelska
                ? "To confirm the deletion of your account, print"
                : "För att bekräfta borttagning av ditt konto, skriv"}{" "}
              "
              <b>
                <u>ja, jag vill ta bort mitt konto</u>
              </b>
              ".
            </p>
            <p>
              {engelska
                ? "All data will be removed"
                : "All data kommer tas bort"}{" "}
              <u>{engelska ? "immediately!" : "omedelbart!"}</u>
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={engelska ? "Write here" : "Skriv här"}
              id="modalTextInput"
            />
            <p id="status">{statusMessage}</p>
            <button
              className="mr-2"
              id="removeAccountJa"
              onClick={() => {
                deleteUserAccount();
                closeModals();
              }}
              disabled={confirmationText !== "ja, jag vill ta bort mitt konto"}
            >
              {engelska ? "Confirm" : "Bekräfta"}
            </button>
            <button onClick={closeModals} id="removeAccountNej">
              {engelska ? "Cancel" : "Avbryt"}
            </button>
          </div>
        </div>
      )}
      <Footer isFixed={true} />
    </div>
  );
};

export default MittKonto;

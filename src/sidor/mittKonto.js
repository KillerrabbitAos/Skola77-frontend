import React, { useState, useEffect } from 'react';

const MittKonto = () => {
    const [userData, setUserData] = useState(null);
    const [loginMessage, setLoginMessage] = useState('');
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [confirmationText, setConfirmationText] = useState('');

    const hashPassword = async (password) => {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('https://account.skola77.com:3005/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                window.location.replace("/editor");
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const deleteUserAccount = () => {
        fetch('https://account.skola77.com:3005/deleteUser', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'https://skola77.com';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Fel vid borttagning av konto:', error);
            alert('Något gick fel. Försök igen senare.');
        });
    };

    const handleUpdateUser = async (field, value) => {
        setStatusMessage('');
        try {
            const updatedData = {};
            if (field === 'password') {
                updatedData[field] = await hashPassword(value);
            } else {
                updatedData[field] = value;
            }

            const response = await fetch('https://account.skola77.com:3005/editUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            if (result.success) {
                checkLoginStatus();
                setStatusMessage('Uppdatering lyckades!');
                closeModals();
            } else {
                setStatusMessage(result.message || 'Något gick fel.');
            }
        } catch (error) {
            console.error('An error occurred while updating user data:', error);
            setStatusMessage('Något gick fel vid uppdateringen.');
        }
    };

    const closeModals = () => {
        setShowUsernameModal(false);
        setShowEmailModal(false);
        setShowPasswordModal(false);
        setShowDeleteAccountModal(false);
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setConfirmationText('');
        setStatusMessage('');
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('https://account.skola77.com:3005/home', {
                credentials: 'include'
            });
            const result = await response.json();
            if (result.loggedin) {
                setUserData({
                    username: result.username,
                    email: result.email,
                    data: result.data
                });
            } else {
                setLoginMessage(result.message);
                window.location.replace("/login.html"); // Lägg till denna rad för att omdirigera till inloggning
            }
        } catch (error) {
            console.error('An error occurred while checking login status:', error);
        }
    };

    const downloadUserData = async () => {
        try {
            const response = await fetch('https://account.skola77.com:3005/home', {
                credentials: 'include'
            });
            const data = await response.json();
    
            // Kontrollera om användaren är inloggad
            if (data.loggedin) {
                const textData = `Användarnamn: ${data.username}\nE-post: ${data.email}\nBordsplaceringsdata: ${data.data}`;
                const blob = new Blob([textData], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
    
                const a = document.createElement('a');
                a.href = url;
                a.download = 'användardata.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert('Du är inte inloggad.');
            }
        } catch (error) {
            console.error('Fel vid nedladdning av data:', error);
            alert('Något gick fel vid nedladdningen.');
        }
    };

    const handleRefresh = () => {
        if (!sessionStorage.getItem('refreshed')) {
          sessionStorage.setItem('refreshed', 'true');
          window.location.reload();
        }
      };
      
    
    

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {

        // Kör handleRefresh endast när sidan laddas om för första gången i sessionen
        if (!sessionStorage.getItem('refreshed')) {
          handleRefresh();
        }
      }, []);
      

    return (
        <div className="container">
            {userData ? (
                <div id='användardata'>
                    <div id='username'>
                        <p id='placeholder'>Användarnamn:</p>
                        <div className="account-info">
                            <p className='data'>{userData.username}</p>
                            <button id='accountButton' onClick={() => setShowUsernameModal(true)}>Ändra</button>
                        </div>
                    </div>
                    <div id='email'>
                        <p id='placeholder'>E-postadress:</p>
                        <div className="account-info">
                            <p className='data'>{userData.email}</p>
                            <button id='accountButton' onClick={() => setShowEmailModal(true)}>Ändra</button>
                        </div>
                    </div>
                    <div id='password'>
                        <p id='placeholder'>Lösenord:</p>
                        <div className="account-info">
                            <p className='data'>************</p>
                            <button id='accountButton' onClick={() => setShowPasswordModal(true)}>Ändra</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text">{loginMessage}</p>
            )}

            <div id='KontoButtons'>
            <button onClick={handleLogout} id='signOut' className='accountActionButtons'>Logga ut</button>
            <button className='accountActionButtons' onClick={() => setShowDeleteAccountModal(true)}>Ta bort mitt konto</button>
            <button className='accountActionButtons' onClick={downloadUserData}>Ladda ned min data</button>
            </div>
           

            {showUsernameModal && (
                <div className={`modal ${showUsernameModal ? 'show' : ''}`}>
                    <div className="modal-content">
                        <h2>Redigera användarnamn</h2>
                        <p id='description'>Ändra användarnamnet kopplat till ditt konto.</p>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Nytt användarnamn"
                            id="modalTextInput"
                        />
                        <p id='status'>{statusMessage}</p>
                        <button onClick={() => handleUpdateUser('username', newUsername)}>Spara</button>
                        <button onClick={closeModals}>Avbryt</button>
                    </div>
                </div>
            )}

            {showEmailModal && (
                <div className={`modal ${showEmailModal ? 'show' : ''}`}>
                    <div className="modal-content">
                    <h2>Uppdatera e-postadress</h2>
<p id='description'>Ändra e-postadressen kopplad till ditt konto.</p>
<form onSubmit={(e) => {
    e.preventDefault(); 
    handleUpdateUser('email', newEmail);
}}>

    <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="Ny e-postadress"
        id="modalTextInput"
        required
    />
    <p id='status'>{statusMessage}</p>
    <button type='submit'>Spara</button>
    <button type='button' onClick={closeModals}>Avbryt</button>

</form>

                    </div>
                </div>
            )}

            {showPasswordModal && (
                <div className={`modal ${showPasswordModal ? 'show' : ''}`}>
                    <div className="modal-content">
                        <h2>Ändra lösenord</h2>
                        <p id='description'>Ändra lösenordet kopplat till ditt konto.</p>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nytt lösenord"
                            id="modalTextInput"
                        />
                        <p id='status'>{statusMessage}</p>
                        <button onClick={() => handleUpdateUser('password', newPassword)}>Spara</button>
                        <button onClick={closeModals}>Avbryt</button>
                    </div>
                </div>
            )}

            {showDeleteAccountModal && (
                <div className={`modal ${showDeleteAccountModal ? 'show' : ''}`}>
                    <div className="modal-content">
                        <h2>Bekräfta borttagning av konto</h2>
                        <p>För att bekräfta borttagning av ditt konto, skriv "<b><u>ja, jag vill ta bort mitt konto</u></b>".</p>
                        <p>All data kommer tas bort <u>omedelbart!</u></p>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="Skriv här"
                            id="modalTextInput"
                        />
                        <p id='status'>{statusMessage}</p>
                        <button id='removeAccountJa'
                            onClick={() => {
                                deleteUserAccount();
                                closeModals();
                            }} 
                            disabled={confirmationText !== "ja, jag vill ta bort mitt konto"}
                        >
                            Bekräfta
                        </button>
                        <button onClick={closeModals} id='removeAccountNej'>Avbryt</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MittKonto;

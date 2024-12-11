import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // För att läsa URL-parametrar

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    async function hashPassword(password) {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Lösenorden matchar inte!');
            return;
        }

        const hashedPassword = await hashPassword(newPassword);
        

        const response = await fetch('https://auth.skola77.com/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, email, hashedPassword })
        });

        const data = await response.json();

        if (data.success) {
            setMessage('Lösenordet har återställts!');
            window.location.href = "/login.html";

        } else {
            setMessage(data.message);
        }
    };

    return (
        <div id="reset-password-container">
            <h2>Återställ lösenord</h2>
            <form onSubmit={handleSubmit}>
                <label className="form-label">
                    Nytt lösenord:
                    <input
                        type="password"
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label className="form-label">
                    Bekräfta lösenord:
                    <input
                        type="password"
                        className="form-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button id="submit-button" type="submit">Återställ lösenord</button>
            </form>
            {message && <p id="message">{message}</p>}
        </div>
    );
}
export default ResetPassword;

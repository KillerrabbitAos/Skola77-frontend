import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
            window.location.href = "/";

        } else {
            setMessage(data.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Återställ lösenord</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Nytt lösenord:</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Bekräfta lösenord:</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                    >
                        Återställ lösenord
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-green-700">{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
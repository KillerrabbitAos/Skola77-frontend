import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MittKonto = () => {


    const handleLogout = async () => {
        const response = await fetch('https://account.skola77.com:3005/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });

          window.location.replace("/editor");


        
    };

    return (
        <div>

            <button onClick={handleLogout}>Logga ut</button>
            <p id='signOutStatus'></p>

        </div>

        
    )

};



export default MittKonto;

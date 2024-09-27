import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MittKonto = () => {


    const handleLogout = async () => {
        const response = await fetch('https://192.168.50.10:3005/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          });

          window.location.replace("https://www.skola77.com");


        
    };

    return (
        <div>

            <button onClick={handleLogout}>Logga ut</button>
            <p id='signOutStatus'></p>

        </div>

        
    )

};



export default MittKonto;

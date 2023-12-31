import React, { useState } from 'react';

const TablePlanner = () => {
  const [guestList, setGuestList] = useState([]);
  const [newGuest, setNewGuest] = useState('');
  const [selectedTable, setSelectedTable] = useState('');

  const handleAddGuest = () => {
    if (newGuest.trim() !== '' && selectedTable !== '') {
      const updatedGuestList = [...guestList, { name: newGuest, table: selectedTable }];
      setGuestList(updatedGuestList);
      setNewGuest('');
      setSelectedTable('');
    } else {
      alert('Vänligen fyll i gästens namn och välj ett bord.');
    }
  };

  const handleRemoveGuest = (index) => {
    const updatedGuestList = [...guestList];
    updatedGuestList.splice(index, 1);
    setGuestList(updatedGuestList);
  };

  return (
    <div>
      <h2>Bordsplacering</h2>
      <div>
        <input
          type="text"
          placeholder="Gästens namn"
          value={newGuest}
          onChange={(e) => setNewGuest(e.target.value)}
        />
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Välj bord</option>
          <option value="Table 1">Bord 1</option>
          <option value="Table 2">Bord 2</option>
          <option value="Table 3">Bord 3</option>
          {/* Lägg till fler bord här */}
        </select>
        <button onClick={handleAddGuest}>Lägg till gäst</button>
      </div>
      <ul>
        {guestList.map((guest, index) => (
          <li key={index}>
            {guest.name} - {guest.table}
            <button onClick={() => handleRemoveGuest(index)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TablePlanner;

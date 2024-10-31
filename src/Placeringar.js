import { useState } from "react";
import Klassrum from "./Klassrum";
import { data } from "./data";
import NameList from "./Namn";

const SkapaPlaceringar = () => {
  const [grid, setGrid] = useState(data.klassrum[0].grid);
  const [Klassnamn, setKlassnamn] = useState(null);
  const [namn, setNamn] = useState(["", "orm"]);

  const slumpa = () => {
    const nyGrid = [];
    const användaNummer = [];
    grid.map((rad) => {
      const nyRad = rad.map((plats, kolumn) => {
        if (plats.id && namn.length > 5 && kolumn < 5) {
          let nummer = Math.floor(Math.random() * (namn.length - 1)) + 1;
          let orm = false;
          let i = 0;
          while (användaNummer.includes(nummer) && i < 1000) {
            console.log("has");
            nummer = Math.floor(Math.random() * (namn.length - 1)) + 1;
            if (användaNummer.length === (namn.length - 1)) {
              nummer = 0;
              console.log(användaNummer);
              

            }
            i++
          }
          if (nummer !== 0) {
            användaNummer.push(nummer);
          }
          return {
            id: plats.id,
            person: nummer,
          };
        } else {
          return plats;
        }
      });
      nyGrid.push(nyRad);
    });
    setGrid(nyGrid);
  };

  return (
    <div>
      <Klassrum edit={false} grid={grid} setGrid={setGrid} names={namn} />{" "}
      <button onClick={slumpa}>Slumpa</button>
      {data.klasser
        .slice()
        .reverse()
        .map((klass) => (
          <li
            key={klass.namn}
            className="font-bold text-xl p-2 cursor-pointer"
            onClick={() => {
              setNamn(klass.personer);
              setKlassnamn(klass.namn);
            }}
          >
            {klass.namn}
          </li>
        ))}
    </div>
  );
};

export default SkapaPlaceringar;

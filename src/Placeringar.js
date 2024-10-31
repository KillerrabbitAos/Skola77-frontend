import { useState } from "react";
import Klassrum from "./Klassrum";
import { data } from "./data";
import NameList from "./Namn";

const SkapaPlaceringar = () => {
  const [grid, setGrid] = useState(data.klassrum[0].grid);
  const [Klassnamn, setKlassnamn] = useState(null);
  const [namn, setNamn] = useState(["", "orm"]);

  const slumpa = () => {}

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

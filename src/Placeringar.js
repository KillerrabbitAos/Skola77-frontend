import { useState } from 'react';
import Klassrum from './Klassrum';
import { data } from './data';

const SkapaPlaceringar = () => {
    const [grid, setGrid] = useState(data.klassrum[0].grid)
  
    return(<Klassrum grid={grid} setGrid={setGrid}/>)
}

export default SkapaPlaceringar;
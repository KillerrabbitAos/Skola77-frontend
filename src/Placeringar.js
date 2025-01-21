import {useState, useEffect, useRef} from "react";
import Klassrum from "./Klassrum";
import {data as originalData} from "./data";
import NameList from "./Klasser";
import {RiDeleteBin6Line} from "react-icons/ri";
import "./Animationer.css";
import "./print.css";
import Overlay from "./Overlay";


function generateUniqueId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function divideArray(list, x) {
    if (x <= 0) throw new Error("Number of parts must be greater than 0.");
    const result = [];
    const partSize = Math.floor(list.length / x);
    let remainder = list.length % x;
    let start = 0;

    for (let i = 0; i < x; i++) {
        const end = start + partSize + (remainder > 0 ? 1 : 0);
        result.push(list.slice(start, end));
        start = end;
        if (remainder > 0) remainder--;
    }

    return result;
}

function sparaData(nyData) {
    fetch("https://auth.skola77.com/updateData", {
        credentials: "include", method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify(nyData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

const myList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const dividedLists = divideArray(myList, 3);

console.log(dividedLists);

async function scaleToFit(content, setUpdateSize, updateSize) {
    const engelska = true
    const pageWidth = 8.27; // A4 width in inches (Letter: 8.5)
    const pageHeight = 11.69; // A4 height in inches (Letter: 11)

    const dpi = calculateDPI();

    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;

    const printableWidth = pageWidth * dpi;
    const printableHeight = pageHeight * dpi;

    const scaleX = printableWidth / contentWidth;
    const scaleY = printableHeight / contentHeight;

    const scale = Math.min(scaleX, scaleY);

    content.style.transformOrigin = "top left";
    const originalTransform = content.style.transform;  // Spara det ursprungliga värdet på transform
    content.style.transform = `scale(${scale})`;

    // Centrera innehållet med transform
    content.style.position = "absolute";
    content.style.top = "50%";
    content.style.left = "50%";
    content.style.transform += " translate(-50%, -50%)";  // Lägg till för att centrera

    await new Promise((resolve) => setTimeout(resolve, 200));

    setUpdateSize(!updateSize);

    // Lägg till event listeners för att hantera utskriftslayouten
    const handleAfterPrint = () => {
        // Återställ layout när användaren lämnar utskriftsläge
        content.style.transform = originalTransform;  // Återställ till ursprungliga transform
        content.style.position = "relative";
        // Läs om sidan
        window.location.reload();
    };

    window.addEventListener('afterprint', handleAfterPrint);

    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(engelska ? "To get a correct printout, it is important that you check 'Background graphics' in the print settings." : 'För att få en korrekt utskrift är det viktigt att du bockar i "Bakgrundsgrafik" i utskriftsinställningarna." ')
    window.print();

    // Ta bort event listener efter utskrift
    window.removeEventListener('afterprint', handleAfterPrint);
}

// Function to calculate DPI dynamically
function calculateDPI() {
    // Create a hidden element to test DPI
    const dpiTest = document.createElement("div");
    dpiTest.style.width = "1in"; // Set width to 1 inch
    dpiTest.style.height = "1in"; // Optional: height to 1 inch for consistency
    dpiTest.style.position = "absolute"; // Avoid layout interference
    dpiTest.style.visibility = "hidden"; // Ensure it's not visible
    document.body.appendChild(dpiTest);

    // Measure the width in pixels
    const dpi = dpiTest.offsetWidth;

    // Remove the test element from the DOM
    document.body.removeChild(dpiTest);

    return dpi; // Return the raw DPI value
}

const SkapaPlaceringar = () => {
    const [rows, setRows] = useState(6);

    const [cols, setCols] = useState(7);
    const [grid, setGrid] = useState(Array.from({length: rows}, () => Array.from({length: cols}, () => ({
        id: null, person: 0
    }))));
    const [data, setData] = useState(null);
    const [klassrumsId, setKlassrumsId] = useState(null);
    const [updateSize, setUpdateSize] = useState(false);
    const [kolumner, setKolumner] = useState(3);
    const [frånvarande, setFrånvarande] = useState([]);
    const [klassnamn, setKlassnamn] = useState(null);
    const [namn, setNamn] = useState(["", "orm"]);
    const [låstaBänkar, setLåstaBänkar] = useState([]);
    const [klar, setKlar] = useState(false);
    const [omvänd, setOmvänd] = useState(false);
    const [klassId, setKlassId] = useState(null);
    const [sparat, setSparat] = useState(true);
    const [klassrumsnamn, setKlassrumsnamn] = useState(null);
    const [placeringsId, setPlaceringsId] = useState(null);
    const [placeringsnamn, setPlaceringsnamn] = useState(null);
    const [visaKlassmeny, setVisaklassmeny] = useState(true);
    const [visaKlassrumsmeny, setVisaklassrumsmeny] = useState(true);
    const [vägg, setVägg] = useState(false);
    const klassrumsmenyRef = useRef(null);
    const [laddarPlacering, setLaddarPlacering] = useState(false);
    const klassmenyRef = useRef(null);
    const [engelska, setEngelska] = useState(true)
    const [klassmenykord, setKlassmenykord] = useState([1]);
    const [klassrumsmenykord, setKlassrumsmenykord] = useState([1]);
    const [nyttPlaceringsnamn, setNyttPlaceringsnamn] = useState(null);

    const nameDiv = useRef(null);
    const content = useRef(null);

    const väljKLassOchKlassrum = (<div className="flex flex-wrap justify-center gap-4">
        <div
            ref={klassmenyRef}
            className="w-fit justify-center items-center flex"
        >
            <div style={{height: "46px"}}>
                <h2 className="text-xl mt-2 font-bold mr-1">{engelska ? "Class" : "Klass"}:</h2>
            </div>
            <div
                style={{
                    position: "relative", width: "180px", height: "46px",
                }}
                className="!h-[46px]"
            >
                <Overlay style={{zIndex: "600"}}>
                    <ul
                        style={{
                            height: visaKlassmeny ? "12rem" : "46px",
                        }}
                        className="overflow-y-scroll scrollbar-none place-self-start bg-[#f1f1f1] w-52 border border-black"
                    >
                        {visaKlassmeny ? (data && (<div>
                            <div className="flex">
                                <li
                                    className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                                    onClick={() => setVisaklassmeny(false)}
                                >
                                    <div className="flex justify-center items-center">
                                        <div className="w-[155px] truncate">
                                        {klassnamn || (engelska ? "Choose class..." : "Välj klass...")}
                                        </div>
                                        <img className="w-[20px]" src="/nerpil.png"></img>
                                    </div>
                                </li>
                            </div>
                            {data.klasser.map((klass) => {
                                if (klass.id !== klassId) {
                                    return (<li
                                        key={klass.id}
                                        className="font-bold text-xl p-2 cursor-pointer"
                                        onClick={() => {
                                            setNamn(klass.personer);
                                            setKlassnamn(klass.namn);
                                            setKlassId(klass.id);
                                            setGrid((prevGrid) => prevGrid.map((rad) => rad.map((ruta) => {
                                                return {id: ruta.id, person: 0};
                                            })));
                                            setVisaklassmeny(false);
                                        }}
                                    >
                                        {klass.namn}
                                    </li>);
                                }
                            })}
                        </div>)) : (<div
                            className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                            onClick={() => {
                                setVisaklassmeny(true);
                            }}
                        >
                            <div className="flex justify-center items-center">
                                <div className="w-[155px] truncate">
                                {klassnamn || (engelska ? "Choose class..." : "Välj klass...")}
                                </div>
                                <img
                                    style={{
                                        rotate: !visaKlassmeny && "90deg",
                                        animationName: visaKlassmeny ? "vridNer" : "vridUpp",
                                        animationDuration: "0.1s",
                                    }}
                                    className="w-[20px]"
                                    src="/nerpil.png"
                                ></img>
                            </div>
                        </div>)}
                    </ul>
                </Overlay>
            </div>
        </div>

        {<div className="w-fit flex justify-center items-center">
            <div style={{height: "46px"}}>
                <h2 ref={klassrumsmenyRef} className="text-xl mt-2 font-bold mr-1">
                    {engelska ? "Classroom" : "Klassrum"}:{" "}
                </h2>
            </div>
            <div
                style={{
                    position: "relative", width: "180px", height: "46px",
                }}
                className="!h-[46px]"
            >
                <Overlay>
                    <ul
                        style={{
                            height: visaKlassrumsmeny ? "12rem" : "46px",
                        }}
                        className="overflow-y-scroll scrollbar-none place-self-start bg-[#f1f1f1] w-52 border border-black"
                    >
                        {visaKlassrumsmeny ? (data && (<div>
                            <div className="flex">
                                <li
                                    className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                                    onClick={() => setVisaklassrumsmeny(false)}
                                >
                                    <div className="flex justify-center items-center">
                                        <div className="w-[155px]">
                                        {klassrumsnamn || (engelska ? "Choose room..." : "Välj klassrum...")}
                                        </div>
                                        <img className="w-[20px]" src="/nerpil.png"></img>
                                    </div>
                                </li>
                            </div>
                            {data.klassrum.map((klassrum, index) => {
                                if (klassrum.id !== klassrumsId) {
                                    return (<li
                                        key={klassrum.id}
                                        className="font-bold text-xl p-2 cursor-pointer"
                                        onClick={() => {
                                            setGrid(klassrum.grid);
                                            setRows(klassrum.rows);
                                            setCols(klassrum.cols);
                                            setKlassrumsnamn(klassrum.namn);
                                            setKlassrumsId(klassrum.id);
                                            setVisaklassrumsmeny(false);
                                        }}
                                    >
                                        {klassrum.namn}
                                    </li>);
                                }
                            })}
                        </div>)) : (<div
                            className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                            onClick={() => {
                                setVisaklassrumsmeny(true);
                            }}
                        >
                            <div className="flex justify-center items-center">
                                <div className="w-[155px] truncate">
                                    {klassrumsnamn || (engelska ? "Choose room..." : "Välj klassrum...")}

                                    
                                </div>
                                <img
                                    style={{
                                        rotate: !visaKlassrumsmeny && "90deg",
                                        animationName: visaKlassrumsmeny ? "vridNer" : "vridUpp",
                                        animationDuration: "0.1s",
                                    }}
                                    className="w-[20px]"
                                    src="/nerpil.png"
                                ></img>
                            </div>
                        </div>)}
                    </ul>
                </Overlay>
            </div>
        </div>}
    </div>);

    async function checkLoginStatus() {
        try {
            const response = await fetch("https://auth.skola77.com/home", {
                credentials: "include",
            });
            const result = await response.json();

            try {
                setEngelska(JSON.parse(result.settings).engelska)
                const parsedData = JSON.parse(result.data);
                setData(parsedData);
                const klassrum = parsedData.klassrum;
                const klasser = parsedData.klasser;

                console.log("Klassrum:", klassrum);
                console.log("Klasser:", klasser);
            } catch (parseError) {
                console.error("Kunde inte parsa data:", parseError);
                window.location.href = "https://auth.skola77.com?skola77";
            }
        } catch (fetchError) {
            console.error("Fel vid hämtning av data:", fetchError);
            window.location.href = "https://auth.skola77.com?skola77";
        }
    }

    const sparaPlacering = (index) => {
        let nyData = data;

        if (data.placeringar.some((placering) => placering.id === placeringsId)) {
            nyData.placeringar = data.placeringar.map((placering) => {
                if (placering.id === placeringsId) {
                    return {
                        id: placeringsId, namn: index, klassrum: {
                            id: klassrumsId, namn: klassrumsnamn, grid: grid, cols: cols, rows: rows,
                        }, klass: {id: klassId, namn: klassnamn, personer: namn},
                    };
                } else {
                    return placering;
                }
            });
        } else {
            const nyttId = generateUniqueId();
            setPlaceringsId(nyttId);
            nyData.placeringar.push({
                id: nyttId, namn: index, klassrum: {
                    id: klassrumsId, namn: klassrumsnamn, grid: grid, cols: cols, rows: rows,
                }, klass: {id: klassId, namn: klassnamn, personer: namn},
            });
        }
        console.log(nyData);

        setData(nyData);

        setSparat(true)
        sparaData(nyData);
    };
    const slumpa = () => {
        const nyGrid = [];
        const namnAttSlumpa = [];
        console.log(låstaBänkar);
        namn.forEach((namn, index) => {
            if (namn === "") {
                låstaBänkar.push(index);
            }
        });

        namn.forEach((namn, index) => !(låstaBänkar.includes(index) || frånvarande.includes(index) || index === 0) && namnAttSlumpa.push(index));

        namnAttSlumpa.sort(() => Math.random() - 0.5);
        let slumpIndex = 0;

        grid.forEach((rad) => {
            const nyRad = [];
            rad.forEach((plats) => {
                let person = 0;

                if (plats.id) {
                    if (låstaBänkar.includes(plats.id)) {
                        person = plats.person;
                    } else if (slumpIndex < namnAttSlumpa.length) {
                        person = namnAttSlumpa[slumpIndex];
                        slumpIndex++;
                    } else {
                        person = 0;
                    }
                }

                nyRad.push({
                    id: plats.id, person,
                });
            });
            nyGrid.push(nyRad);
        });

        setGrid(nyGrid);
    };
    const taBortPlacering = (id = placeringsId) => {
        let nyData = data;
        nyData.placeringar = nyData.placering.filter((placering) => placering.id !== id);
        setData(nyData);
        sparaData(nyData);
    };
    const namnILista = namn && divideArray(namn
        .map((namn, index) => ({namn: namn, orginalIndex: index}))
        .sort((a, b) => a.namn.localeCompare(b.namn))
        .slice(1)
        .filter((namn) => namn.namn !== "")
        .map((namnObj) => namnObj.namn !== "" && (<div
            key={namnObj.orginalIndex}
            className="text-lg border-solid m-[5px] border-[3px] w-[315px] h-[50px]"
        >
            <div className="flex justify-between items-center w-full">
                <div className="truncate">{namnObj.namn}</div>
                <div>
                    {frånvarande.includes(namnObj.orginalIndex) ? (<div
                        onClick={() => {
                            setFrånvarande((prevFrånvarande) => prevFrånvarande.filter((namnObj2) => namnObj2 !== namnObj.orginalIndex));
                        }}
                        className="bg-red-500 align-middle justify-center flex-row flex items-center text-center h-[45px] text-white w-[175px] rounded-[5px]"
                    >
                        {engelska ? "absent" : "frånvarande"}
                    </div>) : (<div
                        onClick={() => {
                            setFrånvarande((prevFrånvarande) => [...prevFrånvarande, namnObj.orginalIndex,]);
                        }}
                        className="bg-green-500 align-middle justify-center flex-row flex items-center text-center h-[45px] text-white w-[175px] rounded-[5px]"
                    >
                        <span>{engelska ? "present" : "närvarande"}</span>
                    </div>)}
                </div>
            </div>
        </div>)), Math.floor(window.outerWidth / 330));
    useEffect(() => {
        setVisaklassrumsmeny(!klassrumsnamn);
        setVisaklassmeny(!klassnamn);
        checkLoginStatus();
        window.addEventListener("resize", () => {
            setKolumner(namnILista.length);
        });
        return () => {
            window.removeEventListener("resize", () => {
                setKolumner(namnILista.length);
            });
        };
    }, []);
    useEffect(() => {
        if (laddarPlacering) {
            setLaddarPlacering(false);
        } else if (!laddarPlacering) {
            setSparat(false);
        }
    }, [placeringsnamn, grid, nyttPlaceringsnamn, klassrumsId, klassId]);
    return (<div>
        {placeringsId || (data && !data.placeringar[0]) ? (<div className="w-full grid grid-cols-10">
            {placeringsId ? (<div
                onClick={() => {
                    if (sparat || window.confirm((engelska ? "You have unsaved changes. Do you want to exit anyway? If not, press cancel and save first." : "Du har osparade ändringar. Vill du gå tillbaka ändå? Om inte, tryck på avbryt och spara först."))) {
                        setNamn([""]);
                        setKlassnamn(null);
                        setKlassId(null);
                        setKlassrumsId(null);
                        setKlassrumsnamn(null);
                        setPlaceringsnamn(null);
                        setLaddarPlacering(true);
                        setSparat(true);
                        setNyttPlaceringsnamn(null);
                        setPlaceringsId(null);
                        setGrid(Array.from({length: rows}, () => Array.from({length: cols}, () => ({
                            id: null, person: 0,
                        }))));
                        setRows(6);
                        setCols(7);
                        setSparat(true);
                    }
                }}
                className="w-[100%] rounded-br-lg bg-green-500 h-[100%] place-self-start flex justify-center items-center cursor-pointer"
            >
                <img className="h-[50%]" src="/pil-vänster.png"/>
            </div>) : window.outerWidth > 850 && !(klassnamn && klassrumsnamn) ? (
                <div className="text-wrap text-xl scrollbar-none overflow-x-scroll border text-center">
                    <div>
                        {data.klasser.length > 0 && data.klassrum.length > 0 ? (engelska ? "Start by selecting a class and a classroom" : "Börja med att välja klass och klassrum ") : data.klassrum.length > 0 ? (engelska ? 'Go to "classes" to create a "class"' : "Gå till klasser för att skapa en klass") : data.klasser.length > 0 ? (engelska ? 'Go to "classrooms" to create a new classroom' : "Gå till klassrum för att skapa ett klassrum") : `${engelska ? "You need to create a class and a classroom to continue. See the menu" : "Du behöver skapa en klass och ett klassrum. Se menyn"} ${window.outerWidth < window.outerHeight ? (engelska ? "at the top right" : "uppe till höger") : (engelska ? "above" : "ovan")}.`}
                    </div>
                </div>) : (<div></div>)}
            <div className="col-span-8">
                <div className="">
                    {(nyttPlaceringsnamn || klassnamn || klassrumsnamn) && (
                        <div className="text-3xl mt-3 flex justify-center text-center font-bold">
                            <input
                                value={nyttPlaceringsnamn || (nyttPlaceringsnamn === "" ? nyttPlaceringsnamn : (klassnamn || "") + (engelska ? " in " : " i ") + (klassrumsnamn || ""))}
                                onChange={(e) => setNyttPlaceringsnamn(e.target.value)}
                                onBlur={() => nyttPlaceringsnamn === (klassnamn || "") + (engelska ? " in " : " i ") + (klassrumsnamn || "") || nyttPlaceringsnamn === "" ? setNyttPlaceringsnamn((klassnamn || "") + (engelska ? " in " : " i ") + (klassrumsnamn || "")) : setPlaceringsnamn(nyttPlaceringsnamn)}
                                className="text-3xl w-fit mt-3 flex justify-center text-center"
                            />
                        </div>)}
                    <div className="mt-1">{väljKLassOchKlassrum}</div>
                </div>
            </div>
            {placeringsId && (<div
                onClick={() => {
                    if (window.confirm(engelska ? "Are you sure that you want to delete the seating plan. If not, press cancel" : "Är du säker på att du vill radera placeringen? Om inte, tryck på avbryt.")) {
                        let nyData = data;
                        nyData.placeringar = nyData.placeringar.filter((placering) => placering.id !== placeringsId);
                        setData(nyData);
                        sparaData(nyData);
                        setNamn([""]);
                        setKlassnamn(null);
                        setKlassId(null);
                        setKlassrumsId(null);
                        setKlassrumsnamn(null);
                        setPlaceringsnamn(null);
                        setLaddarPlacering(true);
                        setSparat(true);
                        setNyttPlaceringsnamn(null);
                        setPlaceringsId(null);
                        setGrid(Array.from({length: rows}, () => Array.from({length: cols}, () => ({
                            id: null, person: 0,
                        }))));
                        setRows(6);
                        setCols(7);
                        setSparat(true);
                    }
                }}
                className="w-[100%] rounded-bl-lg bg-red-500 h-[100%] place-self-start flex justify-center items-center cursor-pointer"
            >
                <RiDeleteBin6Line
                    style={{
                        height: "65%", width: "65%", color: "white", margin: "auto",
                    }}
                />
            </div>)}
        </div>) : (<div className="text-center">
            {data && data.placeringar.length > 0 && (<div>
                <h2 className="text-3xl mt-2">{engelska ? "Your seating plans" : "Dina placeringar"}</h2>
                <ul className="overflow-y-scroll divide-y-2 scrollbar w-[98vw] m-auto scrollbar-none  h-full border border-black mt-2">
                    {data && data.placeringar.map((placering) => {
                        return (<li
                            key={placering.id}
                            className="font-semibold text-2xl p-2 cursor-pointer"
                            onClick={() => {
                                const klasserDict = Object.fromEntries(data.klasser.map((klass) => [klass.id, klass]));
                                const klassrumDict = Object.fromEntries(data.klassrum.map((klassrum) => [klassrum.id, klassrum,]));
                                let klassrumBorttagen;
                                let klassBorttagen;
                                if (!klasserDict[placering.klass.id]) {
                                    klassBorttagen = true;
                                }
                                if (!klasserDict[placering.klass.id]) {
                                    klassrumBorttagen = true;
                                }
                                const currentKlass = klasserDict[placering.klass.id] || placering.klass;

                                const currentKlassrum = klassrumDict[placering.klassrum.id] || placering.klassrum;

                                if (!currentKlass || !currentKlassrum) {
                                    return;
                                }
                                const bänkarMedPersoner = [];
                                placering.klassrum.grid.map((rad, y) => rad.map((cell, x) => cell.person && bänkarMedPersoner.push({
                                    kord: `${x}-${y}`, person: cell.person,
                                })));
                                setNamn(currentKlass.personer);

                                setKlassnamn(currentKlass.namn);
                                setVisaklassmeny(false);
                                setVisaklassrumsmeny(false);
                                setKlassrumsId(placering.klassrum.id);
                                setKlassrumsnamn(currentKlassrum.namn);
                                setLaddarPlacering(true);
                                setKlassId(placering.klass.id);
                                setGrid(currentKlassrum.grid.map((rad, y) => rad.map((cell, x) => {
                                    const nyttId = generateUniqueId();
                                    const bänkmatch = bänkarMedPersoner.find((bänk) => bänk.kord === `${x}-${y}`);
                                    return {
                                        id: bänkmatch ? JSON.stringify(nyttId) : cell.id,
                                        person: bänkmatch ? bänkmatch.person : cell.person,
                                    };
                                })));
                                setCols(currentKlassrum.cols);
                                setPlaceringsId(placering.id);
                                setRows(currentKlassrum.rows);
                                setPlaceringsnamn(placering.namn);
                                setNyttPlaceringsnamn(placering.namn || (placering.klass.namn && placering.klassrum.namn && placering.klass.namn + " i " + placering.klassrum.namn) || null);
                            }}
                        >
                            {placering.namn || (placering.klass.namn || (engelska ? "an empty class" : "en tom klass")) + " i " + (placering.klassrum.namn || (engelska ? "an empty classroom" : "ett tomt klassrum"))}
                        </li>);
                    })}
                </ul>
            </div>)}
            <ul className="overflow-y-hidden m-auto  w-[98vw] h-full border border-black mt-2">
                <li
                    key={"ny placering"}
                    className="font-semibold text-2xl p-2 cursor-pointer"
                    onClick={() => {
                        const beng = generateUniqueId();
                        setNamn([""]);
                        setKlassnamn(null);
                        setKlassId(null);
                        setKlassrumsId(null);
                        setLaddarPlacering(true);
                        setKlassrumsnamn(null);
                        setVisaklassmeny(true);
                        setPlaceringsnamn(null);
                        setVisaklassrumsmeny(true);
                        setPlaceringsId(JSON.parse(JSON.stringify(beng)));
                    }}
                >
                    {engelska ? "Press here to create a new seating plan..." : "Tryck här för att skapa en ny placering..."}
                </li>
            </ul>
        </div>)}

        <>
            {klassrumsnamn && (<div className="" ref={content} style={{zIndex: "100"}}>
                <div className="my-3">
                    <div
                        className={vägg && "m-auto p-5 w-fit fit-content rounded-lg border-black border-8"}
                    >
                        <Klassrum
                            extra={!klar && rows > 10 && !placeringsId && !data.placeringar.some((placering) => placering.klassrum.rows > 10) && (
                                <span
                                    className="cursor-pointer underline text-black"
                                    onClick={() => nameDiv.current.scrollIntoView({behavior: "smooth"})}
                                >
                        {engelska ? "Psst... the student names appear at the bottom of the page." : "Psst... alla personer hittar du längst ner på sidan."}
                      </span>)}
                            edit={false}
                            engelska={engelska}
                            updateSize={updateSize}
                            låstaBänkar={låstaBänkar}
                            setLåstaBänkar={setLåstaBänkar}
                            grid={grid}
                            columns={cols}
                            rows={rows}
                            setGrid={setGrid}
                            klar={klar}
                            reverse={omvänd}
                            setReverse={setOmvänd}
                            names={namn}
                        />{" "}
                    </div>
                </div>
            </div>)}
            {klassnamn && klassrumsnamn && (


                <div className="flex gap-4 w-full rounded-lg flex-wrap justify-center mb-10">
                    <button
                        className="px-5 py-4 bg-green-500 text-white border border-black text-center flex-1 min-w-[120px] max-w-[200px] rounded-lg"
                        onClick={slumpa}
                    >
                        {engelska ? "Randomize" : "Slumpa"}
                    </button>
                    <button
                        className="px-5 py-4 bg-green-500 text-white border border-black text-center flex-1 min-w-[120px] max-w-[200px] rounded-lg"
                        onClick={async () => {
                            setKlar(true);
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            await scaleToFit(content.current, setUpdateSize, updateSize);
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            setKlar(false);
                        }}
                    >
                        {engelska ? "Print" : "Skriv ut"}
                    </button>
                    {klassnamn && klassrumsnamn && (<div className="w-[130px]">
                        <button
                            className="px-5 py-4 bg-green-500 text-white border border-black text-center flex-1 min-w-[120px] max-w-[200px] rounded-b-none rounded-lg"
                            onClick={() => {
                                sparaPlacering(nyttPlaceringsnamn || placeringsnamn);
                                setSparat(true);
                            }}
                        >
                            {`${engelska ? "save" : "spara"}${!sparat && !laddarPlacering ? "*" : ""}`}
                        </button>
                        <button
                            className="px-5 py-4 bg-green-500 text-white border border-black text-center flex-1 min-w-[120px] max-w-[200px] rounded-t-none rounded-lg"
                            onClick={() => {
                                let index = prompt("Vad ska placeringen heta?");
                                while (data.placeringar.some((placering) => placering.namn === index)) {
                                    index = prompt("Du har redan lagt in en placering som heter så. Skriv ett namn som skiljer sig åt.");
                                }
                                setPlaceringsnamn(index);
                                sparaPlacering(index);
                            }}
                        >
                            {engelska ? "save as" : "spara som"}
                        </button>
                    </div>)}

                    <button
                        className="px-5 py-4 bg-green-500 text-white border border-black text-center flex-1 min-w-[120px] max-w-[200px] rounded-lg"
                        onClick={() => {
                            setKlar(!klar);
                        }}
                    >
                        {!klar ? (engelska ? "Show to students" : "Klar") : (engelska ? "Continue editing" : "Fortsätt redigera")}
                    </button>
                    <button
                        className="px-5 py-4 bg-green-500 text-white border border-black text-center flex-1 min-w-[120px] max-w-[200px] rounded-lg"
                        onClick={() => {
                            setOmvänd(!omvänd);
                        }}
                    >
                        {engelska ? "Change to" : "Byt till"} {omvänd ? (engelska ? "student perspective" : "elevperspektiv") : (engelska ? "teachers perspective" : "lärarperspektiv")}
                    </button>
                </div>


            )}
            {klassnamn && (<div
                className="m-auto"
                ref={nameDiv}
                style={{
                    display: "flex", justifyContent: "center",
                }}
            >
                {namnILista.map((kolumn) => (<div>{kolumn}</div>))}
            </div>)}
        </>

        <p className="text-center mt-5">Skola 77 2 Flamingo</p>
    </div>);
};

export default SkapaPlaceringar;

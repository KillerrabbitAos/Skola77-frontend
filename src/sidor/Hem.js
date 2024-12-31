import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const style = `
  .animate-scrollBg {
    animation: scrollBg 20s linear infinite;
  }
`;

const Hem = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/klassrum");
  };

  useEffect(() => {
    // Tillåt scrollning alltid och hantera endast stora enheter om det behövs
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <style>{style}</style>

      <div className="relative bg-gradient-to-r from-green-400 to-green-600 min-h-screen flex flex-col justify-center items-center overflow-y-auto sm:overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center animate-scrollBg"></div>

        {/* Logo */}
        <img
          src="/favicon.svg"
          className="w-20 pb-10 sm:w-24 md:w-32 lg:w-40"
          alt="Logo"
        />

        {/* Välkomsttext */}
        <div className="relative text-center p-6 rounded-lg bg-white shadow-xl transform transition-all duration-500 hover:scale-105 z-10 mx-4 sm:mx-6 md:mx-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-400 animate-pulse">
            Välkommen till nya Skola 77
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mt-4 animate-fadeIn">
            Smidig sittning, perfekt placering – vi gör bordsplanering enkelt!
          </p>
        </div>

        <Changelog />

        <div className="mt-8">
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 text-green-600 bg-white border-2 border-green-600 rounded-full shadow-md transform transition duration-300 hover:bg-green-200 hover:scale-110 cursor-pointer hover:font-bold"
          >
            Börja skapa!
          </button>
        </div>
      </div>
    </>
  );
};

const Changelog = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8 mx-6 md:mx-16 z-10">
      <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 mb-4">
        Uppdateringar
      </h2>
      <ul className="space-y-4">
        <li className="flex items-start">
          <div className="flex-shrink-0 text-green-600">[2024-12-11]</div>
          <div className="ml-3 text-gray-700">
            <strong>Ny version:</strong> Lansering av nya Skola 77-2.
          </div>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0 text-green-600">[2024-12-28]</div>
          <div className="ml-3 text-gray-700">
            <strong>Design:</strong> Hemskärmsuppdateringar.
          </div>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0 text-green-600">[2024-12-30]</div>
          <div className="ml-3 text-gray-700">
            <strong>Buggfixar:</strong> Grundläggande funktioner och design uppdaterad.
          </div>
        </li>
        <li className="flex items-start">
          <div className="flex-shrink-0 text-green-600">[2024-12-31]</div>
          <div className="ml-3 text-gray-700">
            <strong>Design:</strong> Klassidan är uppdaterad.
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Hem;
export { Changelog };

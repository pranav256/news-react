import { useState } from "react";

import "./App.css";
import Navbar from "./components/Navbar";

import CardHolder from "./components/CardHolder";


function App() {
  const [category, setCategory] = useState(localStorage.getItem("category") || "general");
  const [country, setCountry] = useState(localStorage.getItem("country") || "in");
  const [countryName, setCountryName] = useState(localStorage.getItem("countryName") || "India");

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <Navbar
        setCategory={setCategory}
        setCountry={setCountry}
        setCountryName={setCountryName}
      />
      <h1 id="newsName">
        {`Showing Headlines About ${capitalizeFirstLetter(
          category
        )} - ${countryName}`}
      </h1>

      <CardHolder country={country} category={category} capitalizeFirstLetter={capitalizeFirstLetter} countryName={ countryName}/>
    </>
  );
}

export default App;

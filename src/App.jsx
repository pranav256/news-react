import { useState } from "react";
import Navbar from "./components/Navbar";
import CardHolder from "./components/CardHolder";

function App() {
  const [category, setCategory] = useState(
    localStorage.getItem("category") || "general"
  );
  const [country, setCountry] = useState(
    localStorage.getItem("country") || "in"
  );
  const [countryName, setCountryName] = useState(
    localStorage.getItem("countryName") || "India"
  );
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("darkMode") || true
  );
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className={darkTheme ? "dark" : ""}>
      <section className="font-Poppins dark:bg-gray-800">
        <Navbar
          setCategory={setCategory}
          setCountry={setCountry}
          setCountryName={setCountryName}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
        />
        <h1 className="text-center my-3 text-xl dark:text-white ">{`Showing Headlines About ${capitalizeFirstLetter(
          category
        )} - ${countryName} `}</h1>

        <CardHolder
          country={country}
          category={category}
          countryName={countryName}
        />
      </section>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
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
    JSON.parse(localStorage.getItem("darkTheme")) || false
  );
  useEffect(() => {
    const saveToLocalStorage = () => {
      localStorage.setItem("country", country);
      localStorage.setItem("category", category);
      localStorage.setItem("countryName", countryName);
      localStorage.setItem("darkTheme", darkTheme);
    };
    saveToLocalStorage();
  }, [country, category, countryName, darkTheme]);

  return (
    <div className={darkTheme ? "dark" : "light"}>
      <section className="font-Poppins dark:bg-gray-800">
        <Navbar
          setCategory={setCategory}
          setCountry={setCountry}
          setCountryName={setCountryName}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
        />
        <h1 className="text-center my-3 text-xl dark:text-white ">{`Showing Headlines About ${
          category.charAt(0).toUpperCase() + category.slice(1)
        } - ${countryName} `}</h1>

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

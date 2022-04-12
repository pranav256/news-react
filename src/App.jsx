import React, { useState, useEffect } from "react";

import "./App.css";
import Navbar from "./components/Navbar";
import CardHolder from "./components/CardHolder";

import LoadingBar from "react-top-loading-bar";
function App() {
  const [progress, setProgress] = useState(0);
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(
    localStorage.getItem("category") || "general"
  );
  const [country, setCountry] = useState(
    localStorage.getItem("country") || "in"
  );
  const [countryName, setCountryName] = useState(
    localStorage.getItem("countryName") || "India"
  );

  useEffect(() => {
    const updatePage = async () => {
      setProgress(10);
      const url = `https://raw.githubusercontent.com/pranav256/news-api/main/${country}/${category}.json`;
      const data = await fetch(url);
      setProgress(30);
      const resp = await data.json();
      window.scrollTo(0, 0);
      setProgress(50);
      setArticles(resp.articles);
      setProgress(100);
    };
    // save country name and category to local storage
    const saveToLocalStorage = () => {
      localStorage.setItem("country", country);
      localStorage.setItem("category", category);
      localStorage.setItem("countryName", countryName);
    };
    document.title = `Latest Headlines About: ${capitalizeFirstLetter(
      category
    )}`;
    updatePage();
    saveToLocalStorage();
  }, [category, country]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <>
      <LoadingBar color="blue" progress={progress} />
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

      <CardHolder articles={articles} />
    </>
  );
}

export default App;

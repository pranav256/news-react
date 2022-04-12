import React, { useState, useEffect } from "react";
import "./App.css";
import LoadingBar from "react-top-loading-bar";
import Navbar from "./components/Navbar";
import CardHolder from "./components/CardHolder";
function App() {
  const [progress, setProgress] = useState(0);
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("in");
  const [countryName, setCountryName] = useState("India");
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    const updatePage = async () => {
      setProgress(10);
      let url = `https://raw.githubusercontent.com/pranav256/news-api/main/${country}/${category}.json`;
      let data = await fetch(url);
      setProgress(30);
      let resp = await data.json();
      window.scrollTo(0, 0);
      setProgress(50);
      setArticles(resp.articles);
      setProgress(100);
    };
    document.title = `Latest Headlines About: ${capitalizeFirstLetter(
      category
    )}`;
    updatePage();
  }, [category, country, setProgress, setArticles]);
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
      <CardHolder
        setProgress={setProgress}
        articles={articles}
        countryName={countryName}
      />
    </>
  );
}

export default App;

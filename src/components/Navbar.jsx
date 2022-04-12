import "./css/Navbar.css";
import React from "react";

function Navbar({ setCategory, setCountry, setCountryName }) {
  return (
    <header>
      <nav className="navbar">
        <img
          id="icon"
          src="https://img.icons8.com/fluency/48/000000/news.png"
          alt="icon"
        />
        <ul>
          <li className="list">
            <div className="dropDown">
              <button className="dropBtn">Category</button>
              <div className="dropDownContent">
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("general");
                  }}
                >
                  General
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("business");
                  }}
                >
                  Business
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("technology");
                  }}
                >
                  Technology
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("entertainment");
                  }}
                >
                  Entertainment
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("science");
                  }}
                >
                  Science
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("health");
                  }}
                >
                  Health
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCategory("sports");
                  }}
                >
                  Sports
                </span>
              </div>
            </div>
          </li>
          <li className="list">
            <div className="dropDown">
              <button className="dropBtn">Country</button>
              <div className="dropDownContent">
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCountry("in");
                    setCountryName("India");
                  }}
                >
                  India
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCountry("us");
                    setCountryName("United States");
                  }}
                >
                  USA
                </span>
                <span
                  className="dropDownItem"
                  onClick={() => {
                    setCountry("gb");
                    setCountryName("United Kingdom");
                  }}
                >
                  United Kingdom
                </span>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;

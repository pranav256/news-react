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
            <div className="dropdown">
              <button className="dropbtn">Category</button>
              <div className="dropdown-content">
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("general");
                  }}
                >
                  General
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("business");
                  }}
                >
                  Business
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("technology");
                  }}
                >
                  Technology
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("entertainment");
                  }}
                >
                  Entertainment
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("science");
                  }}
                >
                  Science
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCategory("health");
                  }}
                >
                  Health
                </span>
                <span
                  className="dropdown-item"
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
            <div className="dropdown">
              <button className="dropbtn">Country</button>
              <div className="dropdown-content">
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCountry("in");
                    setCountryName("India");
                  }}
                >
                  India
                </span>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    setCountry("us");
                    setCountryName("United States");
                  }}
                >
                  USA
                </span>
                <span
                  className="dropdown-item"
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

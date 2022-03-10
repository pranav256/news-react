import React from "react";
import "./css/Navbar.css";
function NavbarNew({ setCategory, setCountry, setCountryName }) {
  return (
    <header>
      <nav>
        <ul>
          <li className="navBarContent">
            <img
              id="icon"
              src="https://img.icons8.com/fluency/48/000000/news.png"
              alt="icon"
            />
          </li>
          <li className="navBarContent">
            <label className="dropdown">
              <div className="dropDownButton">Country</div>
              <input type="checkbox" className="dropDownBox" />
              <ul className="dropDownMenu">
                <li
                  onClick={() => {
                    setCategory("general");
                  }}
                >
                  General
                </li>
                <li
                  onClick={() => {
                    setCategory("business");
                  }}
                >
                  Business
                </li>
                <li
                  onClick={() => {
                    setCategory("technology");
                  }}
                >
                  Technology
                </li>
                <li
                  onClick={() => {
                    setCategory("entertainment");
                  }}
                >
                  Entertainment
                </li>
                <li
                  onClick={() => {
                    setCategory("science");
                  }}
                >
                  Science
                </li>
                <li
                  onClick={() => {
                    setCategory("health");
                  }}
                >
                  Health
                </li>
                <li
                  onClick={() => {
                    setCategory("sports");
                  }}
                >
                  Sports
                </li>
              </ul>
            </label>
          </li>
          <li className="navBarContent">
            <label className="dropdown">
              <div className="dropDownButton">Country</div>
              <input type="checkbox" className="dropDownBox" />
              <ul className="dropDownMenu">
                <li
                  onClick={() => {
                    setCountry("in");
                    setCountryName("India");
                  }}
                >
                  India
                </li>
                <li
                  onClick={() => {
                    setCountry("us");
                    setCountryName("United States");
                  }}
                >
                  USA
                </li>
                <li
                  onClick={() => {
                    setCountry("gb");
                    setCountryName("United Kingdom");
                  }}
                >
                  United Kingdom
                </li>
              </ul>
            </label>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavbarNew;

// LanguageSelector.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [showLanguageList, setShowLanguageList] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
    setShowLanguageList(false); // Close the language list after selection
  };

  const toggleLanguageList = () => {
    setShowLanguageList(!showLanguageList);
  };

  return (
    <div className="language-selector">
      <div
        className="selected-language"
        onMouseEnter={toggleLanguageList}
        onMouseLeave={toggleLanguageList}
      >
        {selectedLanguage === "en" ? (
          <span className="selected">
            En<span style={{marginTop:".5vw", fontSize:".7vw"}} >&#9660;</span>
          </span>
        ) : (
          <span className="selected">
            Bn <span style={{marginTop:".5vw", fontSize:".7vw"}}>&#9660;</span>
          </span>
        )}
        {showLanguageList && (
          <div className="language-list">
            <div style={{ fontSize: ".9vw", marginBottom: ".5vw" }}>
              Select Language
            </div>
            <ul>
              <li
                onClick={() => changeLanguage("en")}
                className={selectedLanguage === "en" ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="language"
                  id="en"
                  checked={selectedLanguage === "en"}
                />
                <span>English</span>
              </li>
              <li
                onClick={() => changeLanguage("bn")}
                className={selectedLanguage === "bn" ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="language"
                  id="bn"
                  checked={selectedLanguage === "bn"}
                />
                <span>বাংলা</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;

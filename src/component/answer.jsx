import React from "react";
import "../style/answer.css";
import Checkbox from "./CheckBox.jsx"

export default function Answers() {
  return (
    <div className="answers">
      <Checkbox className="answers" text="Test answer" />
    </div>
  );
}
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import "./answer.css";
import { useLocation } from "react-router-dom";
// import success from "./success.png";
import failed from "./failed.png";
import good from "./good.jpg";
import veryGood from "./very_good.jpg";
import excellent from "./execellent.jpg";
function Answer() {
  const location = useLocation();
  const submittedData = location.state?.selectedOptions;
  const questionData = location.state?.questionData;

  const [totalscore, setTotalscore] = useState(0);

  useEffect(() => {
    console.log("result");
    let score = 0;

    if (submittedData) {
      submittedData.forEach((submittedQuestion) => {
        // Check if the selected option is correct
        if (submittedQuestion.answer === submittedQuestion.selectedOption) {
          score += 5;
        }
      });
    }

    // Update the state once, outside the loop
    setTotalscore(score);
  }, [submittedData, questionData]);

  let imageSrc;
  let imageAlt;

  if (totalscore >= 16 && totalscore <= 20) {
    imageSrc = excellent;
    imageAlt = "Excellent";
  } else if (totalscore >= 11 && totalscore <= 15) {
    imageSrc = veryGood;
    imageAlt = "Very Good";
  } else if (totalscore >= 5 && totalscore <= 10) {
    imageSrc = good;
    imageAlt = "Good";
  } else {
    imageSrc = failed;
    imageAlt = "Failed";
  }

  return (
    <>
      <Navbar />
      <div className="answer_container">
        <div className="score">
          Your Score {totalscore} out of{" "}
          {submittedData ? submittedData.length * 5 : 0}
        </div>
        <div className="image">
          <img
            className="score-img"
            src={imageSrc}
            alt={imageAlt}
            // Set your desired width and height
          />
        </div>
      </div>
      <div className="analysis">
        <h1>Question Analysis</h1>
        <div className="question_container_analysis">
          {questionData.length > 0 &&
            questionData.map((question, index) => (
              <div className="question_title" key={index}>
                <h3>{question.title}</h3>

                <div className="main-option">
                  {submittedData[index] && (
                    <>
                      <div
                        className="option"
                        style={{
                          backgroundColor:
                            submittedData[index].selectedOption ===
                            questionData[index].option1
                              ? questionData[index].option1 ===
                                questionData[index].answer
                                ? "green"
                                : "red"
                              : "transparent",
                        }}
                      >
                        <input
                          id={question.option1}
                          type="radio"
                          name={`question_${question.id}`}
                          value={questionData[index].option1}
                          readOnly
                          checked={
                            submittedData[index].selectedOption ===
                            questionData[index].option1
                          }
                        />
                        <label htmlFor={question.option1}>
                          {questionData[index].option1}
                        </label>
                      </div>
                      <div
                        className="option"
                        style={{
                          backgroundColor:
                            submittedData[index].selectedOption ===
                            questionData[index].option2
                              ? questionData[index].option2 ===
                                questionData[index].answer
                                ? "green"
                                : "red"
                              : "transparent",
                        }}
                      >
                        <input
                          id={question.option2}
                          type="radio"
                          name={`question_${question.id}`}
                          value={questionData[index].option2}
                          readOnly
                          checked={
                            submittedData[index].selectedOption ===
                            questionData[index].option2
                          }
                        />
                        <label htmlFor={question.option2}>
                          {questionData[index].option2}
                        </label>
                      </div>
                      <div
                        className="option"
                        style={{
                          backgroundColor:
                            submittedData[index].selectedOption ===
                            questionData[index].option3
                              ? questionData[index].option3 ===
                                questionData[index].answer
                                ? "green"
                                : "red"
                              : "transparent",
                        }}
                      >
                        <input
                          id={question.option3}
                          type="radio"
                          name={`question_${question.id}`}
                          value={questionData[index].option3}
                          readOnly
                          checked={
                            submittedData[index].selectedOption ===
                            questionData[index].option3
                          }
                        />
                        <label htmlFor={question.option3}>
                          {questionData[index].option3}
                        </label>
                      </div>
                      <div
                        className="option"
                        style={{
                          backgroundColor:
                            submittedData[index].selectedOption ===
                            questionData[index].option4
                              ? questionData[index].option4 ===
                                questionData[index].answer
                                ? "green"
                                : "red"
                              : "transparent",
                        }}
                      >
                        <input
                          id={question.option4}
                          type="radio"
                          name={`question_${question.id}`}
                          value={questionData[index].option4}
                          readOnly
                          checked={
                            submittedData[index].selectedOption ===
                            questionData[index].option4
                          }
                        />
                        <label htmlFor={question.option4}>
                          {questionData[index].option4}
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default React.memo(Answer);

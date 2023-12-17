import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import "./question.css";
import ProgressBar from "../component/ProgressBar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import MiniPlayer from "../component/MiniPlayer.jsx";

// ...

function Question() {
  const { id } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  // ...

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const result = await fetch(
          `http://127.0.0.1:8000/api/get-question/${id}`
        );
        if (!result.ok) {
          throw new Error("Network result was not ok");
        }

        const data = await result.json();
        setQuestionData(data);

        // Initialize selectedOptions with default values
        const initialOptions = data.map((question) => ({
          questionId: question.id,
          title: question.title,
          answer: question.answer, // Include the answer field
          selectedOption: null,
        }));
        setSelectedOptions(initialOptions);
      } catch (e) {
        console.error("Error fetching question data:", e);
      }
    };

    fetchQuestionData();
  }, [id]);

  const handleRadioChange = (e) => {
    const questionId = questionData[currentQuestionIndex].id;
    const value = e.target.value;

    // Find if the question is already in the array
    const existingQuestionIndex = selectedOptions.findIndex(
      (item) => item.questionId === questionId
    );

    if (existingQuestionIndex !== -1) {
      // Update the existing question's selected option
      setSelectedOptions((prevOptions) => [
        ...prevOptions.slice(0, existingQuestionIndex),
        {
          questionId,
          title: questionData[currentQuestionIndex].title,
          answer: questionData[currentQuestionIndex].answer,
          selectedOption: value,
        },
        ...prevOptions.slice(existingQuestionIndex + 1),
      ]);
    } else {
      // Add the new question to the array
      setSelectedOptions((prevOptions) => [
        ...prevOptions,
        {
          questionId,
          title: questionData[currentQuestionIndex].title,
          answer: questionData[currentQuestionIndex].answer,
          selectedOption: value,
        },
      ]);
    }
  };

  // ...

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      Math.min(prevIndex + 1, questionData.length - 1)
    );
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const submit = async () => {
    console.log("Submitted Data:", selectedOptions);
    // Navigate to the next page or handle as needed
    navigate(`/result/${id}`, { state: { selectedOptions, questionData } });
  };

  const percentage =
    questionData.length > 0
      ? ((currentQuestionIndex + 1) / questionData.length) * 100
      : 0;

  return (
    <>
      <Navbar />
      <div className="question_container">
        {questionData.length > 0 &&
          currentQuestionIndex < questionData.length && (
            <div className="question_title">
              <h1>{questionData[currentQuestionIndex].title}</h1>
              <p>Question can have one answer</p>
              <div className="main-option">
                <div className="option">
                  <input
                    id={questionData[currentQuestionIndex].option1}
                    type="radio"
                    name={`question_${questionData[currentQuestionIndex].id}`}
                    value={questionData[currentQuestionIndex].option1}
                    onChange={handleRadioChange}
                    checked={selectedOptions.some(
                      (item) =>
                        item.questionId ===
                          questionData[currentQuestionIndex].id &&
                        item.selectedOption ===
                          questionData[currentQuestionIndex].option1
                    )}
                  />
                  <label htmlFor={questionData[currentQuestionIndex].option1}>
                    {questionData[currentQuestionIndex].option1}
                  </label>
                </div>
                <div className="option">
                  <input
                    id="option2"
                    type="radio"
                    name={`question_${questionData[currentQuestionIndex].id}`}
                    value={questionData[currentQuestionIndex].option2}
                    onChange={handleRadioChange}
                    checked={selectedOptions.some(
                      (item) =>
                        item.questionId ===
                          questionData[currentQuestionIndex].id &&
                        item.selectedOption ===
                          questionData[currentQuestionIndex].option2
                    )}
                  />
                  <label htmlFor="option2">
                    {questionData[currentQuestionIndex].option2}
                  </label>
                </div>
                <div className="option">
                  <input
                    id="option3"
                    type="radio"
                    name={`question_${questionData[currentQuestionIndex].id}`}
                    value={questionData[currentQuestionIndex].option3}
                    onChange={handleRadioChange}
                    checked={selectedOptions.some(
                      (item) =>
                        item.questionId ===
                          questionData[currentQuestionIndex].id &&
                        item.selectedOption ===
                          questionData[currentQuestionIndex].option3
                    )}
                  />
                  <label htmlFor="option3">
                    {questionData[currentQuestionIndex].option3}
                  </label>
                </div>
                <div className="option">
                  <input
                    id="option4"
                    type="radio"
                    name={`question_${questionData[currentQuestionIndex].id}`}
                    value={questionData[currentQuestionIndex].option4}
                    onChange={handleRadioChange}
                    checked={selectedOptions.some(
                      (item) =>
                        item.questionId ===
                          questionData[currentQuestionIndex].id &&
                        item.selectedOption ===
                          questionData[currentQuestionIndex].option4
                    )}
                  />
                  <label htmlFor="option4">
                    {questionData[currentQuestionIndex].option4}
                  </label>
                </div>
              </div>
            </div>
          )}
      </div>
      <ProgressBar
        next={nextQuestion}
        prev={prevQuestion}
        submit={submit}
        progress={percentage}
      />
      <MiniPlayer
        id={id}
        title={
          questionData.length > 0
            ? questionData[currentQuestionIndex].title
            : ""
        }
      />
    </>
  );
}

export default Question;

import React, { useEffect, useState } from "react";
import "./App.css"; // Import custom CSS

const API_URL = "https://opentdb.com/api.php?amount=5&type=multiple";

const App = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.results.map((item) => ({
          question: item.question,
          options: [
            { text: item.correct_answer, isCorrect: true },
            ...item.incorrect_answers.map((ans) => ({ text: ans, isCorrect: false })),
          ],
        }));
        setQuizData(formattedData);
      })
      .catch((err) => console.error("Failed to load quiz data", err));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, isCompleted]);

  const handleAnswerClick = (isCorrect, answerText) => {
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: quizData[currentQuestion].question, answer: answerText, isCorrect },
    ]);
    if (isCorrect) setScore(score + 10);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(10);
    } else {
      setIsCompleted(true);
    }
  };

  if (!quizData.length) return <div className="quiz-container">Loading Quiz...</div>;

  return (
    <div className="quiz-container">
      {!isCompleted ? (
        <>
          <h2>{quizData[currentQuestion].question}</h2>
          <div className="options-container">
            {quizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option.isCorrect, option.text)}
                className="option-button"
              >
                {option.text}
              </button>
            ))}
          </div>
          <div className="timer">Time left: {timeLeft}s</div>
          <div className="score">Score: {score}</div>
        </>
      ) : (
        <div className="result-container">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} points</p>
          <h3>Answer Summary:</h3>
          <ul>
            {userAnswers.map((answer, index) => (
              <li key={index}>
                <strong>Question:</strong> {answer.question} <br />
                <strong>Your Answer:</strong> {answer.answer} <br />
                <strong>{answer.isCorrect ? "Correct" : "Incorrect"}</strong>
              </li>
            ))}
          </ul>
          <button className="restart-button" onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

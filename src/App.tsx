import React, { useState } from 'react';

//components 

import { fetchQuizQuestions } from './API'

import QuestionCard from './components/QuestionCard'
import { QuestionState, Difficulty } from './API'


import { GlobalStyle, Wrapper } from './App.styles'

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 3

const App = () => {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  //console.log(questions)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false)
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.MEDIUM
    )

    //error handling
    setQuestions(newQuestions)

    //reset everything
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  }


  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) { // user answer

      const answer = e.currentTarget.value
      const correct = questions[number].correct_answer === answer
      if (correct) setScore(prev => prev + 1)
      // save answer in array
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }

      setUserAnswers((prev) => [...prev, answerObject])

    }
  }

  const nextQuestion = () => {
    // move onto next question

    const nextQuestion = number + 1
    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }

  }


  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>

        {/* only show start button when game is finished */}
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>Start</button>) : null}

        {/* only show score during active game, i.e. not game over */}
        {!gameOver && <p className="score">Score: {score}</p>}

        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver && (<QuestionCard
          questionNumber={number + 1} // increament for array 
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />)}
        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 ? (<button className="next" onClick={nextQuestion}>Next Question</button>) : null}



      </Wrapper >

    </>
  );
}

export default App;

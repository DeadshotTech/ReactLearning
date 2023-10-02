import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  // loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_QUESTIONS_REQUEST":
      return {
        ...state,
        status: "loading",
      };
    case "FETCH_QUESTIONS_SUCCESS":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };
    case "FETCH_QUESTIONS_FAILURE":
      return {
        ...state,
        status: "error",
      };
    case "START_QUIZ":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "ANSWER_QUESTION":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "FINISH_QUIZ":
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.highscore, state.points),
      };
    case "RESTART_QUIZ":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
      };
    case "COUNTDOWN":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}
export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (points, question) => points + question.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((response) => response.json())
      .then((data) =>
        dispatch({ type: "FETCH_QUESTIONS_SUCCESS", payload: data })
      )
      .catch((err) =>
        dispatch({ type: "FETCH_QUESTIONS_FAILURE", payload: err })
      );
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={questions.length}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions.at(index)}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

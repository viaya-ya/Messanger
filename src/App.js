import { Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./UI/app/MainPage/Main";
import Header from "./UI/app/MessagesPage/header/Header";
import Content from "./UI/app/MessagesPage/content/Content";
import Block from "./UI/app/MessagesPage/block/Block";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div className="wrapper">
              <Main></Main>
            </div>
          }
        ></Route>
      </Routes>

      <Routes>
        <Route
          path="/:userId/start"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>

        <Route
          path="/:userId/goal"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>

        <Route
          path="/:userId/goal/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/policy"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/policy/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/posts/:paramPostID?"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/posts/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/speedgoal"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/speedgoal/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/strateg"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/strateg/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/statistics"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/:userId/statistics/new/:paramPostID?"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>

        <Route
          path="/:userId/startProject"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>

        <Route
          path="/:userId/program/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>

        <Route
          path="/:userId/project/new"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>

        <Route
          path="/:userId/project"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        
        <Route
          path="/:userId/program"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;

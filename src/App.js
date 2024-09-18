import { Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./UI/app/MainPage/Main";
import Header from "./UI/app/MessagesPage/header/Header";
import Content from "./UI/app/MessagesPage/content/Content";
import Block from "./UI/app/MessagesPage/block/Block";
import VKAuth from "./UI/VKAuth";

function App() {
  return (

  //   <VKAuth 
  //   apiId="your_api_id"
  //   callback={(response) => console.log('Авторизация успешна:', response)}
  //   containerStyle={{ margin: '20px' }}
  // />


    <div>
      <Routes>

      <Route
          path="/vk"
          element={
            <div className="wrapper">
              <VKAuth></VKAuth>
            </div>
          }
        ></Route>

        <Route
          path="/main"
          element={
            <div className="wrapper">
              <Main></Main>
            </div>
          }
        ></Route>
      </Routes>

      <Routes>
        <Route
          path="/start"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/goal"
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
          path="/posts"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/speedgoal"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/strateg"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
        <Route
          path="/statistics"
          element={
            <div className="messages">
              <Header></Header>
              <Content></Content>
              <Block></Block>
            </div>
          }
        ></Route>
          <Route
          path="/project"
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

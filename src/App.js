import { Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "@app/Authorization/Main";
import Content from "@app/Constructions/content/Content";
import Panel from "@app/Constructions/panel/Panel";

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

        <Route
          path="/:group/:route"
          element={
            <div className="messages">
              <Panel></Panel>
              <Content></Content>
            </div>
          }
        ></Route>

      </Routes>
    </div>
  );
}

export default App;

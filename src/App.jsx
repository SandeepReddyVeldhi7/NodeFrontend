import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import AppStore from "./utils/AppStore";
import Login from "./login";
import Body from "./component/Body";
import Feed from "./component/Feed"

import Users from "./component/users";
import Chat from "./component/chat";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Provider store={AppStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed/>} />
             <Route path="/users" element={<Users/>} />
              <Route path="/chat/:id" element={<Chat/>} />
              
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

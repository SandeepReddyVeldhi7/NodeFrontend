import { useState } from "react";
import NavBar from "./NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import AppStore from "./utils/AppStore";
import Login from "./login";
import Body from "./Body";
import Feed from "./feed";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Provider store={AppStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

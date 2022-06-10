import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Status, Wrapper } from "@googlemaps/react-wrapper";

import MyMapApp from "./MyMapApp";

import "./index.css";

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <h1>Loading</h1>;
    case Status.FAILURE:
      return <h1>Error!</h1>;
    case Status.SUCCESS:
      return <MyMapApp />;
  }
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Wrapper
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
              render={render}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

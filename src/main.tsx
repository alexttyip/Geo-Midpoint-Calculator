import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MyMapApp from "./MyMapApp";

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
    <Wrapper
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
      render={render}
    />
  </React.StrictMode>,
  document.getElementById("root")
);

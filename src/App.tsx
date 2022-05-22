import { useState } from "react";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import Marker from "./Marker";
import Map from "./Map";
import Form from "./Form";
import LatLngLiteral = google.maps.LatLngLiteral;

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const App = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(3); // initial zoom
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle");
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
        render={render}
      >
        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
        </Map>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      <Form
        center={center}
        setCenter={setCenter}
        zoom={zoom}
        setZoom={setZoom}
        clicks={clicks}
        setClicks={setClicks}
      />
    </div>
  );
};

export default App;

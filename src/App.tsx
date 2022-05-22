import { useState } from "react";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import Marker from "./components/Marker";
import Map from "./components/Map";
import LatLngLiteral = google.maps.LatLngLiteral;
import MapMouseEvent = google.maps.MapMouseEvent;

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const App = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(6); // initial zoom
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 55,
    lng: -4,
  });

  const onClick = (e: MapMouseEvent) => {
    const newLatLang = e.latLng;

    if (newLatLang) setClicks((prev) => [...prev, newLatLang]);
  };

  const onIdle = (m: google.maps.Map) => {
    const newZoom = m?.getZoom();
    const newCenter = m?.getCenter()?.toJSON();

    if (newZoom !== undefined) {
      setZoom(newZoom);
    }

    if (newCenter) {
      setCenter(newCenter);
    }
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
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
      {/*<Form*/}
      {/*  center={center}*/}
      {/*  setCenter={setCenter}*/}
      {/*  zoom={zoom}*/}
      {/*  setZoom={setZoom}*/}
      {/*  clicks={clicks}*/}
      {/*  setClicks={setClicks}*/}
      {/*/>*/}
    </div>
  );
};

export default App;

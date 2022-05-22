import { useMemo, useState } from "react";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import Marker from "./components/Marker";
import Map from "./components/Map";
import Line from "./components/Line";
import LatLngLiteral = google.maps.LatLngLiteral;
import MapMouseEvent = google.maps.MapMouseEvent;
import LatLng = google.maps.LatLng;

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const App = () => {
  const [clicks, setClicks] = useState<LatLng[]>([]);
  const [zoom, setZoom] = useState(6);
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 55,
    lng: -4,
  });
  const midpoint = useMemo<LatLngLiteral | null>(() => {
    if (clicks.length < 2) {
      return null;
    }

    return {
      lat: clicks.reduce((acc, curr) => acc + curr.lat(), 0) / clicks.length,
      lng: clicks.reduce((acc, curr) => acc + curr.lng(), 0) / clicks.length,
    };
  }, [clicks]);

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
            <Marker key={`marker${i}`} position={latLng} />
          ))}

          {midpoint &&
            clicks.map((latLng, i) => (
              <Line
                key={`line${i}`}
                path={[
                  { lat: latLng.lat(), lng: latLng.lng() },
                  { lat: midpoint.lat, lng: midpoint.lng },
                ]}
              />
            ))}

          {midpoint && (
            <Marker
              key="midpoint"
              position={midpoint}
              title="Midpoint"
              label="M"
            />
          )}
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

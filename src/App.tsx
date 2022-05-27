import { useCallback, useMemo, useState } from "react";

import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { Line, Map, Marker } from "./components";
import LatLngLiteral = google.maps.LatLngLiteral;
import MapMouseEvent = google.maps.MapMouseEvent;
import LatLng = google.maps.LatLng;

interface Location {
  latLng: LatLng;
  localId: number;
}

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const App = () => {
  const [nextLocalId, setNextLocalId] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const zoom = 6;
  const center = { lat: 55, lng: -4 };

  const midpoint = useMemo<LatLngLiteral | null>(() => {
    if (locations.length < 2) {
      return null;
    }

    return {
      lat:
        locations.reduce((acc, { latLng }) => acc + latLng.lat(), 0) /
        locations.length,
      lng:
        locations.reduce((acc, { latLng }) => acc + latLng.lng(), 0) /
        locations.length,
    };
  }, [locations]);

  const removeLocation = useCallback(
    (localIdToRemove: number) => {
      setLocations((prev) =>
        prev.filter(({ localId }) => localId !== localIdToRemove)
      );
    },
    [locations]
  );

  const onClick = ({ latLng }: MapMouseEvent) => {
    if (latLng) {
      setLocations((prev) => [
        ...prev,
        {
          latLng,
          localId: nextLocalId,
        },
      ]);
      setNextLocalId((prev) => prev + 1);
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
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {locations.map(({ localId, latLng }) => (
            <Marker
              key={`marker${localId}`}
              position={latLng}
              onClick={() => removeLocation(localId)}
            />
          ))}

          {midpoint &&
            locations.map(({ localId, latLng }) => (
              <Line
                key={`line${localId}`}
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
      {/*  locations={locations}*/}
      {/*  setClicks={setClicks}*/}
      {/*/>*/}
    </div>
  );
};
export default App;

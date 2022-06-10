import { useCallback, useMemo, useState } from "react";
import { Form, Line, Map, Marker } from "./components";

export interface Location {
  latLng: google.maps.LatLng;
  localId: number;
}

const MyMapApp = () => {
  const [nextLocalId, setNextLocalId] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const zoom = 6;
  const center = { lat: 55, lng: -4 };

  const midpoint = useMemo<google.maps.LatLng | null>(() => {
    if (locations.length < 2) {
      return null;
    }

    return new window.google.maps.LatLng({
      lat:
        locations.reduce((acc, { latLng }) => acc + latLng.lat(), 0) /
        locations.length,
      lng:
        locations.reduce((acc, { latLng }) => acc + latLng.lng(), 0) /
        locations.length,
    });
  }, [locations]);

  const removeLocation = useCallback(
    (localIdToRemove: number) => {
      setLocations((prev) =>
        prev.filter(({ localId }) => localId !== localIdToRemove)
      );
    },
    [locations]
  );

  const onClick = ({ latLng }: google.maps.MapMouseEvent) => {
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
            <Line key={`line${localId}`} path={[latLng, midpoint]} />
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

      {/* Basic form for controlling center and zoom of map. */}
      <Form locations={locations} setLocations={setLocations} />
    </div>
  );
};

export default MyMapApp;
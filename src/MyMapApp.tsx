import { useCallback, useEffect, useMemo, useState } from "react";
import { ParamKeyValuePair, useSearchParams } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import { Form, Line, Map, Marker } from "./components";

export interface Location {
  name?: string;
  latLng: google.maps.LatLng;
  localId: number;
}

const DEFAULT_ZOOM = 6; // Approx whole of UK
const DEFAULT_CENTER = { lat: 55, lng: -4 }; // Approx UK

const MyMapApp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMidpoint, setShowMidpoint] = useState(true);

  const [locations, setLocations] = useState<Location[]>(() => {
    const arr: Location[] = [];
    let localId = 0;
    searchParams.forEach((value, key) => {
      if (key !== "coordinate") return;

      const [lat, lng] = value.split(",").map(Number);

      arr.push({
        latLng: new window.google.maps.LatLng({ lat, lng }),
        localId,
      });

      localId++;
    });

    return arr;
  });

  const [nextLocalId, setNextLocalId] = useState(locations.length);

  useEffect(() => {
    setSearchParams(
      locations.map(
        ({ latLng }): ParamKeyValuePair => [
          "coordinate",
          `${latLng.lat()},${latLng.lng()}`,
        ]
      )
    );
  }, [locations]);

  const midpoint = useMemo<google.maps.LatLng | null>(() => {
    if (locations.length < 2 || !showMidpoint) {
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
  }, [locations, showMidpoint]);

  const addLocation = (latLng: google.maps.LatLng, name?: string) => {
    if (!latLng) return;

    setLocations((prev) => [
      ...prev,
      {
        latLng,
        localId: nextLocalId,
        name,
      },
    ]);

    setNextLocalId((prev) => prev + 1);
  };

  const removeLocation = useCallback(
    (localIdToRemove: number) => {
      setLocations((prev) =>
        prev.filter(({ localId }) => localId !== localIdToRemove)
      );
    },
    [locations]
  );

  const onClick = ({ latLng }: google.maps.MapMouseEvent) =>
    latLng && addLocation(latLng);

  return (
    <Flex height="100%">
      <Map
        center={DEFAULT_CENTER}
        onClick={onClick}
        zoom={DEFAULT_ZOOM}
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
      <Form
        locations={locations}
        addLocation={addLocation}
        toggleMidpoint={() => setShowMidpoint((prev) => !prev)}
        clearLocations={() => setLocations([])}
      />
    </Flex>
  );
};

export default MyMapApp;

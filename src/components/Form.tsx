import { useEffect, useRef } from "react";

import { Location } from "../MyMapApp";

import PlacesAutocomplete from "./PlacesAutocomplete";

interface FormProps {
  locations: Location[];
  addLatLng: (latLng: google.maps.LatLng) => void;
  clearLocations: () => void;
  toggleMidpoint: () => void;
}

const Form = ({
  locations,
  addLatLng,
  clearLocations,
  toggleMidpoint,
}: FormProps) => {
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  // Always scroll to bottom of list
  useEffect(() => {
    if (clearButtonRef?.current) {
      clearButtonRef.current?.scrollIntoView();
    }
  });

  const onShareClick = () =>
    navigator.clipboard.writeText(window.location.href);

  return (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        overflowY: "auto",
      }}
    >
      <PlacesAutocomplete setSelected={addLatLng} />

      <h3>
        {locations.length === 0 ? "Click on map to add markers" : "Markers"}
      </h3>

      {locations.map(({ localId, latLng }) => (
        <pre key={localId}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}

      <button style={{ width: "100%" }} onClick={onShareClick}>
        Share
      </button>

      <button
        ref={clearButtonRef}
        style={{ width: "100%" }}
        onClick={clearLocations}
      >
        Clear
      </button>
      <button style={{ width: "100%" }} onClick={toggleMidpoint}>
        Toggle Show Midpoint
      </button>
    </div>
  );
};

export default Form;

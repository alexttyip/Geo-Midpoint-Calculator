import { Location } from "../MyMapApp";
import { useEffect, useRef } from "react";

interface FormProps {
  locations: Location[];
  setLocations: (locations: Location[]) => void;
}

const Form = ({ locations, setLocations }: FormProps) => {
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  // Always scroll to bottom of list
  useEffect(() => {
    if (clearButtonRef?.current) {
      clearButtonRef.current?.scrollIntoView();
    }
  });

  return (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        overflowY: "auto",
      }}
    >
      <h3>
        {locations.length === 0 ? "Click on map to add markers" : "Markers"}
      </h3>

      {locations.map(({ localId, latLng }) => (
        <pre key={localId}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))}

      <button
        ref={clearButtonRef}
        style={{ width: "100%" }}
        onClick={() => setLocations([])}
      >
        Clear
      </button>
    </div>
  );
};

export default Form;

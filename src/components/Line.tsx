import { useEffect, useState } from "react";

const Line = (options: google.maps.PolylineOptions) => {
  const [line, setLine] = useState<google.maps.Polyline>();

  useEffect(() => {
    if (!line) {
      setLine(new window.google.maps.Polyline());
    }

    return () => {
      if (line) {
        line.setMap(null);
      }
    };
  }, [line]);

  useEffect(() => {
    if (line) {
      line.setOptions(options);
    }
  }, [line, options]);

  return null;
};

export default Line;

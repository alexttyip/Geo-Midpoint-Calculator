import { useEffect, useState } from "react";
import PolylineOptions = google.maps.PolylineOptions;

const Line = (options: PolylineOptions) => {
  const [line, setLine] = useState<google.maps.Polyline>();

  useEffect(() => {
    if (!line) {
      setLine(new google.maps.Polyline());
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

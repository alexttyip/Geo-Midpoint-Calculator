import { useEffect, useState } from "react";

const MarkerComponent = ({
  onClick,
  ...options
}: google.maps.MarkerOptions & { onClick?: () => void }) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (!marker) return;

    marker.setOptions(options);

    if (onClick) {
      marker.setClickable(true);
      marker.addListener("click", onClick);
    } else {
      marker.setClickable(false);
    }
  }, [marker, options]);

  return null;
};

export default MarkerComponent;

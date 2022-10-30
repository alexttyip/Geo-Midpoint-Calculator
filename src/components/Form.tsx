import { useEffect, useRef } from "react";
import {
  Button,
  ButtonGroup,
  Code,
  Divider,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  useToast,
} from "@chakra-ui/react";

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
  const columnBottomRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Always scroll to bottom of list
  useEffect(() => {
    if (columnBottomRef?.current) {
      columnBottomRef.current?.scrollIntoView();
    }
  });

  const onShareClick = () => {
    navigator.clipboard.writeText(window.location.href);

    toast({
      title: "Copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <Flex
      flexDir="column"
      flexBasis="350"
      padding="1rem"
      gap="1rem"
      overflowY="auto"
    >
      <PlacesAutocomplete setSelected={addLatLng} />

      <Heading size="lg">
        {locations.length === 0 ? "Click on map to add markers" : "Markers"}
      </Heading>

      <OrderedList spacing="1rem">
        {locations.map(({ localId, latLng: { lat, lng } }) => (
          <ListItem key={localId}>
            <Code>Lat: {lat()}</Code>
            <br />
            <Code>Lng: {lng()}</Code>
          </ListItem>
        ))}
      </OrderedList>

      <Divider />

      <ButtonGroup
        colorScheme="teal"
        flexDirection="column"
        spacing={0}
        width="100%"
        gap="inherit"
      >
        <Button onClick={onShareClick}>Share</Button>

        <Button onClick={clearLocations} colorScheme="red">
          Clear
        </Button>

        <Button onClick={toggleMidpoint} variant="outline">
          Toggle Show Midpoint
        </Button>
      </ButtonGroup>

      <div ref={columnBottomRef} />
    </Flex>
  );
};

export default Form;

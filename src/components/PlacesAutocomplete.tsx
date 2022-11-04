import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from "@choc-ui/chakra-autocomplete";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface PlacesAutocompleteProps {
  addLocation: (place: google.maps.LatLng, name?: string) => void;
}

const PlacesAutocomplete = ({ addLocation }: PlacesAutocompleteProps) => {
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = ({ item: { value } }: { item: Item }) => {
    getGeocode({ address: value }).then((results) => {
      addLocation(new window.google.maps.LatLng(getLatLng(results[0])), value);
      setValue("", false);
      clearSuggestions();
    });
  };

  return (
    <AutoComplete openOnFocus onSelectOption={handleSelect}>
      <AutoCompleteInput
        placeholder="Search an address"
        value={value}
        onChange={(value) => setValue(value.target.value)}
      />

      <AutoCompleteList>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <AutoCompleteItem key={`option-${place_id}`} value={description}>
              {description}
            </AutoCompleteItem>
          ))}
      </AutoCompleteList>
    </AutoComplete>
  );
};

export default PlacesAutocomplete;

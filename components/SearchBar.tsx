import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { useDebouncedCallback } from "use-debounce";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text) router.setParams({ query: undefined });
  };

  const handleSubmit = () => {
    if (query.trim()) router.setParams({ query });
    // Navigate to the search results page with the query
  };

  // const debouncedSearch = useDebouncedCallback(
  //   (text: string) => router.push(`/search?query=${text}`),
  //   500 // Adjust the debounce delay as needed
  // );

  // const handleSearch = (text: string) => {
  //   setQuery(text);
  //   debouncedSearch(text);
  //   // router.setParams({ query: text });
  //   // Here you can add logic to handle the search query, e.g., updating a search state or making an API call
  // };
  return (
    <View
      className="searchbar"
      style={
        Platform.OS === "android"
          ? { elevation: 5, shadowColor: "#878787" }
          : {}
      }
    >
      <TextInput
        className="flex-1 p-5"
        placeholder="Search for pizzas, burgers ...."
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor="#A0A0A0"
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity
        className="pr-5"
        onPress={() => router.setParams({ query })}
      >
        <Image
          source={images.search}
          className="size-6"
          resizeMode="contain"
          tintColor="#5D5F6D"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

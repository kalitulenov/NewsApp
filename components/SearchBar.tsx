import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type Props = {};

const SearchBar = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={30}
          color={Colors.lightGrey}
        ></Ionicons>
        <TextInput
          placeholder="Search"
          placeholderTextColor={Colors.lightGrey}
          style={styles.searchTxt}
          autoCapitalize="none"
        ></TextInput>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginBottom: 0,
  },
  searchBar: {
    backgroundColor: "#E4E4E4",
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
  },
  searchTxt: {
    fontSize: 14,
    flex: 1,
    color: Colors.darkGrey,
  },
});

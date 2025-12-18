import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const NewsDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
      <View>
        <Text>NewsDetails {id}</Text>
      </View>
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({});

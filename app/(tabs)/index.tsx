import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import axios from "axios";
import { NewsDataType } from "@/types";
import BreakingNews from "@/components/BreakingNews";

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);

  useEffect(() => {
    getBreakingNews();
  }, []);

  const getBreakingNews = async () => {
    try {
      // Expo web not replacing process.env variables
      // const URL =
      //   "https://newsdata.io/api/1/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}";
      const URL =
        "https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de";

      //  console.log("URL2: ", URL);

      const response = await axios.get(URL);
      //   console.log("DATA123:", response.data);

      if (response && response.data) {
        setBreakingNews(response.data.results);
      }
    } catch (error: any) {
      console.log("Error message: ", error.message);
    }
  };
  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar />
      <BreakingNews newsList={breakingNews} />
      {/* {breakingNews.map((item, index) => (
        <Text>{item.title}</Text>
      ))} */}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

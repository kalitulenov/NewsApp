import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import axios from "axios";
import { NewsDataType } from "@/types";
import BreakingNews from "@/components/BreakingNews";
import { isLoading } from "expo-font";
import Catgories from "@/components/Catgories";
import NewsList from "@/components/NewsList";
import Loading from "@/components/Loading";

type Props = {};

const Page = (props: Props) => {
  const { top: safeTop } = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBreakingNews();
    getNews();
  }, []);

  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       getBreakingNews();
  //       getNews();
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setIsLoading(false); // ← ОБЯЗАТЕЛЬНО
  //     }
  //   };
  //   load();
  // }, []);

  const getBreakingNews = async () => {
    try {
      // Expo web not replacing process.env variables
      // const URL =
      //   "https://newsdata.io/api/1/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}";
      const URL =
        "https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=5";

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
  const onCatChanged = (category: string) => {
    console.log("Category: ", category);
    setNews([]);
    getNews(category);
  };

  const getNews = async (category: string = "") => {
    try {
      let categoryString = "";
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }
      // console.log("categoryString: ", categoryString);
      // Expo web not replacing process.env variables
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=10${categoryString}`;
      //    console.log("URL: ", URL);
      const response = await axios.get(URL);

      if (response && response.data) {
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Error message: ", error.message);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: safeTop }]}>
      <Header />
      <SearchBar withHorizontalPadding={true} />
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        // <ActivityIndicator size={"large"} />
        //<Loading size="large"></Loading>
        <BreakingNews newsList={breakingNews} />
      )}
      {/* // <BreakingNews newsList={breakingNews} /> */}
      <Catgories onCategoryChanged={onCatChanged} />
      {/* {breakingNews.map((item, index) => (
        <Text>{item.title}</Text>
      ))} */}
      {/* <NewsList newsList={breakingNews} /> */}
      <NewsList newsList={news} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

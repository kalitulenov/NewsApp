import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { NewsDataType } from "@/types";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import Loading from "@/components/Loading";
import { NewsItem } from "@/components/NewsList";

type Props = {};

const Page = (props: Props) => {
  const { query, category, country } = useLocalSearchParams<{
    query: string;
    category: string;
    country: string;
  }>();

  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = async (category: string = "") => {
    try {
      let categoryString = "";
      let countryString = "";
      let queryString = "";
      if (category.length !== 0) {
        categoryString = `&category=${category}`;
      }
      if (country.length !== 0) {
        countryString = `&country=${country}`;
      }
      if (query.length !== 0) {
        queryString = `&q=${query}`;
      }
      // console.log("categoryString: ", categoryString);
      // Expo web not replacing process.env variables
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&size=10${categoryString}${countryString}${queryString}`;
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
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} />
            </TouchableOpacity>
          ),
          title: "Search2",
        }}
      />
      {/* <View>
        <Text>Search Query: {query}</Text>
        <Text>Category: {category}</Text>
        <Text>Coubtry: {country}</Text>
      </View> */}
      <View style={styles.container}>
        {isLoading ? (
          <Loading size={"large"} />
        ) : (
          <FlatList
            data={news}
            keyExtractor={(_, index) => "list_item${index}"}
            showsVerticalScrollIndicator={false}
            renderItem={({ index, item }) => {
              return (
                <Link href={`/news/${item.article_id}`} asChild key={index}>
                  <TouchableOpacity>
                    <NewsItem item={item}></NewsItem>
                  </TouchableOpacity>
                </Link>
                // <Text>{item.title}</Text>
              );
            }}
          />
        )}
      </View>
    </>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
  },
});

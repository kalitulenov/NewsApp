import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { NewsDataType } from "@/types";
import Loading from "@/components/Loading";
import { Colors } from "@/constants/Colors";
import Moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const NewsDetails = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    if (!isLoading) renderBookmark(news[0].article_id);
  }, [isLoading]);

  const getNews = async () => {
    try {
      // Expo web not replacing process.env variables
      // const URL =
      //   "https://newsdata.io/api/1/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}";
      const URL = `https://newsdata.io/api/1/latest?apikey=pub_d04c7afa300b4847835de372229e59de&id=${id}`;

      //console.log("URL2: ", URL);

      const response = await axios.get(URL);
      //   console.log("DATA123:", response.data);

      if (response && response.data) {
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log("Error message: ", error.message);
    }
  };

  const saveBookmark = async (newsId: string) => {
    setBookmark(true);
    await AsyncStorage.getItem("bookmark").then((token) => {
      // const res = JSON.parse(token);
      const res = token ? JSON.parse(token) : []; // ChatGpt
      if (res !== null) {
        let data = res.find((value: string) => value === newsId);
        if (data == null) {
          res.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(res));
          alert("News Saved");
        } else {
          let bookmark = [];
          bookmark.push(newsId);
          AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
          alert("News Saved!");
        }
      }
    });
  };

  const removeBookmark = async (newsId: string) => {
    setBookmark(false);
    const bookmark = await AsyncStorage.getItem("bookmark").then((token) => {
      // const res = JSON.parse(token);
      const res = token ? JSON.parse(token) : []; // ChatGpt
      return res.filter((id: string) => id !== newsId);
    });
    await AsyncStorage.setItem("bookmark", JSON.stringify(bookmark));
    alert("News unSaved!");
  };

  const renderBookmark = async (newsId: string) => {
    await AsyncStorage.getItem("bookmark").then((token) => {
      // const res = JSON.parse(token);
      const res = token ? JSON.parse(token) : []; // ChatGpt
      if (res !== null) {
        let data = res.find((value: string) => value === newsId);
        return data == null ? setBookmark(false) : setBookmark(true);
      }
    });
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                bookmark
                  ? removeBookmark(news[0].article_id)
                  : saveBookmark(news[0].article_id);
              }}
            >
              <Ionicons
                name={bookmark ? "heart" : "heart-outline"}
                size={22}
                color={bookmark ? "red" : Colors.black}
              />
            </TouchableOpacity>
          ),
          title: "",
        }}
      />
      {isLoading ? (
        <Loading size={"large"} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
          <Text style={styles.title}>{news[0].title}</Text>
          <View style={styles.newsInfoWrapper}>
            <Text style={styles.newsInfo}>
              {Moment(news[0].pubDate).format("MMMM DD, hh:mm a")}
            </Text>
            <Text style={styles.newsInfo}>{news[0].source_name}</Text>
          </View>
          <Image source={{ uri: news[0].image_url }} style={styles.newsImg} />

          {news[0].content ? (
            <Text style={styles.newsContent}>{news[0].content}</Text>
          ) : (
            <Text style={styles.newsContent}>{news[0].description}</Text>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  newsImg: {
    width: "100%",
    height: 300,
    marginBottom: 30,
    borderRadius: 10,
  },
  newsInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  newsInfo: {
    fontSize: 17,
    color: Colors.darkGrey,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    marginVertical: 10,
    letterSpacing: 0.6,
  },
  newsContent: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    letterSpacing: 0.8,
    lineHeight: 22,
  },
});

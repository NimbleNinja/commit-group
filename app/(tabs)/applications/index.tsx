import { Icon, ListItem, Text, useTheme } from "@rneui/themed";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import {
  getFirestore,
  getDocs,
  query,
  collection,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { Application } from "@/types/types";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ApplicationsPage() {
  const { theme } = useTheme();
  const [data, setData] = useState<Application[]>([]);

  const renderApplication = ({ item }: { item: Application }) => {
    return (
      <Pressable
        onPress={() => router.navigate(`/(tabs)/applications/${item.id}`)}
      >
        <ListItem>
          {item.status === "complete" ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={40}
              color="green"
            />
          ) : (
            <MaterialCommunityIcons name="pen-plus" size={40} color="blue" />
          )}
          <ListItem.Content>
            <ListItem.Title numberOfLines={1}>{item.title}</ListItem.Title>
            <ListItem.Subtitle numberOfLines={1}>
              {item.description}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </Pressable>
    );
  };

  useEffect(() => {
    const getApplications = async () => {
      try {
        const db = getFirestore();
        const q = query(collection(db, "applications"));
        const applications: Application[] = [];
        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            applications.push(doc.data() as Application);
          });
          console.log("applications: ", applications);
          setData(applications);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getApplications();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text h1 style={styles.title}>
          Applications
        </Text>
        <FlatList
          data={data}
          renderItem={renderApplication}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        <Link
          href="/(tabs)/applications/new-application"
          style={{ position: "absolute", right: 20, bottom: 20 }}
          asChild
        >
          <Pressable>
            <Icon name="add-circle" size={56} color={theme.colors.primary} />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  separator: {
    height: 8,
  },
});

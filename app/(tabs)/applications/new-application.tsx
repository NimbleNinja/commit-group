import { Image, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Application, Category } from "@/types/types";
import storage from "@react-native-firebase/storage";
import { doc, setDoc, getFirestore } from "@react-native-firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import RNPickerSelect from "react-native-picker-select";

export default function NewApplication() {
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [values, setValues] = useState({
    title: "",
    description: "",
    customer: "",
    category: Category.category1,
  });
  const [load, setLoad] = useState(false);

  const pickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
    });

    console.log(result);

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const handleSave = async () => {
    setLoad(true);

    const application: Application = {
      id: new Date().getTime().toString(),
      title: values.title,
      status: "new",
      review: null,
      category: values.category,
      offers: [],
      description: values.description,
      customer: values.customer,
      file: null,
    };

    //1. save media file
    if (file && file.mimeType) {
      const fileMimeType = file.mimeType.split("/");
      const fileType = fileMimeType[0];
      const fileExtension = fileMimeType[1];
      const fileName = `${new Date().getTime().toString()}.${fileExtension}`;

      try {
        const fileRef = storage().ref(fileName);
        await fileRef.putFile(file.uri);
        const fileUrl = await storage().ref(fileName).getDownloadURL();

        application.file = {
          name: fileName,
          type: fileType,
          url: fileUrl,
        };
      } catch (error) {
        console.log("error during save file: ", error);
        setLoad(false);
      }
    }

    //2. save application with file download url

    try {
      const db = getFirestore();
      await setDoc(doc(db, "applications", application.id), application);
      router.replace("/applications");
      console.log("Application created");
    } catch (error) {
      console.log("error during save application: ", error);
      setLoad(false);
    }

    setLoad(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text h2 style={styles.title}>
          New application
        </Text>
        {file && file.type === "image" && (
          <Image source={{ uri: file.uri }} style={styles.fileView} />
        )}
        {file && file.type === "video" && (
          <Video
            style={styles.fileView}
            source={{ uri: file.uri }}
            useNativeControls
          />
        )}
        <Input
          value={values.title}
          onChangeText={(text) =>
            setValues((prev) => ({ ...prev, title: text }))
          }
          placeholder="Title"
          disabled={load}
        />
        <Input
          value={values.description}
          onChangeText={(text) =>
            setValues((prev) => ({ ...prev, description: text }))
          }
          placeholder="Description"
          disabled={load}
        />
        <Input
          value={values.customer}
          onChangeText={(text) =>
            setValues((prev) => ({ ...prev, customer: text }))
          }
          placeholder="Customer"
          disabled={load}
        />
        <RNPickerSelect
          onValueChange={(value) =>
            setValues((prev) => ({ ...prev, category: value }))
          }
          placeholder={{ label: "Category 1", value: Category.category1 }}
          value={values.category}
          items={[
            // { label: "Category 1", value: Category.category1 },
            { label: "Category 2", value: Category.category2 },
            { label: "Category 3", value: Category.category3 },
          ]}
        />
        <Button title="chose file" onPress={pickFile} loading={load} />
        <Button title="save" onPress={handleSave} loading={load} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  title: {
    textAlign: "center",
  },
  fileView: {
    height: 300,
  },
});

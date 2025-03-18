import { Card, Input, ListItem, Text, Button } from "@rneui/themed";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
} from "@react-native-firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";
import { Application, Offer } from "@/types/types";
import { useEffect, useState } from "react";
import { Video } from "expo-av";
import RNPickerSelect from "react-native-picker-select";

export default function ApplicationPage() {
  const { id } = useLocalSearchParams();

  const [application, setApplication] = useState<Application | null>(null);
  const [load, setLoad] = useState(false);

  const [offerFormVisible, setOfferFormVisible] = useState(false);
  const [offerValues, setOfferValues] = useState({
    performer: "",
    price: "",
    estimate: "",
    comment: "",
  });

  const [ratingFormVisible, setRatingFormVisible] = useState(false);
  const [ratingValues, setRatingValues] = useState({
    offerId: "",
    rating: "",
    comment: "",
  });

  const getApplication = async (docId: string) => {
    const db = getFirestore();
    const docRef = doc(db, "applications", docId);
    const application = await getDoc(docRef);
    setApplication(application.data() as Application);
    console.log(application.data());
  };

  const handleOffer = async () => {
    if (!application) return;
    setLoad(true);

    const newOffer: Offer = {
      id: new Date().getTime().toString(),
      ...offerValues,
    };

    try {
      const db = getFirestore();
      const docRef = doc(db, "applications", application.id);
      await updateDoc(docRef, {
        offers: [...application.offers, newOffer],
      });
      const updatedapplication = await getDoc(docRef);
      setApplication(updatedapplication.data() as Application);

      console.log("updatedapplication: ", updatedapplication);

      setOfferFormVisible(false);
      setOfferValues({
        performer: "",
        price: "",
        estimate: "",
        comment: "",
      });
    } catch (error) {
      console.log(error);
    }
    setLoad(false);
  };

  const handleReviewRating = async () => {
    if (!application) return;

    setLoad(true);
    const db = getFirestore();
    const docRef = doc(db, "applications", application.id);
    await updateDoc(docRef, {
      status: "complete",
      review: {
        id: new Date().getTime().toString(),
        ...ratingValues,
      },
    });
    const updatedapplication = await getDoc(docRef);
    setApplication(updatedapplication.data() as Application);

    console.log("updatedapplication: ", updatedapplication);

    setLoad(false);
    router.replace("/applications");
  };

  useEffect(() => {
    getApplication(id as string);
  }, []);

  if (!application) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size={80} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Card containerStyle={{ marginBottom: 24 }}>
          {application.file && application.file.type === "image" && (
            <Card.Image
              style={{ height: 250 }}
              source={{ uri: application.file.url }}
            />
          )}
          {application.file && application.file.type === "video" && (
            <Video
              style={{ height: 250 }}
              source={{ uri: application.file.url }}
              useNativeControls
            />
          )}
          <Text h3>{application.title}</Text>
          <Card.Divider />

          <Text style={{ fontSize: 20 }}>
            <Text h4>Customer:</Text>
            {` ${application.customer}`}
          </Text>

          <Text style={{ fontSize: 20 }}>
            <Text h4>Status:</Text>
            {` ${application.status}`}
          </Text>

          <Text style={{ fontSize: 20 }}>
            <Text h4>Category:</Text>
            {` ${application.category}`}
          </Text>

          <Text style={{ fontSize: 20 }}>{application.description}</Text>
        </Card>
        {application.status === "new" && (
          <View style={styles.actions}>
            <Button
              title="MAKE AN OFFER"
              onPress={() => setOfferFormVisible((prev) => !prev)}
              disabled={ratingFormVisible || load}
            />
            {application.offers.length > 0 && (
              <Button
                title="LEAVE A REVIEW"
                color="green"
                onPress={() => setRatingFormVisible((prev) => !prev)}
                disabled={offerFormVisible || load}
              />
            )}
          </View>
        )}
        {offerFormVisible && (
          <Card>
            <Input
              placeholder="Performer name"
              value={offerValues.performer}
              onChangeText={(val) =>
                setOfferValues((prev) => ({ ...prev, performer: val }))
              }
            />
            <Input
              placeholder="Price $"
              value={offerValues.price}
              onChangeText={(val) =>
                setOfferValues((prev) => ({ ...prev, price: val }))
              }
            />
            <Input
              placeholder="Estimate"
              value={offerValues.estimate}
              onChangeText={(val) =>
                setOfferValues((prev) => ({ ...prev, estimate: val }))
              }
            />
            <Input
              placeholder="Comment"
              value={offerValues.comment}
              onChangeText={(val) =>
                setOfferValues((prev) => ({ ...prev, comment: val }))
              }
            />
            <Button title="SAVE" onPress={handleOffer} loading={load} />
          </Card>
        )}
        {application.offers.length > 0 &&
          !ratingFormVisible &&
          application.status === "new" && (
            <Card>
              <Card.Title>Offers:</Card.Title>
              {application.offers.map((offer) => {
                return (
                  <ListItem key={offer.id}>
                    <ListItem.Content>
                      <ListItem.Title>{`${offer.price}$ - ${offer.performer} - ${offer.estimate}`}</ListItem.Title>
                      <ListItem.Subtitle>{offer.comment}</ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                );
              })}
            </Card>
          )}
        {ratingFormVisible && application.status === "new" && (
          <Card>
            <RNPickerSelect
              onValueChange={(value) =>
                setRatingValues((prev) => ({ ...prev, offerId: value }))
              }
              value={ratingValues.offerId}
              items={application.offers.map((offer) => {
                return { label: offer.performer, value: offer.id };
              })}
            />

            <Input
              placeholder="Rating 1-5"
              value={ratingValues.rating}
              onChangeText={(val) =>
                setRatingValues((prev) => ({ ...prev, rating: val }))
              }
            />
            <Input
              placeholder="Comment"
              value={ratingValues.comment}
              onChangeText={(val) =>
                setRatingValues((prev) => ({ ...prev, comment: val }))
              }
            />
            <Button title="SAVE" loading={load} onPress={handleReviewRating} />
          </Card>
        )}
        {application.status === "complete" && application.review && (
          <Card>
            <Text h4>
              Performer:{" "}
              {
                application.offers.find(
                  (offer) => offer.id === application.review?.offerId
                )?.performer
              }
            </Text>
            <Text style={{ fontSize: 20 }}>
              <Text h4>Rating:</Text>
              {` ${application.review.rating}/5`}
            </Text>

            <Text style={{ fontSize: 20 }}>
              <Text h4>Comment:</Text>
              {` ${application.review.comment}`}
            </Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    flex: 1,
  },
  actions: {
    gap: 8,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 24,
  },
});

import { StyleSheet, View } from "react-native";
import { Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text h2>Applications proccess</Text>
        <Text h4>1. To see applications list, press "Applications" tab.</Text>
        <Text h4>
          2. To see details of application, press "Applications" tab and select
          any application.
        </Text>
        <Text h4>
          3. To create new application, press "Applications" tab than press "+"
          button.
        </Text>
        <Text h4>
          4. To offer yourself as a performer, press "Applications" tab than go
          to details page and press "Make an offer".
        </Text>
        <Text h4>
          5. To transfer the application to the status "completed" and evaluate
          the work go to details page and press "Leave a review".
        </Text>
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
  img: {
    height: 400,
  },
});

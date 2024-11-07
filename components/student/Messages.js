import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Messages({ navigation }) {
  const friends = [
    {
      userId: "1",
      userName: "Jagr Groubert",
      userImage: require("../../assets/profilePicture.png"),
      Messages: [
        {
          date: "10/21/2024",
          time: "1:30pm",
          message: "Hey, how's the design going?",
          seen: false,
        },
      ],
    },
    {
      userId: "2",
      userName: "Faiz Sayed",
      userImage: "",
      Messages: [
        {
          date: "10/21/2024",
          time: "1:30pm",
          message: "Hey, are you finished with the assignment for tomorrow?",
          seen: true,
        },
      ],
    },
  ];
  const getInitials = (userName) => {
    if (!userName) return "";
    const nameArray = userName.split(" ");
    if (nameArray.length === 1) {
      return nameArray[0][0].toUpperCase();
    }
    const firstNameInitial = nameArray[0][0].toUpperCase();
    const lastNameInitial = nameArray[nameArray.length - 1][0].toUpperCase();
    return firstNameInitial + lastNameInitial;
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={[styles.row, { marginBottom: 20 }]}>
          <Text style={styles.title}>Messages</Text>
          <MaterialCommunityIcons name="pencil-outline" size={30} />
        </View>
        <View style={[styles.searchBox, styles.pair]}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="#424242"
          ></MaterialCommunityIcons>
          <TextInput
            style={styles.input}
            placeholder="Search for people"
          ></TextInput>
        </View>
        <FlatList
          data={friends}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("MessageDetails", { item })}
              style={[styles.pair, { paddingTop: 18 }]}
            >
              {item.userImage ? (
                <Image style={styles.profileImage} source={item.userImage} />
              ) : (
                <View style={styles.defaultImage}>
                  <Text style={styles.initial}>
                    {getInitials(item.userName)}
                  </Text>
                </View>
              )}
              <View style={styles.column}>
                <Text style={styles.senderName}>{item.userName}</Text>
                <Text
                  style={
                    item.Messages[Messages.length - 1].seen
                      ? styles.msgSeen
                      : styles.msgNotSeen
                  }
                >
                  {item.Messages[Messages.length - 1].message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
  pair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  searchBox: {
    height: 50,
    backgroundColor: "#D9D9D9",
    width: "100%",
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#424242",
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: "#d9d9d9",
  },
  defaultImage: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: "#d9d9d9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#013976",
  },
  senderName: {
    fontWeight: 900,
    color: "#333",
    fontSize: 16,
  },
  msgSeen: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#424242",
  },
  msgNotSeen: {
    fontSize: 14,
    color: "#424242",
  },
});

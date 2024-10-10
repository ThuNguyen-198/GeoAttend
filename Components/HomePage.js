import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function HomePage({ navigation }) {
  const courses = [
    { courseName: "Advanced Database" },
    { courseName: "Capstone Project" },
    { courseName: "Advanced Algorithm" },
  ];

  const listStyle = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
      paddingHorizontal: 10,
    },
    card: {
      backgroundColor: "#fff",
      padding: 15,
      marginVertical: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    item: {
      fontSize: 18,
      color: "#013976",
    },
  });

  return (
    <View style={listStyle.container}>
      <FlatList
        data={courses}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("CourseDetails")}
            style={listStyle.card}
          >
            <Text style={listStyle.item}>{item.courseName}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

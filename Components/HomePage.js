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

  return (
    <View style={listStyle.container}>
      <Text style={listStyle.title}>Courses</Text>
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
const listStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
    borderWidth: 0.3,
    borderColor: "#A4A4A4",
  },
  item: {
    fontSize: 18,
    color: "#013976",
  },
});

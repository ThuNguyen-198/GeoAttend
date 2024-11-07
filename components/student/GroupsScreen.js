import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function GroupsScreen({ navigation }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  const myGroups = [
    {
      groupId: "112",
      groupName: "GeoAttend",
      groupMembers: [
        { userId: "1", userName: "Thu Nguyen" },
        { userId: "2", userName: "Jagr Groubert" },
        { userId: "3", userName: "Chandramouli Prabhakaran" },
        { userId: "4", userName: "Sashank Subramaniam" },
        { userId: "5", userName: "Faiz Sayed" },
      ],
    },
    {
      groupId: "136",
      groupName: "Research",
      groupMembers: [
        { userId: "1", userName: "Thu Nguyen" },
        { userId: "4", userName: "Sashank Subramaniam" },
        { userId: "5", userName: "Faiz Sayed" },
      ],
    },
    {
      groupId: "143",
      groupName: "Group 1",
      groupMembers: [
        { userId: "1", userName: "Thu Nguyen" },
        { userId: "2", userName: "Jagr Groubert" },
        { userId: "3", userName: "Chandramouli Prabhakaran" },
      ],
    },
  ];

  const toggleGroup = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <MaterialCommunityIcons name="plus" size={38} color="#949494" />
      </View>

      <FlatList
        data={myGroups}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={[styles.card, styles.row]}
              onPress={() => navigation.navigate("GroupDetails", { item })}
            >
              <Text style={styles.groupName}>{item.groupName}</Text>
              <TouchableOpacity onPress={() => toggleGroup(item.groupId)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      marginVertical: 10,
                      borderLeftWidth: 0.3,
                      borderLeftColor: "#424242",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        expandedGroup === item.groupId
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      style={styles.groupDropDownIcon}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>

            {expandedGroup === item.groupId && item.groupMembers.length > 0 && (
              <FlatList
                data={item.groupMembers}
                renderItem={(
                  { item: member } // Change `member` to `item`
                ) => (
                  <View style={{ paddingHorizontal: 20 }}>
                    <View style={styles.memberRow}>
                      <Text key={member.userId} style={styles.memberName}>
                        {member.userName}
                      </Text>
                      <View style={styles.pair}>
                        <TouchableOpacity>
                          <MaterialCommunityIcons
                            name="message"
                            size={20}
                            color={"#EFAB00"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <MaterialCommunityIcons
                            name="delete"
                            size={20}
                            color={"#013976"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        height: 0.6,
                        backgroundColor: "#d9d9d9",
                      }}
                    ></View>
                  </View>
                )}
                keyExtractor={(member) => member.userId.toString()} // Ensure unique key for members
              />
            )}
          </View>
        )}
        keyExtractor={(item) => item.groupId.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
    borderWidth: 0,
    borderColor: "#A4A4A4",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groupName: {
    fontSize: 18,
    color: "#013976",
    paddingVertical: 10,
  },
  groupDropDownIcon: {
    // minWidth: 50,
    fontSize: 30,
    color: "#424242",
    paddingLeft: 30,
    paddingVertical: 10,
  },
  memberRow: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  memberName: {
    fontSize: 16,
    color: "#424242",
  },
});

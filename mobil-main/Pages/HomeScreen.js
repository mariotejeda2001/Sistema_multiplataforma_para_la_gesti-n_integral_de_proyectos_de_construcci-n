import React, { useState } from "react";
import { useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Button } from "react-native-paper";
import { globals } from "../Globals";
import { StyleSheet } from "react-native";
const Item = ({ item, navigation }) => (
  <View style={styles.item}>
    <Text style={styles.datestart}>{item.fecha_inicio}</Text>
    <Text style={styles.dateend}>{item.fecha_fin}</Text>
    <Text style={styles.status}>{item.estado}</Text>
    <Text style={styles.title}>{item.nombre}</Text>
    <Text style={styles.location}>{item.ubicacion}</Text>
    <Button
      icon="eye"
      textColor="white"
      onPress={() => navigation.navigate("Details", { item: item })}
    >
      Ver Detalles
    </Button>
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    backgroundColor: "#FCF7D1",
  },
  item: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#444",
    width: 350,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    margin: 10,
    color: "#fff",
  },
  datestart: {
    fontSize: 10,
    position: "absolute",
    right: 0,
    margin: 15,
    color: "#fff",
  },
  dateend: {
    fontSize: 10,
    position: "absolute",
    right: 60,
    margin: 15,
    color: "#fff",
  },
  status: {
    fontSize: 10,
    position: "absolute",
    left: 0,
    paddingTop: 10,
    paddingLeft: 10,
    color: "#fff",
  },
  location: {
    fontSize: 15,
    marginLeft: 10,
    color: "#fff",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#444",
    width: 450,
    height: 60,
  },
});

export const HomeScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getProjects();
    }, 1000);
  }, []);
  const { user } = route.params;
  console.log(user.id);
  const renderItem = ({ item }) => <Item item={item} navigation={navigation} />;
  const [data, setData] = useState([]);
  const getProjects = async () => {
    try {
      const response = await fetch(globals.urlAPI + "proyecto/" + user.id);
      const json = await response.json();
      console.log(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView style={styles.container}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>
      </ScrollView>

      <View style={styles.bar}>
        <Button textColor="white" icon={"home"} />
        <Button textColor="white">Notificaciones</Button>
        <Button
          textColor="white"
          onPress={() => navigation.navigate("Profile", { user: user })}
        >
          Perfil
        </Button>
      </View>
    </>
  );
};

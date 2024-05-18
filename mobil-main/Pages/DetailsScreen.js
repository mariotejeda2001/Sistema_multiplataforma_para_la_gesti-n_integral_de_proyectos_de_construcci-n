import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";

import { Button } from "react-native-paper";
import { Table, Row, Rows } from "react-native-table-component";
import { stylesDetails } from "../Styles";
import { useState } from "react";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { globals } from "../Globals";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export const DetailsScreen = ({ navigation, route }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getEvidencias();
    }, 2000);
  }, []);
  const { item } = route.params;
  const id = item.id;
  const [evidencias, setEvidencias] = useState([]);
  const getEvidencias = async () => {
    try {
      const response = await fetch(globals.urlAPI + "avances/" + id);
      const json = await response.json();
      setEvidencias(json);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
    getEvidencias();
  }, []);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={stylesDetails.container}>
        <View style={stylesDetails.header}>
          <Image
            style={stylesDetails.img}
            source={{
              uri: item.img,
            }}
          />
          <Text style={stylesDetails.descripcion}>{item.descripcion}</Text>
        </View>
        <View
          style={{
            width: 400,
          }}
        >
          <Table borderStyle={{ borderWidth: 1, borderColor: "#444" }}>
            <Row
              data={["Fecha de inicio", "Fecha de fin", "Estado", "Ubicacion"]}
              style={{ height: 40, backgroundColor: "#fff" }}
            />
            <Rows
              data={[
                [
                  item.fecha_inicio,
                  item.fecha_fin,
                  item.estado,
                  item.ubicacion,
                ],
              ]}
            />
          </Table>
        </View>
        <View style={{ width: 400 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Evidencia
          </Text>

          <FlatList
            scrollEnabled={true}
            data={evidencias}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Evidencia", { item: item });
                  }}
                >
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      margin: 10,
                      borderRadius: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                    source={{
                      uri: globals.urlAPI + "evidencias/" + item.archivo,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
          />
          <Button
            icon="camera"
            mode="contained"
            onPress={() => navigation.navigate("Camera", { id: id })}
            style={{ margin: 10, padding: 10, backgroundColor: "#000" }}
          >
            Tomar Evidencia
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};
export const Fotos = ({ navigation, route }) => {
  const { id } = route.params;

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = React.useRef(null);
  const [descripcion, setDescripcion] = useState("");
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "start",
      alignItems: "center",
    },
    camera: {
      flex: 1,
      width: "100%",
    },
    foto: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: "transparent",
      flexDirection: "column-reverse",
      alignItems: "center",
      justifyContent: "space-between",
    },

    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "black",
      textAlign: "center",
      marginTop: 10,
    },
    btnCamera: {
      fontSize: 20,
      backgroundColor: "#A9A9A9",
      width: 100,
      height: 100,
      color: "#fff",
      margin: 10,
      borderRadius: 100,
      alignItems: "center",
      justifyContent: "center",
    },
    btnType: {
      fontSize: 20,
      backgroundColor: "#A9A9A9",
      width: 80,
      height: 50,
      color: "#fff",
      marginLeft: 300,
      marginTop: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  const takePicture = async () => {
    if (cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(uri);
      console.log(uri);
    }
  };
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        
        <TouchableOpacity onPress={requestPermission}>
          <Text>Request permission</Text>
        </TouchableOpacity>
        
      </View>
    );
  }
  function toggleCameraType() {
    setType((current) =>
      current === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        <View style={styles.container}>
          <Text style={styles.text}>Evidencia</Text>
          <Image
            source={{ uri: capturedPhoto }}
            style={{ width: 400, height: 500, marginTop: 10 }}
          />
          <TextInput
            style={{
              width: 300,
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              margin: 10,
              borderRadius: 10,
              padding: 10,
            }}
            placeholder="Descripcion de la evidencia"
            value={descripcion}
            onChangeText={(text) => setDescripcion(text)}
          />
          <Button
            icon="content-save"
            mode="contained"
            style={{ margin: 10, padding: 10, backgroundColor: "#000" }}
            onPress={() => {
              if (uploadImage(capturedPhoto, id, descripcion)) {
                navigation.goBack();
              }
            }}
          />
        </View>
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          ref={cameraRef}
          autoFocus="on"
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnCamera} onPress={takePicture}>
              <Text style={{ color: "#fff" }}>Capturar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnType} onPress={toggleCameraType}>
              <Text style={{ color: "#fff" }}>Flip</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
};
const uploadImage = async (uri, id, descripcion) => {
  //haremos una peticion a la API que estoy desarollando
  //para subir la imagen

  const data = new FormData();
  //subir la imagen tomada como archivo llamado evidencia
  data.append("evidencia", {
    uri,
    type: "image/jpeg",
    name: "evidencia.jpg",
  });
  data.append("proyecto_id", id);
  data.append("descripcion", descripcion);
  fetch(globals.urlAPI + "Avance", {
    method: "POST",
    body: data,
    mode: "no-cors",
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("upload succes", response);
      alert("Upload success!");
      //retroceder a la pantalla anterior
    })
    .catch((error) => {
      console.log("upload error", error);
    });
};
export const Evidencia = ({ navigation, route }) => {
  const { item } = route.params;
  const escalaImg = useSharedValue(1);
  const focoX = useSharedValue(0);
  const focoY = useSharedValue(0);

  const pinchScreen = Gesture.Pinch()
    .onStart((e) => {
      focoX.value = e.focalX;
      focoY.value = e.focalY;
    })
    .onUpdate((e) => {
      escalaImg.value = e.scale;
    })
    .onEnd(() => {
      escalaImg.value = withTiming(1, { duration: 500 });
    });
  const centroImagen = {
    x: 400 / 2,
    y: 500 / 2,
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: focoX.value },
      { translateY: focoY.value },
      { translateX: -centroImagen.x },
      { translateY: -centroImagen.y },
      { scale: escalaImg.value },
      { translateX: -focoX.value },
      { translateY: -focoY.value },
      { translateX: centroImagen.x },
      { translateY: centroImagen.y },
    ],
  }));

  const styles = StyleSheet.create({
    img: {
      width: 400,
      height: 500,
      borderRadius: 20,
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SafeAreaView>
        <GestureHandlerRootView>
          <GestureDetector gesture={pinchScreen}>
            <Animated.Image
              style={[styles.img, animatedStyle]}
              source={{
                uri: globals.urlAPI + "evidencias/" + item.archivo,
              }}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </SafeAreaView>

      <Text
        style={{ fontSize: 20, fontWeight: "bold", margin: 10, color: "#444" }}
      >
        {item.descripcion}
      </Text>
      <Text
        style={{ fontSize: 20, fontWeight: "bold", margin: 10, color: "#444" }}
      >
        {item.fecha}
      </Text>
      <Button
        icon="delete"
        mode="contained"
        style={{ margin: 10, padding: 10, backgroundColor: "#444" }}
        onPress={() => {
          deleteEvidencia(item.id);
          navigation.goBack();
        }}
      >
        <Text>Eliminar</Text>
      </Button>
    </View>
  );
};

const deleteEvidencia = async (id) => {
  fetch(globals.urlAPI + "Avance/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((response) => {
      console.log("Delete succes", response);
      alert("Delete success!");
      //retroceder a la pantalla anterior
    })
    .catch((error) => {
      console.log("Delete error", error);
    });
};

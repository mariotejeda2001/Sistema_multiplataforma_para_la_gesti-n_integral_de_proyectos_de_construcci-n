import * as React from "react";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { HomeScreen } from "./Pages/HomeScreen";
import { ProfileScreen } from "./Pages/ProfileScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DetailsScreen } from "./Pages/DetailsScreen";
import { Fotos } from "./Pages/DetailsScreen";
import { Evidencia } from "./Pages/DetailsScreen";
import { globals } from "./Globals";

const Stack = createNativeStackNavigator();
const MyStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#33FF00" }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: "#FCF7D1",
            },
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            screenOptions={{
              contentStyle: {
                backgroundColor: "#FCF7D1",
              },
            }}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Camera" component={Fotos} />
          <Stack.Screen name="Evidencia" component={Evidencia} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const validate = async () => {
    if (!email) {
      Alert.alert("Please Enter Your Email id");
    } else if (!password) {
      Alert.alert("Please Enter Your Password");
    } else {
      login();
    }
  };
  const login = async () => {
    var url = globals.urlAPI + "login";
    var data = { correo: email, password: password };
    try {
      // Aquí conecta con tu API para verificar las credenciales
      // Supongamos que tu API devuelve información del usuario si las credenciales son válidas
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        navigation.navigate("Home", { user: userData });
      } else {
        // Maneja el caso de credenciales inválidas
        alert("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    textInput: {
      width: 350,
      height: 60,
      padding: 10,
      marginBottom: 15,
      borderRadius: 20,
      fontFamily: "Arial",
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
    },
    loginButton: {
      width: 200,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      backgroundColor: "#444",
    },
    loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  });
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={validate}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyStack;

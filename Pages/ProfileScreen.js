import React from 'react';
import { View, Text } from 'react-native';

export const ProfileScreen = ({ route }) => {
  const {user} = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Perfil de Usuario</Text>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 18 }}>Rol: {user.rol}</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 18 }}>Teléfono: {user.telefono}</Text>
      </View>
      <View>
        <Text style={{ fontSize: 18 }}>Correo electrónico: {user.correo}</Text>
      </View>
    </View>
  );
};


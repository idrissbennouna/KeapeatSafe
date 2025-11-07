import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button title="Se connecter" onPress={login} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600' },
});

export default LoginScreen;
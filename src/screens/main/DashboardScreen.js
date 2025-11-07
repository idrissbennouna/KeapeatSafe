import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenue dans ton tableau de bord 🏠</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardScreen;
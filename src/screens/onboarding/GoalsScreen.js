import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Goals</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600' },
});

export default GoalsScreen;
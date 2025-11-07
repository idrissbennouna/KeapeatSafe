import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import colors from '../../styles/colors';

const Card = ({ children, title, imageSource, onPress, style, titleStyle }) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container style={[styles.card, style]} {...(onPress ? { onPress, activeOpacity: 0.85 } : {})}>
      {imageSource ? <Image source={imageSource} style={styles.image} resizeMode="cover" /> : null}
      {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
      <View style={styles.content}>{children}</View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    // Ombre légère cross-platform
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  content: {
    // espace pour le contenu enfants
  },
});

export default Card;
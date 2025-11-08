import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await register(name, email, password);
      navigation.navigate('Login');
    } catch (e) {
      setError(e.message || "Échec de l’inscription");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>
      <View style={styles.form}>
        <Input label="Nom complet" placeholder="Jean Dupont" value={name} onChangeText={setName} />
        <Input label="Email" placeholder="exemple@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Mot de passe" placeholder="••••••" value={password} onChangeText={setPassword} secureTextEntry />
        <Input label="Confirmer" placeholder="••••••" value={confirm} onChangeText={setConfirm} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="S’inscrire" onPress={handleRegister} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  form: { gap: 12 },
  error: { color: '#d32f2f', marginBottom: 8 },
  link: { marginTop: 16, textAlign: 'center', color: '#1976d2', fontWeight: '500' },
});

export default RegisterScreen;
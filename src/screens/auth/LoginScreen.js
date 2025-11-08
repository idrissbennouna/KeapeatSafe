import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Veuillez saisir email et mot de passe');
      return;
    }
    try {
      await login(email, password);
      // La navigation vers l’app principale se fait via le contexte (user défini)
    } catch (e) {
      setError(e.message || 'Échec de connexion');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.form}>
        <Input label="Email" placeholder="exemple@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Mot de passe" placeholder="••••••" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Se connecter" onPress={handleLogin} />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Créer un compte</Text>
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

export default LoginScreen;
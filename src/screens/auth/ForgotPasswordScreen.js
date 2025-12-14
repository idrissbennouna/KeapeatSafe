import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import colors from '../../styles/colors';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { requestPasswordReset, resetPassword } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSendCode = async () => {
    setError('');
    setInfo('');
    if (!email) { setError('Veuillez saisir votre email'); return; }
    try {
      const token = await requestPasswordReset(email);
      setInfo(`Code envoyé: ${token}`);
      setStep(2);
    } catch (e) {
      setError(e.message || 'Échec de l’envoi du code');
    }
  };

  const handleReset = async () => {
    setError('');
    setInfo('');
    if (!code || !newPassword || !confirm) { setError('Veuillez remplir tous les champs'); return; }
    if (newPassword !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    try {
      await resetPassword(email, code, newPassword);
      setInfo('Mot de passe mis à jour');
      navigation.navigate('Login');
    } catch (e) {
      setError(e.message || 'Échec de la réinitialisation');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>

      {step === 1 && (
        <View style={styles.form}>
          <Input label="Email" placeholder="exemple@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}
          <Button title="Envoyer le code" onPress={handleSendCode} />
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Retour à la connexion</Text>
        </View>
      )}

      {step === 2 && (
        <View style={styles.form}>
          <Input label="Code" placeholder="123456" value={code} onChangeText={setCode} keyboardType="number-pad" />
          <Input label="Nouveau mot de passe" placeholder="••••••" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          <Input label="Confirmer" placeholder="••••••" value={confirm} onChangeText={setConfirm} secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {info ? <Text style={styles.info}>{info}</Text> : null}
          <Button title="Mettre à jour" onPress={handleReset} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12, color: colors.textPrimary },
  form: { gap: 12 },
  error: { color: '#d32f2f' },
  info: { color: colors.accent },
  link: { marginTop: 12, textAlign: 'center', color: '#1976d2', fontWeight: '500' },
});

export default ForgotPasswordScreen;

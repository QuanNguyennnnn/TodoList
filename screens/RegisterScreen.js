import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  Alert, TouchableOpacity, ActivityIndicator, useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter all fields!');
      return;
    }

    setLoading(true);
    try {
      const existing = await AsyncStorage.getItem('user');
      if (existing) {
        Alert.alert('Account already exists');
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify({ email, password }));
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', 'Could not save data');
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Register</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color={isDark ? '#fff' : '#555'} style={styles.icon} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#fff' : '#555'} style={styles.icon} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Login')} style={[styles.link, { color: isDark ? '#4a90e2' : 'blue' }]}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', marginBottom: 15,
    paddingHorizontal: 10, borderRadius: 5
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 40 },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 10, textAlign: 'center' }
});

import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'

export default function SignIn() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secureText, setSecureText] = useState(true)

  const handleSignIn = () => {
    signIn()
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <View style={styles.content}>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={28} color="#F5F5F5" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Vamos entrar no seu</Text>
            <Text style={styles.title}>STOCKY</Text>
            <Text style={styles.subtitle}>Tenha controle sobre seu estoque a qualquer momento.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Insira seu e-mail"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, borderWidth: 0 }]}
                  placeholder="Insira sua senha"
                  placeholderTextColor="#9E9E9E"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureText}
                />
                <TouchableOpacity 
                  onPress={() => setSecureText(!secureText)} 
                  style={styles.eyeIconContainer}
                >
                  <Ionicons 
                    name={secureText ? "eye-off-outline" : "eye-outline"} 
                    size={22} 
                    color="#9E9E9E" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c', 
    paddingHorizontal: 12,
    paddingTop: 36,
  },
  content: {
    flex: 1, 
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 60,
  },
  title: {
    color: '#F5F5F5', 
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9E9E9E', 
    fontSize: 16,
    marginTop: 10,
  },
  form: {
    gap: 24, 
  },
  inputGroup: {
    gap: 8, 
  },
  label: {
    color: '#9E9E9E',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2A2A2A', 
    color: '#F5F5F5', 
    fontSize: 16,
    height: 60,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333', 
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    height: 60,
  },
  eyeIconContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  footer: {
    justifyContent: 'flex-end',
    marginBottom: 40, 
  },
  loginButton: {
    width: "100%",
    height: 60,
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#F5F5F5', 
    fontSize: 16,
    fontWeight: 'bold',
  },
})
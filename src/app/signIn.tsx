import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  ScrollView 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

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
            <Ionicons name="arrow-back" size={28} color={COLORS.brancoTexto} />
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
                placeholderTextColor={COLORS.cinzaTexto}
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
                  placeholderTextColor={COLORS.cinzaTexto}
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
                    color={COLORS.cinzaTexto} 
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
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  content: {
    flex: 1, 
  },
  backButton: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    marginBottom: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  title: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.weight.bold,
  },
  subtitle: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.lg,
    marginTop: SPACING.sm,
  },
  form: {
    gap: SPACING.lg, 
  },
  inputGroup: {
    gap: SPACING.xs, 
  },
  label: {
    color: COLORS.cinzaTexto,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
  input: {
    height: 60,
    backgroundColor: COLORS.cinzaMedio, 
    color: COLORS.brancoTexto, 
    fontSize: FONTS.size.lg,
    paddingHorizontal: SPACING.md,
    borderColor: COLORS.cinzaClaro, 
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: COLORS.cinzaMedio,
    borderColor: COLORS.cinzaClaro,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  eyeIconContainer: {
    justifyContent: 'center',
        paddingHorizontal: SPACING.md,
  },
  footer: {
    justifyContent: 'flex-end',
    marginBottom: SPACING.xxl, 
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: 60,
    backgroundColor: COLORS.laranjaStock,
    borderRadius: RADIUS.sm,
  },
  loginButtonText: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.lg,
    fontWeight: FONTS.weight.bold,
  },
})
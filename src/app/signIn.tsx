import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  Image,
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
    <>
      <View style={styles.container}>
        {/* VIEW HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.brancoTexto} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/logo.png')} 
              style={styles.logoImage} 
            />
            <Text style={styles.title}>
              STOCKY
            </Text>
          </View>
        </View>

        {/* VIEW FORM */}
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

        {/* BUTÃO ENTRAR */}
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },
  header: {
    width: '100%',
    gap: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    alignItems: 'center',
    gap: SPACING.lg,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.xxl,
    fontWeight: FONTS.weight.bold,
  },
  form: {
    width: '100%',
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
  button: {
    height: 60,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: COLORS.laranjaStock,
    borderWidth: 2,
    borderRadius: RADIUS.sm,
  },
  buttonText: {
    color: COLORS.laranjaStock,
    fontSize: FONTS.size.md,
    fontWeight: FONTS.weight.bold,
  },
})
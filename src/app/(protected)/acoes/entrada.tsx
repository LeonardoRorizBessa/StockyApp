import { useState } from 'react'
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { COLORS, SPACING, FONTS, RADIUS } from '@/theme'

export default function Entrada() {
  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* SECTION HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Entrada de Estoque</Text>
            <TouchableOpacity onPress={() => router.replace('/home')}>
              <Ionicons name="close" size={24} color={COLORS.brancoTexto} />
            </TouchableOpacity>
          </View>

          <View style={styles.divisor} />

        
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaEscuro,
    paddingHorizontal: SPACING.sm,
    paddingTop: SPACING.xxl,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.brancoTexto,
    fontSize: FONTS.size.xl,
    fontWeight: FONTS.weight.bold,
  },
  divisor: {
    height: 1,
    backgroundColor: COLORS.cinzaMedio,
    marginBottom: SPACING.md,
  },
})
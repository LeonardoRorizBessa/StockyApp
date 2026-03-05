import { Redirect, Stack, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { useAuth } from '@/hooks/useAuth'
import { ActivityIndicator } from 'react-native'

export default function ProtectedLayout(){
  const { isLoggedIn, isReady } = useAuth()

  if (!isReady) {
    return (
      <ActivityIndicator style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    )
  }

  if (!isLoggedIn) {
    return <Redirect href="/signIn" />
  }

  return (
    <>
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#284496',
        tabBarInactiveTintColor: '#072a63',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Estoque',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Escanear',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="barcode-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  )
}
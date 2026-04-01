import { Redirect, Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedLayout(){
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Redirect href="/welcome" />
  }

  return (
    <>
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#2A2A2A',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="estoque"
          options={{
            title: 'Estoque',
            headerShown: false,
            tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={24} color={color} />,
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
        <Tabs.Screen 
          name="acoes" 
          options={{ 
            headerShown: false,
            href: null,
            tabBarStyle: { display: 'none' } 
          }}
        />
      </Tabs>
    </>
  )
}
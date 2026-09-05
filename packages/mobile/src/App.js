import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import { useAuthStore } from './store/authStore'

// Screens
import LoginScreen from './screens/auth/LoginScreen'
import DashboardScreen from './screens/dashboard/DashboardScreen'
import ProjectsScreen from './screens/projects/ProjectsScreen'
import ProjectDetailScreen from './screens/projects/ProjectDetailScreen'
import TasksScreen from './screens/tasks/TasksScreen'
import CreateTaskScreen from './screens/tasks/CreateTaskScreen'
import VoiceReportScreen from './screens/voice/VoiceReportScreen'
import PlansScreen from './screens/plans/PlansScreen'
import SettingsScreen from './screens/settings/SettingsScreen'
import SplashScreen from './screens/auth/SplashScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function DashboardNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName

          if (route.name === 'Dashboard') {
            iconName = 'home'
          } else if (route.name === 'Projects') {
            iconName = 'briefcase'
          } else if (route.name === 'Tasks') {
            iconName = 'checkbox-multiple-marked'
          } else if (route.name === 'Voice') {
            iconName = 'microphone'
          } else if (route.name === 'Settings') {
            iconName = 'cog'
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Voice" component={VoiceReportScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isReady, setIsReady] = React.useState(false)

  useEffect(() => {
    // Initialize app
    setIsReady(true)
  }, [])

  if (!isReady) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainApp" component={DashboardNavigator} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
            <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
            <Stack.Screen name="Plans" component={PlansScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

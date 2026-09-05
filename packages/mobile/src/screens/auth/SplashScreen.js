import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Construction AI</Text>
      <ActivityIndicator size="large" color="#667eea" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
})

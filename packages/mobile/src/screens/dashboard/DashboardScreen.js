import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import client from '../../api/client'

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await client.get('/projects/stats')
      setStats(response.data)
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="briefcase" size={24} color="#667eea" />
          <Text style={styles.statValue}>{stats?.activeProjects || 0}</Text>
          <Text style={styles.statLabel}>Active Projects</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="checkbox-multiple-marked" size={24} color="#764ba2" />
          <Text style={styles.statValue}>{stats?.totalTasks || 0}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#10b981" />
          <Text style={styles.statValue}>{stats?.completedTasks || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons name="microphone" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{stats?.voiceReports || 0}</Text>
          <Text style={styles.statLabel}>Voice Reports</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('CreateTask')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.buttonText}>New Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Voice')}
        >
          <MaterialCommunityIcons name="microphone" size={24} color="#667eea" />
          <Text style={styles.buttonTextSecondary}>Voice Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.quickActionItem}>
          <MaterialCommunityIcons name="file-pdf" size={20} color="#667eea" />
          <Text style={styles.quickActionText}>View Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionItem}>
          <MaterialCommunityIcons name="people" size={20} color="#667eea" />
          <Text style={styles.quickActionText}>Manage Team</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionItem}>
          <MaterialCommunityIcons name="chart-line" size={20} color="#667eea" />
          <Text style={styles.quickActionText}>View Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    fontWeight: '500',
  },
})

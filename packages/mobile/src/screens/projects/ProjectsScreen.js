import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import client from '../../api/client'

export default function ProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await client.get('/projects')
      setProjects(response.data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => navigation.navigate('ProjectDetail', { id: item.id })}
    >
      <View style={styles.projectHeader}>
        <Text style={styles.projectName}>{item.name}</Text>
        <View style={[styles.status, { backgroundColor: item.status === 'active' ? '#10b981' : '#fbbf24' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.projectClient}>{item.client}</Text>
      <View style={styles.projectStats}>
        <View style={styles.stat}>
          <MaterialCommunityIcons name="checkbox-multiple-marked" size={16} color="#667eea" />
          <Text style={styles.statText}>{item.taskCount || 0} Tasks</Text>
        </View>
        <View style={styles.stat}>
          <MaterialCommunityIcons name="account-multiple" size={16} color="#667eea" />
          <Text style={styles.statText}>{item.teamSize || 0} Team</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="briefcase-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No projects yet</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  projectClient: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  projectStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
})

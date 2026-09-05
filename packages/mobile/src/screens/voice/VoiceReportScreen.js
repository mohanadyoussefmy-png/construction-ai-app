import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { MaterialCommunityIcons } from 'react-native-vector-icons'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import client from '../../api/client'

const audioRecorderPlayer = new AudioRecorderPlayer()

export default function VoiceReportScreen() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedPath, setRecordedPath] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [transcription, setTranscription] = useState('')

  const startRecording = async () => {
    try {
      setIsRecording(true)
      const result = await audioRecorderPlayer.startRecorder()
      setRecordedPath(result)
    } catch (error) {
      Alert.alert('Error', 'Failed to start recording')
      setIsRecording(false)
    }
  }

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder()
      setIsRecording(false)
      setRecordedPath(result)
      Alert.alert('Success', 'Recording stopped')
    } catch (error) {
      Alert.alert('Error', 'Failed to stop recording')
    }
  }

  const handleTranscribe = async () => {
    if (!recordedPath) {
      Alert.alert('Error', 'No recording found')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('audio', {
        uri: recordedPath,
        type: 'audio/m4a',
        name: 'voice-report.m4a',
      })

      const response = await client.post('/voice/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setTranscription(response.data.transcription)
      Alert.alert('Success', 'Recording transcribed successfully')
    } catch (error) {
      Alert.alert('Error', 'Failed to transcribe recording')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveReport = async () => {
    if (!transcription) {
      Alert.alert('Error', 'No transcription available')
      return
    }

    setIsLoading(true)
    try {
      await client.post('/voice/reports', {
        content: transcription,
        audioPath: recordedPath,
        timestamp: new Date().toISOString(),
      })

      Alert.alert('Success', 'Voice report saved')
      setRecordedPath('')
      setTranscription('')
    } catch (error) {
      Alert.alert('Error', 'Failed to save report')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.recordingContainer}>
        <View style={[styles.recordButton, isRecording && styles.recordingActive]}>
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={styles.recordTouchable}
          >
            <MaterialCommunityIcons
              name={isRecording ? 'stop' : 'microphone'}
              size={40}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.status}>
          {isRecording ? 'Recording...' : 'Ready to record'}
        </Text>
      </View>

      {recordedPath ? (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.transcribeButton}
            onPress={handleTranscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="text-to-speech" size={20} color="#fff" />
                <Text style={styles.buttonText}>Transcribe</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {transcription ? (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionTitle}>Transcription:</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveReport}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                <Text style={styles.buttonText}>Save Report</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingActive: {
    backgroundColor: '#ef4444',
  },
  recordTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  actionContainer: {
    marginBottom: 20,
  },
  transcribeButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  transcriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

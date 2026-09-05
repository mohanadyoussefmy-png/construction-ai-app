import React, {useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const tasks = ['Inspect level 3 framing', 'Confirm material delivery', 'Update safety checklist'];

export default function App() {
  const [screen, setScreen] = useState('Home');
  const [recording, setRecording] = useState(false);
  const content = screen === 'Voice' ? (
    <View style={styles.body}>
      <Text style={styles.kicker}>VOICE UPDATE</Text>
      <Text style={styles.title}>Talk. We organize.</Text>
      <Text style={styles.copy}>Capture progress, issues, and tasks directly from the jobsite.</Text>
      <TouchableOpacity style={[styles.record, recording && styles.recording]} onPress={() => setRecording(!recording)}><Text style={styles.recordText}>{recording ? '■' : '●'}</Text></TouchableOpacity>
      <Text style={styles.status}>{recording ? 'Recording… tap to stop' : 'Tap to record an update'}</Text>
      <TouchableOpacity style={styles.primary} onPress={() => Alert.alert('Report saved', 'Your field update is ready for the project record.')}><Text style={styles.primaryText}>Save field report</Text></TouchableOpacity>
    </View>
  ) : <ScrollView contentContainerStyle={styles.body}>
    <Text style={styles.kicker}>VOICE TASK</Text><Text style={styles.title}>{screen === 'Home' ? 'Your jobsite, in sync.' : screen}</Text>
    <Text style={styles.copy}>{screen === 'Projects' ? 'Harbor Point · 68% complete\nRiverside Clinic · 91% complete' : 'Field-first project management for your crew.'}</Text>
    <Text style={styles.section}>{screen === 'Tasks' ? 'Today’s tasks' : 'Next tasks'}</Text>
    {tasks.map((task, i) => <View style={styles.card} key={task}><View style={styles.dot}/><View><Text style={styles.cardTitle}>{task}</Text><Text style={styles.meta}>{i === 0 ? 'Harbor Point · Today' : 'Assigned to your crew'}</Text></View></View>)}
    <TouchableOpacity style={styles.primary} onPress={() => setScreen('Voice')}><Text style={styles.primaryText}>Create voice update</Text></TouchableOpacity>
  </ScrollView>;
  return <SafeAreaView style={styles.safe}>{content}<View style={styles.tabs}>{['Home','Tasks','Projects','Voice'].map(x => <TouchableOpacity key={x} onPress={() => setScreen(x)}><Text style={[styles.tab, screen === x && styles.active]}>{x}</Text></TouchableOpacity>)}</View></SafeAreaView>;
}
const styles = StyleSheet.create({safe:{flex:1,backgroundColor:'#F7F8FA'},body:{flexGrow:1,padding:24,justifyContent:'center'},kicker:{fontWeight:'800',letterSpacing:2,color:'#216C5C',fontSize:12},title:{fontSize:32,fontWeight:'800',color:'#13241F',marginTop:8},copy:{fontSize:16,lineHeight:24,color:'#65736E',marginTop:10,marginBottom:30},section:{fontWeight:'800',fontSize:18,color:'#13241F',marginBottom:12},card:{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:14,padding:16,marginBottom:10},dot:{width:12,height:12,borderRadius:6,backgroundColor:'#54A78E',marginRight:12},cardTitle:{fontSize:16,fontWeight:'700',color:'#20312B'},meta:{fontSize:12,color:'#77847F',marginTop:3},primary:{backgroundColor:'#216C5C',padding:17,borderRadius:14,alignItems:'center',marginTop:18},primaryText:{color:'#fff',fontSize:16,fontWeight:'800'},tabs:{height:66,backgroundColor:'#fff',borderTopWidth:1,borderColor:'#E6EBE8',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},tab:{color:'#77847F',fontSize:12},active:{color:'#216C5C',fontWeight:'800'},record:{width:150,height:150,borderRadius:75,backgroundColor:'#216C5C',alignSelf:'center',alignItems:'center',justifyContent:'center',borderWidth:10,borderColor:'#DDF3EA',marginVertical:25},recording:{backgroundColor:'#C54D4D'},recordText:{fontSize:42,color:'#fff'},status:{textAlign:'center',color:'#65736E',fontWeight:'700'}});

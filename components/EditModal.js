import React from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, StyleSheet, useColorScheme
} from 'react-native';

const priorities = [
  { label: '🔥 High', value: 'high' },
  { label: '⚡ Medium', value: 'medium' },
  { label: '🧊 Low', value: 'low' }
];

export default function EditModal({
  visible, onClose, taskText, setTaskText,
  onSave, priority, setPriority
}) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: isDark ? '#1e1e1e' : 'white' }]}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Edit Task</Text>

          <TextInput
            value={taskText}
            onChangeText={setTaskText}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
                color: isDark ? '#fff' : '#000'
              }
            ]}
            placeholder="Task name"
            placeholderTextColor={isDark ? '#aaa' : '#666'}
          />

          <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#333' }]}>Priority:</Text>
          <View style={styles.priorityGroup}>
            {priorities.map(p => (
              <TouchableOpacity
                key={p.value}
                onPress={() => setPriority(p.value)}
                style={[
                  styles.priorityOption,
                  priority === p.value && styles.selectedPriority
                ]}
              >
                <Text style={{ color: isDark ? '#fff' : '#000' }}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={{ color: '#555' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onSave}>
              <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', backgroundColor: '#00000088'
  },
  modal: {
    width: '85%', padding: 20,
    borderRadius: 12, elevation: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6
  },
  subtitle: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '600'
  },
  priorityGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priorityOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 5
  },
  selectedPriority: {
    backgroundColor: '#ddd'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10
  }
});

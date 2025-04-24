import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, SectionList, TouchableOpacity,
  StyleSheet, Image, useColorScheme, Switch,
  LayoutAnimation, UIManager, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import TaskItem from '../components/TaskItem';
import EditModal from '../components/EditModal';
import { groupTasksByDate } from '../utils/groupTasksByDate'; // dùng file tách riêng

export default function HomeScreen({ navigation }) {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('medium');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingPriority, setEditingPriority] = useState('medium');

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
    const loadTasks = async () => {
      const data = await AsyncStorage.getItem('tasks');
      if (data) setTasks(JSON.parse(data));
    };
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!task.trim()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      title: task,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    }]);
    setTask('');
    setPriority('medium');
  };

  const toggleComplete = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const deleteTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const logout = () => navigation.replace('Login');

  const openEditModal = (taskObj) => {
    setEditingTask(taskObj);
    setEditingText(taskObj.title);
    setEditingPriority(taskObj.priority || 'medium');
    setIsModalVisible(true);
  };

  const handleSaveEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev =>
      prev.map(t =>
        t.id === editingTask.id
          ? { ...t, title: editingText, priority: editingPriority }
          : t
      )
    );
    setIsModalVisible(false);
    setEditingTask(null);
    setEditingText('');
    setEditingPriority('medium');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : completedCount / totalCount;

  const filterTasks = () =>
    tasks.filter(t => {
      const matchCompleted = showCompleted ? t.completed : !t.completed;
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter ? t.priority === priorityFilter : true;
      return matchCompleted && matchSearch && matchPriority;
    });

  const filteredGrouped = groupTasksByDate(filterTasks());

  const renderPriorityFilter = (icon, value) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        priorityFilter === value && styles.selectedPriorityButton
      ]}
      onPress={() => setPriorityFilter(priorityFilter === value ? null : value)}
    >
      <Text>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png' }}
        style={styles.banner}
      />
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Your Tasks</Text>

      <View style={styles.progressBox}>
        <Text style={{ color: isDark ? '#aaa' : '#444' }}>
          Completed: {completedCount} / {totalCount}
        </Text>
        <Progress.Bar
          progress={progress}
          width={null}
          height={10}
          color="#4a90e2"
          borderRadius={8}
          unfilledColor={isDark ? '#333' : '#eee'}
          style={{ marginTop: 5 }}
        />
      </View>

      <TextInput
        placeholder="Search tasks..."
        placeholderTextColor="#aaa"
        style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.priorityFilterRow}>
        {renderPriorityFilter('🔥', 'high')}
        {renderPriorityFilter('⚡', 'medium')}
        {renderPriorityFilter('🧊', 'low')}
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="add" size={20} color="#4a90e2" />
        <TextInput
          placeholder="Add a new task"
          placeholderTextColor="#999"
          value={task}
          onChangeText={setTask}
          style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <View style={styles.filterRow}>
        <Text style={{ color: isDark ? '#ccc' : '#333' }}>
          {showCompleted ? 'Showing completed' : 'Showing active'}
        </Text>
        <Switch
          value={showCompleted}
          onValueChange={() => setShowCompleted(!showCompleted)}
        />
      </View>

      {filteredGrouped.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076500.png' }}
            style={styles.emptyImage}
          />
          <Text style={{ color: isDark ? '#ccc' : '#666', marginTop: 10 }}>
            No tasks to show!
          </Text>
        </View>
      ) : (
        <SectionList
          sections={filteredGrouped}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TaskItem
              item={item}
              onDelete={deleteTask}
              onToggle={toggleComplete}
              onEdit={openEditModal}
              isDark={isDark}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: isDark ? '#ccc' : '#333' }]}>
              {title}
            </Text>
          )}
          style={{ marginTop: 10 }}
        />
      )}

      <TouchableOpacity onPress={logout} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <EditModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        taskText={editingText}
        setTaskText={setEditingText}
        onSave={handleSaveEdit}
        priority={editingPriority}
        setPriority={setEditingPriority}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  banner: { width: 70, height: 70, alignSelf: 'center', marginBottom: 10 },
  progressBox: { marginBottom: 15 },
  searchInput: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, borderRadius: 8,
    marginBottom: 10
  },
  priorityFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  priorityButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#eee'
  },
  selectedPriorityButton: {
    backgroundColor: '#4a90e2'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc',
    paddingHorizontal: 10, borderRadius: 5,
    marginBottom: 10
  },
  input: { flex: 1, height: 40, marginLeft: 8 },
  addButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyImage: { width: 80, height: 80, opacity: 0.6 },
  logout: { marginTop: 30, alignItems: 'center' },
  logoutText: { color: '#4a90e2', fontWeight: 'bold' },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 6,
    backgroundColor: '#f9f9f9'
  }
});

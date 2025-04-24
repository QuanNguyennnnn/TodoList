import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function TaskItem({ item, onDelete, onToggle, onEdit, isDark }) {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.swipeDelete} onPress={() => onDelete(item.id)}>
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const getPriorityIcon = () => {
    switch (item.priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🧊';
      default: return '';
    }
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.taskItem}>
        <TouchableOpacity onPress={() => onToggle(item.id)}>
          <Ionicons
            name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={item.completed ? 'green' : isDark ? '#ccc' : '#333'}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.taskText,
              {
                textDecorationLine: item.completed ? 'line-through' : 'none',
                color: isDark ? '#fff' : '#000'
              }
            ]}
          >
            {item.title} {getPriorityIcon()}
          </Text>
        </View>

        <TouchableOpacity onPress={() => onEdit(item)}>
          <Ionicons name="create-outline" size={22} color="#4a90e2" />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    gap: 10
  },
  taskText: {
    fontSize: 16
  },
  swipeDelete: {
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 8
  }
});

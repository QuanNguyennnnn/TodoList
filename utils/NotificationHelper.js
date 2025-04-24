import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications in settings');
      return;
    }
  }
}

export function scheduleReminder(title, seconds = 10) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Reminder',
      body: `Task: ${title}`,
    },
    trigger: { seconds },
  });
}

import { View } from 'react-native';
import { Stack } from 'expo-router';
import Auth from '../_components/auth';

export default function Login() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View>
        <Auth />
      </View>
    </>
  );
}

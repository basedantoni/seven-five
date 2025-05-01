import { Redirect, Slot } from 'expo-router';
import { Text } from 'react-native';
import { useUser } from '~/lib/supabase';

export default function HomeLayout() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!user) {
    return <Redirect href='/login' />;
  }

  return <Slot />;
}

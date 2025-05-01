import { useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import Button from '~/app/_components/ui/button';
import Input from '~/app/_components/ui/input';
import { Theme } from '~/utils/theme';

import { supabase } from '~/lib/supabase';

export default function Auth() {
  const { styles } = useStyles(stylesheet);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.navigate('/');
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize={'none'}
        />
      </View>
      <Button
        label='Sign in'
        mode='primary'
        disabled={loading}
        onPress={() => signInWithEmail()}
      />
      <Button
        label='Sign up'
        mode='ghost'
        disabled={loading}
        onPress={() => signUpWithEmail()}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme: Theme) => ({
  container: {
    flexDirection: 'column',
    width: '100%',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
}));

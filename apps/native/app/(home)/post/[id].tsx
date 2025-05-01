import { SafeAreaView, Text, View } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Theme } from '~/utils/theme';

import { trpc } from '~/utils/api';

export default function Post() {
  const { styles } = useStyles(stylesheet);
  const { id } = useGlobalSearchParams<{ id: string }>();
  if (!id) throw new Error('unreachable');
  const { data } = useQuery(trpc.post.byId.queryOptions({ publicId: id }));

  if (!data) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: data[0]?.title ?? 'Mock Post',
          headerBackTitle: 'Back',
          headerBackVisible: true,
        }}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{data[0]?.title}</Text>
        <Text style={styles.content}>{data[0]?.content}</Text>
      </View>
    </SafeAreaView>
  );
}

const stylesheet = createStyleSheet((theme: Theme) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    fontWeight: 'normal',
  },
}));

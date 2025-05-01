import Button from '~/app/_components/ui/button';
import Input from '~/app/_components/ui/input';

import { useState } from 'react';
import { Text, View } from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '~/utils/api';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Theme } from '~/utils/theme';

const CreatePost = () => {
  const queryClient = useQueryClient();
  const { styles } = useStyles(stylesheet);

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const { mutate, error } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        setTitle('');
        setContent('');
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
      <View style={styles.formContainer}>
        <Input
          placeholder='Title'
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        {error?.data?.zodError?.fieldErrors.title && (
          <Text style={styles.errorText}>
            {error.data.zodError.fieldErrors.title}
          </Text>
        )}
        <Input
          placeholder='Content'
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        {error?.data?.zodError?.fieldErrors.content && (
          <Text style={styles.errorText}>
            {error.data.zodError.fieldErrors.content}
          </Text>
        )}

        <Button
          label='Create'
          mode='primary'
          onPress={() => mutate({ title, content })}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme: Theme) => ({
  container: {
    flexDirection: 'column',
    width: '100%',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  errorText: {
    color: theme.destructive,
  },
}));

export default CreatePost;

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { View, Text, ActivityIndicator } from 'react-native';
import { trpc } from '~/utils/api';
import CreatePost from '~/app/_components/posts/create-post';
import Post from '~/app/_components/posts/post';
import MobileAuth from '~/app/_components/mobile-auth';
import Button from '~/app/_components/ui/button';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Theme } from '~/utils/theme';

export default function Home() {
  const { styles } = useStyles(stylesheet);

  const { isLoading, isError, data, refetch } = useQuery(
    trpc.post.all.queryOptions()
  );

  const queryClient = useQueryClient();

  const { mutate: deletePost, error } = useMutation(
    trpc.post.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  const { mutate: updatePost, error: updatePostError } = useMutation(
    trpc.post.update.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.post.all.queryFilter());
      },
    })
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <Button label='Retry' mode='primary' onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MobileAuth />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Create Antho Repo</Text>
        <View style={styles.postsContainer}>
          <Text style={styles.postsTitle}>Posts</Text>
          {data?.map((post) => (
            <View key={post.publicId} style={styles.postContainer}>
              <Post post={post} />
              <View style={styles.buttonContainer}>
                <Button
                  label='Update'
                  mode='outline'
                  onPress={() =>
                    updatePost({ publicId: post.publicId, title: 'Updated' })
                  }
                />
                <Button
                  label='Delete'
                  mode='destructive'
                  onPress={() => deletePost({ publicId: post.publicId })}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={{ width: '100%' }}>
          <CreatePost />
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme: Theme) => ({
  container: {
    flexDirection: 'column',
    padding: 16,
    gap: 32,
    paddingTop: 44,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  postsContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  postsTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'light',
  },
  postContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

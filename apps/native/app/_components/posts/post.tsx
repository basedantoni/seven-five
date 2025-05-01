import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { RouterOutputs } from '~/utils/api';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Theme } from '~/utils/theme';

const Post = ({ post }: { post: RouterOutputs['post']['all'][number] }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Link
      asChild
      href={{
        pathname: '/post/[id]',
        params: { id: post.publicId },
      }}
      style={styles.root}
    >
      <Pressable style={styles.root}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
      </Pressable>
    </Link>
  );
};

const stylesheet = createStyleSheet((theme: Theme) => ({
  root: {
    flexDirection: 'column',
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

export default Post;

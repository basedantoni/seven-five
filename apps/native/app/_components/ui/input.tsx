import { TextInput, TextInputProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Theme } from '~/utils/theme';

export default function Input({ ...props }: TextInputProps) {
  const { styles, theme } = useStyles(stylesheet);

  return <TextInput {...props} style={styles.root} />;
}

const stylesheet = createStyleSheet((theme: Theme) => ({
  root: {
    flexDirection: 'row',
    height: 36,
    width: '100%',
    minWidth: 0,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.input,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 4,
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  },
}));

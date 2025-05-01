import { ReactElement, useMemo } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Theme } from '~/utils/theme';

export interface ButtonProps {
  label: string;
  mode: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  state?: 'default' | 'hovered' | 'pressed' | 'focused' | 'disabled';
  disabled?: boolean;
  showIcon?: boolean;
  icon?: ReactElement;
  onPress?: (e: GestureResponderEvent) => void;
}

export default function Button({
  label,
  mode,
  state,
  disabled,
  showIcon,
  icon,
  onPress,
}: ButtonProps) {
  const { styles, theme } = useStyles(stylesheet);

  const _modePrimary = mode === 'primary';
  const _modeSecondary = mode === 'secondary';
  const _modeDestructive = mode === 'destructive';
  const _modeOutline = mode === 'outline';
  const _modeGhost = mode === 'ghost';
  const _modeLink = mode === 'link';

  const _stateDisabled = state === 'disabled' || disabled;
  const _statePressed = state === 'pressed';
  const _stateFocused = state === 'focused';

  const $styles = useMemo(() => {
    const rootStyle: ViewStyle = {
      ...styles.root,
      ...(_modePrimary && styles.primary),
      ...(_modeSecondary && styles.secondary),
      ...(_modeDestructive && styles.destructive),
      ...(_modeOutline && styles.outline),
      ...(_modeGhost && styles.ghost),
      ...(_modeLink && styles.link),
      ...(_stateDisabled && styles.disabled),
      ...(_statePressed && styles.pressed),
      ...(_stateFocused && styles.focused),
    };

    const getLabelStyle = (state: PressableStateCallbackType): TextStyle => {
      return {
        ...styles.label,
        ...(_modePrimary && styles.primaryForeground),
        ...(_modeSecondary && styles.secondaryForeground),
        ...(_modeDestructive && styles.destructiveForeground),
        ...(_modeOutline && styles.secondaryForeground),
        ...(_stateDisabled && styles.disabledLabel),
        ...(_statePressed && styles.pressedLabel),
        ...(_stateFocused && styles.focusedLabel),
      };
    };

    return {
      root: rootStyle,
      label: getLabelStyle,
    };
  }, [
    styles,
    mode,
    state,
    _modePrimary,
    _modeSecondary,
    _modeDestructive,
    _modeOutline,
    _modeGhost,
    _modeLink,
    _stateDisabled,
    _statePressed,
    _stateFocused,
  ]);

  return (
    <Pressable style={$styles.root} onPress={onPress} disabled={_stateDisabled}>
      {(e: PressableStateCallbackType) => (
        <>
          {showIcon && icon}
          <Text style={$styles.label(e)}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme: Theme) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  },
  primary: {
    backgroundColor: theme.primary,
  },
  secondary: {
    backgroundColor: theme.secondary,
  },
  destructive: {
    backgroundColor: theme.destructive,
  },
  outline: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  hovered: {
    opacity: 0.9,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  focused: {
    borderWidth: 2,
    borderColor: theme.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryForeground: {
    color: theme.primaryForeground,
  },
  secondaryForeground: {
    color: theme.secondaryForeground,
  },
  destructiveForeground: {
    color: theme.primaryForeground,
  },
  textLabel: {
    color: theme.primary,
  },
  disabledLabel: {
    color: theme.primary,
    opacity: 0.5,
  },
  pressedLabel: {},
  focusedLabel: {},
}));

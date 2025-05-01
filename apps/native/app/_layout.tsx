import { Slot } from 'expo-router';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '~/utils/api';

import { UnistylesRegistry } from 'react-native-unistyles';
import { light, dark } from '~/utils/theme';

UnistylesRegistry.addThemes({
  light,
  dark,
}).addConfig({
  adaptiveThemes: true,
  initialTheme: 'light',
});

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

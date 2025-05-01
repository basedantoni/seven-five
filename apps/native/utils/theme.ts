export const light = {
  background: '#FFFFFF',
  foreground: '#0A0A0A',
  primary: '#171717',
  primaryForeground: '#FAFAFA',
  secondary: '#F5F5F5',
  secondaryForeground: '#171717',
  muted: '#F5F5F5',
  mutedForeground: '#737373',
  accent: '#F5F5F5',
  accentForeground: '#171717',
  destructive: '#E7000B',
  destructiveForeground: '#171717',
  border: '#E5E5E5',
  input: '#E5E5E5',
};

export const dark = {
  background: '#0A0A0A',
  foreground: '#FAFAFA',
  primary: '#FAFAFA',
  primaryForeground: '#171717',
  secondary: '#262626',
  secondaryForeground: '#FAFAFA',
  muted: '#262626',
  mutedForeground: '#A1A1A1',
  accent: '#262626',
  accentForeground: '#FAFAFA',
  destructive: '#82181A',
  destructiveForeground: '#FB2C36',
  border: '#262626',
  input: '#262626',
};

export type Theme = {
  primary: string;
  secondary: string;
  destructive: string;
  primaryForeground: string;
  secondaryForeground: string;
  destructiveForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  border: string;
  input: string;
};

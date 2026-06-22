import { ref } from 'vue';

const STORAGE_KEY = 'emporion-theme';

const getInitial = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const theme = ref(getInitial());

const apply = (value) => {
  document.documentElement.classList.toggle('dark', value === 'dark');
};

// Apply immediately on module load to avoid a flash.
apply(theme.value);

export function useTheme() {
  const setTheme = (value) => {
    theme.value = value;
    localStorage.setItem(STORAGE_KEY, value);
    apply(value);
  };

  const toggleTheme = () => setTheme(theme.value === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggleTheme };
}

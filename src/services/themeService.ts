/**
 * Theme Service - Manages dark/light mode
 */

export type ThemeMode = 'light' | 'dark';

class ThemeService {
  private readonly THEME_KEY = 'hookouts_theme';

  /**
   * Get current theme from localStorage or default to 'light'
   */
  getTheme(): ThemeMode {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    return (savedTheme as ThemeMode) || 'light';
  }

  /**
   * Set theme and save to localStorage
   */
  setTheme(theme: ThemeMode): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): ThemeMode {
    const currentTheme = this.getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * Apply theme to HTML element
   */
  private applyTheme(theme: ThemeMode): void {
    const htmlElement = document.documentElement;
    
    // Set data-bs-theme attribute for Bootstrap
    htmlElement.setAttribute('data-bs-theme', theme);
    
    // Add/remove theme classes for custom styling
    if (theme === 'dark') {
      htmlElement.classList.add('dark-mode');
      htmlElement.classList.remove('light-mode');
    } else {
      htmlElement.classList.add('light-mode');
      htmlElement.classList.remove('dark-mode');
    }
  }

  /**
   * Initialize theme on app load
   */
  initTheme(): void {
    const theme = this.getTheme();
    this.applyTheme(theme);
  }

  /**
   * Check if current theme is dark
   */
  isDarkMode(): boolean {
    return this.getTheme() === 'dark';
  }
}

export const themeService = new ThemeService();

// Palette centrale (clair et sombre) pour toute l’application
// Inclut couleurs de marque, état, texte, fonds et bordures

const colors = {
  // Marque
  primary: '#2ecc71',       // Vert nutrition
  primaryDark: '#27ae60',
  secondary: '#f39c12',     // Orange d’accent
  accent: '#2980b9',        // Bleu d’accent

  // États / feedback
  success: '#27ae60',
  warning: '#f1c40f',
  danger: '#e74c3c',
  info: '#3498db',

  // Texte
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',

  // Fonds
  backgroundLight: '#ffffff',
  backgroundDark: '#1e1e1e',
  surfaceLight: '#f7f9fa',
  surfaceDark: '#2a2a2a',

  // Bordures / neutres
  border: '#ebedef',
  muted: '#95a5a6',

  // Compat héritée
  gray: '#7f8c8d',
  lightGray: '#ecf0f1',
  white: '#ffffff',
  black: '#000000',
};

export default colors;
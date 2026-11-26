// Set EXPO_PUBLIC_API_URL in .env (e.g. https://api.yourcompany.com/v1).
// When it is empty the app runs on built-in sample data (services/mock.js),
// so every screen works before the backend exists.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
export const USE_MOCK = !API_URL;

// Bangladesh NBR formats. Change here if your rules differ.
export const BIN_LENGTH = 13;
export const TIN_LENGTH = 12;

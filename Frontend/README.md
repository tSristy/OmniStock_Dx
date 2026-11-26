# OmniStock DMS+IMS (Expo + NativeWind)

Distributor mobile app: login by DMS code, inventory + cart, orders, finance, profile.

## Run
```
npm install
npx expo start           # scan the QR with Expo Go
```
Runs on **sample data** until you set the backend URL:
```
cp .env.example .env     # set EXPO_PUBLIC_API_URL=https://your-server/v1
```
Any non-empty DMS code and password work in sample mode.

## Structure
```
App.js                  providers + login gate
screens/                Login, Home, Inventory, Orders, Finance, Profile
navigation/MainTabs.js  floating tab bar
components/             reusable pieces (cards, sheets, form fields)
context/                Auth (saved login), Cart, Toast, Nav
services/api.js         every backend call (contract: docs/API.md)
services/mock.js        sample data used when no API URL is set
theme.js                colors, currency symbol, formatting helpers
```

## Build an APK for a client
```
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

## Notes
- Login is stored in the device Keychain/Keystore and kept until Log out.
- Currency symbol, BIN/TIN lengths: `theme.js` (CURRENCY) and `services/config.js`.
- After editing tailwind.config.js restart with `npx expo start -c`.

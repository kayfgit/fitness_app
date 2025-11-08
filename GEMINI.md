# Project Overview

This is a React Native fitness application built with Expo and TypeScript, inspired by the "Solo Leveling" manwha. The app's main purpose is to provide a personal and motivating fitness experience, where users can create and manage their own quests with specific goals. The app uses a tabbed navigation structure with three main screens: "Quests", "Current", and "Profile". The state of the quests is managed using React Context and persisted to the device's local storage.

## Building and Running

To run the application, you can use the following scripts from the `package.json` file:

*   **`npm start`**: Starts the Expo development server.
*   **`npm run android`**: Starts the app on a connected Android device or emulator.
*   **`npm run ios`**: Starts the app on a connected iOS device or simulator.
*   **`npm run web`**: Starts the app in a web browser.

### Linting

To check the code for any linting errors, run the following command:

*   **`npm run lint`**: Lints the project files using ESLint.

## Development Conventions

*   **Styling**: The project uses Tailwind CSS for styling, as indicated by the `tailwind.config.js` file and the use of `className` props in the components.
*   **State Management**: The application's state is managed through a combination of React Context (`context/quests.tsx`) and local storage (`lib/storage.ts`).
*   **Navigation**: The navigation is handled by `expo-router`, with a stack navigator at the root and a tab navigator for the main screens.
*   **Code Quality**: The project is set up with ESLint for code quality and consistency.

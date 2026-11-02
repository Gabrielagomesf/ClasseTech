import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {RegistrationsProvider} from './src/context/RegistrationsContext';
import {RootNavigator} from './src/navigation';

enableScreens();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <RegistrationsProvider>
        <RootNavigator />
      </RegistrationsProvider>
    </SafeAreaProvider>
  );
}

export default App;

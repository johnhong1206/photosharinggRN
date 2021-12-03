import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from '../hooks/useAuth';
import StackNavigator from './StackNavigator';

const AppScreen = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppScreen;

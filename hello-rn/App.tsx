import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

// Importa as telas
import { MealListScreen } from './MealListScreen'; 
import { MealDetailScreen } from './MealDetailScreen'; 

// Definição dos tipos de navegação (Essencial para TypeScript)
export type RootStackParamList = {
  MealList: undefined; 
  MealDetail: { mealId: string }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 1. Tema do React Native Paper (limpo)
const customPaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00BCD4', // Azul primário (Turquesa)
    background: '#F0F0F0',
    surface: '#FFFFFF',
    text: '#333333',
  },
};

// 2. Tema do NavigationContainer (limpo)
const customNavigationLightTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        background: '#F0F0F0',
        card: '#FFFFFF',
        primary: '#00BCD4',
    },
};

export default function App() {
  return (
    <PaperProvider theme={customPaperLightTheme}>
      <NavigationContainer theme={customNavigationLightTheme}>
        <Stack.Navigator 
          initialRouteName="MealList"
          screenOptions={{
            headerStyle: { backgroundColor: customPaperLightTheme.colors.surface },
            headerTintColor: customPaperLightTheme.colors.primary,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen 
            name="MealList" 
            component={MealListScreen} 
            options={{ title: 'Receitas (Seafood)' }} 
          />
          <Stack.Screen 
            name="MealDetail" 
            component={MealDetailScreen} 
            options={{ title: 'Detalhes da Receita' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeamProvider } from './src/TeamContext';
import { NAME, THEME } from './src/config';
import PokedexScreen from './src/screens/PokedexScreen';
import TeamScreen from './src/screens/TeamScreen';
import GameScreen from './src/screens/GameScreen';
import DetailScreen from './src/screens/DetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const icon = (e) => () => <Text style={{ fontSize: 20 }}>{e}</Text>;
const header = { headerStyle: { backgroundColor: THEME.main }, headerTintColor: '#fff' };

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ ...header, tabBarActiveTintColor: THEME.main }}>
      <Tab.Screen name="Pokédex" component={PokedexScreen} options={{ title: `${NAME}'s Pokédex`, tabBarLabel: 'Pokédex', tabBarIcon: icon('📖') }} />
      <Tab.Screen name="My Team" component={TeamScreen} options={{ tabBarIcon: icon('⚔️') }} />
      <Tab.Screen name="Game" component={GameScreen} options={{ tabBarIcon: icon('❓') }} />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <TeamProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={header}>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TeamProvider>
  );
}

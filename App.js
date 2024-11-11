import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import TeamsScreen from "./screens/TeamsScreen";
import TeamDetailScreen from "./screens/TeamDetailScreen";
import StandingsScreen from "./screens/StandingsScreen";
import NewsScreen from "./screens/NewsScreen";
import NewsDetailScreen from "./screens/NewsDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FixtureScreen from "./screens/FixtureScreen";
import FixtureDetail from "./screens/FixtureDetail";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators
const FixtureStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="FixtureList" component={FixtureScreen} options={{ title: "Fixtures" }} />
    <Stack.Screen name="FixtureDetail" component={FixtureDetail} options={{ title: "Fixture Details" }} />
  </Stack.Navigator>
);

const TeamsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TeamsList" component={TeamsScreen} options={{ title: "Teams" }} />
    <Stack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: "Team Details" }} />
  </Stack.Navigator>
);

const NewsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="NewsList" component={NewsScreen} options={{ title: "News" }} />
    <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} options={{ title: "News Details" }} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Fixtures") {
              iconName = focused ? "football" : "football-outline";
            } else if (route.name === "Teams") {
              iconName = focused ? "people" : "people-outline";
            } else if (route.name === "Standings") {
              iconName = focused ? "trophy" : "trophy-outline";
            } else if (route.name === "News") {
              iconName = focused ? "newspaper" : "newspaper-outline";
            } else if (route.name === "More") {
              iconName = focused ? "reorder-three" : "reorder-three-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Fixtures" component={FixtureStack} options={{ headerShown: false }} />
        <Tab.Screen name="News" component={NewsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Standings" component={StandingsScreen} />
        <Tab.Screen name="Teams" component={TeamsStack} options={{ headerShown: false }} />
        <Tab.Screen name="More" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

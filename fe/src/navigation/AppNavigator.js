import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/general/Login";
import InstitusiScreen from "@/screens/institusi/Index";
import DetailInstitusiScreen from "@/screens/institusi/Detail";
import { useAuthStore } from "@/store/useAuthStore";

export const AppNavigator = () => {
  const token = useAuthStore((state) => state.token);
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen name="Institusi" component={InstitusiScreen} />
          <Stack.Screen
            name="DetailInstitusi"
            component={DetailInstitusiScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

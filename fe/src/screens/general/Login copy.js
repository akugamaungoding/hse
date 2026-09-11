import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/AppButton";
import { AppCard } from "@/components/ui/AppCard";
import { AppInput } from "@/components/ui/AppInput";
import { showMessage } from "react-native-flash-message";

const LoginScreen = () => {
  const [email, setEmail] = useState("nur.haski");
  const [password, setPassword] = useState("password");
  const { loginAction, loading } = useAuth();

  const handleLogin = async () => {
    const result = await loginAction(email, password);
    if (!result.success) {
      showMessage({
        message: "Login Failed",
        description: result.message,
        type: "danger",
      });
    }
  };

  return (
    <AppCard>
      <AppInput
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <AppInput
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleLogin} loading={loading} />
    </AppCard>
  );
};

export default LoginScreen;

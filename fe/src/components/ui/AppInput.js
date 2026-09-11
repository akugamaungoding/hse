import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { COLORS, SPACING } from "@/constants/theme";
import PropTypes from "prop-types";
export const AppInput = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.focused,
          error && styles.errorInput,
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={COLORS.gray}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

AppInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.m },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: SPACING.m,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
    color: COLORS.text,
  },
  focused: { borderColor: COLORS.primary, backgroundColor: "#FFF" },
  errorInput: { borderColor: COLORS.danger },
  errorText: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
});

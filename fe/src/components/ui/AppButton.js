import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS, SPACING } from "@/constants/theme";
import PropTypes from "prop-types";

export const Button = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  style,
}) => {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      style={[styles.btn, isPrimary ? styles.primary : styles.outline, style]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#FFF" : COLORS.primary} />
      ) : (
        <Text
          style={[styles.text, { color: isPrimary ? "#FFF" : COLORS.primary }]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["primary", "outline"]),
  loading: PropTypes.bool,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  btn: {
    padding: SPACING.m,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 50,
  },
  primary: { backgroundColor: COLORS.primary },
  outline: { borderWidth: 1, borderColor: COLORS.primary },
  text: { fontSize: 16, fontWeight: "700" },
});

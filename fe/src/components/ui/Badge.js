import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";

export const Badge = ({ label, type = "default" }) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return { bg: "#E8F5E9", text: "#2E7D32" };
      case "error":
        return { bg: "#FFEBEE", text: "#C62828" };
      case "warning":
        return { bg: "#FFF3E0", text: "#EF6C00" };
      default:
        return { bg: "#F5F5F5", text: "#616161" };
    }
  };

  const colors = getStyles();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AppText style={{ color: colors.text, fontSize: 12, fontWeight: "bold" }}>
        {label}
      </AppText>
    </View>
  );
};

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["default", "success", "error", "warning"]),
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
});

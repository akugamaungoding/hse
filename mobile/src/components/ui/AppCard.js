import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, SPACING } from "@/constants/theme";
import PropTypes from "prop-types";

export const AppCard = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

AppCard.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

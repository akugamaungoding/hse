import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";
import PropTypes from "prop-types";

export const AppText = ({
  children,
  variant = "body",
  color = COLORS.text,
  style,
  ...props
}) => {
  return (
    <Text
      allowFontScaling={false}
      style={[styles.base, styles[variant], { color: color }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

AppText.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["h1", "h2", "body", "caption"]),
  color: PropTypes.string,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  base: {
    fontFamily: "System",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.gray,
  },
});

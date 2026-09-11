const { COLORS } = require("@/constants/theme");
const { ActivityIndicator, View } = require("react-native");

export const Loader = () => {
  return (
    <View>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

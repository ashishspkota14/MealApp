import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

export const tabStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    width: width,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: 80,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
});
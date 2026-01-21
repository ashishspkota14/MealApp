import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { useState, useRef } from "react";
import PagerView from "react-native-pager-view";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { tabStyles } from "../../assets/styles/tabs.styles";
import HomeScreen from "./index";
import SearchScreen from "./search";
import FavoritesScreen from "./favorites";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef(null);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href={"/(auth)/sign-in"} />;

  const tabs = [
    {
      name: "Menu",
      icon: "restaurant",
      component: HomeScreen,
    },
    {
      name: "Search",
      icon: "search",
      component: SearchScreen,
    },
    {
      name: "Favorites",
      icon: "heart",
      component: FavoritesScreen,
    },
  ];

  const handleTabPress = (index) => {
    pagerRef.current?.setPage(index);
    setActiveTab(index);
  };

  const handlePageSelected = (e) => {
    setActiveTab(e.nativeEvent.position);
  };

  return (
    <View style={tabStyles.container}>
      {/* Swipeable Content */}
      <PagerView
        ref={pagerRef}
        style={tabStyles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {tabs.map((tab, index) => (
          <View key={index} style={tabStyles.page}>
            <tab.component />
          </View>
        ))}
      </PagerView>

      {/* Bottom Tab Bar */}
      <View style={tabStyles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={index}
              style={tabStyles.tabButton}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.icon : `${tab.icon}-outline`}
                size={24}
                color={isActive ? COLORS.primary : COLORS.textLight}
              />
              <Text
                style={[
                  tabStyles.tabLabel,
                  isActive && tabStyles.tabLabelActive,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabsLayout;

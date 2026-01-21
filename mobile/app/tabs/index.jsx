import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MealAPI } from "../../services/mealAPI";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const HomeScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredItem, setFeaturedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);

      setMenuItems(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedItem(transformedFeatured);
    } catch (error) {
      console.log("Error loading the data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setMenuItems(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setMenuItems([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !refreshing)
    return <LoadingSpinner message="Loading menu..." />;

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* ANIMAL ICONS */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/Bison.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("../../assets/images/Elk.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("../../assets/images/Moose.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        {/* FEATURED SECTION */}
        {featuredItem && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredItem.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredItem.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredItem.title}
                    </Text>

                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredItem.cookTime}
                        </Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="restaurant-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredItem.servings}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>

          {menuItems.length > 0 ? (
            <FlatList
              data={menuItems}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={64}
                color={COLORS.textLight}
              />
              <Text style={homeStyles.emptyTitle}>No items found</Text>
              <Text style={homeStyles.emptyDescription}>
                Try a different category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;

const BASE_URL = "https://raw.githubusercontent.com/ashishspkota14/MealApp/main/menu.json";

// Cache for the menu data
let cachedMenu = null;

// Fetch the entire menu from GitHub
const fetchMenu = async () => {
  if (cachedMenu) {
    return cachedMenu;
  }
  
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    cachedMenu = data.menu || [];
    return cachedMenu;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
};

export const MealAPI = {
  // Search meals by name
  searchMealsByName: async (query) => {
    try {
      const menu = await fetchMenu();
      if (!query || query.trim() === "") {
        return menu;
      }
      
      const filtered = menu.filter(meal => 
        meal.strMeal.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    } catch (error) {
      console.error("Error searching meals by name:", error);
      return [];
    }
  },

  // Lookup full meal details by id
  getMealById: async (id) => {
    try {
      const menu = await fetchMenu();
      const meal = menu.find(item => item.idMeal === String(id) || item.id === String(id));
      return meal || null;
    } catch (error) {
      console.error("Error getting meal by id:", error);
      return null;
    }
  },

  // Get a single random meal
  getRandomMeal: async () => {
    try {
      const menu = await fetchMenu();
      if (menu.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * menu.length);
      return menu[randomIndex];
    } catch (error) {
      console.error("Error getting random meal:", error);
      return null;
    }
  },

  // Get multiple random meals
  getRandomMeals: async (count = 6) => {
    try {
      const menu = await fetchMenu();
      if (menu.length === 0) return [];
      
      // Shuffle and take first 'count' items
      const shuffled = [...menu].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(count, menu.length));
    } catch (error) {
      console.error("Error getting random meals:", error);
      return [];
    }
  },

  // Get all unique categories from the JSON
  getCategories: async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  },

  // Filter by ingredient (search in ingredient fields)
  filterByIngredient: async (ingredient) => {
    try {
      const menu = await fetchMenu();
      const filtered = menu.filter(meal => {
        for (let i = 1; i <= 10; i++) {
          const ing = meal[`strIngredient${i}`];
          if (ing && ing.toLowerCase().includes(ingredient.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
      return filtered;
    } catch (error) {
      console.error("Error filtering by ingredient:", error);
      return [];
    }
  },

  // Filter by category
  filterByCategory: async (category) => {
    try {
      const menu = await fetchMenu();
      const filtered = menu.filter(meal => 
        meal.strCategory.toLowerCase() === category.toLowerCase()
      );
      return filtered;
    } catch (error) {
      console.error("Error filtering by category:", error);
      return [];
    }
  },

  // Transform meal data to app format (already in correct format, but keep for compatibility)
  transformMealData: (meal) => {
    if (!meal) return null;

    // Extract ingredients from the meal object
    const ingredients = [];
    for (let i = 1; i <= 10; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient.trim());
      }
    }

    return {
      id: meal.idMeal || meal.id,
      title: meal.strMeal,
      description: `${meal.strCategory} from Antler's RoofTop Tavern`,
      image: meal.strMealThumb,
      cookTime: meal.cookTime || "Varies",
      servings: meal.servings || "1 serving",
      category: meal.strCategory,
      price: meal.price || "Market Price",
      ingredients,
      tags: meal.strTags ? meal.strTags.split(',') : [],
      originalData: meal,
    };
  },
};
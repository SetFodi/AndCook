export const sampleRecipes = [
  {
    title: "Creamy Garlic Parmesan Pasta",
    description: "A rich and creamy pasta dish with garlic and parmesan cheese that's ready in just 20 minutes. Perfect for a quick weeknight dinner!",
    ingredients: [
      { name: "Fettuccine pasta", quantity: "8", unit: "oz" },
      { name: "Butter", quantity: "4", unit: "tbsp" },
      { name: "Garlic", quantity: "4", unit: "cloves" },
      { name: "Heavy cream", quantity: "1", unit: "cup" },
      { name: "Parmesan cheese", quantity: "1", unit: "cup" },
      { name: "Salt", quantity: "", unit: "to taste" },
      { name: "Black pepper", quantity: "", unit: "to taste" },
      { name: "Fresh parsley", quantity: "2", unit: "tbsp" },
    ],
    instructions: [
      { step: 1, description: "Cook pasta according to package instructions. Reserve 1/2 cup of pasta water before draining." },
      { step: 2, description: "In a large skillet, melt butter over medium heat. Add minced garlic and sauté for 1-2 minutes until fragrant." },
      { step: 3, description: "Pour in heavy cream and bring to a simmer. Cook for 3-4 minutes until slightly thickened." },
      { step: 4, description: "Reduce heat to low and gradually whisk in grated parmesan cheese until melted and smooth." },
      { step: 5, description: "Add drained pasta to the sauce and toss to coat. If sauce is too thick, add reserved pasta water a little at a time." },
      { step: 6, description: "Season with salt and pepper to taste. Garnish with chopped parsley before serving." },
    ],
    cookingTime: 20,
    servings: 4,
    difficulty: "Easy",
    mainImage: "https://images.unsplash.com/photo-1645112411341-6c4fd023882a?q=80&w=1000",
    categories: ["Italian", "Pasta", "Quick & Easy"],
  },
  {
    title: "Spicy Thai Basil Chicken (Pad Krapow Gai)",
    description: "An authentic Thai street food dish that's spicy, savory, and aromatic. Served with steamed rice and topped with a fried egg for a complete meal.",
    ingredients: [
      { name: "Ground chicken", quantity: "1", unit: "lb" },
      { name: "Thai bird's eye chilies", quantity: "4-10", unit: "" },
      { name: "Garlic", quantity: "5", unit: "cloves" },
      { name: "Shallots", quantity: "3", unit: "" },
      { name: "Thai basil leaves", quantity: "2", unit: "cups" },
      { name: "Oyster sauce", quantity: "2", unit: "tbsp" },
      { name: "Soy sauce", quantity: "1", unit: "tbsp" },
      { name: "Fish sauce", quantity: "1", unit: "tbsp" },
      { name: "Sugar", quantity: "1", unit: "tsp" },
      { name: "Vegetable oil", quantity: "2", unit: "tbsp" },
      { name: "Eggs", quantity: "4", unit: "" },
      { name: "Jasmine rice", quantity: "2", unit: "cups" },
    ],
    instructions: [
      { step: 1, description: "Cook jasmine rice according to package instructions." },
      { step: 2, description: "Using a mortar and pestle, crush chilies, garlic, and shallots into a rough paste. If you don't have a mortar and pestle, finely chop them." },
      { step: 3, description: "Heat oil in a wok or large skillet over high heat. Add the chili paste and stir-fry for 30 seconds until fragrant." },
      { step: 4, description: "Add ground chicken and stir-fry, breaking it up, until no longer pink (about 3-4 minutes)." },
      { step: 5, description: "Add oyster sauce, soy sauce, fish sauce, and sugar. Stir-fry for another minute." },
      { step: 6, description: "Turn off heat and fold in the Thai basil leaves until wilted." },
      { step: 7, description: "In a separate pan, fry eggs sunny-side up." },
      { step: 8, description: "Serve the chicken over steamed rice, topped with a fried egg." },
    ],
    cookingTime: 30,
    servings: 4,
    difficulty: "Medium",
    mainImage: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?q=80&w=1000",
    categories: ["Asian", "Thai", "Spicy"],
  },
  {
    title: "Classic French Chocolate Soufflé",
    description: "A light and airy chocolate dessert that's impressive yet surprisingly simple to make. Serve immediately after baking for the best experience.",
    ingredients: [
      { name: "Butter", quantity: "2", unit: "tbsp" },
      { name: "Granulated sugar", quantity: "1/4", unit: "cup" },
      { name: "Bittersweet chocolate", quantity: "6", unit: "oz" },
      { name: "Egg yolks", quantity: "3", unit: "" },
      { name: "Egg whites", quantity: "5", unit: "" },
      { name: "Salt", quantity: "1/4", unit: "tsp" },
      { name: "Cream of tartar", quantity: "1/4", unit: "tsp" },
      { name: "Vanilla extract", quantity: "1", unit: "tsp" },
      { name: "Powdered sugar", quantity: "", unit: "for dusting" },
    ],
    instructions: [
      { step: 1, description: "Preheat oven to 375°F (190°C). Butter six 6-oz ramekins and coat with granulated sugar." },
      { step: 2, description: "Melt chocolate in a heatproof bowl over simmering water. Let cool slightly." },
      { step: 3, description: "Whisk egg yolks into the melted chocolate one at a time. Add vanilla extract." },
      { step: 4, description: "In a separate bowl, beat egg whites with salt and cream of tartar until foamy. Gradually add sugar and beat until stiff peaks form." },
      { step: 5, description: "Gently fold 1/3 of the egg whites into the chocolate mixture to lighten it. Then fold in the remaining egg whites." },
      { step: 6, description: "Fill the prepared ramekins to the top and smooth the surface. Run your thumb around the edge to create a small channel." },
      { step: 7, description: "Bake for 12-14 minutes until soufflés have risen but centers are still slightly jiggly." },
      { step: 8, description: "Dust with powdered sugar and serve immediately." },
    ],
    cookingTime: 25,
    servings: 6,
    difficulty: "Hard",
    mainImage: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1000",
    categories: ["Dessert", "French", "Chocolate"],
  },
  {
    title: "Mediterranean Quinoa Salad",
    description: "A refreshing and nutritious salad packed with Mediterranean flavors. Perfect for meal prep or as a side dish for grilled meats.",
    ingredients: [
      { name: "Quinoa", quantity: "1", unit: "cup" },
      { name: "Cucumber", quantity: "1", unit: "medium" },
      { name: "Cherry tomatoes", quantity: "1", unit: "cup" },
      { name: "Red bell pepper", quantity: "1", unit: "" },
      { name: "Red onion", quantity: "1/2", unit: "" },
      { name: "Kalamata olives", quantity: "1/2", unit: "cup" },
      { name: "Feta cheese", quantity: "1/2", unit: "cup" },
      { name: "Fresh parsley", quantity: "1/4", unit: "cup" },
      { name: "Fresh mint", quantity: "2", unit: "tbsp" },
      { name: "Olive oil", quantity: "1/4", unit: "cup" },
      { name: "Lemon juice", quantity: "3", unit: "tbsp" },
      { name: "Garlic", quantity: "1", unit: "clove" },
      { name: "Dried oregano", quantity: "1", unit: "tsp" },
      { name: "Salt", quantity: "", unit: "to taste" },
      { name: "Black pepper", quantity: "", unit: "to taste" },
    ],
    instructions: [
      { step: 1, description: "Rinse quinoa thoroughly. Cook in 2 cups of water for about 15 minutes until tender. Fluff with a fork and let cool." },
      { step: 2, description: "Dice cucumber, halve cherry tomatoes, dice bell pepper, and thinly slice red onion." },
      { step: 3, description: "In a large bowl, combine cooled quinoa with all the chopped vegetables, olives, and crumbled feta cheese." },
      { step: 4, description: "Chop parsley and mint, and add to the bowl." },
      { step: 5, description: "In a small jar, combine olive oil, lemon juice, minced garlic, oregano, salt, and pepper. Shake well." },
      { step: 6, description: "Pour dressing over the salad and toss gently to combine." },
      { step: 7, description: "Refrigerate for at least 30 minutes before serving to allow flavors to meld." },
    ],
    cookingTime: 30,
    servings: 6,
    difficulty: "Easy",
    mainImage: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1000",
    categories: ["Vegetarian", "Salad", "Mediterranean", "Healthy"],
  },
  {
    title: "Homemade Margherita Pizza",
    description: "A classic Italian pizza with a crispy crust, fresh tomatoes, mozzarella, and basil. Simple ingredients that create an amazing flavor.",
    ingredients: [
      { name: "Pizza dough", quantity: "1", unit: "lb" },
      { name: "San Marzano tomatoes", quantity: "1", unit: "can (14 oz)" },
      { name: "Fresh mozzarella", quantity: "8", unit: "oz" },
      { name: "Fresh basil leaves", quantity: "1", unit: "handful" },
      { name: "Garlic", quantity: "2", unit: "cloves" },
      { name: "Extra virgin olive oil", quantity: "2", unit: "tbsp" },
      { name: "Salt", quantity: "", unit: "to taste" },
      { name: "Semolina flour", quantity: "", unit: "for dusting" },
    ],
    instructions: [
      { step: 1, description: "Place a pizza stone in the oven and preheat to 500°F (260°C) for at least 30 minutes." },
      { step: 2, description: "Crush tomatoes by hand and strain excess liquid. Mix with minced garlic, 1 tbsp olive oil, and a pinch of salt." },
      { step: 3, description: "On a floured surface, stretch the dough into a 12-inch circle." },
      { step: 4, description: "Dust a pizza peel with semolina flour and place the dough on it." },
      { step: 5, description: "Spread the tomato sauce evenly over the dough, leaving a 1-inch border." },
      { step: 6, description: "Tear mozzarella into pieces and distribute over the sauce." },
      { step: 7, description: "Slide the pizza onto the preheated stone and bake for 8-10 minutes until crust is golden and cheese is bubbly." },
      { step: 8, description: "Remove from oven, top with fresh basil leaves, drizzle with remaining olive oil, and serve immediately." },
    ],
    cookingTime: 45,
    servings: 4,
    difficulty: "Medium",
    mainImage: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000",
    categories: ["Italian", "Pizza", "Vegetarian"],
  }
];

export const sampleCategories = [
  {
    name: "Italian",
    description: "Classic dishes from Italy featuring pasta, pizza, risotto, and more.",
    image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=1000",
    slug: "italian"
  },
  {
    name: "Asian",
    description: "Explore the diverse flavors of Asian cuisine from China, Japan, Thailand, and more.",
    image: "https://images.unsplash.com/photo-1541696490-8744a5dc0228?q=80&w=1000",
    slug: "asian"
  },
  {
    name: "Thai",
    description: "Spicy, sweet, sour, and savory dishes from Thailand with aromatic herbs and spices.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000",
    slug: "thai"
  },
  {
    name: "Vegetarian",
    description: "Delicious meat-free recipes that are full of flavor and nutrition.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    slug: "vegetarian"
  },
  {
    name: "Dessert",
    description: "Sweet treats from cakes and cookies to ice cream and pastries.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000",
    slug: "dessert"
  },
  {
    name: "French",
    description: "Elegant and sophisticated cuisine from France with rich flavors and techniques.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000",
    slug: "french"
  },
  {
    name: "Healthy",
    description: "Nutritious recipes that don't compromise on flavor.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000",
    slug: "healthy"
  },
  {
    name: "Quick & Easy",
    description: "Delicious meals ready in 30 minutes or less for busy weeknights.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1000",
    slug: "quick-easy"
  },
  {
    name: "Pasta",
    description: "From spaghetti to lasagna, explore the world of pasta dishes.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000",
    slug: "pasta"
  },
  {
    name: "Chocolate",
    description: "Decadent chocolate desserts and treats for chocolate lovers.",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1000",
    slug: "chocolate"
  },
  {
    name: "Mediterranean",
    description: "Healthy and flavorful dishes from the Mediterranean region.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000",
    slug: "mediterranean"
  },
  {
    name: "Salad",
    description: "Fresh and vibrant salads for every season and occasion.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    slug: "salad"
  },
  {
    name: "Pizza",
    description: "Homemade pizza recipes with various toppings and crusts.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000",
    slug: "pizza"
  },
  {
    name: "Spicy",
    description: "Dishes with a kick for those who love heat in their food.",
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=1000",
    slug: "spicy"
  },
  {
    name: "Vietnamese",
    description: "Fresh, aromatic dishes from Vietnam featuring herbs, rice noodles, and balanced flavors.",
    image: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=1000",
    slug: "vietnamese"
  },
  {
    name: "Soup",
    description: "Comforting soups and stews for every season.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000",
    slug: "soup"
  },
  {
    name: "Breakfast",
    description: "Start your day right with these delicious breakfast recipes.",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1000",
    slug: "breakfast"
  },
  {
    name: "Middle Eastern",
    description: "Flavorful dishes from the Middle East featuring aromatic spices and herbs.",
    image: "https://images.unsplash.com/photo-1544612318-a212b56c5c9c?q=80&w=1000",
    slug: "middle-eastern"
  },
  {
    name: "Dinner",
    description: "Satisfying dinner recipes for the whole family.",
    image: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=1000",
    slug: "dinner"
  },
  {
    name: "Meat",
    description: "Delicious recipes featuring beef, pork, lamb, and other meats.",
    image: "https://images.unsplash.com/photo-1529694157872-4e0c0f3b238b?q=80&w=1000",
    slug: "meat"
  },
  {
    name: "No-Bake",
    description: "Delicious desserts and treats that don't require an oven.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000",
    slug: "no-bake"
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'kulinaria.ge',
      'via.placeholder.com',
      'placekitten.com',
      'picsum.photos',
      'gemrielia.ge',
      'i.imgur.com',
      'imgur.com',
      'example.com',
      'foodish-api.herokuapp.com',
      'spoonacular.com',
      'themealdb.com',
      'edamam.com',
      'food.fnr.sndimg.com',
      'www.themealdb.com',
      'www.edamam.com',
      'www.food.com',
      'www.foodnetwork.com',
      'www.allrecipes.com',
      'allrecipes.com',
      'www.simplyrecipes.com',
      'simplyrecipes.com',
      'www.epicurious.com',
      'epicurious.com',
      'www.seriouseats.com',
      'seriouseats.com',
      'www.bonappetit.com',
      'bonappetit.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

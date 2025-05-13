'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUtensils, FaSearch, FaUserFriends } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Cooking background"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        </div>
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Discover Delicious Recipes with{" "}
              <span className="text-primary-light">AndCook</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed">
              Find, create, and share amazing recipes from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/recipes">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Explore Recipes
                </motion.button>
              </Link>
              <Link href="/auth/signin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-lg font-medium text-lg transition-all w-full sm:w-auto"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-primary font-medium mb-2 block text-lg">
              Our Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900 dark:text-white">
              Why Choose AndCook?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform offers everything you need to discover, create, and share amazing recipes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
                <FaUtensils className="text-primary text-2xl group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">Diverse Recipes</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Explore thousands of recipes from different cuisines and dietary preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
                <FaSearch className="text-primary text-2xl group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">Easy to Find</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Search by ingredients, categories, or dietary restrictions to find the perfect recipe.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
                <FaUserFriends className="text-primary text-2xl group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">Community</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Share your recipes, rate others, and connect with food enthusiasts around the world.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-orange-600/95 z-0"></div>
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556909114-8c575732b098?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
              Ready to Start Cooking?
            </h2>
            <p className="text-xl mb-10 text-white max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Join our community today and discover amazing recipes that will
              transform your cooking experience.
            </p>
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-10 py-4 rounded-lg font-medium text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 border-2 border-white hover:border-primary/20"
              >
                Sign Up Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

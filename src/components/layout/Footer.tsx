import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-3xl font-bold text-primary hover:text-primary-dark transition-colors duration-300">
              AndCook
            </Link>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Discover delicious recipes from around the world. Cook, share, and enjoy!
            </p>
            <div className="flex space-x-5 mt-8">
              <a href="#" className="text-gray-500 hover:text-primary transform hover:scale-110 transition-all duration-300" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transform hover:scale-110 transition-all duration-300" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transform hover:scale-110 transition-all duration-300" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transform hover:scale-110 transition-all duration-300" aria-label="Pinterest">
                <FaPinterest size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transform hover:scale-110 transition-all duration-300" aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-5 text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Recipes</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Categories</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">My Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-5 text-gray-800">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/breakfast" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Breakfast</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/lunch" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Lunch</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/dinner" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Dinner</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/desserts" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Desserts</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/vegetarian" className="text-gray-600 hover:text-primary hover:pl-2 transition-all duration-300 flex items-center group">
                  <span className="absolute w-0 h-0.5 bg-primary group-hover:w-1 mr-1 transition-all duration-300"></span>
                  <span className="group-hover:pl-3 transition-all duration-300">Vegetarian</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-5 text-gray-800">Contact Us</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Have questions or suggestions? We'd love to hear from you!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-primary-dark hover:scale-105 transition-all duration-300 mt-2 font-medium shadow-lg hover:shadow-primary/30"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-600">
          <p>© {currentYear} <span className="text-primary hover:text-primary-dark transition-colors duration-300">AndCook</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

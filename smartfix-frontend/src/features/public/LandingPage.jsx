// src/features/public/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Watch, 
  Headphones, 
  Camera,
  Phone,
  MapPin,
  Clock,
  Star,
  ShoppingCart,
  Search,
  Filter
} from 'lucide-react';
import { formatCurrency } from '../../shared/utils/formatters';
import { Chatbot } from './components/Chatbot';

export const LandingPage = () => {
  const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';
  const [devices, setDevices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadDevices();
    loadCategories();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/inventory`);
      const data = await response.json();
      if (response.ok) {
        // Only show devices with quantity > 0 for public display
        const availableDevices = data.filter(device => device.quantity > 0);
        setDevices(availableDevices);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/categories`);
      const data = await response.json();
      if (response.ok) {
        setCategories(['All', ...data.map(cat => cat.name)]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(['All']);
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Smartphones': Smartphone,
      'Laptops': Laptop,
      'Tablets': Tablet,
      'Smartwatches': Watch,
      'Headphones': Headphones,
      'Cameras': Camera,
      'Accessories': Phone,
    };
    return iconMap[category] || Smartphone;
  };

  const getDeviceCategoryName = (device) => {
    if (!device) return '';
    if (typeof device.category === 'string') return device.category;
    if (device.category && typeof device.category === 'object') {
      return device.category.name || '';
    }
    return '';
  };

  const filteredDevices = devices.filter(device => {
    const deviceCategory = getDeviceCategoryName(device);
    const matchesCategory = selectedCategory === 'All' || deviceCategory === selectedCategory;
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deviceCategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 shadow-lg border-b-2 border-blue-700 sticky top-0 z-50" style={{ minHeight: '64px' }}>
        <div className="w-full px-0">
          <div className="flex justify-between items-center h-16">
            {/* Logo Only - Far Left Corner */}
            <div className="flex items-center">
              <div className="w-24 h-14 flex items-center justify-center rounded shadow-md" style={{ backgroundColor: '#fff' }}>
                <span style={{ 
                  fontFamily: 'Arial, sans-serif', 
                  letterSpacing: '0.1em', 
                  fontSize: '1.1rem',
                  color: '#2563eb', 
                  fontWeight: 'bold' 
                }}>
                  COREX
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 pr-4 sm:pr-6 lg:pr-8">
              <a href="#home" className="text-white hover:text-blue-200 font-medium transition-colors">
                Home
              </a>
              <a href="#devices" className="text-white hover:text-blue-200 font-medium transition-colors">
                Devices
              </a>
              <a href="#services" className="text-white hover:text-blue-200 font-medium transition-colors">
                Services
              </a>
              <a href="#contact" className="text-white hover:text-blue-200 font-medium transition-colors">
                Contact
              </a>
              <Link 
                to="/login" 
                className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Staff Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden pr-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-white hover:text-blue-200 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden bg-blue-600 border-t border-blue-700 py-4 px-4">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#home" 
                  className="text-white hover:text-blue-200 font-medium transition-colors px-2 py-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </a>
                <a 
                  href="#devices" 
                  className="text-white hover:text-blue-200 font-medium transition-colors px-2 py-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Devices
                </a>
                <a 
                  href="#services" 
                  className="text-white hover:text-blue-200 font-medium transition-colors px-2 py-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Services
                </a>
                <a 
                  href="#contact" 
                  className="text-white hover:text-blue-200 font-medium transition-colors px-2 py-1"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Contact
                </a>
                <Link 
                  to="/login" 
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center mx-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Staff Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Device Images */}
      <section id="home" className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to Corex Ltd
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Your trusted partner for electronic devices and professional repair services
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#devices" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Browse Devices
                </a>
                <a href="#services" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Our Services
                </a>
              </div>
            </div>

            {/* Right Content - Device Showcase */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* iPhone Collection */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Smartphones</h3>
                  <p className="text-blue-100 text-sm text-center">Latest iPhone & Android devices</p>
                </div>

                {/* Smartwatch */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Watch className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Smartwatches</h3>
                  <p className="text-blue-100 text-sm text-center">Apple Watch & fitness trackers</p>
                </div>

                {/* Laptops */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Laptop className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Laptops</h3>
                  <p className="text-blue-100 text-sm text-center">MacBooks & Windows laptops</p>
                </div>

                {/* Accessories */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">Accessories</h3>
                  <p className="text-blue-100 text-sm text-center">Cases, chargers & more</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
        </div>
      </section>

      {/* Featured Devices Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Devices
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular electronic devices with the latest technology and competitive prices.
            </p>
          </div>

          {/* Featured Device Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* iPhone Collection */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
              <div className="relative p-8 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">iPhone Collection</h3>
                <p className="text-gray-300 mb-6">Latest iPhone models in multiple colors and storage options</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">From 800,000 RWF</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Apple Watch */}
            <div className="group relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
              <div className="relative p-8 text-gray-900">
                <div className="w-16 h-16 bg-gray-900/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Watch className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Apple Watch</h3>
                <p className="text-gray-600 mb-6">Smart fitness tracking with health monitoring features</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">From 350,000 RWF</span>
                  <div className="w-8 h-8 bg-gray-900/10 rounded-full flex items-center justify-center group-hover:bg-gray-900/20 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* MacBook */}
            <div className="group relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative p-8 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Laptop className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">MacBook Series</h3>
                <p className="text-blue-100 mb-6">Professional laptops for work and creative projects</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">From 1,200,000 RWF</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section id="devices" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Available Devices
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our wide range of high-quality electronic devices, all available for purchase with professional support.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Devices Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDevices.map((device) => {
                const deviceCategory = getDeviceCategoryName(device);
                const IconComponent = getCategoryIcon(deviceCategory);
                return (
                  <div key={device.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                    {/* Device Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all"></div>
                      <IconComponent className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors relative z-10" />
                      <div className="absolute top-3 right-3">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          In Stock
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{device.name}</h3>
                        <p className="text-sm text-gray-500">{deviceCategory || 'N/A'}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(device.price)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {device.quantity} available
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                          <p className="text-xs text-gray-500">Excellent</p>
                        </div>
                      </div>
                      
                      <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                        <ShoppingCart className="w-4 h-4" />
                        Contact for Price
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredDevices.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No devices found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional repair and maintenance services for all your electronic devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Device Repair</h3>
              <p className="text-gray-600">Expert repair services for smartphones, laptops, tablets, and more with genuine parts.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600">All repairs come with warranty and quality guarantee for your peace of mind.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Service</h3>
              <p className="text-gray-600">Quick turnaround times with professional diagnosis and efficient repair processes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visit Our Store
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Come visit us for all your electronic device needs and professional repair services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span>Kigali, Rwanda</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+250 XXX XXX XXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6">Why Choose Corex Ltd?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Expert technicians with years of experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Genuine parts and quality components</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Competitive pricing and transparent quotes</span>
                </li>
                <li className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>Warranty on all repairs and services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex items-center justify-center px-3 py-1 bg-blue-600 rounded-lg">
                <span style={{ fontFamily: 'Impact, Arial Black, sans-serif', letterSpacing: '0.06em', fontSize: '1rem', color: '#fff', fontWeight: 900 }}>
                  COREX
                </span>
              </div>
              <span className="text-sm">© 2024 Corex Ltd. All rights reserved.</span>
            </div>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
              Staff Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};
// src/features/fault-diagnosis/components/DeviceInfoForm.jsx
import React, { useEffect, useState } from 'react';

export const DeviceInfoForm = ({ onDeviceInfoSubmit }) => {
  const AI_BACKEND_BASE_URL = process.env.REACT_APP_AI_BACKEND_URL || 'http://localhost:5000';
  const [deviceInfo, setDeviceInfo] = useState({
    type: '',
    brand: '',
    model: ''
  });
  const [modelError, setModelError] = useState('');
  const [knownModels, setKnownModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  const deviceTypes = ['Laptop', 'Desktop', 'Smartphone', 'Tablet', 'Monitor', 'Printer'];
  const brands = {
    Laptop: ['Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer'],
    Smartphone: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
    Desktop: ['Dell', 'HP', 'Lenovo', 'Apple', 'Custom'],
    default: ['Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'Other']
  };
  useEffect(() => {
    const fetchKnownModels = async () => {
      if (!deviceInfo.type || !deviceInfo.brand) {
        setKnownModels([]);
        return;
      }

      setLoadingModels(true);
      try {
        const response = await fetch(
          `${AI_BACKEND_BASE_URL}/api/devices/models?deviceType=${encodeURIComponent(deviceInfo.type.toLowerCase())}&brand=${encodeURIComponent(deviceInfo.brand)}`
        );
        const data = await response.json();
        if (response.ok) {
          setKnownModels(data?.models || []);
        } else {
          setKnownModels([]);
        }
      } catch {
        setKnownModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchKnownModels();
  }, [deviceInfo.type, deviceInfo.brand, AI_BACKEND_BASE_URL]);

  const isModelValid = (modelValue) => {
    const trimmedModel = modelValue.trim();
    if (!trimmedModel) return false;
    if (!deviceInfo.type || !deviceInfo.brand) return false;
    if (knownModels.length === 0) return false;
    return knownModels.some((model) => model.toLowerCase() === trimmedModel.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loadingModels) {
      setModelError('Please wait, loading valid models from backend...');
      return;
    }
    if (knownModels.length === 0) {
      setModelError('No known models found for this brand and device type in AI data.');
      return;
    }
    if (!isModelValid(deviceInfo.model)) {
      setModelError('Please enter a valid model for the selected brand and device type.');
      return;
    }
    setModelError('');
    if (deviceInfo.type && deviceInfo.brand && deviceInfo.model) {
      onDeviceInfoSubmit(deviceInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Device Type *
        </label>
        <select
          value={deviceInfo.type}
          onChange={(e) => {
            setDeviceInfo({ ...deviceInfo, type: e.target.value, brand: '', model: '' });
            setModelError('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select device type</option>
          {deviceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand *
        </label>
        <select
          value={deviceInfo.brand}
          onChange={(e) => {
            setDeviceInfo({ ...deviceInfo, brand: e.target.value, model: '' });
            setModelError('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={!deviceInfo.type}
        >
          <option value="">Select brand</option>
          {(brands[deviceInfo.type] || brands.default).map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model *
        </label>
        <input
          type="text"
          value={deviceInfo.model}
          onChange={(e) => {
            setDeviceInfo({ ...deviceInfo, model: e.target.value });
            if (modelError) setModelError('');
          }}
          list="device-model-options"
          placeholder="e.g., iPhone 14, ThinkPad T490"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            modelError ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        <datalist id="device-model-options">
          {knownModels.map((model) => (
            <option key={model} value={model} />
          ))}
        </datalist>
        {!loadingModels && deviceInfo.type && deviceInfo.brand && knownModels.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Valid models: {knownModels.join(', ')}
          </p>
        )}
        {!loadingModels && deviceInfo.type && deviceInfo.brand && knownModels.length === 0 && (
          <p className="mt-2 text-xs text-amber-600">
            No models available from backend for this brand/type.
          </p>
        )}
        {modelError && <p className="mt-2 text-sm text-red-600">{modelError}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Continue to Symptoms →
      </button>
    </form>
  );
};
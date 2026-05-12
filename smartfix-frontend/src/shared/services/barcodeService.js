const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';

class BarcodeService {
  /**
   * Scan a barcode and get product information
   */
  async scanBarcode(barcodeValue) {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcodeValue }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: true,
            found: false,
            message: `Product not found for barcode: ${barcodeValue}`
          };
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scanning barcode:', error);
      
      // Return a mock response if backend is not available
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('ERR_CONNECTION_REFUSED') ||
          error.message.includes('aborted') ||
          error.name === 'TypeError' ||
          error.name === 'AbortError') {
        
        console.log('Backend offline, using demo mode for barcode:', barcodeValue);
        
        return {
          success: true,
          found: true,
          message: 'Backend offline - using demo mode',
          product: {
            id: Math.floor(Math.random() * 1000),
            name: `Demo Product ${barcodeValue.slice(-4)}`,
            description: 'Demo product for testing (backend offline)',
            price: Math.floor(Math.random() * 100000) + 10000,
            quantity: Math.floor(Math.random() * 50) + 1,
            reorderPoint: 5,
            brand: 'Demo Brand',
            model: 'Demo Model',
            category: 'Electronics',
            categoryId: 1,
            stockStatus: 'IN_STOCK',
            barcode: barcodeValue
          }
        };
      }
      
      return {
        success: false,
        found: false,
        message: error.message || 'Failed to scan barcode'
      };
    }
  }

  /**
   * Get barcode for a specific inventory item
   */
  async getBarcodeForItem(inventoryItemId) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/item/${inventoryItemId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get barcode');
      }

      return data;
    } catch (error) {
      console.error('Error getting barcode:', error);
      throw error;
    }
  }

  /**
   * Generate a new barcode for an inventory item
   */
  async generateBarcode(inventoryItemId) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/generate/${inventoryItemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate barcode');
      }

      return data;
    } catch (error) {
      console.error('Error generating barcode:', error);
      throw error;
    }
  }

  /**
   * Get all barcodes
   */
  async getAllBarcodes() {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching barcodes:', error);
      
      // Return mock data if backend is not available
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('ERR_CONNECTION_REFUSED') ||
          error.name === 'TypeError') {
        return [
          {
            id: 1,
            barcodeValue: 'SFEL00010001',
            inventoryItem: {
              id: 1,
              name: 'Demo iPhone 13',
              price: 850000,
              quantity: 5,
              category: 'Electronics'
            },
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            barcodeValue: 'SFEL00020002',
            inventoryItem: {
              id: 2,
              name: 'Demo Samsung Galaxy',
              price: 750000,
              quantity: 3,
              category: 'Electronics'
            },
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ];
      }
      
      throw error;
    }
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes`, {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Search barcodes
   */
  async searchBarcodes(query) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search barcodes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching barcodes:', error);
      throw error;
    }
  }

  /**
   * Get barcode statistics
   */
  async getBarcodeStatistics() {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/statistics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch barcode statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching barcode statistics:', error);
      throw error;
    }
  }

  /**
   * Update barcode
   */
  async updateBarcode(barcodeId, updatedData) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/${barcodeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update barcode');
      }

      return data;
    } catch (error) {
      console.error('Error updating barcode:', error);
      throw error;
    }
  }

  /**
   * Delete barcode
   */
  async deleteBarcode(barcodeId) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/${barcodeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete barcode');
      }

      return data;
    } catch (error) {
      console.error('Error deleting barcode:', error);
      throw error;
    }
  }

  /**
   * Validate barcode format
   */
  async validateBarcode(barcodeValue) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/barcodes/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcodeValue }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to validate barcode');
      }

      return data;
    } catch (error) {
      console.error('Error validating barcode:', error);
      throw error;
    }
  }

  /**
   * Format barcode for display
   */
  formatBarcodeValue(value) {
    if (!value) return '';
    
    // Add spaces for better readability
    // Example: SF12345678 -> SF 1234 5678
    if (value.startsWith('SF') && value.length > 6) {
      return value.substring(0, 2) + ' ' + 
             value.substring(2, 6) + ' ' + 
             value.substring(6);
    }
    
    return value;
  }

  /**
   * Generate barcode check digit (simple implementation)
   */
  generateCheckDigit(barcode) {
    let sum = 0;
    for (let i = 0; i < barcode.length; i++) {
      const digit = parseInt(barcode[i]) || 0;
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    return (10 - (sum % 10)) % 10;
  }

  /**
   * Validate barcode check digit
   */
  validateCheckDigit(barcode) {
    if (barcode.length < 2) return false;
    
    const checkDigit = parseInt(barcode.slice(-1));
    const calculatedCheckDigit = this.generateCheckDigit(barcode.slice(0, -1));
    
    return checkDigit === calculatedCheckDigit;
  }
}

export const barcodeService = new BarcodeService();
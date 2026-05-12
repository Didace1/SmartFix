const SYSTEM_BACKEND_BASE_URL = process.env.REACT_APP_SYSTEM_BACKEND_URL || 'http://localhost:8080';

class QRCodeService {
  /**
   * Scan a QR code and get product information
   */
  async scanQRCode(qrCodeData) {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeData }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: true,
            found: false,
            message: `Product not found for QR code`
          };
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scanning QR code:', error);
      
      // Return a mock response if backend is not available
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('ERR_CONNECTION_REFUSED') ||
          error.message.includes('aborted') ||
          error.name === 'TypeError' ||
          error.name === 'AbortError') {
        
        console.log('Backend offline, using demo mode for QR code:', qrCodeData);
        
        return {
          success: true,
          found: true,
          message: 'Backend offline - using demo mode',
          product: {
            id: Math.floor(Math.random() * 1000),
            name: `Demo Product ${qrCodeData.slice(-4)}`,
            description: 'Demo product for testing (backend offline)',
            price: Math.floor(Math.random() * 100000) + 10000,
            quantity: Math.floor(Math.random() * 50) + 1,
            reorderPoint: 5,
            brand: 'Demo Brand',
            model: 'Demo Model',
            category: 'Electronics',
            categoryId: 1,
            stockStatus: 'IN_STOCK',
            qrCode: qrCodeData
          }
        };
      }
      
      return {
        success: false,
        found: false,
        message: error.message || 'Failed to scan QR code'
      };
    }
  }

  /**
   * Get QR code for a specific inventory item
   */
  async getQRCodeForItem(inventoryItemId) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/item/${inventoryItemId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get QR code');
      }

      return data;
    } catch (error) {
      console.error('Error getting QR code:', error);
      throw error;
    }
  }

  /**
   * Generate a new QR code for an inventory item
   */
  async generateQRCode(inventoryItemId) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/generate/${inventoryItemId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate QR code');
      }

      return data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Get all QR codes
   */
  async getAllQRCodes() {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      
      // Return mock data if backend is not available
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('ERR_CONNECTION_REFUSED') ||
          error.name === 'TypeError') {
        return [
          {
            id: 1,
            qrCodeValue: 'SFQREL00010001',
            qrImageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
            inventoryItem: {
              id: 1,
              name: 'Demo iPhone 13',
              price: 850000,
              quantity: 5,
              category: 'Electronics'
            },
            isActive: true,
            scanCount: 0,
            createdAt: new Date().toISOString()
          }
        ];
      }
      
      throw error;
    }
  }

  /**
   * Generate bulk QR codes
   */
  async generateBulkQRCodes() {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/generate-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate bulk QR codes');
      }

      return data;
    } catch (error) {
      console.error('Error generating bulk QR codes:', error);
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
      
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes`, {
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
   * Search QR codes
   */
  async searchQRCodes(query) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search QR codes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching QR codes:', error);
      throw error;
    }
  }

  /**
   * Get QR code statistics
   */
  async getQRCodeStatistics() {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/statistics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch QR code statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching QR code statistics:', error);
      throw error;
    }
  }

  /**
   * Update QR code
   */
  async updateQRCode(qrCodeId, updatedData) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/${qrCodeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update QR code');
      }

      return data;
    } catch (error) {
      console.error('Error updating QR code:', error);
      throw error;
    }
  }

  /**
   * Delete QR code
   */
  async deleteQRCode(qrCodeId) {
    try {
      const response = await fetch(`${SYSTEM_BACKEND_BASE_URL}/api/qrcodes/${qrCodeId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete QR code');
      }

      return data;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      throw error;
    }
  }

  /**
   * Parse QR code data
   */
  parseQRCodeData(qrCodeData) {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(qrCodeData);
      return {
        isValid: true,
        type: 'json',
        data: parsed
      };
    } catch (e) {
      // If not JSON, treat as plain text
      if (qrCodeData && qrCodeData.length >= 4) {
        return {
          isValid: true,
          type: 'text',
          data: qrCodeData
        };
      }
      return {
        isValid: false,
        type: 'invalid',
        data: null
      };
    }
  }

  /**
   * Format QR code value for display
   */
  formatQRCodeValue(value) {
    if (!value) return '';
    
    // Add spaces for better readability
    // Example: SFQREL0001 -> SFQR EL 0001
    if (value.startsWith('SFQR') && value.length > 8) {
      return value.substring(0, 4) + ' ' + 
             value.substring(4, 6) + ' ' + 
             value.substring(6);
    }
    
    return value;
  }
}

export const qrCodeService = new QRCodeService();
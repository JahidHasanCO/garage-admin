import { API_URL } from "../constants/api";

/**
 * Statistics Service - Handles all statistics-related API calls
 */
class StatisticsService {
  constructor() {
    this.baseURL = `${API_URL}/statistics`;
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers object with authorization
   */
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generic API call handler
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} API response
   */
  async apiCall(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }
      
      return data;
    } catch (error) {
      console.error(`Statistics API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Get basic statistics for all modules
   * @returns {Promise<Object>} Basic statistics data
   */
  async getBasicStatistics() {
    const response = await this.apiCall('');
    return response.data;
  }

  /**
   * Get detailed statistics with insights
   * @returns {Promise<Object>} Detailed statistics with insights
   */
  async getDetailedStatistics() {
    const response = await this.apiCall('/detailed');
    return response.data;
  }

  /**
   * Get all statistics (basic + detailed) in parallel
   * @returns {Promise<Object>} Combined statistics data
   */
  async getAllStatistics() {
    try {
      const [basicStats, detailedStats] = await Promise.allSettled([
        this.getBasicStatistics(),
        this.getDetailedStatistics()
      ]);

      return {
        basic: basicStats.status === 'fulfilled' ? basicStats.value : null,
        detailed: detailedStats.status === 'fulfilled' ? detailedStats.value : null,
        errors: {
          basic: basicStats.status === 'rejected' ? basicStats.reason : null,
          detailed: detailedStats.status === 'rejected' ? detailedStats.reason : null
        }
      };
    } catch (error) {
      console.error('Error fetching all statistics:', error);
      throw error;
    }
  }
}

export const statisticsService = new StatisticsService();
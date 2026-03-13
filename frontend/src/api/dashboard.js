import { api } from './client';

/**
 * Get dashboard summary statistics
 * @returns {Promise<Object>} Dashboard summary data
 */
export async function getDashboardSummary() {
  try {
    return await api.get('/api/dashboard/summary');
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
}

/**
 * Get recent sales (last 10)
 * @returns {Promise<Array>} List of recent sales
 */
export async function getRecentSales() {
  try {
    return await api.get('/api/dashboard/recent-sales');
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    throw error;
  }
}

/**
 * Create a new sale
 * @param {Object} saleData - Sale data including patient_name, payment_mode, items
 * @returns {Promise<Object>} Created sale object
 */
export async function createSale(saleData) {
  try {
    return await api.post('/api/dashboard/new-sale', saleData);
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
}

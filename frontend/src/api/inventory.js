import { api } from './client';

/**
 * Get medicines with optional filters
 * @param {Object} params - Query parameters (search, status, category)
 * @returns {Promise<Array>} List of medicines
 */
export async function getMedicines(params = {}) {
  try {
    return await api.get('/api/inventory/medicines', params);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
}

/**
 * Get inventory overview statistics
 * @returns {Promise<Object>} Inventory overview data
 */
export async function getInventoryOverview() {
  try {
    return await api.get('/api/inventory/overview');
  } catch (error) {
    console.error('Error fetching inventory overview:', error);
    throw error;
  }
}

/**
 * Add a new medicine
 * @param {Object} medicineData - Medicine data
 * @returns {Promise<Object>} Created medicine object
 */
export async function addMedicine(medicineData) {
  try {
    return await api.post('/api/inventory/medicines', medicineData);
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
}

/**
 * Update an existing medicine
 * @param {number} id - Medicine ID
 * @param {Object} medicineData - Updated medicine data
 * @returns {Promise<Object>} Updated medicine object
 */
export async function updateMedicine(id, medicineData) {
  try {
    return await api.put(`/api/inventory/medicines/${id}`, medicineData);
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
}

/**
 * Update medicine status
 * @param {number} id - Medicine ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated medicine object
 */
export async function updateMedicineStatus(id, status) {
  try {
    return await api.patch(`/api/inventory/medicines/${id}/status`, { status });
  } catch (error) {
    console.error('Error updating medicine status:', error);
    throw error;
  }
}

/**
 * Delete a medicine
 * @param {number} id - Medicine ID
 * @returns {Promise<null>}
 */
export async function deleteMedicine(id) {
  try {
    return await api.delete(`/api/inventory/medicines/${id}`);
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
}

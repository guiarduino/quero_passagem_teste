import apiClient from '@/lib/client'

/**
 * Get all available trips/stops
 * @returns {Promise<Array>} List of trips
 */
export async function getTrips() {
  return apiClient.get('/api/stop')
}

export default {
  getTrips
}
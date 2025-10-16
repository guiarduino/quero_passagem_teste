import apiClient from '@/lib/client'

/**
 * Get all available trips/stops
 * @returns {Promise<Array>} List of trips
 */
export async function getTrips() {
  try {
    return apiClient.get('/api/stop').then((res) => res.data)
  } catch (error) {
    console.error('Error fetching trips:', error)
    throw error
  }
}

export async function findTrips(data) {
  try {
    return apiClient.post('/api/search', data).then((res) => res.data)
  } catch (error) {
    console.error('Error fetching trips:', error)
    throw error
  }
}

export default {
  getTrips,
  findTrips
}
const API_BASE = import.meta.env?.API_EXTENSION || '/api'

/**
 * Generic API request handler
 * @param {string} path - API endpoint path
 * @param {string} method - HTTP method
 * @param {object} body - Request body (optional)
 * @param {object} headers - Additional headers (optional)
 * @returns {Promise} Response data
 */
export async function request(path, method = 'GET', body = null, headers = {}) {
  const url = `${API_BASE}${path}`

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  if (body != null) {
    opts.body = JSON.stringify(body)
  }

  try {
    const res = await fetch(url, opts)

    if (!res.ok) {
      const text = await res.text()
      const err = new Error(`API request failed: ${res.status} ${res.statusText}`)
      err.status = res.status
      err.body = text
      throw err
    }

    // No content response
    if (res.status === 204) return null

    // Parse response based on content type
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return await res.json()
    }

    return await res.text()
  } catch (error) {
    // Re-throw with additional context
    console.error(`API Error [${method} ${path}]:`, error)
    throw error
  }
}

// Export helper methods
export const get = (path, headers) => request(path, 'GET', null, headers)
export const post = (path, body, headers) => request(path, 'POST', body, headers)
export const put = (path, body, headers) => request(path, 'PUT', body, headers)
export const patch = (path, body, headers) => request(path, 'PATCH', body, headers)
export const del = (path, headers) => request(path, 'DELETE', null, headers)

export default {
    request,
    get,
    post,
    put,
    patch,
    del
}
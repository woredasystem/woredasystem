// Cache clearing utilities

/**
 * Clear all browser caches
 */
export async function clearAllCaches() {
  try {
    // Clear service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (let registration of registrations) {
        await registration.unregister()
      }
    }

    // Clear cache storage
    if ('caches' in window) {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
    }

    // Clear localStorage (optional - be careful with this)
    // localStorage.clear()

    // Clear sessionStorage
    sessionStorage.clear()

    return true
  } catch (error) {
    console.error('Error clearing caches:', error)
    return false
  }
}

/**
 * Clear only Supabase-related caches
 */
export function clearSupabaseCache() {
  try {
    // Clear sessionStorage (Supabase stores session here)
    const keys = Object.keys(sessionStorage)
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        sessionStorage.removeItem(key)
      }
    })

    // Clear localStorage Supabase keys
    const localKeys = Object.keys(localStorage)
    localKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key)
      }
    })

    return true
  } catch (error) {
    console.error('Error clearing Supabase cache:', error)
    return false
  }
}

/**
 * Force reload the page after clearing caches
 */
export async function hardReload() {
  await clearAllCaches()
  window.location.reload(true) // Force reload from server
}

/**
 * Clear Vite dev server cache (for development)
 */
export function clearViteCache() {
  if (import.meta.env.DEV) {
    // In development, we can't directly clear Vite cache,
    // but we can trigger a hard reload
    window.location.reload(true)
  }
}










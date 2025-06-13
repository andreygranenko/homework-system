"use client"

import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Register service worker
      const registerSW = async () => {
        try {
          console.log('PWA: Registering service worker...')
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('PWA: Service worker registered successfully:', registration)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              console.log('PWA: New service worker found, installing...')
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('PWA: New content available, refresh to update')
                }
              })
            }
          })

        } catch (error) {
          console.error('PWA: Service worker registration failed:', error)
        }
      }

      registerSW()
    } else if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Fallback registration without workbox
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service worker registered (fallback):', registration)
        })
        .catch((error) => {
          console.error('PWA: Service worker registration failed (fallback):', error)
        })
    }
  }, [])

  // Handle install prompt
  useEffect(() => {
    let deferredPrompt: any

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      console.log('PWA: Install prompt available')
    }

    const handleAppInstalled = () => {
      console.log('PWA: App was installed')
      deferredPrompt = null
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return null 
} 
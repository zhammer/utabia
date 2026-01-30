import { useState, useEffect, useCallback } from 'react'
import { TabInfo } from '../types'

export function useTabs() {
  const [tabs, setTabs] = useState<TabInfo[]>([])

  // Fetch all tabs
  const fetchTabs = useCallback(async () => {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      // Dev mode fallback
      setTabs([
        { id: 1, title: 'Example Tab 1', favIconUrl: 'https://www.google.com/favicon.ico' },
        { id: 2, title: 'Example Tab 2', favIconUrl: 'https://github.com/favicon.ico' },
        { id: 3, title: 'Another Tab Here', favIconUrl: 'https://twitter.com/favicon.ico' },
      ])
      return
    }

    const allTabs = await chrome.tabs.query({})
    const currentTab = await chrome.tabs.getCurrent()

    // Exclude the Tabs extension page itself
    const filteredTabs = allTabs
      .filter(tab => tab.id !== currentTab?.id && tab.id !== undefined)
      .map(tab => ({
        id: tab.id!,
        title: tab.title || 'Untitled',
        favIconUrl: tab.favIconUrl,
        url: tab.url
      }))

    setTabs(filteredTabs)
  }, [])

  // Close a tab
  const closeTab = useCallback(async (tabId: number) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      await chrome.tabs.remove(tabId)
    }
    setTabs(prev => prev.filter(t => t.id !== tabId))
  }, [])

  // Listen for tab events
  useEffect(() => {
    fetchTabs()

    if (typeof chrome === 'undefined' || !chrome.tabs) return

    const handleCreated = (tab: chrome.tabs.Tab) => {
      if (tab.id === undefined) return
      setTabs(prev => [...prev, {
        id: tab.id!,
        title: tab.title || 'Untitled',
        favIconUrl: tab.favIconUrl,
        url: tab.url
      }])
    }

    const handleUpdated = (tabId: number, _changes: chrome.tabs.OnUpdatedInfo, tab: chrome.tabs.Tab) => {
      setTabs(prev => prev.map(t =>
        t.id === tabId
          ? { ...t, title: tab.title || 'Untitled', favIconUrl: tab.favIconUrl, url: tab.url }
          : t
      ))
    }

    const handleRemoved = (tabId: number) => {
      setTabs(prev => prev.filter(t => t.id !== tabId))
    }

    chrome.tabs.onCreated.addListener(handleCreated)
    chrome.tabs.onUpdated.addListener(handleUpdated)
    chrome.tabs.onRemoved.addListener(handleRemoved)

    return () => {
      chrome.tabs.onCreated.removeListener(handleCreated)
      chrome.tabs.onUpdated.removeListener(handleUpdated)
      chrome.tabs.onRemoved.removeListener(handleRemoved)
    }
  }, [fetchTabs])

  return { tabs, closeTab }
}

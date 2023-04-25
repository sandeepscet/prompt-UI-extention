import cssText from "data-text:~/contents/suggestion.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "prompt-ui-container"

const debounce = (func, wait = 1000) => {
  let timeout

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const injectSearch = () => {
  const searchboxWrapper = document.createElement("div")
  searchboxWrapper.id = "conversation-search-wrapper"
  searchboxWrapper.classList = "flex items-center justify-center"

  const searchbox = document.createElement("input")
  searchbox.type = "search"
  searchbox.id = "conversation-search"
  searchbox.tabIndex = 0
  searchbox.placeholder = "Search conversations"
  searchbox.classList =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 conversation-search"
  searchbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      // chatStreamIsClosed = true;
      const focusedConversation = document.querySelector(".selected")
      if (focusedConversation) {
        const nextConversation = focusedConversation.nextElementSibling
        if (nextConversation) {
          nextConversation.click()
          nextConversation.scrollIntoView({ block: "center" })
        }
      }
    }
    if (event.key === "ArrowUp") {
      // chatStreamIsClosed = true;
      const focusedConversation = document.querySelector(".selected")
      if (focusedConversation) {
        const previousConversation = focusedConversation.previousElementSibling
        if (previousConversation) {
          previousConversation.click()
          previousConversation.scrollIntoView({ block: "center" })
        }
      }
    }
  })
  searchbox.addEventListener(
    "input",
    debounce((event) => {
      // chatStreamIsClosed = true;
      const searchValue = event.target.value.toLowerCase()
      chrome.storage.sync.get(["conversationsOrder"], (syncResult) => {
        chrome.storage.local.get(["conversations"], (result) => {
          const { conversationsOrder } = syncResult
          const { conversations } = result
          // remove existing conversations
          const curConversationList =
            document.querySelector("#conversation-list")
          // remove conversations list childs other than the search box wrapper (first child)
          while (curConversationList.childNodes.length > 1) {
            curConversationList.removeChild(curConversationList.lastChild)
          }

          const allConversations = Object.values(conversations).filter(
            (c) => !c.skipped
          )
          let filteredConversations = allConversations.sort(
            (a, b) => b.create_time - a.create_time
          )

          if (searchValue) {
          } else {
          }
        })
      })
    }),
    500
  )

  const navGap = document.querySelector("nav > :nth-child(3)")
  navGap.style = `${navGap.style.cssText};display:flex;margin-right:-8px;`

  navGap.append(searchboxWrapper)
  searchboxWrapper.prepend(searchbox)

  return
}

export default injectSearch

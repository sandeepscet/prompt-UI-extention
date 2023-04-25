import cssText from "data-text:~/contents/promptForm.css"
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

const injectPromptForm = () => {
  const observer = new MutationObserver(function (mutations, mutationInstance) {
    const exampleDiv = document.getElementsByClassName(
      "w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
    )
    if (exampleDiv && exampleDiv.length > 0) {
      injectForm()
      mutationInstance.disconnect()
    }
  })

  observer.observe(document, {
    childList: true,
    subtree: true
  })

  function injectForm() {
    const div = document.createElement("div")

    div.id = "div_id"
    div.className = "div_class"
    div.innerHTML = "This part will be replaced by prompt Form"

    const promptFormArea = document.querySelector(
      "#__next > div.overflow-hidden.w-full.h-full.relative.flex > div.flex.h-full.max-w-full.flex-1.flex-col > main > div.flex-1.overflow-hidden > div > div > div > div.text-gray-800.w-full.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100"
    )

    if (promptFormArea) {
      promptFormArea.replaceWith(div)
    }
  }

  return
}

export default injectPromptForm

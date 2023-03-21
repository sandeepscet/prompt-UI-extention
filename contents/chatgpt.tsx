import cssText from "data-text:~/contents/chatgpt.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/chat*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "prompt-ui-container"

const chatgptInputInjection = () => {
  const params = new URLSearchParams(location.search)

  const observer = new MutationObserver(function (mutations, mutationInstance) {
    const exampleDiv = document.getElementsByClassName(
      "w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
    )
    if (exampleDiv && exampleDiv.length > 0) {
      loadTextInTextArea()
      mutationInstance.disconnect()
    }
  })

  observer.observe(document, {
    childList: true,
    subtree: true
  })

  function loadTextInTextArea() {
    const text = params.get("prompt") || ""
    const textarea = document.querySelector('[data-id="root"]') as any
    textarea.focus()
    function setText() {
      textarea.value = text
    }
    setTimeout(setText, 100) //timeout for weird clear thing
  }
  return
}

export default chatgptInputInjection

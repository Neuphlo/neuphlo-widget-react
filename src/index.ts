import { useEffect } from "react"

declare global {
  interface Window {
    __neuphloWidgetLoaded?: boolean
    NeuphloWidget?: NeuphloWidgetApi
  }
}

export interface NeuphloWidgetApi {
  open: () => void
  close: () => void
  toggle: () => void
  destroy: () => void
}

export interface NeuphloWidgetOptions {
  /** Workspace widget key from Inbox settings → Chat widget. */
  widgetKey: string
  /** Loader script origin. Defaults to the Neuphlo cloud. */
  scriptUrl?: string
  /** Neuphlo app origin, for self-hosted installs. */
  appUrl?: string
  /** Launcher corner. Defaults to "right". */
  position?: "left" | "right"
  /** Launcher accent color, any CSS color. */
  color?: string
}

const DEFAULT_SCRIPT_URL = "https://get.neuphlo.com/widget.js"
const SCRIPT_ID = "neuphlo-widget-loader"

export function loadNeuphloWidget(options: NeuphloWidgetOptions): () => void {
  if (typeof document === "undefined") return () => {}
  if (document.getElementById(SCRIPT_ID) || window.__neuphloWidgetLoaded) {
    return () => {}
  }

  const script = document.createElement("script")
  script.id = SCRIPT_ID
  script.src = options.scriptUrl ?? DEFAULT_SCRIPT_URL
  script.async = true
  script.dataset.key = options.widgetKey
  if (options.appUrl) script.dataset.app = options.appUrl
  if (options.position) script.dataset.position = options.position
  if (options.color) script.dataset.color = options.color
  document.body.appendChild(script)

  return () => {
    window.NeuphloWidget?.destroy()
    script.remove()
    window.__neuphloWidgetLoaded = false
  }
}

export function useNeuphloWidget(options: NeuphloWidgetOptions): void {
  const { widgetKey, scriptUrl, appUrl, position, color } = options
  useEffect(
    () => loadNeuphloWidget({ widgetKey, scriptUrl, appUrl, position, color }),
    [widgetKey, scriptUrl, appUrl, position, color],
  )
}

export function NeuphloWidget(props: NeuphloWidgetOptions): null {
  useNeuphloWidget(props)
  return null
}

export function openNeuphloWidget(): void {
  window.NeuphloWidget?.open()
}

export function closeNeuphloWidget(): void {
  window.NeuphloWidget?.close()
}

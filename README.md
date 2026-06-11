# @neuphlo/widget-react

React bindings for the [Neuphlo](https://neuphlo.com) support chat widget. Renders a floating launcher; conversations land in your Neuphlo inbox with the same draft-and-approve flow as email.

## Install

```bash
npm install @neuphlo/widget-react
```

## Usage

Mount the component anywhere in your tree (it renders nothing):

```tsx
import { NeuphloWidget } from "@neuphlo/widget-react"

export function App() {
  return (
    <>
      <YourApp />
      <NeuphloWidget widgetKey="your-widget-key" />
    </>
  )
}
```

Or use the hook:

```tsx
import { useNeuphloWidget } from "@neuphlo/widget-react"

useNeuphloWidget({ widgetKey: "your-widget-key", position: "left", color: "#0f766e" })
```

Open the panel programmatically (e.g. from a "Contact support" button):

```tsx
import { openNeuphloWidget } from "@neuphlo/widget-react"

<button onClick={openNeuphloWidget}>Contact support</button>
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `widgetKey` | — | Workspace widget key from Inbox settings → Chat widget |
| `user` | — | Signed-in user: `{ id, name, email, hash }` |
| `position` | `"right"` | Launcher corner, `"left"` or `"right"` |
| `color` | `"#171717"` | Launcher accent color |
| `appUrl` | Neuphlo cloud | Your app origin for self-hosted installs |
| `scriptUrl` | `https://get.neuphlo.com/widget.js` | Loader script URL |

The widget unmounts cleanly — the launcher and panel are removed when the component unmounts.

## Identifying users

Pass the signed-in user so conversations are recognized in your inbox:

```tsx
<NeuphloWidget
  widgetKey="your-widget-key"
  user={{ id: user.id, name: user.name, email: user.email, hash: user.neuphloHash }}
/>
```

`hash` enables identity verification — compute it **server-side** with the
widget identity secret from Inbox settings → Chat widget:

```ts
import { createHmac } from "node:crypto"

const neuphloHash = createHmac("sha256", process.env.NEUPHLO_IDENTITY_SECRET)
  .update(user.id)
  .digest("hex")
```

Workspaces with "Require verified identities" enabled reject identified
conversations without a valid hash; anonymous visitors are unaffected.

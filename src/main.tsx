import ReactDOM from 'react-dom/client'
import React from 'react'
import { Provider } from './components/ui/provider'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'


// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!


if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  )
}

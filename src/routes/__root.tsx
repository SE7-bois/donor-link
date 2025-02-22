import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

const showMenu = () => {
  console.log(
    document.querySelector("#menu")?.classList.toggle("hidden")
  )
}

function RootComponent() {
  return (
    <header>
      <button onClick={() => showMenu()} className='bg-slate-800 text-white p-4 cursor-pointer active:bg-slate-400'>Menu</button>

      <div id="menu" className='w-1/3 bg-slate-500 text-white absolute z-50 hidden'>
        <ul>
          <li>
            <Link to="/" activeProps={{ className: 'font-bold' }}>Home Button</Link>
          </li>
          <li>
            <Link to="/about" activeProps={{ className: 'font-bold' }}>About us Button</Link>
          </li>
        </ul>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="top-right" />
    </header>
  )
}

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/fundraisers/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full min-h-screen">
      <Outlet />
    </div>
  )
}

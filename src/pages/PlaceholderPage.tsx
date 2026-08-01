import type { ViewId } from '../types'

interface PlaceholderPageProps {
  title: string
  icon: string
  description: string
}

export function PlaceholderPage({ title, icon, description }: PlaceholderPageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 flex items-center justify-center p-8 pb-24 lg:pb-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

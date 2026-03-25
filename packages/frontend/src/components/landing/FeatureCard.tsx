type Props = {
  title: string
  description: string
}

export default function FeatureCard({ title, description }: Props) {
  return (
    <div className="feature-card p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
    </div>
  )
}

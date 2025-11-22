export default function Categories({ icon, title, description }) {
  return (
    <div className="group bg-white rounded-xl p-6 card-glow hover:translate-y-[-8px] smooth-transition cursor-pointer">
      <div className="mb-4">
        <span className="text-5xl">{icon}</span>
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <button className="mt-4 text-purple-600 font-semibold text-sm hover:text-blue-600 smooth-transition">
        Explore →
      </button>
    </div>
  );
}

import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Map, Palette, Globe, FileImage, Languages, Sparkles } from 'lucide-react'

const SAMPLE_THEMES = [
  { name: 'Noir', bg: '#000000', roads: '#FFFFFF', water: '#0A0A0A' },
  { name: 'Terracotta', bg: '#F5EDE4', roads: '#A0522D', water: '#A8C4C4' },
  { name: 'Blueprint', bg: '#1A3A5C', roads: '#E8F4FF', water: '#0F2840' },
  { name: 'Sunset', bg: '#FDF5F0', roads: '#C45C3E', water: '#F0D8D0' },
  { name: 'Japanese Ink', bg: '#FAF8F5', roads: '#2C2C2C', water: '#E8E4E0' },
  { name: 'Midnight Blue', bg: '#0A1628', roads: '#D4AF37', water: '#061020' },
  { name: 'Emerald', bg: '#062C22', roads: '#4ADEB0', water: '#0D4536' },
  { name: 'Ocean', bg: '#F0F8FA', roads: '#1A5F7A', water: '#B8D8E8' },
  { name: 'Neon Cyberpunk', bg: '#0D0D1A', roads: '#FF00FF', water: '#0A0A15' },
  { name: 'Forest', bg: '#F0F4F0', roads: '#2D4A3E', water: '#B8D4D4' },
  { name: 'Warm Beige', bg: '#F5F0E8', roads: '#8B7355', water: '#DDD5C8' },
  { name: 'Copper Patina', bg: '#E8F0F0', roads: '#B87333', water: '#C0D8D8' },
  { name: 'Pastel Dream', bg: '#FAF7F2', roads: '#7B8794', water: '#D4E4ED' },
  { name: 'Contrast Zones', bg: '#FFFFFF', roads: '#000000', water: '#B0B0B0' },
  { name: 'Autumn', bg: '#FBF7F0', roads: '#8B2500', water: '#D8CFC0' },
  { name: 'Monochrome Blue', bg: '#F5F8FA', roads: '#1A3A5C', water: '#D0E0F0' },
  { name: 'Gradient Roads', bg: '#FFFFFF', roads: '#050505', water: '#D5D5D5' },
]

const FEATURES = [
  { icon: Palette, title: '17 Handcrafted Themes', desc: 'From minimal noir to vibrant cyberpunk' },
  { icon: Globe, title: 'Any City Worldwide', desc: 'Powered by OpenStreetMap data' },
  { icon: Sparkles, title: 'Print-Ready Quality', desc: 'Up to 6000x6000 pixels at 300 DPI' },
  { icon: FileImage, title: 'Multiple Formats', desc: 'PNG, SVG, and PDF exports' },
  { icon: Languages, title: 'Multilingual Labels', desc: 'Native script support for any language' },
  { icon: Map, title: 'Customizable Coverage', desc: 'Control map radius from 4km to 20km' },
]

export function Landing() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-terra-50/50 to-sand-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-950 tracking-tight leading-[1.1]">
              Beautiful City Map Posters, Instantly
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-sand-600 leading-relaxed max-w-2xl mx-auto">
              Turn any city into a stunning piece of art. Choose from 17 handcrafted color themes,
              customize the details, and download print-ready poster files.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/create' : '/signup'}
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-terra-600 hover:bg-terra-700 rounded-xl no-underline transition-all shadow-lg shadow-terra-600/20 hover:shadow-xl hover:shadow-terra-600/30"
              >
                {user ? 'Create a Poster' : 'Get Started Free'}
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-sand-700 bg-white hover:bg-sand-50 rounded-xl no-underline transition-all border border-sand-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-sand-900 mb-4">
          17 Unique Color Themes
        </h2>
        <p className="text-center text-sand-600 mb-12 max-w-xl mx-auto">
          Each theme is carefully designed to bring a different aesthetic to your city map poster.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
          {SAMPLE_THEMES.map((theme) => (
            <div key={theme.name} className="group">
              <div
                className="aspect-[3/4] rounded-lg overflow-hidden border border-sand-200 shadow-sm group-hover:shadow-md transition-shadow relative"
                style={{ backgroundColor: theme.bg }}
              >
                <svg viewBox="0 0 60 80" className="w-full h-full">
                  <line x1="15" y1="10" x2="15" y2="70" stroke={theme.roads} strokeWidth="0.8" opacity="0.6" />
                  <line x1="30" y1="5" x2="30" y2="75" stroke={theme.roads} strokeWidth="1.2" />
                  <line x1="45" y1="15" x2="45" y2="65" stroke={theme.roads} strokeWidth="0.8" opacity="0.6" />
                  <line x1="5" y1="25" x2="55" y2="25" stroke={theme.roads} strokeWidth="0.6" opacity="0.5" />
                  <line x1="5" y1="40" x2="55" y2="40" stroke={theme.roads} strokeWidth="1" />
                  <line x1="10" y1="55" x2="50" y2="55" stroke={theme.roads} strokeWidth="0.6" opacity="0.5" />
                  <circle cx="42" cy="18" r="6" fill={theme.water} opacity="0.5" />
                </svg>
              </div>
              <p className="mt-1.5 text-xs text-center text-sand-600 font-medium truncate">
                {theme.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-sand-900 mb-12">
            Everything You Need
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-terra-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-terra-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-sand-900">{title}</h3>
                  <p className="mt-1 text-sm text-sand-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-sand-900 mb-4">
          Ready to create your poster?
        </h2>
        <p className="text-sand-600 mb-8 max-w-lg mx-auto">
          Sign up for free and start generating beautiful city map posters in minutes.
        </p>
        <Link
          to={user ? '/create' : '/signup'}
          className="inline-block px-8 py-3.5 text-base font-semibold text-white bg-terra-600 hover:bg-terra-700 rounded-xl no-underline transition-all shadow-lg shadow-terra-600/20"
        >
          {user ? 'Create a Poster' : 'Get Started Free'}
        </Link>
      </section>
    </div>
  )
}

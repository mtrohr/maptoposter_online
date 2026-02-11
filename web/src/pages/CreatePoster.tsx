import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Theme, ResolutionPreset } from '@/lib/types'
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react'

export function CreatePoster() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [presets, setPresets] = useState<ResolutionPreset[]>([])
  const [loading, setLoading] = useState(true)

  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('')
  const [customWidth, setCustomWidth] = useState(12)
  const [customHeight, setCustomHeight] = useState(16)
  const [useCustomSize, setUseCustomSize] = useState(false)
  const [distance, setDistance] = useState(18000)
  const [outputFormat, setOutputFormat] = useState<'png' | 'svg' | 'pdf'>('png')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [displayCity, setDisplayCity] = useState('')
  const [displayCountry, setDisplayCountry] = useState('')
  const [fontFamily, setFontFamily] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    async function fetchData() {
      const [themeRes, presetRes] = await Promise.all([
        supabase.from('themes').select('*').order('sort_order'),
        supabase.from('resolution_presets').select('*').order('sort_order'),
      ])
      setThemes(themeRes.data ?? [])
      setPresets(presetRes.data ?? [])
      if (themeRes.data?.length) setSelectedTheme(themeRes.data[0].slug)
      if (presetRes.data?.length) setSelectedPreset(presetRes.data[0].name)
      setLoading(false)
    }
    fetchData()
  }, [])

  const distanceLabels: Record<number, string> = {
    4000: 'Small City',
    8000: 'Medium',
    12000: 'Large',
    18000: 'Full View',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-sand-900 mb-8">Create a Poster</h1>

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-sand-900 mb-4">Location</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-sand-700 mb-1.5">City *</label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                placeholder="e.g. Paris"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-sand-700 mb-1.5">Country *</label>
              <input
                id="country"
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                placeholder="e.g. France"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 mt-3 text-sm text-sand-600 hover:text-sand-800 bg-transparent border-none cursor-pointer"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Advanced options
          </button>

          {showAdvanced && (
            <div className="grid sm:grid-cols-2 gap-4 mt-3 p-4 bg-sand-50 rounded-lg border border-sand-200">
              <div>
                <label htmlFor="displayCity" className="block text-sm font-medium text-sand-700 mb-1.5">Display City Name</label>
                <input
                  id="displayCity"
                  type="text"
                  value={displayCity}
                  onChange={(e) => setDisplayCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                  placeholder="e.g.東京"
                />
              </div>
              <div>
                <label htmlFor="displayCountry" className="block text-sm font-medium text-sand-700 mb-1.5">Display Country Name</label>
                <input
                  id="displayCountry"
                  type="text"
                  value={displayCountry}
                  onChange={(e) => setDisplayCountry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                  placeholder="e.g. 日本"
                />
              </div>
              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-sand-700 mb-1.5">Font Family</label>
                <input
                  id="fontFamily"
                  type="text"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                  placeholder="e.g. Noto Sans JP"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lat" className="block text-sm font-medium text-sand-700 mb-1.5">Latitude</label>
                  <input
                    id="lat"
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label htmlFor="lng" className="block text-sm font-medium text-sand-700 mb-1.5">Longitude</label>
                  <input
                    id="lng"
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-sand-900 mb-4">Theme</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.slug}
                type="button"
                onClick={() => setSelectedTheme(theme.slug)}
                className={`group cursor-pointer bg-transparent p-0 border-2 rounded-lg overflow-hidden transition-all ${
                  selectedTheme === theme.slug
                    ? 'border-terra-600 shadow-md'
                    : 'border-transparent hover:border-sand-300'
                }`}
              >
                <div
                  className="aspect-[3/4] relative"
                  style={{ backgroundColor: theme.colors.bg }}
                >
                  <svg viewBox="0 0 60 80" className="w-full h-full">
                    <line x1="15" y1="10" x2="15" y2="70" stroke={theme.colors.road_residential} strokeWidth="0.8" />
                    <line x1="30" y1="5" x2="30" y2="75" stroke={theme.colors.road_primary} strokeWidth="1.2" />
                    <line x1="45" y1="15" x2="45" y2="65" stroke={theme.colors.road_residential} strokeWidth="0.8" />
                    <line x1="5" y1="25" x2="55" y2="25" stroke={theme.colors.road_secondary} strokeWidth="0.8" />
                    <line x1="5" y1="40" x2="55" y2="40" stroke={theme.colors.road_motorway} strokeWidth="1.2" />
                    <line x1="10" y1="55" x2="50" y2="55" stroke={theme.colors.road_tertiary} strokeWidth="0.6" />
                    <circle cx="42" cy="18" r="6" fill={theme.colors.water} opacity="0.6" />
                    <rect x="8" y="45" width="10" height="8" rx="1" fill={theme.colors.parks} opacity="0.6" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-sand-800 py-1.5 px-1 truncate bg-white">
                  {theme.display_name}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-sand-900 mb-4">Size</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => { setSelectedPreset(preset.name); setUseCustomSize(false) }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                  !useCustomSize && selectedPreset === preset.name
                    ? 'bg-terra-600 text-white border-terra-600'
                    : 'bg-white text-sand-700 border-sand-200 hover:border-sand-300'
                }`}
              >
                <span className="block">{preset.label}</span>
                <span className="block text-xs opacity-70">{preset.pixel_width}x{preset.pixel_height}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setUseCustomSize(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                useCustomSize
                  ? 'bg-terra-600 text-white border-terra-600'
                  : 'bg-white text-sand-700 border-sand-200 hover:border-sand-300'
              }`}
            >
              Custom
            </button>
          </div>

          {useCustomSize && (
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-sand-50 rounded-lg border border-sand-200">
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-1.5">
                  Width: {customWidth}" ({Math.round(customWidth * 300)}px)
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="w-full accent-terra-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-1.5">
                  Height: {customHeight}" ({Math.round(customHeight * 300)}px)
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  className="w-full accent-terra-600"
                />
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-sand-900 mb-4">Map Coverage</h2>
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-1.5">
              Radius: {(distance / 1000).toFixed(0)}km
              {distanceLabels[distance] && (
                <span className="text-sand-500 font-normal ml-2">({distanceLabels[distance]})</span>
              )}
            </label>
            <input
              type="range"
              min="4000"
              max="20000"
              step="1000"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full accent-terra-600"
            />
            <div className="flex justify-between text-xs text-sand-500 mt-1">
              <span>4km</span>
              <span>20km</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-sand-900 mb-4">Output Format</h2>
          <div className="flex gap-2">
            {(['png', 'svg', 'pdf'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setOutputFormat(fmt)}
                className={`px-5 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-all cursor-pointer border ${
                  outputFormat === fmt
                    ? 'bg-terra-600 text-white border-terra-600'
                    : 'bg-white text-sand-700 border-sand-200 hover:border-sand-300'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-sand-200">
          <div className="text-sm text-sand-600">
            Estimated cost: <span className="font-semibold text-sand-900">1 credit</span>
          </div>
          <button
            type="button"
            disabled={!city || !country}
            className="sm:ml-auto w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white bg-terra-600 hover:bg-terra-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-none shadow-lg shadow-terra-600/20"
          >
            Generate Poster
          </button>
        </div>
      </div>
    </div>
  )
}

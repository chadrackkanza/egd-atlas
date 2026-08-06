import { useState } from 'react'
import { PROVINCES, COMMUNES_BY_PROVINCE, SECTEURS_BY_COMMUNE, THEMES } from '../data/mockData'
import type { ViewId } from '../types'
import {
  LuArrowLeft, LuCheck, LuArrowRight, LuMapPin, LuFilePlus,
  LuDownload, LuLayers, LuSparkles, LuFileText, LuImage,
  LuGraduationCap, LuHeartPulse, LuDroplet, LuRoute, LuChurch,
  LuBuilding2, LuUsers, LuShield, LuLeaf, LuMap, LuCircleCheck,
} from 'react-icons/lu'

const FORMATS = ['A4 Paysage', 'A4 Portrait', 'A3 Paysage', 'A3 Portrait', 'A2 Paysage']
const RESOLUTIONS = ['Haute qualité (300 dpi)', 'Standard (150 dpi)', 'Web (72 dpi)']

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  ecoles: <LuGraduationCap className="w-5 h-5" />,
  sante: <LuHeartPulse className="w-5 h-5" />,
  eau: <LuDroplet className="w-5 h-5" />,
  routes: <LuRoute className="w-5 h-5" />,
  limites: <LuMap className="w-5 h-5" />,
  eglises: <LuChurch className="w-5 h-5" />,
  marches: <LuBuilding2 className="w-5 h-5" />,
}

const THEME_ICONS: Record<string, React.ReactNode> = {
  education: <LuGraduationCap className="w-6 h-6" />,
  sante: <LuHeartPulse className="w-6 h-6" />,
  eau: <LuDroplet className="w-6 h-6" />,
  religion: <LuChurch className="w-6 h-6" />,
  infrastructure: <LuBuilding2 className="w-6 h-6" />,
  environnement: <LuLeaf className="w-6 h-6" />,
  population: <LuUsers className="w-6 h-6" />,
  securite: <LuShield className="w-6 h-6" />,
}

interface GenererCarteProps {
  onNavigate: (view: ViewId) => void
}

export function GenererCarte({ onNavigate }: GenererCarteProps) {
  const [step, setStep] = useState(1)
  const [province, setProvince] = useState('Kinshasa')
  const [commune, setCommune] = useState('Kintambo')
  const [secteur, setSecteur] = useState('Joli-Parc')
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['education'])
  const [selectedElements, setSelectedElements] = useState<string[]>(['ecoles', 'sante', 'eau', 'routes'])
  const [format, setFormat] = useState('A4 Paysage')
  const [resolution, setResolution] = useState('Haute qualité (300 dpi)')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const ELEMENTS = [
    { id: 'ecoles', label: 'Écoles', count: 45 },
    { id: 'sante', label: 'Centres de santé', count: 12 },
    { id: 'eau', label: "Points d'eau", count: 38 },
    { id: 'routes', label: 'Routes principales', count: 28 },
    { id: 'limites', label: 'Limites des quartiers', count: 8 },
    { id: 'eglises', label: 'Paroisses/Églises', count: 15 },
    { id: 'marches', label: 'Marchés', count: 6 },
  ]

  const communes = COMMUNES_BY_PROVINCE[province] || []
  const secteurs = SECTEURS_BY_COMMUNE[commune] || []

  const toggleTheme = (id: string) => setSelectedThemes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  const toggleElement = (id: string) => setSelectedElements(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 2500)
  }

  const steps = [
    { n: 1, label: 'Zone' },
    { n: 2, label: 'Thème' },
    { n: 3, label: 'Éléments' },
    { n: 4, label: 'Générer' },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-6 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => onNavigate('carte-interactive')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3 transition-colors">
            <LuArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LuFilePlus className="w-5 h-5 text-green-700" />
            Générer une carte
          </h1>
          <p className="text-sm text-slate-500 mt-1">Suivez les étapes pour créer votre carte personnalisée</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <button onClick={() => s.n < step && setStep(s.n)} className="flex items-center gap-2 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  step > s.n ? 'bg-green-600 text-white' :
                  step === s.n ? 'bg-green-700 text-white shadow-lg shadow-green-200' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {step > s.n ? <LuCheck className="w-4 h-4" /> : s.n}
                </div>
                <span className={`text-sm font-medium hidden sm:inline transition-colors ${
                  step === s.n ? 'text-green-700' : step > s.n ? 'text-green-600' : 'text-slate-400'
                }`}>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded transition-all ${step > s.n ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {/* Step 1: Zone */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <LuMapPin className="w-5 h-5 text-green-700" />
                Choisir la zone
              </h2>
              <p className="text-sm text-slate-500 mb-6">Sélectionnez la zone géographique à cartographier</p>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Province</label>
                    <select value={province} onChange={e => { setProvince(e.target.value); setCommune(COMMUNES_BY_PROVINCE[e.target.value]?.[0] || '') }} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                      {PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Commune/Territoire</label>
                    <select value={commune} onChange={e => { setCommune(e.target.value); setSecteur(SECTEURS_BY_COMMUNE[e.target.value]?.[0] || '') }} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                      {communes.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Secteur/Quartier</label>
                    <select value={secteur} onChange={e => setSecteur(e.target.value)} className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                      {secteurs.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 200 }}>
                  <div className="text-center text-slate-500">
                    <LuMap className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <div className="text-sm font-medium">{commune}</div>
                    <div className="text-xs text-slate-400">{province} · {secteur}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Themes */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <LuLayers className="w-5 h-5 text-green-700" />
                Choisir le thème
              </h2>
              <p className="text-sm text-slate-500 mb-6">Sélectionnez un ou plusieurs thèmes à représenter</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => toggleTheme(theme.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      selectedThemes.includes(theme.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={selectedThemes.includes(theme.id) ? 'text-green-700' : 'text-slate-600'}>
                      {THEME_ICONS[theme.id]}
                    </span>
                    <span className={`text-sm font-medium ${selectedThemes.includes(theme.id) ? 'text-green-700' : 'text-slate-700'}`}>
                      {theme.label}
                    </span>
                    {selectedThemes.includes(theme.id) && (
                      <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <LuCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Elements */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <LuLayers className="w-5 h-5 text-green-700" />
                Choisir les éléments
              </h2>
              <p className="text-sm text-slate-500 mb-6">Sélectionnez les éléments à afficher sur votre carte</p>
              <div className="space-y-2">
                {ELEMENTS.map(el => (
                  <label
                    key={el.id}
                    className={`flex items-center gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedElements.includes(el.id)
                        ? 'border-green-400 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input type="checkbox" checked={selectedElements.includes(el.id)} onChange={() => toggleElement(el.id)} className="rounded accent-green-600 w-4 h-4" />
                    <span className={selectedElements.includes(el.id) ? 'text-green-700' : 'text-slate-500'}>
                      {ELEMENT_ICONS[el.id]}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">{el.label}</div>
                    </div>
                    <div className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {el.count} entités
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Preview & Generate */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <LuSparkles className="w-5 h-5 text-green-700" />
                Aperçu & Génération
              </h2>
              <p className="text-sm text-slate-500 mb-6">Configurez les paramètres de sortie et générez votre carte</p>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Preview */}
                <div className="bg-slate-100 rounded-xl overflow-hidden flex flex-col" style={{ minHeight: 280 }}>
                  <div className="bg-slate-200 px-4 py-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="ml-2 text-xs text-slate-600 font-medium">Aperçu de la carte</span>
                  </div>
                  {generated ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <LuCircleCheck className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-sm font-semibold text-slate-800 mb-1">Carte générée !</div>
                      <div className="text-xs text-slate-500">Carte_{commune}_{selectedThemes[0]}.pdf</div>
                      <div className="text-xs text-slate-400 mt-1">2.4 MB · {format}</div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                      <div>
                        <LuMap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <div className="text-sm font-medium text-slate-700">{commune} · {province}</div>
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {selectedThemes.slice(0, 3).map(t => {
                            const theme = THEMES.find(th => th.id === t)
                            return theme ? (
                              <span key={t} className="text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-600 flex items-center gap-1">
                                {THEME_ICONS[theme.id]} {theme.label}
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Config */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Format de sortie</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FORMATS.map(f => (
                        <button
                          key={f}
                          onClick={() => setFormat(f)}
                          className={`text-xs px-3 py-2.5 rounded-lg border-2 text-left font-medium transition-all flex items-center gap-1.5 ${
                            format === f ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <LuFileText className="w-3.5 h-3.5" />
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Résolution</label>
                    <div className="space-y-2">
                      {RESOLUTIONS.map(r => (
                        <label key={r} className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="resolution" value={r} checked={resolution === r} onChange={() => setResolution(r)} className="accent-green-600" />
                          <span className="text-sm text-slate-700">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {!generated && (
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                    >
                      {generating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <LuFilePlus className="w-5 h-5" />
                          Générer la carte
                        </>
                      )}
                    </button>
                  )}
                  {generated && (
                    <button
                      onClick={() => onNavigate('mes-exports')}
                      className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <LuDownload className="w-5 h-5" />
                      Voir mes exports
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 hover:border-slate-300 bg-white px-4 py-2.5 rounded-xl transition-all font-medium"
          >
            <LuArrowLeft className="w-4 h-4" />
            Précédent
          </button>
          <div className="text-sm text-slate-400">Étape {step} / 4</div>
          {step < 4 ? (
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              className="flex items-center gap-2 text-sm bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl transition-all font-medium"
            >
              Suivant
              <LuArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-28" />
          )}
        </div>
      </div>
    </div>
  )
}

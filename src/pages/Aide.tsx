import { useState } from 'react'
import {
  LuSearch, LuChevronDown, LuRocket, LuUpload, LuBookOpen,
  LuCircleHelp, LuMail, LuCheck, LuClock, LuMessageCircle,
} from 'react-icons/lu'

const FAQS = [
  {
    q: 'Comment exporter en PDF haute résolution ?',
    a: 'Dans l\'onglet "Générer une carte", configurez la résolution à 300 dpi puis sélectionnez le format PDF. La génération prend quelques secondes selon la complexité de la carte.'
  },
  {
    q: 'Puis-je ajouter mes propres fichiers Shapefile/GeoJSON ?',
    a: 'Oui ! Dans la section Données, cliquez sur "Importer des données" et glissez-déposez votre fichier SHP, GeoJSON ou CSV. Les données importées apparaissent automatiquement dans le gestionnaire de couches.'
  },
  {
    q: 'Comment générer un atlas complet pour une commune ?',
    a: 'Depuis la page Atlas, sélectionnez le modèle "Atlas Communal" puis cliquez sur "Créer l\'atlas". Le wizard vous guidera pour choisir la zone, les thèmes et les paramètres de sortie.'
  },
  {
    q: 'Quelles zones géographiques sont disponibles ?',
    a: 'EGD Atlas couvre l\'ensemble du territoire de la RDC : les 26 provinces, tous les territoires, communes, secteurs et quartiers pour lesquels des données sont disponibles.'
  },
  {
    q: 'Quelle est la différence entre Formule Gratuite et Premium ?',
    a: 'La formule Premium offre des exports illimités en haute résolution (300 dpi), un stockage de 500 MB, l\'accès à tous les modèles d\'atlas et le support prioritaire.'
  },
]

export function Aide() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [message, setMessage] = useState('')

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  const handleSendContact = () => {
    if (message.trim()) {
      setContactSent(true)
      setMessage('')
      setTimeout(() => { setContactSent(false); setShowContact(false) }, 3000)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 pb-24 lg:pb-6">
      {/* Hero Search */}
      <div className="bg-gradient-to-br from-green-800 to-green-600 px-4 py-12 text-center text-white">
        <div className="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LuCircleHelp className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Comment pouvons-nous vous aider ?</h1>
        <p className="text-green-200 text-sm mb-6">Trouvez des guides, tutoriels et réponses à vos questions</p>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-slate-900 bg-white rounded-xl px-4 py-3 pl-10 text-sm shadow-lg focus:ring-2 focus:ring-white/50 outline-none"
          />
          <LuSearch className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        {/* Quick Guides */}
        {!search && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Guides rapides</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: 'Prendre en main', desc: 'Découvrez les bases de la plateforme', icon: <LuRocket className="w-6 h-6" />, steps: '5 min' },
                { title: 'Importer des données', desc: 'Ajoutez vos propres fichiers géospatiaux', icon: <LuUpload className="w-6 h-6" />, steps: '3 min' },
                { title: "Générer un atlas", desc: 'Créez votre premier atlas professionnel', icon: <LuBookOpen className="w-6 h-6" />, steps: '7 min' },
              ].map(guide => (
                <button key={guide.title} className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:border-green-300 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center text-green-700 mb-3 transition-colors">
                    {guide.icon}
                  </div>
                  <div className="font-semibold text-slate-900 mb-1 group-hover:text-green-700 transition-colors">{guide.title}</div>
                  <div className="text-xs text-slate-500 mb-2">{guide.desc}</div>
                  <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <LuClock className="w-3 h-3" /> {guide.steps}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Questions fréquentes</h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-900 pr-4">{faq.q}</span>
                  <LuChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                Aucun résultat pour « {search} »
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        {showContact && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <LuMessageCircle className="w-4 h-4 text-green-700" />
              Contacter le support
            </h3>
            {contactSent ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <LuCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-sm font-semibold text-slate-800">Message envoyé !</div>
                <div className="text-xs text-slate-500 mt-1">Notre équipe vous répondra dans les 24h</div>
              </div>
            ) : (
              <div className="space-y-3">
                <input type="text" placeholder="Objet du message" className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500" />
                <textarea
                  placeholder="Décrivez votre problème..."
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendContact}
                    className="bg-green-700 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Envoyer
                  </button>
                  <button onClick={() => setShowContact(false)} className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5">
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Button */}
        {!showContact && (
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="font-semibold mb-1 flex items-center gap-2">
                <LuMail className="w-5 h-5" />
                Vous n'avez pas trouvé votre réponse ?
              </div>
              <div className="text-sm text-blue-200">Notre équipe est disponible pour vous aider</div>
            </div>
            <button
              onClick={() => setShowContact(true)}
              className="bg-white text-blue-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Contacter le support
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

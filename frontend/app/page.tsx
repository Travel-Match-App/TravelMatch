"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Camera, ArrowLeft, MapPin, Star, Clock, X, Globe, Navigation, Info, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface RecommendationResponse {
  result: string
  alternatives: string[]
  base: string
  categoria?: string
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [analysisBase, setAnalysisBase] = useState<string>("")
  const [categoria, setCategoria] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setError(null)

      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        setError(null)
        const imageUrl = URL.createObjectURL(file)
        setImagePreview(imageUrl)
      } else {
        setError("Por favor, selecione apenas arquivos de imagem.")
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)
    setResult(null)
    setAlternatives([])
    setAnalysisBase("")
    setCategoria("")
    setShowResult(false)

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`)
      }

      const data: RecommendationResponse = await response.json()
      setResult(data.result)
      setAlternatives(data.alternatives || [])
      setAnalysisBase(data.base || "")
      setCategoria(data.categoria || "")
      setShowResult(true)
    } catch (error) {
      console.error(error)
      setError("Erro ao conectar ao servidor. Verifique se o backend está em execução.")
    } finally {
      setLoading(false)
    }
  }

  const destinos = [
    {
      nome: "Paris",
      imagem: "/paris.jpg",
      descricao: "A cidade do amor, conhecida pela Torre Eiffel e museus incríveis.",
      locais: "Torre Eiffel • Museu do Louvre • Catedral de Notre-Dame",
      rating: 4.8,
      tempo: "7-10 dias",
      coordenadas: "48.8566° N, 2.3522° E",
      continente: "Europa",
    },
    {
      nome: "Rio de Janeiro",
      imagem: "/public/rio.jpg",
      descricao: "Belezas naturais deslumbrantes e o icônico Cristo Redentor.",
      locais: "Cristo Redentor • Praia de Copacabana • Pão de Açúcar",
      rating: 4.7,
      tempo: "5-7 dias",
      coordenadas: "22.9068° S, 43.1729° W",
      continente: "América do Sul",
    },
    {
      nome: "Tóquio",
      imagem: "/japao.jpg",
      descricao: "Fusão perfeita entre tecnologia, tradição e culinária única.",
      locais: "Templo Sensoji • Shibuya • Palácio Imperial",
      rating: 4.9,
      tempo: "7-14 dias",
      coordenadas: "35.6762° N, 139.6503° E",
      continente: "Ásia",
    },
    {
      nome: "Nova York",
      imagem: "/novayork.jpg",
      descricao: "A cidade que nunca dorme, cheia de cultura e vida urbana.",
      locais: "Central Park • Estátua da Liberdade • Times Square",
      rating: 4.6,
      tempo: "5-8 dias",
      coordenadas: "40.7128° N, 74.0060° W",
      continente: "América do Norte",
    },
    {
      nome: "Gramado",
      imagem: "/gramado.jpg",
      descricao: "Charmosa cidade da Serra Gaúcha com clima europeu e atrações encantadoras.",
      locais: "Lago Negro • Mini Mundo • Rua Coberta",
      rating: 4.5,
      tempo: "3-5 dias",
      coordenadas: "29.3783° S, 50.8755° W",
      continente: "América do Sul",
    },
    {
      nome: "Ibiza",
      imagem: "/ibiza.jpg",
      descricao: "Ilha espanhola famosa por praias paradisíacas e vida noturna vibrante.",
      locais: "Cala Comte • Dalt Vila • Playa d'en Bossa",
      rating: 4.4,
      tempo: "4-7 dias",
      coordenadas: "38.9067° N, 1.4206° E",
      continente: "Europa",
    },
    {
      nome: "Havaí",
      imagem: "/havai.jpg",
      descricao: "Arquipélago dos EUA conhecido por vulcões, praias exuberantes e cultura polinésia.",
      locais: "Waikiki Beach • Parque Nacional dos Vulcões • Hanauma Bay",
      rating: 4.8,
      tempo: "7-10 dias",
      coordenadas: "21.3099° N, 157.8581° W",
      continente: "Oceania",
    },
    {
      nome: "Provence",
      imagem: "/provence.jpg",
      descricao: "Região no sul da França famosa por campos de lavanda, vilas medievais e gastronomia.",
      locais: "Gordes • Abadia de Sénanque • Mercado de Aix-en-Provence",
      rating: 4.6,
      tempo: "5-8 dias",
      coordenadas: "43.9352° N, 5.0679° E",
      continente: "Europa",
    },
    {
      nome: "Canadá",
      imagem: "/canada.jpg",
      descricao: "País com paisagens deslumbrantes, montanhas, lagos e cidades cosmopolitas.",
      locais: "Banff • Toronto • Vancouver • Montréal",
      rating: 4.7,
      tempo: "10-14 dias",
      coordenadas: "56.1304° N, 106.3468° W",
      continente: "América do Norte",
    },
    {
      nome: "Suíça",
      imagem: "/suica.jpg",
      descricao: "País alpino com paisagens de tirar o fôlego, lagos cristalinos e vilas pitorescas.",
      locais: "Zurique • Genebra • Alpes Suíços • Interlaken",
      rating: 4.8,
      tempo: "7-10 dias",
      coordenadas: "46.8182° N, 8.2275° E",
      continente: "Europa",
    },
    {
      nome: "Amazônia",
      imagem: "/amazonias.jpg",
      descricao: "A maior floresta tropical do mundo, rica em biodiversidade e cultura indígena.",
      locais: "Rio Amazonas • Floresta Nacional do Jamari • Reserva de Desenvolvimento Sustentável Mamirauá",
      rating: 4.8,
      tempo: "7-10 dias",
      coordenadas: "3.4653° S, 62.2159° W",
      continente: "América do Sul"
    },
    {
      nome: "Machu Picchu",
      imagem: "/machu.jpg",
      descricao: "Antiga cidade inca situada nas montanhas dos Andes, famosa por suas ruínas bem preservadas e paisagens deslumbrantes.",
      locais: "Ruínas de Machu Picchu • Trilha Inca • Vale Sagrado dos Incas",
      rating: 4.9,
      tempo: "3-5 dias",
      coordenadas: "13.1631° S, 72.5450° W",
      continente: "América do Sul"
    },
    {
      nome: "Mônaco",
      imagem: "/monaco.jpg",
      descricao: "Luxo à beira-mar com cassinos, iates e o famoso circuito de Fórmula 1.",
      locais: "Cassino de Monte Carlo • Porto de Hércules • Palácio do Príncipe",
      rating: 4.8,
      tempo: "2-4 dias",
      coordenadas: "43.7384° N, 7.4246° E",
      continente: "Europa"
    },
    {
      nome: "Indianápolis",
      imagem: "/indianapolis.jpg",
      descricao: "Cultura automobilística vibrante e museus históricos no coração dos EUA.",
      locais: "Indianapolis Motor Speedway • Museu da Indy • Monument Circle",
      rating: 4.6,
      tempo: "3-5 dias",
      coordenadas: "39.7684° N, 86.1581° W",
      continente: "América do Norte"
    },
    {
      nome: "Santorini",
      imagem: "/santorini.jpg",
      descricao: "Ilha grega icônica com casinhas brancas, cúpulas azuis e vistas deslumbrantes do pôr do sol.",
      locais: "Oia • Fira • Praia de Perissa",
      rating: 4.9,
      tempo: "3-5 dias",
      coordenadas: "36.3932° N, 25.4615° E",
      continente: "Europa"
    },
    {
      nome: "Veneza",
      imagem: "/veneza.jpg",
      descricao: "Cidade flutuante única com canais românticos, gôndolas e rica arquitetura renascentista.",
      locais: "Praça de São Marcos • Grande Canal • Palácio Ducal",
      rating: 4.7,
      tempo: "2-4 dias",
      coordenadas: "45.4408° N, 12.3155° E",
      continente: "Europa"
    },
    {
      nome: "Cancún",
      imagem: "/cancun.jpg",
      descricao: "Destino caribenho vibrante com praias de areia branca, águas azul-turquesa e vida noturna agitada.",
      locais: "Playa Delfines • Isla Mujeres • Zona Arqueológica El Rey",
      rating: 4.8,
      tempo: "4-6 dias",
      coordenadas: "21.1619° N, 86.8515° W",
      continente: "América do Norte"
    },
    {
      nome: "Deserto do Atacama",
      imagem: "/atacama.jpg",
      descricao: "Paisagens áridas com tons avermelhados, vales lunares e pores do sol intensos.",
      locais: "Vale da Lua • Gêiseres El Tatio • Salar de Atacama",
      rating: 4.8,
      tempo: "3-5 dias",
      coordenadas: "23.8634° S, 69.2518° W",
      continente: "América do Sul"
    },
    {
      nome: "Dubai",
      imagem: "/dubai.jpg",
      descricao: "Cidade futurista cercada por desertos dourados e arquitetura em tons quentes ao pôr do sol.",
      locais: "Burj Khalifa • Deserto de Dubai • Dubai Marina",
      rating: 4.7,
      tempo: "3-5 dias",
      coordenadas: "25.276987° N, 55.296249° E",
      continente: "Ásia"
    },
    {
      nome: "Bali",
      imagem: "/bali.jpg",
      descricao: "Região tropical com arrozais, florestas e templos integrados à vegetação.",
      locais: "Monkey Forest • Tegalalang Rice Terrace • Campuhan Ridge Walk",
      rating: 4.8,
      tempo: "3-5 dias",
      coordenadas: "8.5069° S, 115.2625° E",
      continente: "Ásia"
    },
    {
      nome: "Sydney",
      imagem: "/sydney.jpg",
      descricao: "Cidade vibrante com icônicos marcos como a Opera House e praias deslumbrantes à beira do Pacífico.",
      locais: "Opera House • Bondi Beach • Harbour Bridge",
      rating: 4.7,
      tempo: "3-5 dias",
      coordenadas: "33.8688° S, 151.2093° E",
      continente: "Oceania"
    },
    {
      nome: "Holambra",
      imagem: "/holambra.jpg",
      descricao: "Cidade charmosa conhecida como a 'Cidade das Flores', com influência holandesa e belos campos floridos.",
      locais: "Campos de flores • Moinho Povos Unidos • Museu Histórico de Holambra",
      rating: 4.6,
      tempo: "1-2 dias",
      coordenadas: "20.9225° S, 47.1361° W",
      continente: "América do Sul"
    },
    {
      nome: "Antártica",
      imagem: "/antartica.jpg",
      descricao: "O continente gelado extremo, com paisagens vastas de gelo, vida selvagem única e expedições científicas.",
      locais: "Península Antártica • Ilhas Shetland do Sul • Estação McMurdo",
      rating: 4.7,
      tempo: "7-14 dias",
      coordenadas: "82.8628° S, 135.0000° E",
      continente: "Antártida"
    }
   ]

  const destinoSelecionado = destinos.find((dest) => dest.nome === result)

  const handleBack = () => {
    setShowResult(false)
    setSelectedFile(null)
    setResult(null)
    setAlternatives([])
    setAnalysisBase("")
    setCategoria("")
    setImagePreview(null)
    setError(null)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setError(null)
  }

  // Função para determinar a cor baseada na categoria
  const getCategoryColor = () => {
    if (categoria.includes("azuis")) return "from-blue-500 to-blue-700"
    if (categoria.includes("verdes")) return "from-green-500 to-green-700"
    if (categoria.includes("vermelhas")) return "from-red-500 to-red-700"
    if (categoria.includes("boina")) return "from-purple-500 to-purple-700"
    if (categoria.includes("camisa_havaiana")) return "from-yellow-500 to-yellow-700"
    if (categoria.includes("casaco")) return "from-slate-500 to-slate-700"
    return "from-blue-600 to-indigo-600"
  }

  // Função para determinar o ícone baseado na categoria
  const getCategoryIcon = () => {
    if (categoria.includes("azuis") || categoria.includes("verdes") || categoria.includes("vermelhas")) {
      return <Palette className="w-5 h-5 mr-2 text-slate-300" />
    }
    return <Info className="w-5 h-5 mr-2 text-slate-300" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Subtle Geographic Background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg viewBox="0 0 1200 800" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Elegant world map outline */}
          <path
            d="M200 300 Q300 280 400 300 Q500 320 600 300 Q700 280 800 300 Q900 320 1000 300"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-slate-400"
          />
          <path
            d="M150 400 Q250 380 350 400 Q450 420 550 400 Q650 380 750 400 Q850 420 950 400"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-slate-400"
          />
          <circle cx="300" cy="250" r="2" fill="currentColor" className="text-slate-500" />
          <circle cx="600" cy="350" r="2" fill="currentColor" className="text-slate-500" />
          <circle cx="800" cy="280" r="2" fill="currentColor" className="text-slate-500" />
        </svg>
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-6 py-16 min-h-screen flex flex-col items-center justify-center"
            >
              {/* Header */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-16"
              >
                <div className="flex items-center justify-center mb-8">
                  <div className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg mr-4 border border-slate-700/50">
                    <Globe className="w-8 h-8 text-blue-400" />
                  </div>
                  <h1 className="text-6xl font-light text-white tracking-tight">TravelMatch</h1>
                </div>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                  Descubra destinos únicos através da análise inteligente de suas fotografias
                </p>
                <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Análise por IA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Reconhecimento de Imagem</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Destinos Personalizados</span>
                  </div>
                </div>
              </motion.div>

              {/* Upload Card */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full max-w-2xl"
              >
                <Card className="bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-slate-700/50 rounded-3xl overflow-hidden">
                  <CardContent className="p-12">
                    {/* Upload Area */}
                    <div className="text-center mb-10">
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Upload className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="text-2xl font-light text-white mb-3">Envie sua fotografia</h2>
                      <p className="text-slate-400 font-light">Arraste sua imagem aqui ou clique para selecionar</p>
                    </div>

                    {/* Drop Zone */}
                    <motion.div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                        isDragOver
                          ? "border-blue-400 bg-blue-500/10 scale-[1.02]"
                          : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer block">
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="p-4 bg-slate-700/50 rounded-xl">
                              <Camera className="w-8 h-8 text-slate-400" />
                            </div>
                          </div>
                          <div>
                            <p className="text-lg text-slate-200 font-medium mb-2">
                              {isDragOver ? "Solte sua imagem aqui" : "Clique para selecionar ou arraste aqui"}
                            </p>
                            <p className="text-sm text-slate-500">JPG, PNG ou GIF • Máximo 10MB</p>
                          </div>
                        </div>
                      </label>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                      >
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Selected File */}
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 space-y-4"
                      >
                        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl border border-slate-600/50">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Camera className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-200 truncate max-w-xs">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={removeFile}
                            className="p-2 hover:bg-red-500/20 rounded-full transition-colors group"
                          >
                            <X className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                          </button>
                        </div>

                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-xl border border-slate-600/50"
                            />
                            <button
                              onClick={() => window.open(imagePreview, "_blank")}
                              className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm hover:bg-black/90 transition-colors backdrop-blur-sm"
                            >
                              Visualizar
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Upload Button */}
                    <motion.div className="mt-10" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                        className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl shadow-lg border-0"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-3">
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            />
                            <span>Analisando imagem...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <Navigation className="w-5 h-5" />
                            <span>Descobrir Destino</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-6 py-12 min-h-screen"
            >
              {/* Back Button */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mb-8">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center space-x-2 bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700/80 hover:border-slate-500 backdrop-blur-sm shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Nova Análise</span>
                </Button>
              </motion.div>

              {destinoSelecionado && (
                <div className="max-w-5xl mx-auto">
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Card className="bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-slate-700/50 rounded-3xl overflow-hidden">
                      <div className="relative h-96">
                        <img
                          src={destinoSelecionado.imagem || "/placeholder.svg"}
                          alt={destinoSelecionado.nome}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                        {/* Location Info */}
                        <div className="absolute top-6 right-6 bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-700/50">
                          <div className="text-center">
                            <p className="text-sm font-medium text-slate-300 mb-1">{destinoSelecionado.continente}</p>
                            <p className="text-xs text-slate-400 font-mono">{destinoSelecionado.coordenadas}</p>
                          </div>
                        </div>

                        <div className="absolute bottom-6 left-6 text-white">
                          <h2 className="text-5xl font-light mb-4">{destinoSelecionado.nome}</h2>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{destinoSelecionado.rating}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-5 h-5" />
                              <span>{destinoSelecionado.tempo}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-xl font-medium mb-4 text-white">Sobre o destino</h3>
                            <p className="text-slate-300 leading-relaxed font-light">{destinoSelecionado.descricao}</p>
                          </div>

                          <div>
                            <h3 className="text-xl font-medium mb-4 text-white flex items-center">
                              <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                              Informações de Localização
                            </h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Continente:</span>
                                <span className="text-slate-200 font-medium">{destinoSelecionado.continente}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Coordenadas:</span>
                                <span className="text-slate-200 font-mono text-xs">
                                  {destinoSelecionado.coordenadas}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Duração recomendada:</span>
                                <span className="text-slate-200 font-medium">{destinoSelecionado.tempo}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-medium mb-4 text-white flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-green-400" />
                            Principais Atrações
                          </h3>
                          <p className="text-slate-300 font-light">{destinoSelecionado.locais}</p>
                        </div>

                        {/* Análise da IA */}
                        <div
                          className={`bg-gradient-to-r ${getCategoryColor()} rounded-2xl p-8 border border-slate-600/50`}
                        >
                          <h3 className="text-lg font-medium mb-4 text-white flex items-center">
                            {getCategoryIcon()}
                            Análise da Imagem
                          </h3>
                          <div className="space-y-3">
                            <p className="text-slate-200 leading-relaxed font-light">
                              Destino recomendado com base em: <span className="font-medium">{analysisBase}</span>
                            </p>
                            {alternatives.length > 0 && (
                              <div>
                                <p className="text-slate-200 font-medium mt-2">Destinos alternativos:</p>
                                <ul className="list-disc list-inside text-slate-200 font-light">
                                  {alternatives.map((alt, index) => (
                                    <li key={index}>{alt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Imagem Analisada */}
                        {imagePreview && (
                          <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50">
                            <h3 className="text-lg font-medium mb-4 text-white">Imagem Analisada</h3>
                            <div className="relative">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Imagem analisada"
                                className="w-full max-h-64 object-contain rounded-xl"
                              />
                              <button
                                onClick={() => window.open(imagePreview, "_blank")}
                                className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm hover:bg-black/90 transition-colors backdrop-blur-sm"
                              >
                                Ampliar
                              </button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
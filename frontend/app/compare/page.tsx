"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Plus,
  X,
  Search,
  MapPin,
  Star,
  Clock,
  Cloud,
  Sun,
  CloudRain,
  Plane,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface DestinationData {
  id: string
  name: string
  image: string
  rating: number
  continent: string
  coordinates: string
  description: string
  attractions: string
  recommended_days: string
  weather: {
    temperature: string
    condition: string
    humidity: string
    wind_speed: string
    description: string
    feels_like: string
    uv_index: string
  }
  flight_info: {
    search_url: string
    average_price: string
    price_trend: "up" | "down" | "stable"
    best_time_to_book: string
    cheapest_month: string
    price_change_percentage: string
  }
  cost_of_living: {
    daily_budget_low: string
    daily_budget_mid: string
    daily_budget_high: string
    accommodation_avg: string
    food_avg: string
    transport_avg: string
  }
}

const availableDestinations = [
  "Paris",
  "Rio de Janeiro",
  "Tóquio",
  "Nova York",
  "Gramado",
  "Ibiza",
  "Havaí",
  "Provence",
  "Canadá",
  "Suíça",
  "Londres",
  "Barcelona",
  "Roma",
  "Amsterdam",
  "Berlim",
  "Praga",
  "Viena",
  "Budapeste",
  "Cracóvia",
  "Estocolmo",
  "Copenhague",
  "Oslo",
]

export default function ComparePage() {
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      router.push("/auth/login")
    }
  }, [router])

  const filteredDestinations = availableDestinations.filter(
    (dest) =>
      dest.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedDestinations.some((selected) => selected.name === dest),
  )

  const addDestination = async (destinationName: string) => {
    if (selectedDestinations.length >= 4) {
      setError("Máximo de 4 destinos para comparação")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch destination data
      const response = await fetch(`http://localhost:8000/destination-compare/${encodeURIComponent(destinationName)}`)

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do destino: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSelectedDestinations((prev) => [...prev, data.destination])
        setSearchTerm("")
        setShowSearch(false)
      } else {
        setError(data.message || "Erro ao carregar dados do destino")
      }
    } catch (err) {
      console.error("Error fetching destination:", err)
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  const removeDestination = (destinationId: string) => {
    setSelectedDestinations((prev) => prev.filter((dest) => dest.id !== destinationId))
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
      return <Sun className="w-5 h-5 text-yellow-400" />
    }
    if (lowerCondition.includes("rain") || lowerCondition.includes("storm")) {
      return <CloudRain className="w-5 h-5 text-blue-400" />
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="w-5 h-5 text-slate-400" />
    }
    return <Sun className="w-5 h-5 text-yellow-400" />
  }

  const getPriceTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-green-400" />
      default:
        return <Minus className="w-4 h-4 text-slate-400" />
    }
  }

  const getPriceTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-red-400"
      case "down":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  const getBestValueDestination = () => {
    if (selectedDestinations.length === 0) return null

    return selectedDestinations.reduce((best, current) => {
      const currentPrice = Number.parseInt(current.flight_info.average_price.replace(/[^\d]/g, ""))
      const bestPrice = Number.parseInt(best.flight_info.average_price.replace(/[^\d]/g, ""))
      const currentRating = current.rating
      const bestRating = best.rating

      // Score baseado em preço baixo e rating alto
      const currentScore = currentRating * 1000 - currentPrice
      const bestScore = bestRating * 1000 - bestPrice

      return currentScore > bestScore ? current : best
    })
  }

  const bestValue = getBestValueDestination()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg viewBox="0 0 1200 800" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M200 300 Q300 280 400 300 Q500 320 600 300 Q700 280 800 300 Q900 320 1000 300"
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

      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  size="sm"
                  className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700/50 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-white">Comparar Destinos</h1>
                    <p className="text-sm text-slate-400">Compare clima, preços e custos de vida</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Globe className="w-4 h-4" />
                <span>{selectedDestinations.length}/4 destinos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Add Destination Section */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
            <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-400" />
                  Adicionar Destinos para Comparação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Buscar destino..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
                    />
                  </div>
                  <Button
                    onClick={() => setShowSearch(!showSearch)}
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                  >
                    {showSearch ? "Ocultar" : "Mostrar"} Lista
                  </Button>
                </div>

                {/* Search Results */}
                <AnimatePresence>
                  {(showSearch || searchTerm) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 max-h-40 overflow-y-auto"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {filteredDestinations.map((destination) => (
                          <Button
                            key={destination}
                            onClick={() => addDestination(destination)}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="bg-slate-700/30 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-blue-500 transition-all"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {destination}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Best Value Recommendation */}
          {bestValue && selectedDestinations.length > 1 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
              <Card className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Zap className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Melhor Custo-Benefício</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <img
                      src={bestValue.image || "/placeholder.svg?height=60&width=80"}
                      alt={bestValue.name}
                      className="w-20 h-15 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{bestValue.name}</h4>
                      <p className="text-green-400 text-sm">
                        ⭐ {bestValue.rating} • {bestValue.flight_info.average_price} • {bestValue.weather.temperature}
                      </p>
                      <p className="text-slate-300 text-sm">{bestValue.description.slice(0, 100)}...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Comparison Grid */}
          {selectedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {selectedDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`bg-slate-800/90 backdrop-blur-xl border transition-all duration-300 hover:scale-105 ${
                        bestValue?.id === destination.id
                          ? "border-green-500/50 shadow-lg shadow-green-500/20"
                          : "border-slate-700/50 hover:border-slate-600/50"
                      }`}
                    >
                      {/* Header with Image */}
                      <div className="relative h-40 overflow-hidden rounded-t-xl">
                        <img
                          src={destination.image || "/placeholder.svg?height=160&width=300"}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Remove Button */}
                        <button
                          onClick={() => removeDestination(destination.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>

                        {/* Best Value Badge */}
                        {bestValue?.id === destination.id && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 rounded-full">
                            <span className="text-white text-xs font-medium">Melhor Custo-Benefício</span>
                          </div>
                        )}

                        <div className="absolute bottom-2 left-2 text-white">
                          <h3 className="text-lg font-semibold">{destination.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{destination.rating}</span>
                            <span className="text-xs text-slate-300">• {destination.continent}</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-4">
                        {/* Weather Section */}
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            {getWeatherIcon(destination.weather.condition)}
                            <span className="ml-2">Clima</span>
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Temperatura:</span>
                              <span className="text-white font-medium">{destination.weather.temperature}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Sensação:</span>
                              <span className="text-white">{destination.weather.feels_like}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Umidade:</span>
                              <span className="text-white">{destination.weather.humidity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Vento:</span>
                              <span className="text-white">{destination.weather.wind_speed}</span>
                            </div>
                          </div>
                        </div>

                        {/* Flight Prices Section */}
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Plane className="w-4 h-4 text-blue-400 mr-2" />
                            Passagens
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Preço médio:</span>
                              <div className="flex items-center space-x-1">
                                {getPriceTrendIcon(destination.flight_info.price_trend)}
                                <span className="text-white font-medium">{destination.flight_info.average_price}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Tendência:</span>
                              <span
                                className={`font-medium ${getPriceTrendColor(destination.flight_info.price_trend)}`}
                              >
                                {destination.flight_info.price_change_percentage}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Mês mais barato:</span>
                              <span className="text-white">{destination.flight_info.cheapest_month}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => window.open(destination.flight_info.search_url, "_blank")}
                            size="sm"
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                          >
                            <Plane className="w-3 h-3 mr-1" />
                            Buscar
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>

                        {/* Cost of Living Section */}
                        <div className="bg-slate-700/50 rounded-lg p-3">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <DollarSign className="w-4 h-4 text-green-400 mr-2" />
                            Custo Diário
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Econômico:</span>
                              <span className="text-green-400 font-medium">
                                {destination.cost_of_living.daily_budget_low}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Médio:</span>
                              <span className="text-yellow-400 font-medium">
                                {destination.cost_of_living.daily_budget_mid}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Luxo:</span>
                              <span className="text-red-400 font-medium">
                                {destination.cost_of_living.daily_budget_high}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{destination.recommended_days}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{destination.continent}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">Nenhum destino selecionado</h4>
                    <p className="text-slate-400 mb-6">
                      Adicione destinos para comparar clima, preços de passagens e custo de vida!
                    </p>
                    <Button
                      onClick={() => setShowSearch(true)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Destino
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="bg-slate-800/90 border border-slate-700/50">
                <CardContent className="p-6 flex items-center space-x-3">
                  <motion.div
                    className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <span className="text-white">Carregando dados do destino...</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Star,
  Clock,
  LogOut,
  Camera,
  Heart,
  TrendingUp,
  Globe,
  Calendar,
  Compass,
  History,
  Bookmark,
  Cloud,
  Sun,
  CloudRain,
  Plane,
  ExternalLink,
  GitCompare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface Suggestion {
  id: string
  destination: string
  reason: string
  image: string
  rating: number
  estimated_days: string
  category: string
  priority: number
  weather?: {
    temperature: string
    condition: string
    description: string
  }
  flight_info?: {
    search_url: string
    average_price: string
  }
}

interface UserStats {
  total_analyses: number
  favorite_category: string
  last_analysis: string
  preferred_destinations: string[]
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const storedUserId = localStorage.getItem("user_id")
    const storedUserName = localStorage.getItem("user_name")

    if (!storedUserId || !storedUserName) {
      router.push("/auth/login")
      return
    }

    setUserId(storedUserId)
    setUserName(storedUserName)

    // Fetch user suggestions and stats
    fetchUserData(storedUserId)
  }, [router])

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true)

      // Fetch suggestions
      const suggestionsResponse = await fetch(`http://localhost:8000/user-suggestions/${userId}`)
      const suggestionsData = await suggestionsResponse.json()

      if (suggestionsData.success) {
        setSuggestions(suggestionsData.suggestions)
      }

      // Fetch user stats
      const statsResponse = await fetch(`http://localhost:8000/user-stats/${userId}`)
      const statsData = await statsResponse.json()

      if (statsData.success) {
        setUserStats(statsData.stats)
      }
    } catch (err) {
      setError("Erro ao carregar dados do usuário")
      console.error("Dashboard error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_name")
    router.push("/auth/login")
  }

  const handleNewAnalysis = () => {
    router.push("/analyze")
  }

  // No handleNewAnalysis, adicionar função para comparação
  const handleCompareDestinations = () => {
    router.push("/compare")
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "imagens_azuis":
        return "from-blue-500 to-blue-700"
      case "imagens_verdes":
        return "from-green-500 to-green-700"
      case "imagens_vermelhas":
        return "from-red-500 to-red-700"
      case "boina":
        return "from-purple-500 to-purple-700"
      case "camisa_havaiana":
        return "from-yellow-500 to-yellow-700"
      case "casaco":
        return "from-slate-500 to-slate-700"
      default:
        return "from-blue-600 to-indigo-600"
    }
  }

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) return { text: "Alta", color: "bg-red-500/20 text-red-400 border-red-500/30" }
    if (priority >= 6) return { text: "Média", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" }
    return { text: "Baixa", color: "bg-green-500/20 text-green-400 border-green-500/30" }
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
      return <Sun className="w-4 h-4 text-yellow-400" />
    }
    if (lowerCondition.includes("rain") || lowerCondition.includes("storm")) {
      return <CloudRain className="w-4 h-4 text-blue-400" />
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="w-4 h-4 text-slate-400" />
    }
    return <Sun className="w-4 h-4 text-yellow-400" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>
    )
  }

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
                <div className="p-2 bg-slate-700/50 rounded-xl">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">TravelMatch</h1>
                  <p className="text-sm text-slate-400">Dashboard</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600">
                    <AvatarFallback className="text-white font-medium">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-slate-400">ID: {userId}</p>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
            <h2 className="text-3xl font-light text-white mb-2">Bem-vindo de volta, {userName}! 👋</h2>
            <p className="text-slate-400">Aqui estão suas sugestões personalizadas de viagem com clima e passagens</p>
          </motion.div>

          {/* Stats Cards */}
          {userStats && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Camera className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">{userStats.total_analyses}</p>
                      <p className="text-sm text-slate-400">Análises</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white capitalize">
                        {userStats.favorite_category.replace("_", " ")}
                      </p>
                      <p className="text-sm text-slate-400">Categoria Favorita</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {new Date(userStats.last_analysis).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-slate-400">Última Análise</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                      <Heart className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white">{userStats.preferred_destinations.length}</p>
                      <p className="text-sm text-slate-400">Destinos Favoritos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Compass className="w-5 h-5 mr-2 text-blue-400" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Botão principal no topo */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleNewAnalysis}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 px-8 w-full max-w-sm"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Nova Análise
                    </Button>
                  </div>

                  {/* Dois botões na base da pirâmide */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleCompareDestinations}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-12"
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      Comparar Destinos
                    </Button>

                    <Button
                      variant="outline"
                      className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 h-12"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Histórico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-white">Sugestões Personalizadas</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Bookmark className="w-4 h-4" />
                <span>Com clima e passagens</span>
              </div>
            </div>

            {error && (
              <Card className="bg-red-500/20 border border-red-500/30 mb-6">
                <CardContent className="p-4">
                  <p className="text-red-400 text-center">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {suggestions.map((suggestion, index) => {
                  const priorityBadge = getPriorityBadge(suggestion.priority)

                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group">
                        <div className="relative h-48 overflow-hidden rounded-t-xl">
                          <img
                            src={suggestion.image || "/placeholder.svg?height=200&width=300"}
                            alt={suggestion.destination}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Priority Badge */}
                          <div
                            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${priorityBadge.color}`}
                          >
                            {priorityBadge.text}
                          </div>

                          <div className="absolute bottom-3 left-3 text-white">
                            <h4 className="text-lg font-semibold">{suggestion.destination}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{suggestion.rating}</span>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(suggestion.category)} text-white`}
                            >
                              {suggestion.category.replace("_", " ").replace("imagens ", "")}
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed">{suggestion.reason}</p>

                            {/* Weather Info */}
                            {suggestion.weather && (
                              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {getWeatherIcon(suggestion.weather.condition)}
                                    <span className="text-slate-300 text-sm">Clima:</span>
                                  </div>
                                  <span className="text-white text-sm font-medium">
                                    {suggestion.weather.temperature}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-xs mt-1">{suggestion.weather.description}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-slate-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{suggestion.estimated_days}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Recomendado</span>
                              </div>
                            </div>

                            {/* Flight Button */}
                            {suggestion.flight_info && (
                              <Button
                                onClick={() => window.open(suggestion.flight_info!.search_url, "_blank")}
                                size="sm"
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                              >
                                <Plane className="w-4 h-4 mr-2" />
                                Ver Passagens ({suggestion.flight_info.average_price})
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {suggestions.length === 0 && !error && (
              <Card className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Nenhuma sugestão ainda</h4>
                      <p className="text-slate-400 mb-6">
                        Faça sua primeira análise de imagem para receber sugestões personalizadas com clima e passagens!
                      </p>
                      <Button
                        onClick={handleNewAnalysis}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Começar Análise
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

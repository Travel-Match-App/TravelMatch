"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Eye, EyeOff, LogIn, Scan, Globe, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Função para gerar ID único
const generateUserId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Função para validar email básico
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [faceRecognitionMode, setFaceRecognitionMode] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setFaceRecognitionMode(true)
      setError(null)
    } catch (err) {
      setError("Erro ao acessar a câmera. Verifique as permissões.")
      console.error("Camera error:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setFaceRecognitionMode(false)
    setCapturing(false)
  }, [])

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setCapturing(true)
    setError(null)

    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(video, 0, 0)

      // Simular processamento
      setTimeout(() => {
        if (isLogin) {
          // Para login facial
          const userId = generateUserId()
          const userName = name || email.split("@")[0] || "Usuário"

          setSuccess("Login facial realizado com sucesso!")
          localStorage.setItem("user_id", userId)
          localStorage.setItem("user_name", userName)

          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        } else {
          // Para registro facial
          setSuccess("Cadastro facial realizado com sucesso!")
          setTimeout(() => {
            setIsLogin(true)
            setSuccess(null)
            stopCamera()
            resetForm()
          }, 2000)
        }
        setCapturing(false)
      }, 2000)
    }
  }, [isLogin, name, email, router, stopCamera])

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Simular processamento
    setTimeout(() => {
      // Validações básicas apenas
      if (!isValidEmail(email)) {
        setError("Email inválido")
        setLoading(false)
        return
      }

      if (!password.trim()) {
        setError("Senha é obrigatória")
        setLoading(false)
        return
      }

      if (!isLogin && !name.trim()) {
        setError("Nome é obrigatório")
        setLoading(false)
        return
      }

      if (!isLogin && password !== confirmPassword) {
        setError("Senhas não coincidem")
        setLoading(false)
        return
      }

      // Aceitar qualquer email/senha
      if (isLogin) {
        // Login
        const userId = generateUserId()
        const userName = name || email.split("@")[0] || "Usuário"

        setSuccess("Login realizado com sucesso!")
        localStorage.setItem("user_id", userId)
        localStorage.setItem("user_name", userName)

        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        // Registro
        setSuccess("Cadastro realizado com sucesso!")
        setTimeout(() => {
          setIsLogin(true)
          setSuccess(null)
          resetForm()
        }, 2000)
      }

      setLoading(false)
    }, 1500)
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setConfirmPassword("")
    setError(null)
    setSuccess(null)
    stopCamera()
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
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

      <div className="relative z-10 container mx-auto px-6 py-16 min-h-screen flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg mr-4 border border-slate-700/50">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-5xl font-light text-white tracking-tight">TravelMatch</h1>
          </div>
          <p className="text-lg text-slate-300 font-light">{isLogin ? "Entre em sua conta" : "Crie sua conta"}</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="bg-slate-800/90 backdrop-blur-xl shadow-2xl border border-slate-700/50 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-light text-white">{isLogin ? "Entrar" : "Cadastrar"}</CardTitle>
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Rápido</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scan className="w-4 h-4 text-purple-400" />
                  <span>Facial</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                  >
                    <p className="text-green-400 text-sm text-center">{success}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Face Recognition Mode */}
              <AnimatePresence>
                {faceRecognitionMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-64 object-cover rounded-xl bg-slate-700"
                      />
                      <div className="absolute inset-0 border-2 border-dashed border-blue-400/50 rounded-xl flex items-center justify-center">
                        <div className="w-32 h-32 border-2 border-blue-400 rounded-full"></div>
                      </div>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />

                    <div className="flex space-x-3">
                      <Button
                        onClick={captureImage}
                        disabled={capturing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        {capturing ? (
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                        ) : (
                          <Camera className="w-4 h-4 mr-2" />
                        )}
                        {capturing ? "Processando..." : "Capturar"}
                      </Button>

                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Traditional Form */}
              {!faceRecognitionMode && (
                <form onSubmit={handleTraditionalLogin} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">
                        Nome completo
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-green-500"
                        placeholder="Qualquer nome"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-green-500"
                      placeholder="qualquer@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-green-500 pr-10"
                        placeholder="Qualquer senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-slate-300">
                        Confirmar senha
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!isLogin}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-green-500"
                        placeholder="Repita a senha"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                    ) : (
                      <LogIn className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
                  </Button>
                </form>
              )}

              {/* Face Recognition Button */}
              {!faceRecognitionMode && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">ou</span>
                  </div>
                </div>
              )}

              {!faceRecognitionMode && (
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="w-full py-3 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {isLogin ? "Entrar com Face" : "Cadastrar com Face"}
                </Button>
              )}

              {/* Toggle Mode */}
              {!faceRecognitionMode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                    <span className="text-blue-400 hover:text-blue-300">{isLogin ? "Cadastre-se" : "Entre"}</span>
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

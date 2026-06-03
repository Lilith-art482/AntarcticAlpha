import { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { X, QrCode } from 'lucide-react'
import { BrowserMultiFormatReader } from '@zxing/library'

interface QRScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (result: string | null) => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScan }) => {
  const { theme } = useThemeStore()
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    if (isOpen) {
      startScanner()
    } else {
      stopScanner()
    }

    return () => {
      stopScanner()
    }
  }, [isOpen])

  const startScanner = async () => {
    try {
      setError(null)
      setIsScanning(true)

      const codeReader = new BrowserMultiFormatReader()
      codeReaderRef.current = codeReader

      // Сначала получить список доступных камер
      const devices = await codeReader.listVideoInputDevices()
      
      // Ищем заднюю (основную) камеру - обычно она имеет label или prefer rear camera
      let videoInputDevice = devices.find((device: any) => {
        // Проверяем, не является ли камера фронтальной
        const label = device.label.toLowerCase()
        return device.kind === 'videoinput' && 
               !label.includes('front') && 
               !label.includes('user') && 
               !label.includes('front-facing')
      })

      // Если не нашли, берем любую камеру с наибольшим разрешением
      if (!videoInputDevice) {
        videoInputDevice = devices.find((device: any) => device.kind === 'videoinput')
      }

      if (!videoInputDevice) {
        throw new Error('Камера не найдена')
      }

      await codeReader.decodeFromVideoDevice(
        videoInputDevice.deviceId,
        videoRef.current!,
        (result: any) => {
          if (result) {
            onScan(result.getText())
            stopScanner()
          }
        }
      )
    } catch (err: any) {
      console.error('Scanner error:', err)
      setError('Не удалось запустить камеру. Проверьте разрешения.')
      setIsScanning(false)
    }
  }

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
      codeReaderRef.current = null
    }
    setIsScanning(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Scanner Modal */}
      <div className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border ${
        theme === 'dark' 
          ? 'bg-[#0b0f17] border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-white/5' : 'border-gray-100'
        }`}>
          <div className="flex items-center gap-3">
            <QrCode className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4C7F6E]' : 'text-[#4C7F6E]'}`} />
            <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Сканировать QR код
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-all ${
              theme === 'dark' 
                ? 'bg-white/5 hover:bg-white/10 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="p-4">
          <div className={`relative rounded-2xl overflow-hidden ${
            theme === 'dark' ? 'bg-black' : 'bg-gray-900'
          }`}>
            <video
              ref={videoRef}
              className="w-full aspect-[3/4] object-cover"
              playsInline
              muted
            />
            
            {/* Scanner overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#4C7F6E] rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#4C7F6E] rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#4C7F6E] rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#4C7F6E] rounded-br-xl" />
                
                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#4C7F6E] to-transparent animate-scan" />
                )}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center p-6">
                  <p className="text-red-400 font-bold mb-2">{error}</p>
                  <button
                    onClick={startScanner}
                    className="px-4 py-2 bg-[#4C7F6E] hover:bg-[#3d6b5a] text-white rounded-xl font-bold text-sm"
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <p className={`text-center text-sm mt-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Наведите камеру на QR код для сканирования
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(50%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

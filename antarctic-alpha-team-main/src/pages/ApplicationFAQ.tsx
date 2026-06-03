import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useNavigate } from 'react-router-dom'
import { HelpCircle, ChevronDown, Users, MessageCircle, ArrowLeft, Send } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

  return (
    <div 
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen 
          ? theme === 'dark' 
            ? 'bg-[#4E6E49]/5 border-[#4E6E49]/20' 
            : 'bg-[#4E6E49]/5 border-[#4E6E49]/20'
          : theme === 'dark' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white border-gray-200'
      }`}
    >
      <button
        onClick={onClick}
        className="w-full p-5 flex items-start justify-between gap-4 text-left"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-2 rounded-xl transition-colors shrink-0 ${
            isOpen 
              ? 'bg-[#4E6E49]/20 text-[#4E6E49]' 
              : theme === 'dark'
                ? 'bg-white/5 text-gray-400'
                : 'bg-gray-100 text-gray-500'
          }`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className={`font-bold ${headingColor} mb-1`}>
              {question}
            </h4>
            {isOpen && (
              <p className={`text-sm leading-relaxed ${textColor} animate-fade-in`}>
                {answer}
              </p>
            )}
          </div>
        </div>
        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-[#4E6E49]' : 'text-gray-400'}`} />
        </div>
      </button>
    </div>
  )
}

export const ApplicationFAQ = () => {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [question, setQuestion] = useState('')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  const faqData = [
    {
      question: 'Сколько времени занимает рассмотрение заявки?',
      answer: 'Обычно рассмотрение занимает от 3 до 7 рабочих дней. Мы тщательно изучаем каждую заявку, поэтому просим немного подождать. После подачи заявки вы получите уведомление о статусе рассмотрения.'
    },
    {
      question: 'Какой нужен опыт для вступления?',
      answer: 'Мы рассматриваем кандидатов с разным уровнем опыта — от новичков до профессионалов. Важнее всего ваша мотивация, готовность учиться и развиваться. Опыт в трейдинге является преимуществом, но не обязателен.'
    },
    {
      question: 'Есть ли какие-то требования к депозиту?',
      answer: 'Нет, мы не требуем минимальный депозит для вступления. ARCA — это сообщество для обучения и развития, а не инвестиционный фонд. Вы сможете развивать навыки и тестировать стратегии без финансовых обязательств.'
    },
    {
      question: 'Можно ли подать заявку повторно, если отказали?',
      answer: 'Да, конечно. Если вашу заявку отклонили, вы можете подать её снова через 30 дней. За это время вы можете улучшить свои навыки, получить дополнительный опыт и усилить мотивационную часть заявки.'
    },
    {
      question: 'Что делать, если у меня остались вопросы?',
      answer: 'Вы можете задать вопрос напрямую через форму внизу этой страницы или написать нам в Telegram. Мы всегда готовы помочь и ответить на все ваши вопросы о вступлении в сообщество.'
    },
    {
      question: 'Какие обязательства после вступления?',
      answer: 'После вступления вы получаете доступ к образовательным материалам, стратегиям и командному чату. Каких-либо обязательных платежей или взносов нет. Участники активно участвуют в жизни сообщества, но формат участия определяется вашими возможностями.'
    }
  ]

  const handleFaqToggle = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      setFormSubmitted(true)
      setQuestion('')
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Grid Pattern Background */}
      <div className={`fixed inset-0 pointer-events-none ${
        theme === 'dark'
          ? 'bg-[linear-gradient(rgba(78,110,73,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(78,110,73,0.08)_1px,transparent_1px)]'
          : 'bg-[linear-gradient(rgba(78,110,73,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(78,110,73,0.06)_1px,transparent_1px)]'
      } [background-size:40px_40px] z-0`} />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-[#4E6E49]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-[#4E6E49]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <button
            onClick={() => navigate('/application')}
            className={`flex items-center gap-2 mb-6 text-sm font-medium ${subTextColor} hover:text-[#4E6E49] transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к заявке
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4E6E49]/10 border border-[#4E6E49]/20 text-[#4E6E49] text-sm font-semibold mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ для соискателей
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 ${headingColor}`}>
              Ответы на частые <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-500/80">
                вопросы
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Узнайте больше о вступлении в сообщество ARCA перед подачей заявки
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={expandedFaq === index}
              onClick={() => handleFaqToggle(index)}
            />
          ))}
        </div>
      </div>

      {/* Question Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-12">
        <div className={`max-w-2xl mx-auto rounded-3xl p-8 border ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-gray-200'
        }`}>
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-black mb-2 ${headingColor}`}>
              Остались вопросы?
            </h2>
            <p className={subTextColor}>
              Задайте свой вопрос — мы ответим вам лично
            </p>
          </div>

          {formSubmitted ? (
            <div className={`text-center p-6 rounded-2xl ${
              theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
            }`}>
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
              }`}>
                <Send className="w-6 h-6 text-emerald-500" />
              </div>
              <p className={`font-bold ${headingColor}`}>
                Спасибо за вопрос!
              </p>
              <p className={`text-sm mt-1 ${subTextColor}`}>
                Мы ответим вам в ближайшее время
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuestion}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Напишите ваш вопрос..."
                className={`w-full p-4 rounded-2xl border resize-none transition-all focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/10 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-[#4E6E49]'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]'
                }`}
                rows={4}
              />
              <button
                type="submit"
                disabled={!question.trim()}
                className={`w-full mt-4 py-4 px-6 rounded-2xl font-black text-lg transition-all ${
                  question.trim()
                    ? 'bg-[#4E6E49] hover:bg-[#4E6E49]/90 text-white shadow-lg shadow-[#4E6E49]/20'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Отправить вопрос
              </button>
            </form>
          )}
        </div>

        {/* Contact Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <a
            href="https://t.me/artyommedoed"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <Users className="w-4 h-4" />
            <span>Написать DM</span>
          </a>

          <a
            href="https://t.me/+n0tBXaJGGjI1NDhi"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 border border-[#4E6E49]/20 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Командный чат</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ApplicationFAQ

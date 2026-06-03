import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { ArrowLeft, Home } from 'lucide-react'
import mascotImg from '@/assets/404_mascot.png'
import CustomCursor from '@/components/CustomCursor'

export const NotFound = () => {
    const { theme } = useThemeStore()
    const navigate = useNavigate()

    return (
        <>
            <CustomCursor />
            <div className={`min-h-screen w-full flex flex-col relative overflow-hidden font-sans selection:bg-[#10b981]/30 ${theme === 'dark' ? 'bg-[#06080c] text-white' : 'bg-slate-50 text-slate-900'}`}>

                {/* Animated Background Atmosphere */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10b981]/5 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#06b6d4]/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

                    {/* Grid Overlay */}
                    <div className={`absolute inset-0 opacity-[0.03] ${theme === 'dark' ? 'invert-0' : 'invert'}`}
                        style={{
                            backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
                            backgroundSize: '80px 80px'
                        }}
                    />

                    {/* Radial Gradient for Depth */}
                    <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#06080c_100%)]' : 'bg-[radial-gradient(circle_at_50%_50%,transparent_0%,#f8fafc_100%)]'}`} />
                </div>

                {/* Header */}
                <header className="relative w-full p-8 lg:p-12 flex justify-between items-center z-50">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#06b6d4] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-110">
                            <Home className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">
                            ARCA <span className="text-[#10b981]">TEAM</span>
                        </span>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center relative z-10 px-6 sm:px-12 pb-24 lg:pb-0">
                    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                        {/* Visual Section (Mascot) */}
                        <div className="relative flex justify-center items-center order-1 lg:order-2">
                            {/* Mobile Backdrop 404 - Visible only on mobile/tablet */}
                            <div className="absolute inset-0 flex items-center justify-center lg:hidden pointer-events-none z-0">
                                <h1 className="text-[14rem] sm:text-[18rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] via-[#06b6d4] to-transparent opacity-10 select-none">
                                    404
                                </h1>
                            </div>

                            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center animate-float group z-10">

                                {/* Halo / Glow Disk */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#10b981]/15 to-transparent rounded-full blur-3xl scale-75 animate-pulse" />

                                {/* Decorative Tech Circles */}
                                <div className="absolute inset-0 border border-[#10b981]/10 rounded-full scale-90 animate-[spin_20s_linear_infinite]" />
                                <div className="absolute inset-4 border border-[#06b6d4]/5 rounded-full scale-110 animate-[spin_30s_linear_infinite_reverse]" />

                                {/* Masked Image Container - Ensures no square borders are visible */}
                                <div className="relative z-20 w-[85%] h-[85%] rounded-full overflow-hidden border border-[#10b981]/10 backdrop-blur-[2px]">
                                    <img
                                        src={mascotImg}
                                        alt="ARCA - Team Mascot"
                                        className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                                        style={{
                                            maskImage: 'radial-gradient(circle, black 65%, transparent 95%)',
                                            WebkitMaskImage: 'radial-gradient(circle, black 65%, transparent 95%)'
                                        }}
                                    />
                                    {/* Overlay to further blend edges */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_40px_20px_#06080c] pointer-events-none" />
                                </div>

                                {/* Floating Tech Badges */}
                                <div className="absolute top-10 right-0 p-3 bg-[#10b981]/10 backdrop-blur-md rounded-2xl border border-[#10b981]/20 shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                                    <div className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                                </div>
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-10 order-2 lg:order-1 mt-4 lg:mt-0">
                            <div className="relative w-full flex flex-col items-center lg:items-start">
                                {/* Desktop Backdrop 404 - Hidden on mobile */}
                                <h1 className="hidden lg:block text-[14rem] sm:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] via-[#06b6d4] to-transparent opacity-10 select-none">
                                    404
                                </h1>
                                <div className="relative lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full px-4 lg:px-0">
                                    <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight mb-2 drop-shadow-sm leading-tight">
                                        ПОТЕРЯЛИСЬ В <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#06b6d4]">ХРАНИЛИЩЕ?</span>
                                    </h2>
                                    <p className="text-base sm:text-2xl font-medium opacity-50 max-w-xl mx-auto lg:mx-0">
                                        Указанные координаты не соответствуют ни одному известному сектору в нашей инфраструктуре.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md lg:max-w-none pt-4 pb-12 lg:pb-0">
                                <button
                                    onClick={() => {
                                        const isMobile = window.innerWidth < 1024;
                                        navigate('/profile', { state: { openMenu: isMobile } });
                                    }}
                                    className="group relative flex items-center justify-center gap-4 px-12 py-6 bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] overflow-hidden"
                                >
                                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
                                    ВЕРНУТЬСЯ ДОМОЙ

                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                </button>

                                <button
                                    onClick={() => window.history.back()}
                                    className="flex items-center justify-center gap-4 px-12 py-6 border-2 border-[#10b981]/20 hover:border-[#10b981]/50 text-[#10b981] font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 hover:bg-[#10b981]/5"
                                >
                                    НАЗАД
                                </button>
                            </div>
                        </div>

                    </div>
                </main>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </>
    )
}

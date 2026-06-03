import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface SphereItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface SphereSelectorProps {
    spheres: SphereItem[];
    activeSphere: string;
    setActiveSphere: (id: string) => void;
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({
    spheres,
    activeSphere,
    setActiveSphere,
}) => {
    const { theme } = useThemeStore();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedSphere = spheres.find(s => s.id === activeSphere);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        setActiveSphere(id);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full lg:w-72" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 ${theme === 'dark'
                    ? 'bg-[#151a21]/80 border-white/5 text-gray-300 hover:border-[#4E6E49]/30'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]'
                    } shadow-xl backdrop-blur-xl group relative overflow-hidden`}
            >
                <div className="flex items-center gap-2.5 overflow-hidden relative z-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'
                        } flex-shrink-0`}>
                        {selectedSphere?.icon}
                    </div>
                    <div className="text-left min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#4E6E49]/60 leading-none mb-1">Сфера</p>
                        <span className="text-sm font-black tracking-tight truncate block">{selectedSphere?.label}</span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-[#4E6E49] transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180' : ''}`} />

                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#4E6E49]/0 via-[#4E6E49]/5 to-[#4E6E49]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

            {/* Dropdown - Unified for Mobile and Desktop */}
            {isOpen && (
                <div className={`absolute z-50 top-full mt-2 w-full min-w-[240px] rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${theme === 'dark' ? 'bg-[#1a1f26] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    <div className="p-2 space-y-1">
                        {spheres.map((sphere) => (
                            <button
                                key={sphere.id}
                                onClick={() => handleSelect(sphere.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeSphere === sphere.id
                                    ? theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'
                                    : theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeSphere === sphere.id
                                    ? 'bg-[#4E6E49]/50 text-white shadow-lg shadow-[#4E6E49]/20'
                                    : theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                                    }`}>
                                    {sphere.icon}
                                </div>
                                <span className="text-sm font-bold tracking-tight">{sphere.label}</span>
                                {activeSphere === sphere.id && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4E6E49]/50 animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

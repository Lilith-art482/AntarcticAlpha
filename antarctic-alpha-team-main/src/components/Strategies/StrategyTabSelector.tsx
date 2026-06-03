import React from 'react';
import { useThemeStore } from '@/store/themeStore';

interface StrategyItem {
    id: string | null;
    name: string;
    icon: React.ReactNode;
}

interface StrategyTabSelectorProps {
    strategies: StrategyItem[];
    activeStrategy: string | null;
    setActiveStrategy: (id: string | null) => void;
}

export const StrategyTabSelector: React.FC<StrategyTabSelectorProps> = ({
    strategies,
    activeStrategy,
    setActiveStrategy,
}) => {
    const { theme } = useThemeStore();

    return (
        <div className={`flex flex-wrap gap-2 p-1.5 rounded-xl border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-gray-50 border-gray-200'} `}>
            {strategies.map(s => (
                <button
                    key={s.id}
                    onClick={() => setActiveStrategy(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeStrategy === s.id
                        ? 'bg-[#4E6E49]/50 text-white shadow-md'
                        : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    {s.icon}
                    <span>{s.name}</span>
                </button>
            ))}
        </div>
    );
};
import React, { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingInputProps {
    currentRating: number | null; // Текущая оценка пользователя
    onRate: (rating: number) => void;
    theme: 'light' | 'dark';
    disabled?: boolean; // Для блокировки ввода оценок, если пользователь уже оценил или нет прав
}

export const RatingInput: React.FC<RatingInputProps> = ({
    currentRating,
    onRate,
    theme,
    disabled = false
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const starColor = (index: number) => {
        if (disabled) {
            return theme === 'dark' ? 'text-gray-600' : 'text-gray-300';
        }
        if (hoverRating >= index) {
            return 'text-yellow-400';
        }
        if (currentRating && currentRating >= index) {
            return 'text-yellow-500';
        }
        return theme === 'dark' ? 'text-gray-600' : 'text-gray-300';
    };

    const starFill = (index: number) => {
        if (disabled) {
            return theme === 'dark' ? 'fill-gray-700' : 'fill-gray-200';
        }
        if (hoverRating >= index) {
            return 'fill-yellow-400';
        }
        if (currentRating && currentRating >= index) {
            return 'fill-yellow-500';
        }
        return theme === 'dark' ? 'fill-gray-700' : 'fill-gray-200';
    };

    return (
        <div className="flex cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((index) => (
                <Star
                    key={index}
                    size={20}
                    className={`transition-colors duration-200 ${starColor(index)} ${starFill(index)}`}
                    onMouseEnter={() => !disabled && setHoverRating(index)}
                    onClick={() => !disabled && onRate(index)}
                />
            ))}
        </div>
    );
};

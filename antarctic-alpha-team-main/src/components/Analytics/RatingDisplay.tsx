import React from 'react'
import { Star } from 'lucide-react'

interface RatingDisplayProps {
    ratings?: { userId: string; value: number }[];
    theme: 'light' | 'dark';
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    ratings,
    theme
}) => {
    if (!ratings || ratings.length === 0) {
        return <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Нет оценок</span>
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.value, 0);
    const averageRating = (totalRating / ratings.length).toFixed(1);

    return (
        <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                {averageRating}
            </span>
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                ({ratings.length})
            </span>
        </div>
    );
};

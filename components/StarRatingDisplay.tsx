import React from 'react';

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


interface StarRatingDisplayProps {
    rating: number;
    totalStars?: number;
    size?: string;
}

const StarRatingDisplay: React.FC<StarRatingDisplayProps> = ({ rating, totalStars = 5, size = 'h-5 w-5' }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) => {
                const starIndex = i + 1;
                let starClass = 'text-gray-300';
                if (starIndex <= fullStars) {
                    starClass = 'text-yellow-400';
                }
                // Note: half-star implementation is complex with simple SVGs, rounding for now.
                // A more advanced version could use gradients or clipping masks.
                else if (starIndex === fullStars + 1 && hasHalfStar) {
                    // For simplicity, we'll just round up for display
                    if (rating - fullStars >= 0.5) {
                         starClass = 'text-yellow-400';
                    }
                }
                
                return <StarIcon key={i} className={`${size} ${starClass}`} />;
            })}
        </div>
    );
};

export default StarRatingDisplay;

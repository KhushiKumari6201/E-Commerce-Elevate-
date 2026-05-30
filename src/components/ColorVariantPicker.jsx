import { motion } from 'framer-motion';

export default function ColorVariantPicker({ 
  colors, 
  selectedColor, 
  onColorSelect, 
  size = 'md' 
}) {
  if (!colors || colors.length <= 1) return null;

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const ringClasses = {
    sm: 'ring-1 ring-offset-1',
    md: 'ring-2 ring-offset-2',
    lg: 'ring-2 ring-offset-2'
  };

  const selectedRingColor = 'ring-brand-blue';
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const ringClass = ringClasses[size] || ringClasses.md;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {colors.map((color, idx) => {
        const isSelected = selectedColor?.name === color.name;
        const isAvailable = color.isAvailable !== false;

        return (
          <div key={idx} className="relative">
            <motion.button
              type="button"
              disabled={!isAvailable}
              onClick={() => onColorSelect(color)}
              whileHover={isAvailable ? { scale: 1.1 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              className={`
                relative rounded-full transition-all focus:outline-none overflow-hidden
                ${sizeClass}
                ${color.class || ''}
                ${isSelected ? `${ringClass} ${selectedRingColor}` : `${ringClass} ring-transparent`}
                ${isAvailable ? 'cursor-pointer hover:shadow-sm' : 'opacity-40 cursor-not-allowed'}
              `}
              style={color.hex ? { backgroundColor: color.hex } : {}}
              title={`${color.name}${isAvailable ? '' : ' (Out of Stock)'}`}
            >
              {/* Diagonal Slash for Out of Stock Variants */}
              {!isAvailable && (
                <svg
                  className="absolute inset-0 w-full h-full text-red-500 opacity-80 pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="100"
                    x2="100"
                    y2="0"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

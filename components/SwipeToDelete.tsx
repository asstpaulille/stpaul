import React, { useState, useRef, PointerEvent } from 'react';
import { Trash } from './Icons';

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
}

const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({ children, onDelete }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const [translateX, setTranslateX] = useState(0);

  const buttonWidth = 80;

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    isSwiping.current = true;
    startX.current = e.clientX;
    itemRef.current?.style.setProperty('transition', 'none');
    itemRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isSwiping.current) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    if (diff > 0) { // Only allow swiping to the right
        setTranslateX(Math.min(diff, buttonWidth + 20));
    }
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    itemRef.current?.style.removeProperty('transition');
    itemRef.current?.releasePointerCapture(e.pointerId);

    if (translateX > buttonWidth / 2) {
      setTranslateX(buttonWidth);
    } else {
      setTranslateX(0);
    }
  };
  
  const handleDeleteClick = () => {
    onDelete();
    setTranslateX(0);
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full flex items-center justify-center bg-red-500 text-white rounded-lg"
        style={{ width: `${buttonWidth}px` }}
        aria-hidden="true"
      >
        <button
          onClick={handleDeleteClick}
          className="flex flex-col items-center justify-center w-full h-full text-white font-bold"
          tabIndex={translateX < buttonWidth ? -1 : 0}
        >
          <Trash className="w-5 h-5 mb-1" />
          <span>Supprimer</span>
        </button>
      </div>
      <div
        ref={itemRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full bg-gray-50 relative touch-pan-y"
        style={{ transform: `translateX(${translateX}px)`, transition: 'transform 0.3s ease' }}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeToDelete;

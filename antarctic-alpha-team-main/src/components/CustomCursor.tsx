import { useEffect, useRef, useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const { isDesktop, hasTouchScreen } = useDeviceDetection();

  useEffect(() => {
    // Показываем кастомный курсор только на десктопах (ПК, ноутбуки)
    // На планшетах и телефонах используется стандартный курсор (палец/тач)
    if (isDesktop) {
      document.body.style.cursor = 'none';
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Проверяем, наведён ли курсор на интерактивный элемент
      const element = document.elementFromPoint(e.clientX, e.clientY);
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], .strategy-card, .nav-chip, .pill, .glass-panel, .section-card'
      );
      
      let isInteractive = false;
      interactiveElements.forEach(el => {
        if (el.contains(element) || el === element) {
          isInteractive = true;
        }
      });
      
      setIsHovering(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDesktop]);

  // Не рендерим курсор на планшетах, телефонах и устройствах с тачскрином
  // (iPad, Surface, другие гибридные устройства)
  if (!isDesktop || hasTouchScreen) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x - 16,
        top: position.y - 16,
        transform: isClicking ? 'scale(0.9)' : 'scale(1)',
        transition: 'transform 0.1s ease',
      }}
    >
      {/* SVG персонажа */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        className={isHovering ? 'drop-shadow-[0_0_8px_rgba(78,110,73,0.6)]' : ''}
        style={{
          filter: isHovering ? 'brightness(1.1)' : 'none',
          transition: 'filter 0.15s ease',
        }}
      >
        <ellipse cx="32" cy="38" rx="18" ry="22" fill="#4E6E49" />
        <ellipse cx="32" cy="40" rx="10" ry="16" fill="white" />
        <circle cx="32" cy="20" r="12" fill="#4E6E49" />
        <circle cx="28" cy="18" r="2.5" fill="white" />
        <circle cx="36" cy="18" r="2.5" fill="white" />
        <circle cx="28" cy="18" r="1.2" fill="black" />
        <circle cx="36" cy="18" r="1.2" fill="black" />
        <path d="M32 22 L28 26 L32 28 L36 26 Z" fill="#FFA500" />
        <ellipse cx="22" cy="58" rx="6" ry="3" fill="#FFA500" />
        <ellipse cx="42" cy="58" rx="6" ry="3" fill="#FFA500" />
        <ellipse cx="14" cy="38" rx="4" ry="12" fill="#4E6E49" transform="rotate(-20 14 38)" />
        <ellipse cx="50" cy="38" rx="4" ry="12" fill="#4E6E49" transform="rotate(20 50 38)" />
      </svg>
      
      {/* Индикатор клика */}
      <div
        className={`absolute inset-0 rounded-full bg-[#4E6E49] transition-opacity duration-150 ${
          isClicking ? 'opacity-30' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default CustomCursor;

import React, { useState, useRef, useEffect } from 'react';
import { usePopper } from 'react-popper';

interface TooltipProps {
  tooltip: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip, children }) => {
  const [visible, setVisible] = useState(false);
  const referenceRef = useRef<HTMLSpanElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
    placement: 'right',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8], // Moves the tooltip 8px to the right from the element
        },
      },
    ],
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (referenceRef.current && !referenceRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [referenceRef]);

  return (
    <>
      <span ref={referenceRef} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {children}
      </span>
      {visible && (
        <div ref={popperRef} style={{ ...styles.popper, zIndex: 9999 }} {...attributes.popper}>
          <div style={{ backgroundColor: 'white', border: '1px solid black', padding: '8px', borderRadius: '4px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)' }}>
            {tooltip}
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;
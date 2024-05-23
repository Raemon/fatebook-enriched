import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';

export const Tooltip = ({ children, tooltip, display="inline-block" }:{
  children:React.ReactNode, 
  tooltip:React.ReactNode|string,
  display?:'block'|'inline-block'|'inline'
}) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  const { styles, attributes } = usePopper(buttonRef.current, tooltipRef.current);

  const tooltipStyle = {
    ...styles.popper,
    zIndex: 9999,
    // You can add other styles such as background, color etc.
    backgroundColor: 'rgba(0,0,0,1)',
    color: 'white',
    padding: 6,
    borderRadius: 4,
    fontSize: 12,
    maxWidth: 300,
    display: 'inline-block',
  };

  let timeoutId: NodeJS.Timeout|null = null;

  const showTooltip = () => {
    setVisible(true);
  }

  const hideTooltip = () => {
    timeoutId = setTimeout(() => {
      setVisible(false);
    }, 100);  // delay in milliseconds
  }

  const clearHideTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  return (
    <>
      <div
        ref={buttonRef}
        onMouseEnter={showTooltip}
        onMouseOver={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ display: display }}
      >
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          style={tooltipStyle}
          {...attributes.popper}
          // onMouseOver={clearHideTimeout}
          // onMouseLeave={hideTooltip}
        >
          {tooltip}
        </div>
      )}
    </>
  )
}

export default Tooltip;

import { Placement } from '@popperjs/core';
import { useState, cloneElement } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';

const Tooltip = ({
  children,
  content,
  placement = "top-start"
}: {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: Placement
}): JSX.Element => {

  const [visible, setVisible] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
  });

  // Clone the child element to attach ref and event handlers
  const child = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      setReferenceElement(node);
      // Call the original ref, if any
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
  });

  return (
    <>
      {child}
      {visible &&
        createPortal(
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
            className="bg-white border border-gray-200 rounded-md shadow-lg p-2 text-sm max-w-sm z-50"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;

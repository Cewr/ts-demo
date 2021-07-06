import React, { ReactElement, useEffect, useState, useRef } from 'react';
import './index.css';
import { getIn } from '../../utils';
import cx from 'classnames';

interface Props {
  height?: number;
  noScrolling?: boolean;
  className?: string;
  style?: any;
  spacing?: number;
  children: ReactElement;
}

export default function Roll({
  className,
  style,
  height = 70,
  spacing = 20,
  children,

  noScrolling = false,
}: Props): ReactElement {
  const [mainHeight, setMainHeight] = useState<number | false>(false);
  const [showBarBg, setShowBarBg] = useState<boolean>(false);

  const [barHeight, setBarHeight] = useState<string>('');
  const [barTop, setBarTop] = useState<string>('0%');

  const [contTop, setContTop] = useState<number>(0);

  const barBg = useRef(null);
  const bar = useRef(null);
  const container = useRef(null);
  const cont = useRef(null);

  useEffect(() => {
    if (!noScrolling) return;
    // @ts-ignore
    [...(document.getElementsByClassName('no_scrolling') || [])].forEach((item) => {
      item?.addEventListener?.(
        'wheel',
        (e: Event) => {
          e.preventDefault();
        },
        false,
      );
    });
  }, [noScrolling]);

  useEffect(() => {
    setContTop(0);
    setBarTop('0%');

    const contHeight = getIn(cont, ['current', 'clientHeight'], 0);
    if (height >= contHeight) {
      setMainHeight(contHeight);
      setShowBarBg(false);
    } else {
      setMainHeight(false);
      setShowBarBg(true);
      setBarHeight(`${((height / contHeight) * 100).toFixed(3)}%`);
    }
  }, [children, height]);

  return (
    <div
      ref={container}
      className={cx('roll-container', className || '', { no_scrolling: noScrolling })}
      style={{ ...style, height: mainHeight || height }}
    >
      <div className="roll-bar-bg" ref={barBg} style={{ display: showBarBg ? 'block' : 'none' }}>
        <div className="roll-bar" ref={bar} style={{ height: barHeight, top: barTop }} />
      </div>

      <div
        className="roll-cont"
        ref={cont}
        style={{ top: contTop }}
        onWheel={(e) => {
          if (!showBarBg) return;
          const contHeight = getIn(cont, ['current', 'clientHeight'], 0);
          const containerHeight = getIn(container, ['current', 'clientHeight'], 0);

          const x = contTop - (e?.deltaY > 0 ? spacing : -spacing);
          const x2 = `${((-x / contHeight) * 100).toFixed(3)}%`;

          if (x < -contHeight + containerHeight - spacing || x > 0) return;

          setContTop(x);
          setBarTop(x2);
        }}
      >
        {children}
      </div>
    </div>
  );
}

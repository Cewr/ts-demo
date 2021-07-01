import { getIn } from '../../utils';
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import './index.less';
import cx from 'classnames';

interface Props {
  className?: string;
  style?: any;
  height?: number;
  children: ReactElement;
}

export default function Roll({ className, style, height, children }: Props): ReactElement {
  const [mainHeight, setMainHeight] = useState<number | false>(false);
  const [showBarBg, setShowBarBg] = useState<boolean>(false);

  const [barHeight, setBarHeight] = useState<string>('');
  const [barTop, setBarTop] = useState<string>('0%');

  const main = useRef(null);
  const barBg = useRef(null);
  const bar = useRef(null);
  const container = useRef(null);
  const cont = useRef(null);

  useEffect(() => {
    const containerHeight = getIn(container, ['current', 'clientHeight'], 0);
    const contHeight = getIn(cont, ['current', 'clientHeight'], 0);

    if (containerHeight >= contHeight) {
      setShowBarBg(false);
      setMainHeight(contHeight);
    } else {
      setMainHeight(false);
      setShowBarBg(true);
      setBarHeight(`${(containerHeight / contHeight) * 100}%`);
    }
  });

  return (
    <div
      ref={main}
      className={cx('roll-main', className)}
      style={{ ...style, height: mainHeight === false ? height : mainHeight }}
    >
      <div className="roll-bar-bg" ref={barBg} style={{ display: showBarBg ? 'block' : 'none' }}>
        <div className="roll-bar" ref={bar} style={{ height: barHeight, top: barTop }} />
      </div>
      <div className="roll-container" ref={container}>
        <div
          className="roll-cont"
          ref={cont}
          onWheel={() => {
            const contHeight = getIn(cont, ['current', 'clientHeight'], 0);
            const scrollTop = getIn(container, ['current', 'scrollTop'], 0);
            setBarTop(`${(scrollTop / contHeight) * 100}%`);
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

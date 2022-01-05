import React, { ReactElement, useState } from 'react'
import './style.scss'
import cx from 'classnames'


export default function Chess(): ReactElement {
    const ls = [];
    let num = 15 * 15;
    while (num--) {
        ls.push(num)
    }

    const [list, setList] = useState<(number | 'white' | 'black')[]>(ls);
    const [colorType, setColorType] = useState<'' | 'white' | 'black'>('black');

    return (
        <div className='chess'>
            <div className="bg">
                <div className={cx("chess-white", { fall: colorType === 'white' })}></div>
                <div className={cx("chess-black", { fall: colorType === 'black' })}></div>
                <div className="reseau">
                    {list.map((item, idx) => (
                        <div
                            key={idx}
                            className="reseau-lattice"
                            onClick={() => {
                                if (typeof item !== 'string' && colorType) {
                                    const arr = JSON.parse(JSON.stringify(list))
                                    arr[idx] = colorType
                                    setList(arr)
                                    setColorType(colorType === 'black' ? 'white' : 'black')
                                }
                            }}
                        >
                            {typeof item === 'string' && <div className={item}></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

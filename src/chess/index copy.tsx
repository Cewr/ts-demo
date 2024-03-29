import React, { ReactElement, useState, useEffect } from 'react'
import './style.scss'
import cx from 'classnames'

const ls: number[] = [];
let num = 15 * 15;
while (num--) {
    ls.push(num)
}

type ItemType = number | 'white' | 'black';
type ColorType = 'white' | 'black';

// const url = 'http://10.5.84.50:3000/data';
const url = 'http://127.0.0.1:8000/service/chess/';
const fetchApi = (data?: { turn: ColorType, diff: number, win: boolean, list: string }) => (
    fetch(url, {
        method: data ? 'post' : 'get',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined
    }).then(res => res.json()).catch((e) => console.log('e>>>>>', e))
)

const checkWin = (list: ItemType[], index: number) => {
    const win_black = 'black,black,black,black,black';
    const win_white = 'white,white,white,white,white';
    const size = 15;

    const x = index % size;
    const y = (index - x) / size;

    // ——
    const ls_a: ItemType[] = [];
    // |
    const ls_b: ItemType[] = [];
    // \
    const ls_c: ItemType[] = [];
    // /
    const ls_d: ItemType[] = [];

    // ------------------------------------------------------------------
    const arr: number[][] = []
    let origin_x = x > y ? x - y : 0
    let origin_y = x < y ? y - x : 0
    while (origin_x < size && origin_y < size) {
        arr.push([origin_x, origin_y])
        origin_x++
        origin_y++
    }

    const arr2: number[][] = []
    let origin_x2 = x - (14 - y) < 0 ? 0 : x - (14 - y);
    let origin_y2 = x - (14 - y) > 0 ? 14 : x + y;
    while (origin_x2 < size && origin_y2 >= 0) {
        arr2.push([origin_x2, origin_y2])
        origin_x2++
        origin_y2--
    }
    // ------------------------------------------------------------------

    list.forEach((item, idx) => {
        const x2 = idx % size;
        const y2 = (idx - x2) / size;

        if (y2 === y) ls_a.push(item);
        if (x2 === x) ls_b.push(item);

        arr.forEach(l => {
            const x3 = l[0];
            const y3 = l[1];
            if (x2 === x3 && y2 === y3) ls_c.push(item)
        })
        arr2.forEach(l => {
            const x4 = l[0];
            const y4 = l[1];
            if (x2 === x4 && y2 === y4) ls_d.push(item)
        })
    })

    return (
        ls_a.join().includes(win_black) || ls_a.join().includes(win_white) ||
        ls_b.join().includes(win_black) || ls_b.join().includes(win_white) ||
        ls_c.join().includes(win_black) || ls_c.join().includes(win_white) ||
        ls_d.join().includes(win_black) || ls_d.join().includes(win_white)
    )
}

export default function Chess(): ReactElement {
    const [list, setList] = useState<ItemType[]>(ls);
    const [colorType, setColorType] = useState<ColorType>('black');
    const [diff, setDiff] = useState<number>(-1);
    const [isOver, setIsOver] = useState<ColorType | false>(false)

    useEffect(() => {
        fetchApi({ turn: 'black', diff: -1, win: false, list: ls.join() })
    }, [])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            fetchApi().then(res => {
                const { turn, diff: diff2, win, list = [] } = res || {};
                setList(list)
                turn !== colorType && setColorType(turn);
                diff2 !== diff && setDiff(diff2);
                win !== isOver && setIsOver(win && turn)
            })
        }, 1000);
        return () => {
            window.clearTimeout(timer)
        }
    }, [list, colorType, diff, isOver])

    return (
        <div className='chess'>
            <div className="bg">
                <div className={cx("chess-white", { fall: colorType === 'white' })} />
                <div className={cx("chess-black", { fall: colorType === 'black' })} />

                {isOver && <div className="result">
                    <div className='tips'>
                        <div>
                            {{
                                'black': '黑',
                                'white': '白',
                            }[isOver]}棋 胜利
                        </div>
                        <button
                            onClick={() => {
                                setIsOver(false)
                                setList(ls)
                                setColorType('black');
                                setDiff(-1)

                                fetchApi({ turn: 'black', diff: -1, win: false, list: ls.join() });
                            }}
                        >
                            确定
                        </button>
                    </div>
                </div>}

                <div className="reseau">
                    {list.map((item, idx) => (
                        <div
                            key={idx}
                            className={cx("reseau-lattice", { exist: isNaN(item as number) })}
                            onClick={() => {
                                if (!isNaN(item as number) && colorType) {
                                    const arr = JSON.parse(JSON.stringify(list));
                                    arr[idx] = colorType;

                                    const c = colorType === 'black' ? 'white' : 'black';
                                    const win = checkWin(arr, idx)

                                    setList(arr);
                                    setColorType(c);
                                    setDiff(idx)
                                    win && setIsOver(colorType)

                                    fetchApi({
                                        turn: win ? colorType : c,
                                        diff: idx,
                                        win,
                                        list: arr.join(),
                                    })
                                }
                            }}
                        >
                            {typeof item === 'string' && <div className={item}>
                                {diff === idx && <div className="diff" />}
                            </div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

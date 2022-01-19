import React, { ReactElement, useState, useEffect } from 'react'
import './style.scss'
import cx from 'classnames'

const ls: number[] = [];
let num = 15 * 15;
while (num--) {
    ls.push(num)
}

interface DataType {
    win: boolean,
    diff: number,
    turn: 'white' | 'black',
    list: (number | 'white' | 'black')[]
}
const initData: DataType = {
    win: false,
    diff: -1,
    turn: 'black',
    list: ls
}


const checkWin = (list: DataType["list"], index: number) => {
    const win_black = 'black,black,black,black,black';
    const win_white = 'white,white,white,white,white';
    const size = 15;

    const x = index % size;
    const y = (index - x) / size;

    // ——
    const ls_a: DataType['list'] = [];
    // |
    const ls_b: DataType['list'] = [];
    // \
    const ls_c: DataType['list'] = [];
    // /
    const ls_d: DataType['list'] = [];

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
    const [originData, setOriginData] = useState<DataType>(initData);

    const [mySocket, setMySocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        if ("WebSocket" in window) {
            // 打开一个 web socket
            var ws = new WebSocket("ws://127.0.0.1:5678");
            // 连接建立后的回调函数
            ws.onopen = function () {
                // Web Socket 已连接上，使用 send() 方法发送数据
                console.log('onopen>>>>>')
                ws.send(JSON.stringify(initData));
            };

            // 接收到服务器消息后的回调函数
            ws.onmessage = function (evt) {
                var received_msg = evt.data;
                console.count('count')
                if (received_msg.indexOf("sorry") === -1) {
                    const msg = JSON.parse(received_msg)

                    console.log('msg>>>>>', msg.diff)

                    if ('diff' in msg) setOriginData(msg)
                }
            };

            // 连接关闭后的回调函数
            ws.onclose = function () {
                // 关闭 websocket
                alert("连接已关闭...");
            };
            setMySocket(ws)
        }
        else {
            // 浏览器不支持 WebSocket
            console.log("您的浏览器不支持 WebSocket!");
        }
    }, [])

    const { win, diff, turn, list } = originData

    return (
        <div className='chess'>
            <div className="bg">
                <div className={cx("chess-white", { fall: turn === 'white' })} />
                <div className={cx("chess-black", { fall: turn === 'black' })} />

                {win && <div className="result">
                    <div className='tips'>
                        <div>
                            {{
                                'black': '黑',
                                'white': '白',
                            }[turn]}棋 胜利
                        </div>
                        <button
                            onClick={() => {
                                setOriginData(initData)
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
                                if (!isNaN(item as number)) {
                                    const arr = JSON.parse(JSON.stringify(list));
                                    arr[idx] = turn;

                                    const win = checkWin(arr, idx)
                                    const c = win ? turn : (turn === 'black' ? 'white' : 'black');
                                    setOriginData({
                                        turn: c,
                                        diff: idx,
                                        list: arr,
                                        win
                                    })
                                    try {
                                        mySocket?.send(JSON.stringify({
                                            turn: c,
                                            diff: idx,
                                            list: arr,
                                            win
                                        }))
                                    }
                                    catch (e) {
                                        alert(e)
                                    }
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

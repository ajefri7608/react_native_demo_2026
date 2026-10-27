import { colors } from '../../../shared/theme/colors';

export const PATHS = [
  {
    key: 'promise',
    title: 'Promise',
    tint: colors.promise,
    body: '元件自己 await。結束後 dispatch 普通 action。reducer 不收 Promise。',
  },
  {
    key: 'thunk',
    title: 'Thunk',
    tint: colors.thunk,
    body: 'dispatch 一個函式。middleware 可以 getState、await，再 dispatch 普通 action。',
  },
  {
    key: 'saga',
    title: 'Saga',
    tint: colors.saga,
    body: 'dispatch 普通 action。watcher 跑 worker，call、race，再 put 同一個 action。',
  },
] as const;

export type PathKey = (typeof PATHS)[number]['key'];

export const PATH_ROWS: Record<PathKey, { id: string; title: string; body: string }[]> =
  {
    promise: [
      { id: 'await', title: 'await 留在元件', body: '這條路沒有 middleware。' },
      { id: 'then', title: '結束才 dispatch', body: '送出的是普通 action。' },
      { id: 'reducer', title: 'reducer 不收 Promise', body: '它只看到已經算出來的值。' },
      { id: 'unmount', title: '卸載後仍可能回來', body: '元件要自己決定還要不要寫。' },
      { id: 'catch', title: '失敗要自己接', body: '沒有 extraReducers 會幫你分派。' },
      { id: 'loading', title: 'loading 自己記', body: '畫面狀態留在這次呼叫裡。' },
      { id: 'order', title: '後發可能先至', body: '兩次呼叫不會自動排隊。' },
      { id: 'state', title: '不要把 Promise 放進 state', body: '畫面只留已經算出來的值。' },
      { id: 'cancel', title: '卸載不會取消', body: '回來的 dispatch 要自己擋。' },
      { id: 'same', title: '還是同一顆 reducer', body: '讀取頁看不出這條路。' },
    ],
    thunk: [
      { id: 'fn', title: 'dispatch 一個函式', body: 'middleware 負責執行它。' },
      { id: 'state', title: '可以 getState', body: '讀的是按下當下的 draft。' },
      { id: 'again', title: '再 dispatch 普通 action', body: 'reducer 還是唯一改 state 的地方。' },
      { id: 'await', title: 'await 在 thunk 裡', body: '元件不用自己等。' },
      { id: 'async', title: 'createAsyncThunk', body: 'pending、fulfilled 走 extraReducers。' },
      { id: 'race', title: 'Promise.race 不取消輸家', body: '慢的那個仍可能再寫一次。' },
      { id: 'return', title: 'dispatch 回傳 Promise', body: '元件可以選擇等，也可以不等。' },
      { id: 'latest', title: 'getState 是當下的值', body: '不是按下按鈕時的閉包。' },
      { id: 'reducer', title: 'reducer 裡不能 await', body: '等待只發生在 thunk。' },
      { id: 'unmount', title: '卸載後仍會寫', body: 'store 不跟著元件一起拆。' },
    ],
    saga: [
      { id: 'action', title: 'dispatch 普通 action', body: '元件不碰 Promise。' },
      { id: 'watch', title: 'watcher 用 takeLatest', body: '新的請求會取消上一輪。' },
      { id: 'call', title: 'worker 裡 call', body: '等 API，再 put 同一個 action。' },
      { id: 'race', title: 'race 會取消輸家', body: '被取消的 task 不會再 put。' },
      { id: 'fork', title: '兩條 watcher 都要 fork', body: 'takeLatest 不會自己結束。' },
      { id: 'put', title: 'put 進同一顆 reducer', body: '讀取頁分不出來源，只看到值。' },
      { id: 'take', title: 'take 只收 action', body: 'worker 不直接碰元件。' },
      { id: 'delay', title: 'delay 也是 yield', body: '等待時這條 task 讓出執行。' },
      { id: 'cancel', title: '取消後不再 put', body: '被 race 丟掉的那條停在這裡。' },
      { id: 'same', title: '跟另外兩條路匯合', body: '最後都是普通 action。' },
    ],
  };

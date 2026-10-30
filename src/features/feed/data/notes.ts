export type Note = {
  id: string;
  title: string;
  body: string;
};

export const NOTES: Note[] = [
  {
    id: 'reducer',
    title: '三條路，一個 reducer',
    body: 'Promise、Thunk、Saga 只負責等到 value，再送出普通 action。真正改 state 的是 reducer。讀取頁不在乎 value 從哪條路進來，它只訂閱 store 裡的那個欄位。',
  },
  {
    id: 'static',
    title: '靜態欄位不會通知重繪',
    body: '模組裡的變數改了，已經在畫面上的頁面不會重繪。React 要靠 useState、props、Context，或 Redux 的訂閱通知。畫面上要跟著變的 value 走 store。只有這一頁用的狀態用 useState。只帶到下一頁、之後不再共用的資料用 route params。這頁的標題就是 route param。',
  },
  {
    id: 'selector',
    title: 'selector 指到哪一層',
    body: 'store 每次更新都會叫醒訂閱者，然後比對 selector 的回傳值。選 state.user.name，購物車更新不會重繪。在 selector 裡組一個新物件，每次都是新參考，每次都重繪。這種寫法要再傳 shallowEqual。貴的計算用 createSelector，輸入沒變就交回上一次的結果。',
  },
  {
    id: 'memo',
    title: 'useMemo 擋不住這次 render',
    body: 'useSelector 在 render 之前決定 store 這次更新要不要叫這個元件 render。useMemo 和 useCallback 在 render 已經開始之後，把值或函式的參考記住。子元件要有 React.memo 或 connect，穩定的參考才擋得住它。',
  },
  {
    id: 'race',
    title: 'Promise.race 守不住 store',
    body: 'Promise.race 只挑出先完成的那個。輸的 Promise 仍會跑完。它如果還 dispatch，會把已經寫進 store 的值蓋掉。Saga 的 race 會取消輸的 task，那個 task 不會再 put。寫入頁有兩顆按鈕可以對照。',
  },
];

export type FeedItem =
  | { id: 'paths'; kind: 'tabview' }
  | ({ kind: 'note' } & Note);

export const FEED_ITEMS: FeedItem[] = [{ id: 'paths', kind: 'tabview' }];

export function noteById(id: string) {
  return NOTES.find(note => note.id === id);
}

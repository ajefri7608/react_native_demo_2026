# ReactNativeDemo

React Native 0.88，New Architecture，不用 Expo。用來對照一個 value 怎麼進 store，另一頁怎麼讀到。

## 跑起來

iOS 需要先安裝 pods（這個 repo 已經跑過一次的話可略過）：

```sh
cd ios && pod install && cd ..
npm start
npm run ios
```

Android：

```sh
npm run android
```

## 環境

`npm start` 只把 JavaScript 送到手機，不選環境。環境由安裝指令寫進 `src/shared/config/activeEnv.ts`，Metro 看到檔案變了會重新打包。

| 指令 | 環境 | API |
| --- | --- | --- |
| `npm start` | 不選，沿用 activeEnv.ts | |
| `npm run android` | development（開發） | 本機埠 `8080`，host 跟 Metro 同一個 |
| `npm run android:sit` | sit（系統整合測試） | `https://sit.example.com` |
| `npm run android:uat` | uat（使用者驗收） | `https://uat.example.com` |
| `npm run android:production` | production（正式） | `https://api.example.com` |

iOS 把 `android` 換成 `ios`。網址在 `src/shared/config/env.ts`。登入頁和書庫會顯示目前的環境名稱和網址。

## 三個 tab

- **流動**：直向 FlatList，TabView 是最後一項。直向是同一條捲動：筆記先離開，Promise / Thunk / Saga 黏在頂端，接著捲的是這一頁。水平拖動才換頁。點筆記會用 navigation 推到下一頁，route param 只帶 `noteId`。
- **寫入**：Promise、Thunk、Saga、`Promise.race`、Saga `race`、`createAsyncThunk`。
- **讀取**：`useSelector` 的比對範圍、`shallowEqual`、`createSelector`、靜態欄位、`useCallback`。

跨頁要跟著變的名字在 store。只有這一頁用的輸入用元件 state 或 `draftName`。只帶到下一頁的 id 用 route params。
1
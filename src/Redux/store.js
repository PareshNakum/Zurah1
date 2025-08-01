import { configureStore } from "@reduxjs/toolkit"
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"
import Reducer from "./reducer"

// Detect if running in browser (client-side)
const isBrowser = typeof window !== "undefined"

// Persist configuration
const persistConfig = {
  key: "zurah-persist-key",
  storage: isBrowser ? storage : undefined, // Only use storage in browser
  whitelist: [
    // Specify which parts of state to persist
    "countCart",
    "storeFavCount", 
    "loginData",
    "storeCurrency",
    "HeaderLogoData",
    "DefaultBillingAddress",
    "storeEntityId",
    "storeCurrencyData",
    "logoDetail",
    "addedJewelleryProduct",
    "addedRingAndDiamond",
    "addedDiamondData",
    "zurahDiamond",
    "jeweleryDIYName",
    "jeweleryDIYimage",
    "diamondDIYName", 
    "diamondDIYimage",
    "isJewelDIY",
    "isDiamoDIY",
    "storeSelectedDiamondData",
    "storeSelectedDiamondPrice",
    "diamondShape",
    "diamondImage",
    "jewelSelectedCategory",
    "engravingObj",
    "productNameList",
    "orderDataArray",
    "diaColorType",
    "storeFirstNavData",
    "storeSecondNavData",
    "footerAllContentData"
  ],
  blacklist: [
    // Exclude temporary UI state from persistence
    "loginModal",
    "headerLoginModal", 
    "FooterLoginModal",
    "diamondPageChnages",
    "activeDiamondTabs",
    "activeDIYtabs",
    "sliderAlignment",
    "isSelected",
    "showMoreValue",
    "activeIdMenu"
  ]
}

// Create persisted reducer only in browser
const rootReducer = isBrowser 
  ? persistReducer(persistConfig, Reducer)
  : Reducer

// Store configuration
export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV !== "production",
  })

  return store
}

// Create store instance
const store = makeStore()

// Create persistor only in browser
export const persistor = isBrowser ? persistStore(store) : null

export default store

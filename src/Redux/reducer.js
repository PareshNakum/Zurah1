const initialState = {
  countCart: 0,
  storeFavCount: 0,
  loginModal: false,
  headerLoginModal: false,
  FooterLoginModal: false,
  loginData: {},
  diamondPageChnages: false,
  diamondNumber: "",
  HeaderLogoData: [],
  DefaultBillingAddress: [],
  activeDIYtabs: [],
  jeweleryDIYName: "",
  jeweleryDIYimage: "",
  diamondDIYName: "",
  diamondDIYimage: "",
  storeEntityId: {},
  isJewelDIY: false,
  isDiamoDIY: false,
  storeCurrencyData: [],
  storeCurrency: "",
  logoDetail: [],
  sliderAlignment: "",
  activeDiamondTabs: '',
  addedDiamondData: {},
  productVariantId: "",
  zurahDiamond: {},
  addedJewelleryProduct: {},
  addedRingAndDiamond: {},
  diamondParamsObj: {},
  addedJewelRing: {},
  editDiamondValue: "",
  currentShapeName: [],
  orderDataArray: [],
  engravingObj: {},
  productNameList: [],
  isSelected: true,
  isVerified: 0,
  diamondObj: {},
  addedRingData: {},
  IsSelectedDiamond: false,
  isRingSelected: false,
  storeFilteredValues: {},
  storeActiveFilteredData: {},
  storeSelectedDiamondData: {},
  storeSelectedDiamondPrice: "",
  storeSpecData: {},
  storeProdData: {},
  storeDiamondNumber: "",
  diamondShape: "",
  diamondImage: "",
  finalCanBeSetData: [],
  diamondSelectShape: {},
  jewelSelectedCategory: {},
  donationDetail: [],
  allBlogDataList: [],
  storeEmbossingData: [],
  saveEmbossings: false,
  previewImageDatas: [],
  activeImageData: [],
  DiyStepersData: [],
  DIYName: "",
  ActiveStepsDiy: 0,
  serviceAllData: [],
  otherServiceData: [],
  diaColorType: "White",
  thresholdValue: null,
  overflowItemsData: [],
  showMoreValue: false,
  storeFirstNavData: [],
  storeSecondNavData: [],
  activeIdMenu: "",
  footerAllContentData: [],
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case "countCart":
      return { ...state, countCart: action.countCart };

    case "loginModal":
      return { ...state, loginModal: action.loginModal };

    case "sliderAlignment":
      return { ...state, sliderAlignment: action.sliderAlignment };

    case "headerLoginModal":
      return { ...state, headerLoginModal: action.headerLoginModal };

    case "FooterLoginModal":
      return { ...state, FooterLoginModal: action.FooterLoginModal };

    case "logoDetail":
      return { ...state, logoDetail: action.logoDetail };

    case "loginData":
      return { ...state, loginData: action.loginData };

    case "HeaderLogoData":
      return { ...state, HeaderLogoData: action.HeaderLogoData };

    case "DefaultBillingAddress":
      return { ...state, DefaultBillingAddress: action.DefaultBillingAddress };

    case "activeDIYtabs":
      return { ...state, activeDIYtabs: action.activeDIYtabs };

    case "jeweleryDIYName":
      return { ...state, jeweleryDIYName: action.jeweleryDIYName };

    case "jeweleryDIYimage":
      return { ...state, jeweleryDIYimage: action.jeweleryDIYimage };

    case "diamondDIYName":
      return { ...state, diamondDIYName: action.diamondDIYName };

    case "diamondDIYimage":
      return { ...state, diamondDIYimage: action.diamondDIYimage };

    case "diamondPageChnages":
      return { ...state, diamondPageChnages: action.diamondPageChnages };

    case "diamondNumber":
      return { ...state, diamondNumber: action.diamondNumber };

    case "storeCurrencyData":
      return { ...state, storeCurrencyData: action.storeCurrencyData };

    case "storeCurrency":
      return { ...state, storeCurrency: action.storeCurrency };

    case "isJewelDIY":
      return { ...state, isJewelDIY: action.isJewelDIY };

    case "isDiamoDIY":
      return { ...state, isDiamoDIY: action.isDiamoDIY };

    case "storeEntityId":
      return { ...state, storeEntityId: action.storeEntityId };

    case "storeFavCount":
      return { ...state, storeFavCount: action.storeFavCount };

    case "ACTIVEDIAMONDTABS":
      return { ...state, activeDiamondTabs: action.activeDiamondTabs };

    case "ADD_JEWELLERY_PRODUCT":
      return { ...state, addedJewelleryProduct: action.payload };

    case "DIAMOND_SELECT":
      return { ...state, zurahDiamond: action.payload };

    case "ADDTORING":
      return { ...state, addedDiamondData: action.payload };

    case "SELECT_THIS_RING":
      return { ...state, addedRingAndDiamond: action.payload };

    case "SELECT_DIAMOND_PARAMS":
      return { ...state, diamondParamsObj: action.payload };

    case "SELECT_JEWEL_RING":
      return { ...state, addedJewelRing: action.payload };

    case "EDIT_RING_DIAMOND":
      return { ...state, editDiamondValue: action.payload };

    case "SET_SHAPE_NAME":
      return { ...state, currentShapeName: action.payload };

    case "SET_ORDER":
      return { ...state, orderDataArray: action.payload };

    case "ADD_ENGRAVING":
      return { ...state, engravingObj: action.payload };

    case "ADD_FILTER":
      return { ...state, productNameList: action.payload };

    case "UN_SELECT_FILTER":
      return { ...state, isSelected: action.payload };

    case "VERIFICATION_STATUS":
      return { ...state, isVerified: action.payload };

    case "ADD_TO_RING":
      return { ...state, diamondObj: action.payload };

    case "ADDTRINGDATA":
      return { ...state, addedRingData: action.payload };

    case "IsSelectedDiamond":
      return { ...state, IsSelectedDiamond: action.payload };

    case "isRingSelected":
      return { ...state, isRingSelected: action.payload };

    case "storeFilteredValues":
      return { ...state, storeFilteredValues: action.payload };

    case "storeActiveFilteredData":
      return { ...state, storeActiveFilteredData: action.payload };

    case "storeSelectedDiamondData":
      return { ...state, storeSelectedDiamondData: action.payload };

    case "storeSelectedDiamondPrice":
      return { ...state, storeSelectedDiamondPrice: action.payload };

    case "storeSpecData":
      return { ...state, storeSpecData: action.payload };

    case "storeProdData":
      return { ...state, storeProdData: action.payload };

    case "storeDiamondNumber":
      return { ...state, storeDiamondNumber: action.payload };

    case "diamondShape":
      return { ...state, diamondShape: action.payload };

    case "diamondImage":
      return { ...state, diamondImage: action.payload };

    case "finalCanBeSetData":
      return { ...state, finalCanBeSetData: action.payload };

    case "diamondSelectShape":
      return { ...state, diamondSelectShape: action.payload };

    case "jewelSelectedCategory":
      return { ...state, jewelSelectedCategory: action.payload };

    case "donationDetail":
      return { ...state, donationDetail: action.payload };

    case "allBlogDataList":
      return { ...state, allBlogDataList: action.payload };

    case "storeEmbossingData":
      return { ...state, storeEmbossingData: action.payload };

    case "saveEmbossings":
      return { ...state, saveEmbossings: action.payload };

    case "previewImageDatas":
      return { ...state, previewImageDatas: action.payload };

    case "activeImageData":
      return { ...state, activeImageData: action.payload };

    case "DiyStepersData":
      return { ...state, DiyStepersData: action.payload };

    case "DIYName":
      return { ...state, DIYName: action.payload };

    case "ActiveStepsDiy":
      return { ...state, ActiveStepsDiy: action.payload };

    case "serviceAllData":
      return { ...state, serviceAllData: action.payload };

    case "otherServiceData":
      return { ...state, otherServiceData: action.payload };

    case "diaColorType":
      return { ...state, diaColorType: action.payload };

    case "thresholdValue":
      return { ...state, thresholdValue: action.payload };

    case "overflowItemsData":
      return { ...state, overflowItemsData: action.payload };

    case "showMoreValue":
      return { ...state, showMoreValue: action.payload };

    case "storeFirstNavData":
      return { ...state, storeFirstNavData: action.payload };

    case "storeSecondNavData":
      return { ...state, storeSecondNavData: action.payload };

    case "activeIdMenu":
      return { ...state, activeIdMenu: action.payload };

    case "footerAllContentData":
      return { ...state, footerAllContentData: action.payload };

    default:
      return state;
  }
};

export default Reducer;

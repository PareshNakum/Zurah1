export const countCart = (data) => {
  return {
    type: "countCart",
    countCart: data,
  };
};

export const loginModal = (value) => {
  return {
    type: "loginModal",
    loginModal: value,
  };
};

export const headerLoginModal = (value) => {
  return {
    type: "headerLoginModal",
    headerLoginModal: value,
  };
};

export const FooterLoginModal = (value) => {
  return {
    type: "FooterLoginModal",
    FooterLoginModal: value,
  };
};

export const loginData = (data) => {
  return {
    type: "loginData",
    loginData: data,
  };
};

export const storeForgotVar = (value) => {
  return {
    type: "storeForgotVar",
    value: value,
  };
};

export const storeFavCount = (storeFavCountVal) => {
  return {
    type: "storeFavCount",
    storeFavCount: storeFavCountVal,
  };
};

export const diamondPageChnages = (value) => {
  return {
    type: "diamondPageChnages",
    diamondPageChnages: value,
  };
};

export const diamondNumber = (value) => {
  return {
    type: "diamondNumber",
    diamondNumber: value,
  };
};

export const storeEntityId = (storeEntityId) => {
  return {
    type: "storeEntityId",
    storeEntityId: storeEntityId,
  };
};

export const HeaderLogoData = (HeaderLogoData) => {
  return {
    type: "HeaderLogoData",
    HeaderLogoData: HeaderLogoData,
  };
};

export const DefaultBillingAddress = (DefaultBillingAddress) => {
  return {
    type: "DefaultBillingAddress",
    DefaultBillingAddress: DefaultBillingAddress,
  };
};
export const activeDIYtabs = (activeDIYtabs) => {
  return {
    type: "activeDIYtabs",
    activeDIYtabs: activeDIYtabs,
  };
};


export const jeweleryDIYName = (jeweleryDIYName) => {
  return {
    type: "jeweleryDIYName",
    jeweleryDIYName: jeweleryDIYName,
  };
};

export const jeweleryDIYimage = (jeweleryDIYimage) => {
  return {
    type: "jeweleryDIYimage",
    jeweleryDIYimage: jeweleryDIYimage,
  };
};
export const diamondDIYName = (diamondDIYName) => {
  return {
    type: "diamondDIYName",
    diamondDIYName: diamondDIYName,
  };
};

export const diamondDIYimage = (diamondDIYimage) => {
  return {
    type: "diamondDIYimage",
    diamondDIYimage: diamondDIYimage,
  };
};

export const isJewelDIY = (isJewelDIY) => {
  return {
    type: "isJewelDIY",
    isJewelDIY: isJewelDIY,
  };
};

export const isDiamoDIY = (isDiamoDIY) => {
  return {
    type: "isDiamoDIY",
    isDiamoDIY: isDiamoDIY,
  };
};

export const storeCurrencyData = (storeCurrencyData) => {
  return {
    type: "storeCurrencyData",
    storeCurrencyData: storeCurrencyData,
  };
}

export const storeCurrency = (storeCurrency) => {
  return {
    type: "storeCurrency",
    storeCurrency: storeCurrency,
  };
}
export const logoDetail = (value) => {
  return {
    type: "logoDetail",
    logoDetail: value,
  }
}
export const sliderAlignment = (value) => {
  return {
    type: "sliderAlignment",
    sliderAlignment: value,
  }
}

export const activeDiamondTabs = (activeTabs) => {
  return {
    type: "ACTIVEDIAMONDTABS",
    activeDiamondTabs: activeTabs,
  };
};

export const selectedDiamondObject = (data) => {
  return {
    type: "DIAMOND_SELECT",
    payload: data,
  };
};

export const selectedRingData = (data) => {
  return {
    type: "SELECT_THIS_RING",
    payload: data,
  };
};

export const selectedDiamondParams = (data) => {
  return {
    type: "SELECT_DIAMOND_PARAMS",
    payload: data,
  };
};

export const selectedJewelRing = (data) => {
  return {
    type: "SELECT_JEWEL_RING",
    payload: data,
  };
};

export const editDiamondAction = (data) => {
  return {
    type: "EDIT_RING_DIAMOND",
    payload: data,
  };
};

export const selectedDiamondShapeName = (shape_name) => {
  return {
    type: "SET_SHAPE_NAME",
    payload: shape_name
  }
}

export const orderAction = (orderData) => {
  return {
    type: "SET_ORDER",
    payload: orderData
  }
};

export const addEngravingAction = (engravingData) => {
  return {
    type: "ADD_ENGRAVING",
    payload: engravingData
  }
}

export const addFilterAction = (productArray) => {
  return {
    type: "ADD_FILTER",
    payload: productArray,
  }
}

export const SelectFilterAction = (value) => {
  return {
    type: "UN_SELECT_FILTER",
    payload: value,
  }
};

export const verificationStatusAction = (status) => {
  return {
    type: "VERIFICATION_STATUS",
    payload: status,
  }
};

export const selectDiamondAction = (obj) => {
  return {
    type: "ADD_TO_RING",
    payload: obj,
  }
};

export const addedDiamondData = (obj) => {
  return {
    type: "ADDTORING",
    payload: obj,
  }
};
export const addedRingData = (obj) => {
  return {
    type: "ADDTRINGDATA",
    payload: obj,
  }
};
export const IsSelectedDiamond = (obj) => {
  return {
    type: "IsSelectedDiamond",
    payload: obj,
  }
};
export const isRingSelected = (obj) => {
  return {
    type: "isRingSelected",
    payload: obj,
  }
};
export const storeFilteredData = (obj) => {
  return {
    type: "storeFilteredValues",
    payload: obj,
  }
};
export const storeActiveFilteredData = (obj) => {
  return {
    type: "storeActiveFilteredData",
    payload: obj,
  }
};
export const storeSelectedDiamondData = (obj) => {
  return {
    type: "storeSelectedDiamondData",
    payload: obj,
  }
};
export const storeSelectedDiamondPrice = (obj) => {
  return {
    type: "storeSelectedDiamondPrice",
    payload: obj,
  }
};
export const storeSpecData = (obj) => {
  return {
    type: "storeSpecData",
    payload: obj,
  }
};
export const storeProdData = (obj) => {
  return {
    type: "storeProdData",
    payload: obj,
  }
};
export const storeDiamondNumber = (obj) => {
  return {
    type: "storeDiamondNumber",
    payload: obj,
  }
};
export const diamondImage = (obj) => {
  return {
    type: "diamondImage",
    payload: obj,
  }
};
export const diamondShape = (obj) => {
  return {
    type: "diamondShape",
    payload: obj,
  }
};
export const finalCanBeSetData = (obj) => {
  return {
    type: "finalCanBeSetData",
    payload: obj,
  }
};
export const diamondSelectShape = (obj) => {
  return {
    type: "diamondSelectShape",
    payload: obj,
  }
};
export const jewelSelectedCategory = (obj) => {
  return {
    type: "jewelSelectedCategory",
    payload: obj,
  }
};
export const donationDetail = (obj) => {
  return {
    type: "donationDetail",
    payload: obj,
  }
};
export const allBlogDataList = (obj) => {
  return {
    type: "allBlogDataList",
    payload: obj,
  }
};
export const storeEmbossingData = (obj) => {
  return {
    type: "storeEmbossingData",
    payload: obj,
  }
};
export const saveEmbossings = (obj) => {
  return {
    type: "saveEmbossings",
    payload: obj,
  }
};
export const previewImageDatas = (obj) => {
  return {
    type: "previewImageDatas",
    payload: obj,
  }
};
export const activeImageData = (obj) => {
  return {
    type: "activeImageData",
    payload: obj,
  }
};
export const DiyStepersData = (obj) => {
  return {
    type: "DiyStepersData",
    payload: obj,
  }
};
export const DIYName = (obj) => {
  return {
    type: "DIYName",
    payload: obj,
  }
};
export const ActiveStepsDiy = (obj) => {
  return {
    type: "ActiveStepsDiy",
    payload: obj,
  }
};
export const serviceAllData = (obj) => {
  return {
    type: "serviceAllData",
    payload: obj,
  }
};
export const otherServiceData = (obj) => {
  return {
    type: "otherServiceData",
    payload: obj,
  }
};
export const diaColorType = (obj) => {
  return {
    type: "diaColorType",
    payload: obj,
  }
};
export const thresholdValue = (obj) => {
  return {
    type: "thresholdValue",
    payload: obj,
  }
};
export const overflowItemsData = (obj) => {
  return {
    type: "overflowItemsData",
    payload: obj,
  }
};
export const showMoreValue = (obj) => {
  return {
    type: "showMoreValue",
    payload: obj,
  }
};
export const storeFirstNavData = (obj) => {
  return {
    type: "storeFirstNavData",
    payload: obj,
  }
};
export const storeSecondNavData = (obj) => {
  return {
    type: "storeSecondNavData",
    payload: obj,
  }
};
export const activeIdMenu = (obj) => {
  return {
    type: "activeIdMenu",
    payload: obj,
  }
};
export const footerAllContentData = (obj) => {
  return {
    type: "footerAllContentData",
    payload: obj,
  }
};


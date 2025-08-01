import { lazy } from 'react';

export const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const splicaArrayIntoColumns = (a, n, balanced) => {
  if (n < 2)
    return [a];

  var len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  }

  else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  }

  else {

    n--;
    size = Math.floor(len / n);
    if (len % size === 0)
      size--;
    while (i < size * n) {
      out.push(a.slice(i, i += size));
    }
    out.push(a.slice(size * n));

  }

  return out;

}

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateWithOnlyLetters = (value) => {
  if (value === "") {
    return true
  }
  else {
    return String(value)
      .toLowerCase()
      .match(/^[A-Za-z]+$/);
  }
};

export const safeParse = (jsonString, fallbackValue = null) => {
  if (typeof jsonString === 'string' && jsonString.trim() !== '') {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return fallbackValue;
    }
  }
  return fallbackValue;
}

export const onlyNumbers = (value) => {
  if (value === "") {
    return true
  }
  else {
    return String(value)
      .toLowerCase()
      .match(/^[0-9]+$/);
  }
}

export const reformatDateString = (s) => {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var parts = s.split('-');
  return months[parts[1] - 1] + ' ' + Number(parts[2]) + ', ' + parts[0];
}

export const changeUrl = (text) => {
  //eslint-disable-next-line
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace(/[\s_-]+/g, '-');
}

export const isEmpty = (val) => {
  if (val === '' || val === null || val === undefined || val === 'null' || val === 'undefined') {
    return "";
  } else {
    return val
  }
}
export const jewelVertical = (val) => {
  if (val != 'DIAMO' && val != 'LGDIA' && val != 'GEDIA' && val != 'GEMST' && val != 'LGLDM' && val != 'LDIAM') {
    return true;
  } else {
    return false
  }
}

export const numberWithCommas = (val) => {
  let x = val.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
}

export const extractNumber = (str) => typeof (str) === "string" ? parseFloat(str.replace(/[^0-9.]/g, '')) : 0;

export const firstWordCapital = (string) => {
  if (isEmpty(string) !== "") {
    const arr = string.split(" ");
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ");
    return str2
  }
}

export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem(
        'page-has-been-force-refreshed'
      ) || 'false'
    );

    try {
      const component = await componentImport();
      window.localStorage.setItem(
        'page-has-been-force-refreshed',
        'false'
      );
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem(
          'page-has-been-force-refreshed',
          'true'
        );
        return window.location.reload();
      }
      throw error;
    }
  });

const localStorageId = typeof window !== "undefined" && localStorage.getItem("storeRandomId");

export const RandomId = localStorageId === null ? makeid(10) : localStorageId;

if (localStorageId === null) {
  localStorage.setItem("storeRandomId", RandomId);
}




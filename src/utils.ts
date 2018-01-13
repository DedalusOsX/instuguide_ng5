interface Array<T> {
  sum(field: T): number;
  byField(field: T): T[] | Error;
}

interface Window {
  forEach: any;
  createFormData: any;
}

interface Math {
  easeOutBounce: any;
}

Array.prototype.sum = function (field) {
  let total = 0;
  if (this instanceof Array) {
    this.map(item => total += +item[field]);
    return total;
  }
  TypeError('Please specify correct array');
  return total;
};

Array.prototype.byField = function (field) {
  if (this instanceof Array) {
    let arr = [];
    this.forEach(item => arr.push(item[field]));
    return arr;
  }
  return new TypeError('Please specify correct array');
};

// forEach method, could be shipped as part of an Object Literal/Module
let forEach = function (array, callback, scope) {
  for (let i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

// Upgrade for JSON.stringify, updated to allow arrays
(function () {
  // Convert array to object
  let covlertToObj = function (array) {
    let thisEleObj = {};
    if (typeof array == 'object') {
      for (let i in array) {
        if (i in array) {
          let thisEle = covlertToObj(array[i]);
          thisEleObj[i] = thisEle;
        }
      }
    } else {
      thisEleObj = array;
    }
    return thisEleObj;
  };
  let oldJSONStringify = JSON.stringify;

  JSON.stringify = function (input) {
    if (oldJSONStringify(input) == '[]') {
      return oldJSONStringify(covlertToObj(input));
    }
    return oldJSONStringify(input);
  };
})();

// closest method pollyfill
(function (e) {
  e.closest = e.closest || function (css) {
    let node = this;
    while (node) {
      if (node.matches(css)) {
        return node;
      } else {
        node = node.parentElement;
      }
    }
    return null;
  };
})(Element.prototype);

let easeOutBounce = function (pos) {
  if ((pos) < (1 / 2.75)) {
    return (7.5625 * pos * pos);
  }
  if (pos < (2 / 2.75)) {
    return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
  }
  if (pos < (2.5 / 2.75)) {
    return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
  }
  return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

const createFormData = (object: Object, form?: FormData, namespace?: string): FormData => {
  const formData = form || new FormData();
  let obj = Object.assign({}, object);
  for (let property in obj) {
    if (!obj.hasOwnProperty(property) || typeof obj[property] == 'undefined') {
      continue;
    }
    let brackets = '[]';
    if (!isNaN(+property)) {
      brackets = !(obj[property] instanceof File) ? '[]' : ''; // need to improve
    } else {
      brackets = `[${property}]`;
    }
    const formKey = namespace ? `${namespace}${brackets}` : property;

    if (obj[property] instanceof Date) {
      formData.append(formKey, obj[property].toISOString());
    } else if (typeof obj[property] === 'object' && !(obj[property] instanceof File) && !(obj[property] instanceof Blob)) {
      createFormData(obj[property], formData, formKey);
    } else {
      formData.append(formKey, object[property]);
    }
  }
  return formData;
};

Math.easeOutBounce = easeOutBounce;
window.forEach = forEach;
window.createFormData = createFormData;

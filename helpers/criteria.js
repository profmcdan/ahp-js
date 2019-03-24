const getArrayFrom = arrayString => {
  const tempStr = arrayString.replace(/[\[\]']+/g, "");
  let numArray = tempStr.split(",").map(val => {
    return eval(val);
  });
  return numArray;
};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function toDeci(fraction) {
  fraction = fraction.toString();
  var result,
    wholeNum = 0,
    frac,
    deci = 0;
  if (fraction.search("/") >= 0) {
    if (fraction.search("-") >= 0) {
      wholeNum = fraction.split("-");
      frac = wholeNum[1];
      wholeNum = parseInt(wholeNum, 10);
    } else {
      frac = fraction;
    }
    if (fraction.search("/") >= 0) {
      frac = frac.split("/");
      deci = parseInt(frac[0], 10) / parseInt(frac[1], 10);
    }
    result = wholeNum + deci;
  } else {
    result = fraction;
  }
  return result;
}

getSubCriteriaList = criteriaList => {
  const finalList = [];
  criteriaList.map(criteria => {
    const to = criteria.to,
      from = criteria.from,
      value = getArrayFrom(criteria.weight);
    finalList.push(tempSub);
    return null;
  });
  return finalList;
};

const getCriteriaMatrix = bid_response => {
  const criteria = bid_response.response.criteria;
  const toArray = [];
  criteria.map(crt => {
    toArray.push(crt.to);
  });

  // Get all Unique criteria list
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  const uniqueCriteria = toArray.filter(onlyUnique);
  // console.log(uniqueCriteria);

  criteria_matrix = [];
  uniqueCriteria.map(rowCrit => {
    const crt_table = [];
    uniqueCriteria.map(colCrit => {
      criteria.map(crt => {
        if (crt.from === rowCrit && crt.to === colCrit) {
          crt_table.push(getArrayFrom(crt.weight));
        }
      });
    });
    criteria_matrix.push(crt_table);
  });
  return criteria_matrix;
};

module.exports = getCriteriaMatrix;

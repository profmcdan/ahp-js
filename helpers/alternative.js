const getArrayFrom = arrayString => {
  const tempStr = arrayString.replace(/[\[\]']+/g, "");
  let numArray = tempStr.split(",").map(val => {
    return eval(val);
  });
  return numArray;
};

const getAlternativeMatrix = (
  bid_response,
  uniqueSubCriteria,
  uniqueAlternative,
) => {
  const alternatives = bid_response.response.alternative;

  const toArray = [],
    subCriteriaArray = [];
  alternatives.map(crt => {
    toArray.push(crt.alt.to);
    subCriteriaArray.push(crt.subcriteria);
  });

  // Get all Unique criteria list
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  //   const uniqueAlternative = toArray.filter(onlyUnique);
  //   const uniqueSubCriteria = subCriteriaArray.filter(onlyUnique);

  console.log(uniqueAlternative);

  let alternative_matrix = [];

  uniqueSubCriteria.map(uniqCrit => {
    const criteria_matrix = [];
    const temp_subcriteria = alternatives.filter(value => {
      return value.subcriteria === uniqCrit;
    });

    uniqueAlternative.map(rowCrit => {
      const crt_table = [];
      uniqueAlternative.map(colCrit => {
        const temp = temp_subcriteria.find(crt => {
          return crt.alt.from === rowCrit && crt.alt.to === colCrit;
        });
        if (temp) {
          crt_table.push(getArrayFrom(temp.alt.weight));
        }
      });
      if (crt_table.length > 0) {
        criteria_matrix.push(crt_table);
      }
    });
    alternative_matrix.push(criteria_matrix);
  });
  return alternative_matrix;
};

module.exports = getAlternativeMatrix;

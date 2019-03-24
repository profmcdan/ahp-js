const getCriteriaFromBid = require("./bid_details");

const getArrayFrom = arrayString => {
  const tempStr = arrayString.replace(/[\[\]']+/g, "");
  let numArray = tempStr.split(",").map(val => {
    return eval(val);
  });
  return numArray;
};

const getSubCriteriaMatrix = async (
  bid_response,
  uniqueCriteria,
  uniqueSubCriteria,
) => {
  const subcriteria = bid_response.response.subcriteria;

  const toArray = [],
    criteriaArray = [];

  subcriteria.map(crt => {
    toArray.push(crt.sub.to);
    criteriaArray.push(crt.criteria);
  });

  // Get all Unique criteria list
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  //   const uniqueSubCriteria = toArray.filter(onlyUnique);
  //   const uniqueCriteria = await getCriteriaFromBid(bid_response.bid);
  //   const uniqueCriteria = criteriaArray.filter(onlyUnique);

  //   console.log(uniqueSubCriteria);
  //   console.log();
  //   console.log(uniqueSubCriteria1);

  let sub_criteria_matrix = [];

  uniqueCriteria.map(uniqCrit => {
    const criteria_matrix = [];
    const temp_subcriteria = subcriteria.filter(value => {
      return value.criteria === uniqCrit;
    });

    uniqueSubCriteria.map(rowCrit => {
      const crt_table = [];
      uniqueSubCriteria.map(colCrit => {
        const temp = temp_subcriteria.find(crt => {
          return crt.sub.from === rowCrit && crt.sub.to === colCrit;
        });
        if (temp) {
          crt_table.push(getArrayFrom(temp.sub.weight));
        }
      });
      if (crt_table.length > 0) {
        criteria_matrix.push(crt_table);
      }
    });
    sub_criteria_matrix.push(criteria_matrix);
  });
  return sub_criteria_matrix;
};

module.exports = getSubCriteriaMatrix;

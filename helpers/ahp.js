// import _ from "lodash";
let RI_TABLE = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49]; // Look-up Table

function transpose(matrix) {
  return matrix.reduce(
    (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
    [],
  );
}

class AHP {
  constructor(
    CRITERIA,
    SUBCRITERIA,
    ALTERNATIVE,
    ALL_CRITERIA_MATRIX,
    ALL_SUB_MATRIX,
    ALL_ALTERNATIVE_MATRIX,
  ) {
    this.A = CRITERIA;
    this.SUBCRITERIA = SUBCRITERIA;
    this.ALTERNATIVE = ALTERNATIVE;
    this.ALL_CRITERIA_MATRIX = ALL_CRITERIA_MATRIX;
    this.ALL_SUB_MATRIX = ALL_SUB_MATRIX;
    this.ALL_ALTERNATIVE_MATRIX = ALL_ALTERNATIVE_MATRIX;
    this.LOCAL_WEIGHT_CRITERIA = null;
    this.SUB_GLOBAL_WEIGHTs = null;
    this.ALTERNATIVE_NAMES = null;
  }

  get_size(A) {
    var row_count = A.length;
    var row_sizes = [];
    for (var i = 0; i < row_count; i++) {
      row_sizes.push(A[i].length);
    }
    return [row_count, Math.min.apply(null, row_sizes)];
  }

  aggregate(A) {
    let ri = [];
    A.forEach(function(Ar) {
      let r1 = 1,
        r2 = 1,
        r3 = 1;
      for (let k = 0; k < Ar.length; k++) {
        r1 = r1 * Ar[k][0];
        r2 = r2 * Ar[k][1];
        r3 = r3 * Ar[k][2];
      }
      let r = [
        Math.pow(r1, 1 / Ar.length),
        Math.pow(r2, 1 / Ar.length),
        Math.pow(r3, 1 / Ar.length),
      ];
      ri.push(r);
    });
    return ri;
  }

  vector_sum_aggregate(R) {
    let r1 = 0,
      r2 = 0,
      r3 = 0;
    R.forEach(function(R_row) {
      r1 = r1 + R_row[0];
      r2 = r2 + R_row[1];
      r3 = r3 + R_row[2];
    });
    let v_sum = [1 / r1, 1 / r2, 1 / r3];
    v_sum.sort((a, b) => a - b);
    // v_sum = sorted(v_sum, (reverse = False));
    return v_sum;
  }

  find_fuzzy_weight(R, v_sum) {
    let w1 = [],
      w2 = [],
      w3 = [];
    R.forEach(function(R_row) {
      w1.push(R_row[0] * v_sum[0]);
      w2.push(R_row[1] * v_sum[1]);
      w3.push(R_row[2] * v_sum[2]);
    });
    // Note that the Order of this Result is now in Columns instead of rows for the previous functions
    let weight = [w1, w2, w3];
    weight = transpose(weight);
    // transpose = m => m[0].map((x,i) => m.map(x => x[i])
    return weight;
  }

  defuziffy(W) {
    let M = [];
    for (let l = 0; l < W[0].length; l++) {
      M.push((W[0][l] + W[1][l] + W[2][l]) / 3);
    }
    return M;
  }

  normalize(M) {
    const m_sum = M.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0);
    let M_norm = [];
    M.forEach(function(m) {
      M_norm.push(m / m_sum);
    });
    return M_norm;
  }

  eigen(M_norm) {
    let N = M_norm.length;
    let W = [];
    M_norm.forEach(function(m) {
      W.push(m / N);
    });
    return W;
  }

  multiplyMatrices(m1, m2) {
    const result = [];
    m1.forEach(row => {
      let sum = 0;
      for (let index = 0; index < row.length; index++) {
        sum += row[index] * m2[index];
      }
      result.push(sum);
    });
    return result;
  }

  get_consistency_ratio(eigenvector) {
    //  CI - Index
    // RI - Random Consistency Index
    const n = eigenvector.length;
    // //  Get A = wi/wj = eigenvector/wj
    let A = [];
    for (let i = 0; i < eigenvector.length; i++) {
      let Wr = [],
        w = eigenvector[i];
      eigenvector.forEach(function(wc) {
        Wr.push(w / wc);
      });
      A.push(Wr);
    }

    // Get A*wi
    let Awi = this.multiplyMatrices(A, eigenvector);
    // wi - eigenvector
    const sum_Awi = Awi.reduce(function(accumulator, currentValue) {
      return accumulator + currentValue;
    }, 0);
    const sum_eigenvector = eigenvector.reduce(function(
      accumulator,
      currentValue,
    ) {
      return accumulator + currentValue;
    },
    0);

    const lamda_max = (sum_Awi + 0.001) / sum_eigenvector;
    // lamda_max = lamda_max/eigenvector.length

    let CI = (lamda_max - n) / (n - 1);
    // Get RI
    if (n > 10 || n < 1) {
      n = 10;
    }

    const RI = RI_TABLE[n - 1];
    const consistency_ratio = CI / RI;
    let status = "Unacceptable";
    if (consistency_ratio < 0.1) {
      status = "Acceptable";
    }

    const data = {
      consistency_ratio,
      status,
      lamda_max,
      CI,
      RI,
    };
    return data;
  }

  evaluate_criteria() {
    //  Aggregate Criteria
    const R = this.aggregate(this.A);
    //  Vector Sum
    const v_sum = this.vector_sum_aggregate(R);
    // Get Fuzzy Weight
    const W = this.find_fuzzy_weight(R, v_sum);
    //  Defuziffy
    const M = this.defuziffy(transpose(W));
    // Normalize
    const M_norm = this.normalize(M);
    // Engenvector
    const eigenvector = this.eigen(M_norm);
    // Consistency Ratio
    const consis_ratio = this.get_consistency_ratio(eigenvector);
    return { consis_ratio, eigenvector };
  }

  evaluate_subcriteria(criterialIndex) {
    const R = this.aggregate(this.SUBCRITERIA[criterialIndex]);
    // Vector Sum
    const v_sum = this.vector_sum_aggregate(R);
    // Get Fuzzy Weight
    const W = this.find_fuzzy_weight(R, v_sum);
    // print(np.transpose(W))
    // Defuziffy
    const M = this.defuziffy(transpose(W));
    // Normalize
    const M_norm = this.normalize(M);
    // Engenvector
    const eigenvector = this.eigen(M_norm);
    // console.log(eigenvector);
    // Consistency Ratio
    const consis_ratio = this.get_consistency_ratio(eigenvector);
    // if (!this.LOCAL_WEIGHT_CRITERIA) {
    //   this.LOCAL_WEIGHT_CRITERIA = this.evaluate_criteria().eigenvector;
    // }

    const local_weight = this.LOCAL_WEIGHT_CRITERIA;
    // console.log(eigenvector);
    const sub_global_weight = eigenvector.map(eig => {
      return local_weight[criterialIndex] * eig;
    });
    return {
      consis_ratio,
      eigenvector,
      sub_global_weight,
      local_weight_criteria: local_weight[criterialIndex],
    };
  }

  evaluate_subcriteria2(sb_matrix) {
    const R = this.aggregate(sb_matrix);
    // Vector Sum
    console.log(R);
    const v_sum = this.vector_sum_aggregate(R);
    // Get Fuzzy Weight
    const W = this.find_fuzzy_weight(R, v_sum);
    // print(np.transpose(W))
    // Defuziffy
    const M = this.defuziffy(transpose(W));
    // Normalize
    const M_norm = this.normalize(M);
    // Engenvector
    const eigenvector = this.eigen(M_norm);
    // console.log(eigenvector);
    // Consistency Ratio
    const consis_ratio = this.get_consistency_ratio(eigenvector);
    // if (!this.LOCAL_WEIGHT_CRITERIA) {
    //   this.LOCAL_WEIGHT_CRITERIA = this.evaluate_criteria().eigenvector;
    // }

    const local_weight = this.LOCAL_WEIGHT_CRITERIA;
    // console.log(eigenvector);
    // const sub_global_weight = eigenvector.map(eig => {
    //   return local_weight[criterialIndex] * eig;
    // });
    return {
      consis_ratio,
      eigenvector,
      sub_global_weight: null,
      local_weight_criteria: local_weight[criterialIndex],
    };
  }

  evaluate_all_subcriteria() {
    const criteria_length = this.A.length;
    let data = [];
    for (let index = 0; criteria_length; index++) {
      const sub_data = this.evaluate_subcriteria(index);
      data.push(sub_data);
    }
    return data;
  }

  evaluate_alternative(SB_ALTERNATIVE) {
    const R = this.aggregate(SB_ALTERNATIVE);
    // Vector Sum
    const v_sum = this.vector_sum_aggregate(R);
    // Get Fuzzy Weight
    const W = this.find_fuzzy_weight(R, v_sum);
    // print(np.transpose(W))
    // Defuziffy
    const M = this.defuziffy(transpose(W));
    // Normalize
    const M_norm = this.normalize(M);
    // Engenvector
    const eigenvector = this.eigen(M_norm);
    // Consistency Ratio
    const consis_ratio = this.get_consistency_ratio(eigenvector);
    return { consis_ratio, eigenvector };
  }

  get_global_weight() {
    // this.LOCAL_WEIGHT_CRITERIA = local_weight;
    let criterial_weights = this.evaluate_criteria();
    criterial_weights = criterial_weights.eigenvector;
    let globalWeights = [];
    let numOfCriteria = this.A.length;
    for (let crt = 0; crt < numOfCriteria; crt++) {
      let sb_weights = [];
      let sb_local_weight = this.evaluate_subcriteria(crt);
      let eigenvector = sb_local_weight.eigenvector;
      eigenvector.map(eig => {
        sb_weights.push(eig * criterial_weights[crt]);
      });

      globalWeights.push(sb_weights);
    }
    return globalWeights;
  }

  get_global_weight2() {
    let criterial_weights = this.evaluate_criteria();
    criterial_weights = criterial_weights.eigenvector;
    let globalWeights = [];
    let numOfCriteria = this.A.length;
    for (let crt = 0; crt < numOfCriteria; crt++) {
      let sb_local_weight = this.evaluate_subcriteria(crt);
      globalWeights.push(sb_local_weight);
    }
    return globalWeights;
  }

  get_alternative_global_weights() {
    let sb_weights = this.get_global_weight();

    // sb_weights = np.asarray(sb_weights)   # Convert to NDARRAy
    // sb_weights = np.ndarray.flatten(sb_weights)

    let sb_weights_final = [];
    sb_weights.forEach(function(sbw) {
      sbw.forEach(function(sbw_inner) {
        sb_weights_final.push(sbw_inner);
      });
    });
    sb_weights = sb_weights_final;
    // Loop tru each of the subCriteria for the local weights of the Alternative realtive to each.

    // heck this
    // alternative_local_weights = [[] for i in range(0,
    //     len(self.evaluate_alternative(self.ALTERNATIVE[0])[1]))]
    // console.log(this.ALTERNATIVE.length);
    let alternatives = this.ALTERNATIVE;
    // alternatives = transpose(alternatives);
    let subCriteriaGlobalWeights = this.SUB_GLOBAL_WEIGHTs;
    let numOfAlternative = alternatives[0].length;
    let alternative_local_weights = [];

    alternatives.forEach(alt_mat => {
      let alt_local_weights = this.evaluate_alternative(alt_mat).eigenvector;

      const temp = [];
      for (let i = 0; i < alt_local_weights.length; i++) {
        const val = alt_local_weights[i];
        temp.push(val);
      }
      alternative_local_weights.push(temp);
    });

    // console.log(alternative_local_weights);
    // Mutiplication
    let local_weights = [...Array(numOfAlternative)].map(e => Array());
    for (let index = 0; index < subCriteriaGlobalWeights.length; index++) {
      let temp_weight = alternative_local_weights[index];
      for (let j = 0; j < temp_weight.length; j++) {
        const val = subCriteriaGlobalWeights[index] * temp_weight[j];
        local_weights[j].push(val);
      }
    }

    // Sum the arrays
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const local_weight_sum = local_weights.map(lw => {
      return lw.reduce(reducer);
    });

    // Build the Data for Table
    const alternative_list = this.ALTERNATIVE_NAMES;
    const alt_list = [];
    for (let index = 0; index < alternative_list.length; index++) {
      alt_list.push({
        name: alternative_list[index],
        weight: local_weight_sum[index],
      });
    }

    return {
      alt_local_weights: alternative_local_weights,
      alt_global_weights: local_weight_sum,
      local_weights,
      sub_global_weight: subCriteriaGlobalWeights,
      alt_list,
    };
  }

  // TODO --  Fix this for a multi-dimensional array
  get_sum(all_weights) {
    return all_weights;
  }

  get_final_aggregate(numOfDecisionMakers) {
    const global_weights = [];
    for (let i = 0; i < numOfDecisionMakers; i++) {
      const weights = get_global_weight(
        this.ALL_CRITERIA_MATRIX[i],
        this.ALL_SUB_MATRIX[i],
        this.ALL_ALTERNATIVE_MATRIX[i],
      );
      global_weights.push(weights);
    }
    // compute the average of the weights PLS CHECK THAT THIS WORKS [TODO]
    let final_weight = get_sum(global_weights) / numOfDecisionMakers;

    return final_weight;
  }

  rank_alternatives(numOfDecisionMakers) {
    let alternative_global_weights = this.get_final_aggregate(
      numOfDecisionMakers,
      this.ALL_CRITERIA_MATRIX,
      this.ALL_SUB_MATRIX,
      this.ALL_ALTERNATIVE_MATRIX,
    );
    let priority_weight = [];
    alternative_global_weights.forEach(function(each_weight) {
      priority_weight.push(sum(each_weight) / each_weight.length);
    });
    priority_weight = priority_weight.map((weight, index) => {
      return [weight, index];
    });
    priority_weight.sort((a, b) => b - a); // reverse = True
    return priority_weight;
  }

  get_qualified_alternatives(numOfDecisionMakers, threshold) {
    let priority_weights = this.rank_alternatives(
      numOfDecisionMakers,
      this.ALL_CRITERIA_MATRIX,
      this.ALL_SUB_MATRIX,
      this.ALL_ALTERNATIVE_MATRIX,
    );
    return priority_weights.slice(0, threshold);
  }

  get_final_alternative(bid_price, estimated_price, threshold) {
    const numOfDecisionMakers = ALL_CRITERIA_MATRIX.length;
    selected_alternative = this.get_qualified_alternatives(
      numOfDecisionMakers,
      this.ALL_CRITERIA_MATRIX,
      this.ALL_SUB_MATRIX,
      this.ALL_ALTERNATIVE_MATRIX,
      threshold,
    );
    let selected_index = [];
    let selected_price = [];
    selected_alternative.forEach(function(sel) {
      selected_index.push(sel[1]);
      selected_price.push(estimated_price - bid_price[sel[1]]);
    });
    let selection = Math.min(selected_price);
    let selected_index = selected_price.indexOf(Math.max(...selected_price));
    return selectedIndex;
  }

  evaluate(bid_price, estimated_price, threshold, contractors) {
    // Contractors - Names of the contractors
    const selected_contractor = this.get_final_alternative(
      bid_price,
      estimated_price,
      threshold,
    );
    selected_contractor = contractors[selected_contractor];
    return selected_contractor;
  }
}

module.exports = AHP;

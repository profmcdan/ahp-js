const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load models
const Bid = require("../models/Bid");
const Contractor = require("../models/Contractor");
const Decision = require("../models/Decision");

// Load Helpers
const getCriteriaMatrix = require("../helpers/criteria");
const getSubCriteriaMatrix = require("../helpers/sub_criteria");
const getAlternativeMatrix = require("../helpers/alternative");
const AHP = require("../helpers/ahp");

function transpose(matrix) {
  return matrix.reduce(
    (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
    [],
  );
}

const getCriteriaFromBid = bid => {
  const crit_list = [];

  bid.criteria.map(crt => {
    crit_list.push(crt._id.toString());
  });
  return crit_list;
};

const getSubCriteriaFromBid = bid => {
  const subcrit_list = [];
  bid.criteria.map(crt => {
    crt.subcriteria.map(sb => {
      subcrit_list.push(sb.title.toLowerCase());
    });
  });
  return subcrit_list;
};

const getAlternativeFromBid = bid => {
  const alt_list = [];
  bid.contractors.map(alt => {
    alt_list.push(alt.name.toLowerCase());
  });
  return alt_list;
};

const getSubCriteriaIdFromBid = bid => {
  const subcrit_list = [];
  bid.criteria.map(crt => {
    crt.subcriteria.map(sb => {
      subcrit_list.push(sb._id.toString());
    });
  });
  return subcrit_list;
};

// @desc GET Current User
// api/auth/me
// Private
router.get("/decision/:bid_id/user/:user_id", (req, res) => {
  const { bid_id, user_id } = req.params;

  Decision.findOne({
    maker: user_id,
    bid: bid_id,
  })
    .then(decision => {
      if (!decision) {
        return res.json({ error: "Response not found", statusCode: 404 });
      }
      const criteria_matrix = getCriteriaMatrix(decision);
      const sub_criteria_matrix = getSubCriteriaMatrix(decision);
      const alternative_matrix = getAlternativeMatrix(decision);
      // console.log(criteria_matrix);
      const ahpModel = new AHP(
        criteria_matrix,
        sub_criteria_matrix,
        alternative_matrix,
      );
      // console.log(ahpModel.evaluate_criteria());
      console.log(ahpModel.get_global_weight());
      // console.log(ahpModel.get_alternative_global_weights());
      // console.log(sub_criteria_matrix[0]);
      // console.log(alternative_matrix[0]);
      return res.json({
        criteria_matrix,
        sub_criteria_matrix,
        alternative_matrix,
      });
    })
    .catch(error => {
      console.log(error);
      return res.json({ error: error, statusCode: 500 });
    });
});

router.get("/decision/:id", (req, res) => {
  const { id } = req.params;

  Decision.findById(id)
    .then(async decision => {
      if (!decision) {
        return res.json({ error: "Response not found", statusCode: 404 });
      }
      const bid = await Bid.findById(decision.bid);
      const criteria_list = await getCriteriaFromBid(bid);
      const subcriteria_list = await getSubCriteriaFromBid(bid);
      const subcriteria_list_id = await getSubCriteriaIdFromBid(bid);
      const alternative_list = await getAlternativeFromBid(bid);
      //   console.log("list: ", criteria_list);

      const criteria_matrix = await getCriteriaMatrix(decision);
      const sub_criteria_matrix = await getSubCriteriaMatrix(
        decision,
        criteria_list,
        subcriteria_list,
      );
      const alternative_matrix = await getAlternativeMatrix(
        decision,
        subcriteria_list_id,
        alternative_list,
      );
      // console.log(criteria_matrix);
      const ahpModel = new AHP(
        criteria_matrix,
        sub_criteria_matrix,
        alternative_matrix,
      );
      // console.log(ahpModel.evaluate_criteria());
      //   const global_weights = ahpModel.get_global_weight();
      const criteria_aggregate = await ahpModel.aggregate(criteria_matrix);
      const criteria_aggregate_sum = await ahpModel.vector_sum_aggregate(
        criteria_aggregate,
      );
      const criteria_fuzzy_weight = await ahpModel.find_fuzzy_weight(
        criteria_aggregate,
        criteria_aggregate_sum,
      );
      const criteria_relative_non_fuzzy_weight = await ahpModel.defuziffy(
        transpose(criteria_fuzzy_weight),
      );
      const criteria_normalized = await ahpModel.normalize(
        criteria_relative_non_fuzzy_weight,
      );
      const local_weight = await ahpModel.eigen(criteria_normalized);

      const criteria_fuzzy_table = transpose([
        criteria_relative_non_fuzzy_weight,
        criteria_normalized,
        local_weight,
      ]);
      //   console.log(local_weight);
      const criteria_cr = await ahpModel.get_consistency_ratio(local_weight);

      ahpModel.LOCAL_WEIGHT_CRITERIA = local_weight;
      const subcriteria_data = await ahpModel.get_global_weight2();
      // console.log(ahpModel.get_alternative_global_weights());
      // console.log(sub_criteria_matrix[0]);
      // console.log(alternative_matrix[0]);

      return res.json({
        bid_id: decision.bid,
        criteria_matrix,
        sub_criteria_matrix,
        alternative_matrix,
        criteria_aggregate,
        criteria_aggregate_sum,
        criteria_fuzzy_weight,
        criteria_relative_non_fuzzy_weight,
        criteria_normalized,
        local_weight,
        criteria_fuzzy_table,
        criteria_cr,
        subcriteria_data,
      });
    })
    .catch(error => {
      console.log(error);
      return res.json({ error: error, statusCode: 500 });
    });
});

module.exports = router;

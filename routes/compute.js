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
      //   const global_weights = ahpModel.get_global_weight();
      const criteria_aggregate = ahpModel.aggregate(criteria_matrix);
      const criteria_aggregate_sum = ahpModel.vector_sum_aggregate(
        criteria_aggregate,
      );
      const criteria_fuzzy_weight = ahpModel.find_fuzzy_weight(
        criteria_aggregate,
        criteria_aggregate_sum,
      );
      const criteria_relative_non_fuzzy_weight = ahpModel.defuziffy(
        transpose(criteria_fuzzy_weight),
      );
      const criteria_normalized = ahpModel.normalize(
        criteria_relative_non_fuzzy_weight,
      );
      const local_weight = ahpModel.eigen(criteria_normalized);

      const criteria_fuzzy_table = transpose([
        criteria_relative_non_fuzzy_weight,
        criteria_normalized,
        local_weight,
      ]);
      const criteria_cr = ahpModel.get_consistency_ratio(local_weight);

      ahpModel.LOCAL_WEIGHT_CRITERIA = local_weight;
      const subcriteria_data = ahpModel.get_global_weight2();
      // console.log(ahpModel.get_alternative_global_weights());
      // console.log(sub_criteria_matrix[0]);
      // console.log(alternative_matrix[0]);

      return res.json({
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

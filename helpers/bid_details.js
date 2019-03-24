const mongoose = require("mongoose");

// Load models
const Bid = require("../models/Bid");

const getCriteriaFromBid = async id => {
  const crit_list = [];
  try {
    const bid = await Bid.findById(id);
    bid.criteria.map(async crt => {
      await crit_list.push(crt._id);
    });
    return crit_list;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = getCriteriaFromBid;

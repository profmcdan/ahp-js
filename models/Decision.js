const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DecisionSchema = new Schema(
	{
		maker: {
			type: Schema.Types.ObjectId,
			ref: "users"
		},
		bid: {
			type: Schema.Types.ObjectId,
			ref: "bids"
		},
		contractor: {
			type: Schema.Types.ObjectId,
			ref: "contractors"
		},
		remarks: { type: String, required: true }
	},
	{ timestamps: true }
);

const Decision = mongoose.model("decisions", DecisionSchema);
module.exports = Decision;

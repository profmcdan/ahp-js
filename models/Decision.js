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
		response: {
			criteria: [
				{
					from: String,
					to: String,
					weight: String
				}
			],
			subcriteria: [
				{
					criteria: String,
					sub: {
						from: String,
						to: String,
						weight: String
					}
				}
			],
			alternative: [
				{
					subcriteria: String,
					alt: {
						from: String,
						to: String,
						weight: String
					}
				}
			]
		},
		remarks: { type: String }
	},
	{ timestamps: true }
);

const Decision = mongoose.model("decisions", DecisionSchema);
module.exports = Decision;

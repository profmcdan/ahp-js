const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BidSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "users"
		},
		name: { type: String, required: true },
		description: { type: String, required: true },
		activated: { type: Boolean, default: false },
		closed: { type: Boolean, default: false },
		closed_at: { type: Date },
		criteria: [
			{
				title: {
					type: String,
					required: true
				},
				subcriteria: [
					{
						title: {
							type: String,
							required: true
						},
						description: {
							type: String,
							required: true
						},
						file: {
							type: String,
							required: true
						}
					}
				]
			}
		],
		contractors: [
			{
				name: {
					type: Schema.Types.ObjectId,
					ref: "contractors"
				},
				bid_price: {
					type: String
				}
			}
		]
	},
	{ timestamps: true }
);

const Bid = mongoose.model("bids", BidSchema);
module.exports = Bid;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContractorSchema = new Schema(
	{
		company_name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
		address: { type: String, required: true },
		documents: [
			{
				name: { type: String, required: true },
				filename: { type: String }
			}
		]
	},
	{ timestamps: true }
);

const Contractor = mongoose.model("contractors", ContractorSchema);
module.exports = Contractor;

const AHPModel = require("./ahp");

const get_global_weight = (CRITERIA_MATRIX, SUB_MATRIX, ALTERNATIVE_MATRIX) => {
	const ahp = new AHPModel(CRITERIA_MATRIX, SUB_MATRIX, ALTERNATIVE_MATRIX);
	const global_weights = ahp.get_global_weight();
	const alternative_global_weights = ahp.get_alternative_global_weights();
	return alternative_global_weights;
};

const get_sum = (all_weights) => {
	return all_weights;
};

const aggregate_weights = (numOfDecisionMakers, ALL_CRITERIA_MATRIX, ALL_SUB_MATRIX, ALL_ALTERNATIVE_MATRIX) => {
	const global_weights = [];
	for (let i = 0; i < numOfDecisionMakers; i++) {
		const weights = get_global_weight(ALL_CRITERIA_MATRIX[i], ALL_SUB_MATRIX[i], ALL_ALTERNATIVE_MATRIX[i]);
		global_weights.push(weights);
	}
	// compute the average of the weights
	let final_weight = get_sum(global_weights) / numOfDecisionMakers;

	return final_weight;
};

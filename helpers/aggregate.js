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

function flatten(array) {
	var flat = [];
	for (var i = 0, l = array.length; i < l; i++) {
		var type = Object.prototype.toString.call(array[i]).split(" ").pop().split("]").shift().toLowerCase();
		if (type) {
			flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? flatten(array[i]) : array[i]);
		}
	}
	return flat;
}

function get_sum(flattenedArray) {
	var total = 0;
	for (var i = 0, l = flattenedArray.length; i < l; i++) {
		total += flattenedArray[i];
	}
	var average = total / flattenedArray.length;
	return average;
}

var A = Array(3);
for (i = 0; i < A.length; i++) {
	A[i] = new Array(2);
	for (j = 0; j < A[i].length; j++) {
		A[i][j] = i + j;
	}
}

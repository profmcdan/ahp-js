const getArrayFrom = (arrayString) => {
	const tempStr = arrayString.replace(/[\[\]']+/g, "");
	let numArray = tempStr.split(",").map((val) => {
		return eval(val);
	});
	return numArray;
};

const getSubCriteriaMatrix = (bid_response) => {
	const subcriteria = bid_response.response.subcriteria;
	const toArray = [],
		criteriaArray = [];
	subcriteria.map((crt) => {
		toArray.push(crt.sub.to);
		criteriaArray.push(crt.criteria);
	});

	// Get all Unique criteria list
	const onlyUnique = (value, index, self) => {
		return self.indexOf(value) === index;
	};
	const uniqueSubCriteria = toArray.filter(onlyUnique);
	const uniqueCriteria = criteriaArray.filter(onlyUnique);

	let sub_criteria_matrix = [];

	uniqueCriteria.map((uniqCrit) => {
		const criteria_matrix = [];
		const temp_subcriteria = subcriteria.filter((value) => {
			return value.criteria === uniqCrit;
		});
		uniqueSubCriteria.map((rowCrit) => {
			const crt_table = [];
			uniqueSubCriteria.map((colCrit) => {
				temp_subcriteria.map((crt) => {
					if (crt.sub.from === rowCrit && crt.sub.to === colCrit) {
						crt_table.push(getArrayFrom(crt.sub.weight));
					}
				});
			});
			criteria_matrix.push(crt_table);
		});
		sub_criteria_matrix.push(criteria_matrix);
	});
	console.log(sub_criteria_matrix);
	return sub_criteria_matrix;
};

module.exports = getSubCriteriaMatrix;

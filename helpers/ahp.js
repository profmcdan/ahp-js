let RI_TABLE = [ 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49 ]; // Look-up Table

class AHP {
	constructor(CRITERIA, SUBCRITERIA, ALTERNATIVE) {
		this.A = CRITERIA;
		this.SUBCRITERIA = SUBCRITERIA;
		this.ALTERNATIVE = ALTERNATIVE;
	}

	get_size(A) {
		var row_count = A.length;
		var row_sizes = [];
		for (var i = 0; i < row_count; i++) {
			row_sizes.push(A[i].length);
		}
		return [ row_count, Math.min.apply(null, row_sizes) ];
	}

	aggregate(A) {
		let ri = [];
		A.forEach(function(Ar) {
			let r1 = 1,
				r2 = 1,
				r3 = 1;
			for (let k = 0; k < Ar.length; k++) {
				r1 = r1 * Ar[k][0];
				r2 = r2 * Ar[k][1];
				r3 = r3 * Ar[k][2];
			}
			let r = [ Math.pow(r1, 1 / Ar.length), Math.pow(r2, 1 / Ar.length), Math.pow(r3, 1 / Ar.length) ];
			ri.push(r);
		});
		return ri;
	}

	vector_sum_aggregate(R) {
		let r1 = 0,
			r2 = 0,
			r3 = 0;
		R.forEach(function(R_row) {
			r1 = r1 + R_row[0];
			r2 = r2 + R_row[1];
			r3 = r3 + R_row[2];
		});
		let v_sum = [ 1 / r1, 1 / r2, 1 / r3 ];
		v_sum.sort((a, b) => a - b);
		// v_sum = sorted(v_sum, (reverse = False));
		return v_sum;
	}

	find_fuzzy_weight(R, v_sum) {
		let w1 = [],
			w2 = [],
			w3 = [];
		R.forEach(function(R_row) {
			w1.push(R_row[0] * v_sum[0]);
			w2.push(R_row[1] * v_sum[1]);
			w3.push(R_row[2] * v_sum[2]);
		});
		// Note that the Order of this Result is now in Columns instead of rows for the previous functions
		let weight = [ w1, w2, w3 ];
		return weight;
	}

	defuziffy(W) {
		let M = [];
		for (let l = 0; l < W[0].length; l++) {
			M.push((W[0][l] + W[1][l] + W[2][l]) / 3);
		}
		return M;
	}

	normalize(M) {
		const m_sum = M.reduce(function(accumulator, currentValue) {
			return accumulator + currentValue;
		}, 0);
		let M_norm = [];
		M.forEach(function(m) {
			M_norm.push(m / m_sum);
		});
		return M_norm;
	}

	eigen(M_norm) {
		let N = M_norm.length;
		let W = [];
		M_norm.forEach(function(m) {
			W.push(m / N);
		});
		return W;
	}

	mat_multiply(a, b) {
		var aNumRows = a.length,
			aNumCols = a[0].length,
			bNumRows = b.length,
			bNumCols = b[0].length,
			m = new Array(aNumRows); // initialize array of rows
		for (var r = 0; r < aNumRows; ++r) {
			m[r] = new Array(bNumCols); // initialize the current row
			for (var c = 0; c < bNumCols; ++c) {
				m[r][c] = 0; // initialize the current cell
				for (var i = 0; i < aNumCols; ++i) {
					m[r][c] += a[r][i] * b[i][c];
				}
			}
		}
		return m;
	}

	get_consistency_ratio(eigenvector) {
		//  CI - Index
		// RI - Random Consistency Index
		const n = eigenvector.length;
		// //  Get A = wi/wj = eigenvector/wj
		let A = [];
		for (let i = 0; i < eigenvector.length; i++) {
			let Wr = [],
				w = eigenvector[i];
			eigenvector.forEach(function(wc) {
				Wr.push(w / wc);
			});
			A.push(Wr);
		}

		// Get A*wi
		let Awi = this.mat_multiply(A, eigenvector);
		// wi - eigenvector
		const sum_Awi = Awi.reduce(function(accumulator, currentValue) {
			return accumulator + currentValue;
		}, 0);
		const sum_eigenvector = eigenvector.reduce(function(accumulator, currentValue) {
			return accumulator + currentValue;
		}, 0);
		const lamda_max = sum_Awi / sum_eigenvector;
		// lamda_max = lamda_max/eigenvector.length

		let CI = (lamda_max - n) / (n - 1);
		// Get RI
		if (n > 10 || n < 1) {
			n = 10;
		}

		const RI = RI_TABLE[n - 1];
		const consistency_ratio = CI / RI;
		let status = "Unacceptable";
		if (consistency_ratio < 0.1) {
			status = "Acceptable";
		}

		const data = {
			consistency_ratio,
			status
		};
		return data;
	}

	evaluate_criteria() {
		//  Aggregate Criteria
		const R = this.aggregate(this.A);
		//  Vector Sum
		const v_sum = this.vector_sum_aggregate(R);
		// Get Fuzzy Weight
		const W = this.find_fuzzy_weight(R, v_sum);
		//  Defuziffy
		const M = this.defuziffy(W);
		// Normalize
		const M_norm = this.normalize(M);
		// Engenvector
		const eigenvector = this.eigen(M_norm);
		// Consistency Ratio
		const consis_ratio = this.get_consistency_ratio(eigenvector);
		return { consis_ratio, eigenvector };
	}

	evaluate_subcriteria(criterialIndex) {
		const R = this.aggregate(this.SUBCRITERIA[criterialIndex]);
		// Vector Sum
		const v_sum = this.vector_sum_aggregate(R);
		// Get Fuzzy Weight
		const W = this.find_fuzzy_weight(R, v_sum);
		// print(np.transpose(W))
		// Defuziffy
		const M = this.defuziffy(W);
		// Normalize
		const M_norm = this.normalize(M);
		// Engenvector
		const eigenvector = this.eigen(M_norm);
		// Consistency Ratio
		const consis_ratio = this.get_consistency_ratio(eigenvector);
		return [ consis_ratio, eigenvector ];
	}

	evaluate_alternative(SB_ALTERNATIVE) {
		const R = this.aggregate(SB_ALTERNATIVE);
		// Vector Sum
		const v_sum = this.vector_sum_aggregate(R);
		// Get Fuzzy Weight
		const W = this.find_fuzzy_weight(R, v_sum);
		// print(np.transpose(W))
		// Defuziffy
		const M = this.defuziffy(W);
		// Normalize
		const M_norm = this.normalize(M);
		// Engenvector
		const eigenvector = this.eigen(M_norm);
		// Consistency Ratio
		const consis_ratio = this.get_consistency_ratio(eigenvector);
		return [ consis_ratio, eigenvector ];
	}
}

module.exports = AHP;

const AHP = require("ahp");
var ahpContext = new AHP();

ahpContext.addItems([ "VendorA", "VendorB", "VendorC" ]);

ahpContext.addCriteria([ "price", "functionality", "UX" ]);

//rank criteria with rank scale
ahpContext.rankCriteriaItem("price", [
	[ "VendorB", "VendorC", 1 / 2 ],
	[ "VendorA", "VendorC", 1 / 2 ],
	[ "VendorA", "VendorB", 1 ]
]);

//rank criteria with rank scale
ahpContext.rankCriteriaItem("functionality", [
	[ "VendorB", "VendorC", 1 ],
	[ "VendorA", "VendorC", 5 ],
	[ "VendorA", "VendorB", 5 ]
]);

//rank criteria with absolute rank scole
ahpContext.setCriteriaItemRankByGivenScores("UX", [ 10, 10, 1 ]);

ahpContext.rankCriteria([ [ "price", "functionality", 3 ], [ "price", "UX", 3 ], [ "functionality", "UX", 1 ] ]);

let output = ahpContext.run();
console.log(output);

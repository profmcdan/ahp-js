import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { Container } from "semantic-ui-react";
import "./App.css";
import Navbar from "./components/Home/Navbar";
import Landing from "./components/Home/Landing";
import Footer from "./components/Home/Footer";
import NewBid from "./components/Bid/NewBid";
import AddCriteria from "./components/Bid/AddCriteria";
import NewAlternative from "./components/Alternative/NewAlternative";
import EditAlternative from "./components/Alternative/EditAlternative";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import AlternativeList from "./components/Alternative/AlternativeList";
import Bids from "./components/Bid/Bids";
import BidDetail from "./components/Bid/BidDetail";
import AddSubCriteria from "./components/Bid/AddSubCriteria";
import OpenBids from "./components/Bid/OpenBids";
import CompareCriteria from "./components/Decision/CompareCriteria";
import CompareAlternative from "./components/Decision/CompareAlternative";
import BidDetails from "./components/Bid/BidDetails-User";
import CompareSubCriteria from "./components/Decision/CompareSubCriteria";

class App extends Component {
	render() {
		return (
			<Router>
				<div className="ui container">
					<Navbar />

					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/new-bid" component={NewBid} />
						<Route exact path="/add-criteria/:bid_id" component={AddCriteria} />
						<Route exact path="/alternatives" component={AlternativeList} />
						<Route exact path="/new-alternative/:bid_id" component={NewAlternative} />
						<Route exact path="/update-alternative" component={EditAlternative} />

						<Route exact path="/decision-criteria/:bid_id" component={CompareCriteria} />
						<Route exact path="/decision-alternative/:bid_id" component={CompareAlternative} />
						<Route exact path="/add-sub/:bid_id/:criteria_id" component={CompareSubCriteria} />

						<Route exact path="/bids" component={Bids} />
						<Route exact path="/bid/:id" component={BidDetail} />
						<Route exact path="/bid-user/:id" component={BidDetails} />
						<Route exact path="/bid/:bid_id/:criteria_id" component={AddSubCriteria} />
						<Route exact path="/alt/:bid_id/:contractor_id" component={EditAlternative} />

						<Route exact path="/open-bids" component={OpenBids} />
					</Switch>

					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;

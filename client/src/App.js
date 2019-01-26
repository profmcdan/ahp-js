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
import NewDecision from "./components/Decision/NewDecision";
import Bids from "./components/Bid/Bids";
import BidDetail from "./components/Bid/BidDetail";

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
						<Route exact path="/compare" component={NewDecision} />
						<Route exact path="/bids" component={Bids} />
						<Route exact path="/bid/:id" component={BidDetail} />
					</Switch>

					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;

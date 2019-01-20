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

class App extends Component {
	render() {
		return (
			<Router>
				<Container>
					<Navbar />

					<Switch>
						<Route exact path="/" component={Landing} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/new-bid" component={NewBid} />
						<Route exact path="/add-criteria" component={AddCriteria} />
						<Route exact path="/alternatives" component={AlternativeList} />
						<Route exact path="/new-alternative" component={NewAlternative} />
						<Route exact path="/update-alternative" component={EditAlternative} />
						<Route exact path="/compare" component={NewDecision} />
					</Switch>

					<Footer />
				</Container>
			</Router>
		);
	}
}

export default App;

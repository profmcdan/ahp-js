import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { Container } from "semantic-ui-react";
import "./App.css";
import Navbar from "./components/Home/Navbar";
import Landing from "./components/Home/Landing";
import Footer from "./components/Home/Footer";

class App extends Component {
	render() {
		return (
			<Router>
				<Container>
					<Navbar />

					<Switch>
						<Route exact path="/" component={Landing} />
					</Switch>

					<Footer />
				</Container>
			</Router>
		);
	}
}

export default App;

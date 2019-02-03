import React, { Component } from "react";
import { Form, Header, Button, Icon } from "semantic-ui-react";
import CompareInput from "./CompareInput";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Compare from "./Compare";

class CompareAlternative extends Component {
	constructor(props) {
		super();
		this.state = {
			bid_id: "",
			contractors: [],
			bid: null,
			pref: "",
			description: "",
			criteria_id: "",
			subcriteria: [],
			scores: []
		};
	}

	getBidDetails = () => {
		const { bid_id } = this.state;
		console.log(bid_id);
		axios
			.get(`/api/bid/${bid_id}`)
			.then((response) => {
				console.log(response);
				const bid = response.data.bid;
				const contractors = bid.contractors;
				// const the_criteria = criteria.find((crt) => crt._id === criteria_id);
				// console.log(the_criteria);
				this.setState({
					bid: bid,
					contractors
				});
				console.log(this.state);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleSelect2 = (prefValue) => {
		this.setState({ pref: prefValue });
		console.log(this.state);
	};

	handleSelect = (value, name) => {
		const from_to = name.split("_");
		const score = {};
		score.value = value;
		score.from = from_to[0];
		score.to = from_to[1];
		const OldScores = this.state.scores;
		OldScores.push(score);
		this.setState({ scores: OldScores });
		console.log(this.state);
		// console.log(e);
	};

	componentDidMount() {
		// 	const { match: { params } } = this.props;
		// 	this.setState({ bid_id: params.bid_id });
		const token = localStorage.getItem("jwtToken");
		// Decode token to get user
		if (token) {
			const decoded = jwt_decode(token);
			this.setState({ user: decoded }, () => {
				if (this.state.user) {
					// check if this user has a response for the bid already;
					const { bid_id, user } = this.state;
					const endPoint = `/api/decision/${bid_id}/${user.id}`;
					axios.get(endPoint).then((response) => {
						const resp = response.data;
						console.log(resp);
						if (resp.errors) {
							alert("There is no response for this bid from you yet, create one now");
							this.props.history.push("/open-bids");
						} else {
							// Go on
							this.setState({ decision_id: resp.decision._id }, () => {
								console.log(this.state);
							});
						}
					});
				}
			});
		} else {
			this.props.history.push(`/login`);
		}
	}

	componentWillMount() {
		this.setState({ bid_id: this.props.match.params.bid_id }, () => {
			this.getBidDetails();
		});
	}

	render() {
		const { contractors } = this.state;
		return (
			<div class="ui fluid container">
				<Header>Compare Alternatives</Header>
				<Form>
					{contractors.map((crt) => {
						const filtered_alternatives = contractors.filter((value) => {
							return value !== crt.title;
						});
						return filtered_alternatives.map((crt_right) => {
							return (
								<Form.Field key={crt._id + crt_right._id}>
									<Compare
										from_text={crt.name}
										to_text={crt_right.name}
										onHandleSelect={this.handleSelect}
										name={crt.name + "_" + crt_right.name}
									/>
								</Form.Field>
							);
						});
					})}

					<Button primary>Submit</Button>
				</Form>
			</div>
		);
	}
}

export default CompareAlternative;

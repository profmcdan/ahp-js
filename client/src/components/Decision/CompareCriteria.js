import React, { Component } from "react";
import { Form, Header, Button, Icon } from "semantic-ui-react";
import CompareInput from "./CompareInput";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Compare from "./Compare";

const mainUrl = "http://127.0.0.1:5000";
class CompareCriteria extends Component {
	constructor(props) {
		super();
		this.state = {
			bid_id: "",
			criteria: [],
			bid: null,
			pref: "",
			description: "",
			criteria_id: "",
			subcriteria: [],
			scores: [],
			user: null,
			decision_id: null
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getBidDetails = () => {
		const { bid_id } = this.state;
		const endPoint = `/api/bid/${bid_id}`;
		axios
			.get(endPoint)
			.then((response) => {
				// console.log(response);
				const bid = response.data.bid;
				const criteria = bid.criteria;
				// const the_criteria = criteria.find((crt) => crt._id === criteria_id);
				// console.log(the_criteria);
				this.setState({
					bid: bid,
					criteria
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	cleanData = (allScores, newScore) => {
		const index = allScores.findIndex((score) => score.to === newScore.to && score.from === newScore.from);
		if (index < 0) {
			allScores.push(newScore);
		} else {
			allScores.splice(index, 1);
			allScores.push(newScore);
		}
		return allScores;
	};

	handleSelect = (value, name) => {
		const from_to = name.split("_");
		const score = {};
		score.weight = value;
		score.from = from_to[0];
		score.to = from_to[1];
		if (score.to === score.from) {
			score.value = "[1,1,1]";
		}
		const OldScores = this.state.scores;
		// Clean scores for duplicates
		const newScore = this.cleanData(OldScores, score);
		this.setState({ scores: newScore });
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
		console.log(this.props.match.params.bid_id);
		this.setState({ bid_id: this.props.match.params.bid_id }, () => {
			this.getBidDetails();
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { scores, decision_id } = this.state;
		const endPoint = `/api/decision/add/${decision_id}/criteria`;

		const promises = scores.map(async (score) => {
			const formData = new FormData();
			formData.append("to", score.to);
			formData.append("from", score.from);
			formData.append("weight", score.weight);

			await axios
				.post(endPoint, formData)
				.then((response) => {
					console.log("Comparision Submitted");
					console.log(response.data);
					return response.data;
				})
				.catch((error) => {
					// alert(error);
					console.log(error);
					return error;
				});
		});
		Promise.all(promises)
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { criteria } = this.state;
		return (
			<div class="ui fluid container">
				<Header>Compare Criteria</Header>
				<Form onSubmit={this.handleSubmit}>
					{criteria.map((crt) => {
						const filtered_criteria = criteria.filter((value) => {
							return value !== crt.title;
						});
						return filtered_criteria.map((crt_right) => {
							return (
								<Form.Field key={crt._id + crt_right._id}>
									<Compare
										from_text={crt.title}
										to_text={crt_right.title}
										onHandleSelect={this.handleSelect}
										name={crt.title + "_" + crt_right.title}
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

export default CompareCriteria;

import React, { Component } from "react";
import { Form, Header, Button, Icon, Modal } from "semantic-ui-react";
import CompareInput from "./CompareInput";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Compare from "./Compare";

class CompareAlternative extends Component {
	constructor(props) {
		super();
		this.state = {
			bid_id: "",
			sub_name: "",
			contractors: [],
			bid: null,
			pref: "",
			description: "",
			criteria_id: "",
			subcriteria_id: "",
			subcriteria: [],
			scores: [],
			modalOpen: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleOpen = () => this.setState({ modalOpen: true });

	handleClose = () => this.setState({ modalOpen: false });

	renderModal = () => {
		return (
			<Modal
				trigger={<Button onClick={this.handleOpen}>Success</Button>}
				open={this.state.modalOpen}
				onClose={this.handleClose}
				basic
				size="small"
			>
				<Header icon="browser" content="Cookies policy" />
				<Modal.Content>
					<h3>Record has been successfully submitted.</h3>
				</Modal.Content>
				<Modal.Actions>
					<Button color="green" onClick={this.handleClose} inverted>
						<Icon name="checkmark" /> Close
					</Button>
				</Modal.Actions>
			</Modal>
		);
	};

	getSubCriteriaName = () => {
		const { bid, subcriteria_id } = this.state;
		const finalList = [];
		let sub_name = "";
		console.log(bid);

		bid.criteria.map((criteria) => {
			return criteria.subcriteria.map((subC) => {
				const tempSub = { text: subC.title, value: subC._id };
				finalList.push(tempSub);
				if (subC._id === subcriteria_id) {
					sub_name = tempSub.text;
					this.setState({ sub_name: sub_name });
				}
				return null;
			});
		});
		console.log(finalList);
		return finalList;
	};

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
				this.setState(
					{
						bid: bid,
						contractors
					},
					() => {
						this.getSubCriteriaName();
						console.log(this.state);
					}
				);
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
			score.weight = "[1,1,1]";
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
		this.setState(
			{ bid_id: this.props.match.params.bid_id, subcriteria_id: this.props.match.params.subcriteria_id },
			() => {
				this.getBidDetails();
				console.log(this.state);
			}
		);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { scores, decision_id, subcriteria_id } = this.state;
		const endPoint = `/api/decision/add/${decision_id}/alternative/${subcriteria_id}`;

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
				alert("Submission Successful");
				this.props.history.push(`/open-bids`);
			})
			.catch((error) => {
				console.log(error);
				alert("Submission Error");
			});
	};

	render() {
		const { contractors, sub_name } = this.state;
		return (
			<div class="ui fluid container">
				<Header>Compare Alternatives</Header>
				<Header>{sub_name}</Header>
				<Form onSubmit={this.handleSubmit}>
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

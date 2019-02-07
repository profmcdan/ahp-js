import React, { Component } from "react";
import { Header, Button, Checkbox, Icon, Card } from "semantic-ui-react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class BidDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bid_id: "",
			bid: {},
			criteria: [],
			contractors: []
		};
	}
	getBidDetails = () => {
		const { bid_id } = this.state;
		axios
			.get(`/api/bid/${bid_id}`)
			.then((bid) => {
				const returned_bid = bid.data.bid;
				this.setState({ bid: returned_bid, criteria: returned_bid.criteria, contractors: returned_bid.contractors });
			})
			.catch((error) => {
				console.log(error);
			});
	};
	componentDidMount() {
		this.setState({ bid_id: this.props.match.params.id });
		this.getBidDetails();
	}

	componentWillMount() {
		this.setState({ bid_id: this.props.match.params.id });
		// this.getBidDetails();
	}

	deleteCriteria = (id) => {
		const { bid_id } = this.state;
		confirmAlert({
			title: "Confirm Delete",
			message: "Are you sure you want to delete this Criteria.",
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						axios
							.delete(`/api/bid/${bid_id}/criteria/${id}`)
							.then((response) => {
								// slice it off from the state
								const { criteria } = this.state;
								for (var i = 0; i < criteria.length; i++) {
									if (criteria[i]._id === id) {
										criteria.splice(i, 1);
										break;
									}
								}
								this.setState({ criteria: criteria });
							})
							.catch((error) => {
								console.log(error);
							});
					}
				},
				{
					label: "No"
					// onClick: () => alert("Click No")
				}
			]
		});
	};

	deleteAlternative = (id) => {
		const { bid_id } = this.state;
		confirmAlert({
			title: "Confirm Delete",
			message: "Are you sure you want to delete this Alternative.",
			buttons: [
				{
					label: "Yes",
					onClick: () => {
						axios
							.delete(`/api/bid/${bid_id}/contractor/${id}`)
							.then((response) => {
								// slice it off from the state
								const { contractors } = this.state;
								for (var i = 0; i < contractors.length; i++) {
									if (contractors[i]._id === id) {
										contractors.splice(i, 1);
										break;
									}
								}
								this.setState({ contractors: contractors });
							})
							.catch((error) => {
								console.log(error);
							});
					}
				},
				{
					label: "No"
					// onClick: () => alert("Click No")
				}
			]
		});
	};

	render() {
		const { bid, bid_id, criteria, contractors } = this.state;
		// const { criteria, contractors } = bid;
		console.log(contractors);
		console.log(bid);
		return (
			<div className="ui container">
				<div>
					<div class="ui top segment banner">
						<div>
							<Header>Bid Details</Header>
							<h4>{bid.name}</h4>
							<h5>{bid.description}</h5>
						</div>
					</div>
				</div>
				<div className="ui grid">
					<div className="eight wide column">
						<h4 class="ui horizontal divider header">
							<i class="tag icon" />
							Criteria
						</h4>
						<Card.Group>
							{criteria.map((crt) => {
								return (
									<Card fluid color="green" key={crt._id}>
										<Card.Content>
											 <Card.Header>
												<a href={"/bid/" + bid_id + "/" + crt._id}>{crt.title}</a>
											</Card.Header>
											<Card.Meta>{crt.subcriteria.length} sub-criteria</Card.Meta>
											<Card.Description>{crt.description}</Card.Description>
										</Card.Content>
										<Card.Meta>
											<button
												className="ui red icon button"
												onClick={() => this.deleteCriteria(crt._id)}
												data-tooltip="Delete this criteria"
											>
												{" "}
												<Icon name="delete" size="large" />{" "}
											</button>
										</Card.Meta>
									</Card>
								);
							})}
						</Card.Group>

						<a className="ui primary button" href={"/add-criteria/" + bid_id}>
							Add Criteria
						</a>
					</div>

					<div className="eight wide column">
						<h4 class="ui horizontal divider header">
							<i class="tag icon" />
							Alternatives
						</h4>
						<Card.Group>
							{contractors.map((crt) => {
								return (
									<Card fluid color="green" key={crt._id}>
										<Card.Content>
											 <Card.Header>
												{" "}
												<a href={"/alt/" + bid_id + "/" + crt._id}>{crt.name}</a>{" "}
											</Card.Header>
											<Card.Meta>
												{crt.phone} / {crt.email}
											</Card.Meta>
											<Card.Description>{crt.address}</Card.Description>
										</Card.Content>
										<Card.Meta>
											<button
												className="ui red icon button"
												onClick={() => this.deleteAlternative(crt._id)}
												data-tooltip="Delete this alternative"
											>
												{" "}
												<Icon name="delete" size="large" />{" "}
											</button>
										</Card.Meta>
									</Card>
								);
							})}
						</Card.Group>
						<a className="ui primary button" href={"/new-alternative/" + bid_id}>
							Add Alternative
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default BidDetail;

import React, { Component } from "react";
import { Header, Button, Checkbox, Icon, Card } from "semantic-ui-react";
import axios from "axios";

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

	render() {
		const { bid, bid_id, criteria, contractors } = this.state;
		// const { criteria, contractors } = bid;
		console.log(contractors);
		console.log(bid);
		return (
			<div className="ui container">
				<div>
					<Header>Bid Details</Header>
					<h4>{bid.name}</h4>
					<h5>{bid.description}</h5>
				</div>
				<div className="ui grid">
					<div className="eight wide column">
						<div className="ui column">
							<Card.Group>
								{criteria.map((crt) => {
									return (
										<Card fluid color="green" key={crt._id}>
											<Card.Content>
												 <Card.Header>{crt.title}</Card.Header>
												<Card.Description>{crt.description}</Card.Description>
											</Card.Content>
										</Card>
									);
								})}
							</Card.Group>
						</div>
						<a className="ui button" href={"/add-criteria/" + bid_id}>
							Add Criteria
						</a>
					</div>

					<div className="eight wide column">
						<Card.Group>
							{contractors.map((crt) => {
								return (
									<Card fluid color="green" key={crt._id}>
										<Card.Content>
											 <Card.Header>{crt.name}</Card.Header>
											<Card.Meta>
												{crt.phone} / {crt.email}
											</Card.Meta>
											<Card.Description>{crt.address}</Card.Description>
										</Card.Content>
									</Card>
								);
							})}
						</Card.Group>
						<a className="ui button" href={"/new-alternative/" + bid_id}>
							Add Alternative
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default BidDetail;

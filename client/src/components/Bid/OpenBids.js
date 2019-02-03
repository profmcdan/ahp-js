import React, { Component } from "react";
import { Header, Button, Checkbox, Icon, Table, Dropdown } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

class OpenBids extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bids: [],
			column: null,
			direction: null
		};
	}

	componentDidMount() {
		// 	const { match: { params } } = this.props;
		// 	this.setState({ bid_id: params.bid_id });
		const token = localStorage.getItem("jwtToken");
		// Decode token to get user
		if (token) {
			const decoded = jwt_decode(token);
			this.setState({ user: decoded });
		} else {
			this.props.history.push(`/login`);
		}
	}

	componentWillMount() {
		axios
			.get("/api/bid/opened")
			.then((response) => {
				console.log(response.data);
				this.setState({ bids: response.data });
			})
			.catch((error) => {
				console.log(error);
			});
	}

	handleSort = (clickedColumn) => () => {
		const { column, bids, direction } = this.state;

		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				bids: _.sortBy(bids, [ clickedColumn ]),
				direction: "ascending"
			});

			return;
		}

		this.setState({
			bids: bids.reverse(),
			direction: direction === "ascending" ? "descending" : "ascending"
		});
	};

	handleActivate = (bid_id) => {
		const { user } = this.state;
		if (user) {
			const endPoint = `/api/decision/${bid_id}/${user.id}`;
			// alert(id);
			axios.post(endPoint).then((response) => {
				if (response.data.error) {
					alert("Response Exists Already.");
				} else if (response.data.decision) {
					alert(`Response Created Successfully.`);
				}
			});
		}
	};
	render() {
		const { bids, column, direction } = this.state;
		return (
			<div>
				<Header>Open Bids</Header>
				<Table compact selectable sortable celled definition>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell />
							<Table.HeaderCell>Bid Name</Table.HeaderCell>
							<Table.HeaderCell>Description</Table.HeaderCell>
							<Table.HeaderCell>Start Response</Table.HeaderCell>
							<Table.HeaderCell>Criteria</Table.HeaderCell>
							<Table.HeaderCell>Alternatives</Table.HeaderCell>
							<Table.HeaderCell>Sub-Criteria</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{bids.map((bid) => {
							return (
								<Table.Row key={bid._id}>
									<Table.Cell />
									<Table.Cell>
										<Link to={"/bid-user/" + bid._id}>{bid.name}</Link>
									</Table.Cell>
									<Table.Cell>{bid.description}</Table.Cell>
									<Table.Cell>
										<Button onClick={() => this.handleActivate(bid._id)}>
											<Icon name="check  blue" size="big" />
										</Button>
									</Table.Cell>
									<Table.Cell>
										<Link to={"/decision-criteria/" + bid._id}>
											<Icon name="resolving" /> Compare
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link to={"/decision-alternative/" + bid._id}>
											<Icon name="resolving" /> Compare
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Dropdown placeholder="Select.." fluid selection options={bid.criteria} />
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			</div>
		);
	}
}

export default OpenBids;

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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

	getCriteriaList = (criteriaList, bid_id) => {
		const criteriaValues = criteriaList.map((crt) => {
			return { text: crt.title, value: crt._id + "_" + bid_id };
		});
		return criteriaValues;
	};

	getSubCriteriaList = (bid_id) => {
		const { bids } = this.state;
		const finalList = [];
		const bid = bids.find((bid) => {
			return bid._id === bid_id;
		});
		bid.criteria.map((criteria) => {
			return criteria.subcriteria.map((subC) => {
				const tempSub = { text: subC.title, value: subC._id + "_" + criteria._id + "_" + bid_id };
				finalList.push(tempSub);
				return null;
			});
		});
		console.log(finalList);
		return finalList;
	};

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

	handleChange = (e, { value }) => {
		const parameters = value.split("_");
		const criteria_id = parameters[0],
			bid_id = parameters[1];
		const redirect_path = `/add-sub/${bid_id}/${criteria_id}`;
		this.props.history.push(redirect_path);
		// return <Redirect to={redirect_path} />;

		// this.setState({ bid_id });
	};

	handleAltChange = (e, { value }) => {
		const parameters = value.split("_");
		const subcriteria_id = parameters[0],
			criteria_id = parameters[1],
			bid_id = parameters[2];
		const redirect_path = `/add-alt/${bid_id}/${criteria_id}/sub/${subcriteria_id}`;
		this.props.history.push(redirect_path);
	};

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
							<Table.HeaderCell>Sub-Criteria</Table.HeaderCell>
							<Table.HeaderCell>Alternatives</Table.HeaderCell>
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
										<Dropdown
											placeholder="Select.."
											fluid
											selection
											options={this.getCriteriaList(bid.criteria, bid._id)}
											onChange={this.handleChange}
										/>
									</Table.Cell>
									<Table.Cell>
										<Dropdown
											placeholder="Select.."
											fluid
											selection
											options={this.getSubCriteriaList(bid._id)}
											onChange={this.handleAltChange}
										/>
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

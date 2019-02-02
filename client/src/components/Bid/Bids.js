import React, { Component } from "react";
import _ from "lodash";
import { Header, Button, Checkbox, Icon, Table } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";

class Bids extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bids: [],
			column: null,
			direction: null,
			checked: false
		};
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
	componentWillMount() {
		axios
			.get("/api/bid")
			.then((bids) => {
				console.log(bids.data);
				this.setState({ bids: bids.data });
			})
			.catch((error) => {
				console.log(error);
			});
	}

	closeOrOpenBid = (id) => {
		let endpointUrl = `/api/bid/${id}/activate`;
		const oldBids = this.state.bids;
		const bid_to_change = oldBids.find((bid) => bid._id === id);
		let activatedState;
		const data = new FormData();
		if (bid_to_change.activated) {
			activatedState = false;
		} else {
			activatedState = true;
		}
		data.append("activated", activatedState);

		axios
			.post(endpointUrl, data)
			.then((response) => {
				// Return and edit this heat in the list of heats
				if (response.data.activated) {
					activatedState = true;
				} else {
					activatedState = false;
				}
			})
			.catch((error) => {
				console.log(error);
			});
		const newBids = oldBids.map((h) => (h._id === id ? { ...h, activated: activatedState } : h));
		this.setState({ bids: newBids });
		console.log(this.state);
		this.setState({ checked: !this.state.checked });
		// this.getHeats();
	};

	deleteBid = (id) => {
		console.log("Im deleting this bid, pls show a modal");
	};

	render() {
		const { bids, column, direction, checked } = this.state;
		return (
			<div className="ui container">
				<Header>All Bids here - Admin</Header>
				<Table compact selectable sortable celled definition>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell />

							<Table.HeaderCell sorted={column === "name" ? direction : null} onClick={this.handleSort("name")}>
								Bid Name
							</Table.HeaderCell>
							<Table.HeaderCell>Description</Table.HeaderCell>
							<Table.HeaderCell>Edit</Table.HeaderCell>
							<Table.HeaderCell>Delete</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{bids.map((bid) => {
							return (
								<Table.Row key={bid._id}>
									<Table.Cell collapsing>
										<Checkbox toggle onChange={() => this.closeOrOpenBid(bid._id)} checked={bid.activated} />
									</Table.Cell>
									<Table.Cell>
										<Link to={"/bid/" + bid._id}>{bid.name}</Link>
									</Table.Cell>
									<Table.Cell>{bid.description}</Table.Cell>
									<Table.Cell>
										<Link to={"/bid/edit/" + bid._id} className="ui icon button">
											<Icon name="edit" />
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link onClick={() => this.deleteBid(bid._id)} to="#!" className="ui icon button">
											<Icon name="delete" className="red" />
										</Link>
									</Table.Cell>
								</Table.Row>
							);
						})}
					</Table.Body>
					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell />
							<Table.HeaderCell colSpan="4">
								<a href="/new-bid">
									<Button floated="right" icon labelPosition="left" primary size="small">
										<Icon name="user" /> Add Bid
									</Button>
								</a>
								<Button size="small">Review</Button>
								<Button disabled size="small">
									Delete All
								</Button>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</div>
		);
	}
}

export default Bids;

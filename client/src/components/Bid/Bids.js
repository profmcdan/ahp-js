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
			direction: null
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

	deleteBid = (id) => {
		console.log("Im deleting this bid, pls show a modal");
	};

	render() {
		const { bids, column, direction } = this.state;
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
										<Checkbox slider />
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

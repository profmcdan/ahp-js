import React, { Component } from "react";
import { Form, Header, Button, Icon } from "semantic-ui-react";
import CompareInput from "./CompareInput";
import axios from "axios";
import Compare from "./Compare";

class CompareSubCriteria extends Component {
	constructor(props) {
		super();
		this.state = {
			bid_id: "",
			criteria_id: "",
			bid: null,
			pref: "",
			description: "",
			criteria: "",
			subcriteria: []
		};
	}

	getBidDetails = () => {
		const { bid_id, criteria_id } = this.state;
		console.log(bid_id);
		axios
			.get(`/api/bid/${bid_id}`) // {TODO} : Confirm this endpoint
			.then((response) => {
				console.log(response);
				const bid = response.data.bid;
				const criteria = bid.criteria.find((crt) => crt._id === criteria_id);
				const { subcriteria } = criteria; // [TODO] change this to filter the subc under the given criteria
				console.log(subcriteria);
				this.setState({
					bid: bid,
					subcriteria
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
		this.setState({ value, name });
		console.log(this.state);
		// console.log(e);
	};

	componentDidMount() {
		this.setState({ bid_id: this.props.match.params.bid_id, criteria_id: this.props.match.params.criteria_id });
		this.getBidDetails();
		console.log(this.state);
	}

	componentWillMount() {
		this.setState({ bid_id: this.props.match.params.bid_id, criteria_id: this.props.match.params.criteria_id });
		this.getBidDetails();
		console.log(this.state);
	}

	render() {
		const { subcriteria } = this.state;
		return (
			<div class="ui fluid container">
				<Header>Compare Alternatives</Header>
				<Form>
					{subcriteria.map((crt) => {
						const filtered = subcriteria.filter((value) => {
							return value !== crt.title;
						});
						return filtered.map((crt_right) => {
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

export default CompareSubCriteria;

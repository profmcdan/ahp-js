import React, { Component } from "react";
import { Form, Header, Button, Icon } from "semantic-ui-react";
import CompareInput from "./CompareInput";
import axios from "axios";
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
			subcriteria: []
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
		this.setState({ value, name });
		console.log(this.state);
		// console.log(e);
	};

	componentDidMount() {
		this.setState({ bid_id: this.props.match.params.bid_id });
		this.getBidDetails();
		console.log(this.state);
	}

	componentWillMount() {
		this.setState({ bid_id: this.props.match.params.bid_id });
		this.getBidDetails();
		console.log(this.state);
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

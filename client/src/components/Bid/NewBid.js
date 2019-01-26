import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";
import axios from "axios";

class NewBid extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
			loaded: 0
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { name, description } = this.state;

		const data = new FormData();
		data.append("name", name);
		data.append("description", description);

		axios
			.post(`/api/bid`, data)
			.then((bid) => {
				console.log(bid);
				this.props.history.push("/bids");
			})
			.catch((error) => {
				console.log(error);
			});

		console.log(data);
	};

	render() {
		return (
			<div className="ui container grid">
				<div className="four wide column" />
				<div className="eight wide column">
					<Header>Create a new bid</Header>
					<Form onSubmit={this.handleSubmit}>
						<Form.Field>
							<input
								label="Bid Title"
								placeholder="Bid Title"
								type="text"
								error="wrong"
								success="right"
								name="name"
								value={this.state.name}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<input
								label="Description"
								placeholder="Enter a description for this bid"
								type="text"
								error="wrong"
								success="right"
								name="description"
								value={this.state.description}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Button primary type="submit">
							Submit
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default NewBid;

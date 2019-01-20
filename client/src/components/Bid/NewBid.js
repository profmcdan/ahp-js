import React, { Component } from "react";
import { Input, Form, Header, Button } from "semantic-ui-react";

class NewBid extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			description: ""
		};
	}
	render() {
		const { title, description } = this.state;
		return (
			<div class="ui container grid">
				<div class="four wide column" />
				<div class="eight wide column">
					<Header>Create a new bid</Header>
					<Form>
						<Form.Field>
							<Input placeholder="Enter a bid title" value={title} />
						</Form.Field>
						<Form.Field>
							<Input placeholder="Enter a description for this bid" value={description} />
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

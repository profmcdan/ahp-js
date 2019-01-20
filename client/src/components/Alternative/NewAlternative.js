import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";

class NewAlternative extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			phone: "",
			address: ""
		};
	}
	render() {
		const { name, email, phone, address } = this.state;
		return (
			<div class="ui container grid">
				<div class="four wide column" />
				<div class="eight wide column">
					<Header>Create a Alternative</Header>
					<Form>
						<Form.Field>
							<input type="text" placeholder="Enter Full Name/Company Name" value={name} />
						</Form.Field>
						<Form.Field>
							<input type="text" placeholder="Enter Email Address" value={email} />
						</Form.Field>
						<Form.Field>
							<input type="text" placeholder="Phone Number" value={phone} />
						</Form.Field>
						<Form.Field>
							<input type="text" placeholder="Office/Home Address" value={address} />
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

export default NewAlternative;

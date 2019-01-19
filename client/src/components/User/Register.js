import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";

class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			email: "",
			password: "",
			password2: ""
		};
	}
	render() {
		const { password, password2, email, name } = this.state;
		return (
			<div class="ui container grid">
				<div class="four wide column" />
				<div class="eight wide column">
					<Header>Sign In</Header>
					<Form>
						<Form.Field>
							<input type="text" placeholder="Email Address" value={name} />
						</Form.Field>
						<Form.Field>
							<input type="text" placeholder="Email Address" value={email} />
						</Form.Field>
						<Form.Field>
							<input type="password" placeholder="Password" value={password} />
						</Form.Field>
						<Form.Field>
							<input type="password" placeholder="Confirm Password" value={password2} />
						</Form.Field>
						<Button primary type="submit">
							Register
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default Register;

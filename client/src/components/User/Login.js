import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: ""
		};
	}
	render() {
		const { password, email } = this.state;
		return (
			<div class="ui container grid">
				<div class="four wide column" />
				<div class="eight wide column">
					<Header>Sign In</Header>
					<Form>
						<Form.Field>
							<input type="text" placeholder="Email Address" value={email} />
						</Form.Field>
						<Form.Field>
							<input type="password" placeholder="Password" value={password} />
						</Form.Field>
						<Button primary type="submit">
							Log in
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default Login;

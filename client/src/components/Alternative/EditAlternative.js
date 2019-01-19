import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";

class EditAlternative extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			filename: ""
		};
	}
	render() {
		const { name, filename } = this.state;
		return (
			<div class="ui container grid">
				<div class="four wide column" />
				<div class="eight wide column">
					<Header>Update a Alternative</Header>
					<Form>
						<Form.Field>
							<input type="text" placeholder="Enter document description" value={name} />
						</Form.Field>
						<Form.Field>
							<input type="file" placeholder="Select the document" value={filename} />
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

export default EditAlternative;

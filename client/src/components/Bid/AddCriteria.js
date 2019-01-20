import React, { Component } from "react";
import { Input, Form, Header, Button } from "semantic-ui-react";

class AddCriteria extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			description: ""
		};
	}

	render() {
		const { title } = this.state;
		return (
			<div class="ui container grid">
				<div class="four wide column" />
				<div class="eight wide column">
					<Header>Add Criteria</Header>
					<Form>
						<Form.Field>
							<Input placeholder="Enter a new criteria" value={title} />
						</Form.Field>
						<div class="ui horizontal divider">Sub-Criteria List</div>
						<Form.Field>
							<textarea name="" id="" cols="30" rows="10" placeholder="Enter a list separated by commas" />
						</Form.Field>
						<button className="ui teal labeled icon button" type="submit">
							Submit
							<i class="add icon" />
						</button>
					</Form>
				</div>
			</div>
		);
	}
}

export default AddCriteria;

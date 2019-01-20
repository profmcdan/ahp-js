import React, { Component } from "react";
import { Icon, Form } from "semantic-ui-react";
import CustomButton from "./CustomButton";

class NewDecision extends Component {
	render() {
		return (
			<div>
				<h3>Main Form for Submission of response</h3>
				<Form>
					<Form.Field>
						<CustomButton from_text="Financial" to_text="Qualification" />
					</Form.Field>
					<Form.Field>
						<CustomButton from_text="Financial" to_text="Experience" />
					</Form.Field>
					<Form.Field>
						<CustomButton />
					</Form.Field>
					<Form.Field>
						<CustomButton />
					</Form.Field>
					<Form.Field>
						<CustomButton />
					</Form.Field>
					<Form.Field>
						<CustomButton />
					</Form.Field>
					<button className="ui primary button" type="submit">
						Submit
					</button>
				</Form>
			</div>
		);
	}
}

export default NewDecision;

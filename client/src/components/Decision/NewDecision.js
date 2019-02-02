import React, { Component } from "react";
import { Icon, Form } from "semantic-ui-react";
import CompareInput from "./CompareInput";

class NewDecision extends Component {
	render() {
		return (
			<div>
				<h3>Main Form for Submission of response</h3>
				<Form>
					<Form.Field>
						<CompareInput from_text="Financial" to_text="Qualification" />
					</Form.Field>
					<Form.Field>
						<CompareInput from_text="Financial" to_text="Experience" />
					</Form.Field>
					<Form.Field>
						<CompareInput />
					</Form.Field>
					<Form.Field>
						<CompareInput />
					</Form.Field>
					<Form.Field>
						<CompareInput />
					</Form.Field>
					<Form.Field>
						<CompareInput />
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

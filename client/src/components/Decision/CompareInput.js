import React, { Component } from "react";
import { Icon, Button } from "semantic-ui-react";

class CompareInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
	}
	handleClick = () => {
		this.setState({ active: !this.state.active });
		console.log("This button clicked");
	};
	render() {
		const { from_text, to_text } = this.props;
		const { active } = this.state;
		return (
			<div className="ui icon buttons">
				<div className="ui purple right pointing label">{from_text}</div>

				<div className="ui toggle button" data-tooltip="Extremely Preferred" active={active} onClick={this.handleClick}>
					<Icon name="angle double left" size="small" />{" "}
				</div>
				<div className="ui button" data-tooltip="Very Strongly to Extremely Preferred">
					<Icon name="angle double left" />
				</div>
				<div className="ui button" data-tooltip="Very Strongly Preferred">
					<Icon name="angle double left" />
				</div>
				<div className="ui button" data-tooltip="Strongly to Very Strongly Preferred">
					<Icon name="angle double left" />{" "}
				</div>
				<div className="ui button" data-tooltip="Strongly Preferred">
					<Icon name="angle double left" />
				</div>
				<div className="ui button" data-tooltip="Moderately to Strongly Preferred">
					<Icon name="angle double left" />
				</div>
				<div className="ui button" data-tooltip="Moderately Preferred">
					<Icon name="angle double left" />{" "}
				</div>
				<div className="ui button" data-tooltip="Equally to Moderately Preferred">
					<Icon name="angle double left" />
				</div>
				<div className="ui button" data-tooltip="Equally Preferred">
					<Icon name="balance scale" />
				</div>
				<div className="ui button" data-tooltip="Equally to Moderately Preferred" data-inverted="">
					<Icon name="angle double right" />{" "}
				</div>
				<div className="ui button" data-tooltip="Moderately Preferred" data-inverted="">
					<Icon name="angle double right" />
				</div>
				<div className="ui button" data-tooltip="Moderately to Strongly Preferred" data-inverted="">
					<Icon name="angle double right" />
				</div>
				<div className="ui button" data-tooltip="Strongly Preferred" data-inverted="">
					<Icon name="angle double right" />{" "}
				</div>
				<div className="ui button" data-tooltip="Strongly to Very Strongly Preferred" data-inverted="">
					<Icon name="angle double right" />
				</div>
				<div className="ui button" data-tooltip="Very Strongly Preferred" data-inverted="">
					<Icon name="angle double right" />
				</div>
				<div className="ui button" data-tooltip="Very Strongly to Extremely Preferred" data-inverted="">
					<Icon name="angle double right" />{" "}
				</div>
				<div className="ui button" data-tooltip="Extremely Preferred" data-inverted="">
					<Icon name="angle double right" />
				</div>
				<div className="ui red left pointing label">{to_text}</div>
			</div>
		);
	}
}

export default CompareInput;

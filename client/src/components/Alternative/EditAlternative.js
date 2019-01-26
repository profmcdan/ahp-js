import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";
import Axios from "axios";

class EditAlternative extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bid_id: "",
			contractor_id: "",
			file_title: "",
			document: null,
			loaded: 0,
			bid: {},
			contractors: [],
			contractor: {}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSelectedFile = this.handleSelectedFile.bind(this);
	}

	getBidDetails = () => {
		const { bid_id, contractor_id } = this.state;
		Axios.get(`/api/bid/${bid_id}`)
			.then((response) => {
				console.log(response.data);
				const bid = response.data.bid;
				const contractors = bid.contractors;
				const contractor = contractors.find((crt) => crt._id === contractor_id);
				console.log(contractor);
				this.setState({
					bid: bid,
					contractors: bid.contractors,
					contractor: contractor
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	handleSelectedFile = (e) => {
		this.setState({
			document: e.target.files[0],
			loaded: 0
		});
	};

	componentDidMount() {
		this.setState({ bid_id: this.props.match.params.bid_id, contractor_id: this.props.match.params.contractor_id });
		this.getBidDetails();
	}

	componentWillMount() {
		this.setState({ bid_id: this.props.match.params.bid_id, contractor_id: this.props.match.params.contractor_id });
	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const { file_title, document, bid_id, contractor_id } = this.state;

		const data = new FormData();
		data.append("file_title", file_title);
		data.append("contractor_id", contractor_id);
		if (document) {
			data.append("document", document, document.name);

			Axios.post(`/api/bid/${bid_id}/alternative/upload`, data, {
				onUploadProgress: (ProgressEvent) => {
					this.setState({
						loaded: ProgressEvent.loaded / ProgressEvent.total * 100
					});
				}
			}).then((res) => {
				console.log(res.data);
				this.props.history.push("/bid/" + bid_id);
			});
		}
	};

	render() {
		const { file_title, document } = this.state;
		return (
			<div className="ui container grid">
				<div className="four wide column" />
				<div className="eight wide column">
					<Header>Update a Alternative</Header>
					<Form onSubmit={this.handleSubmit} enctype="multipart/form-data">
						<Form.Field>
							<input
								type="text"
								name="file_title"
								placeholder="Enter document description"
								value={file_title}
								onChange={this.handleChange}
							/>
						</Form.Field>
						<Form.Field>
							<div class="ui right labeled left icon input">
								<i class="book icon" />
								<input
									type="file"
									name="document"
									placeholder="Select the document"
									onChange={this.handleSelectedFile}
								/>
								<a class="ui tag label" href="!#">
									{Math.round(this.state.loaded, 2)} %
								</a>
							</div>
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

import React, { Component } from "react";
import { Input, Form, Header, Button } from "semantic-ui-react";
import axios from "axios";
import { config } from "../../config";
const apiUrl = config.apiUrl;

class AddCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid_id: "",
      title: "",
      description: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ bid_id: this.props.match.params.bid_id });
    // this.getBidDetails();
  }

  componentWillMount() {
    this.setState({ bid_id: this.props.match.params.bid_id });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onSubmit = event => {
    event.preventDefault();
    const { title, description, bid_id } = this.state;
    let sub_criteria_list;
    const data = new FormData();
    data.append("title", title);
    sub_criteria_list = description.split(",");
    console.log(sub_criteria_list);
    axios
      .post(`${apiUrl}/api/bid/${bid_id}/criteria`, data)
      .then(response => {
        const bid = response.data.bid;
        const criteria = bid.criteria.find(crt => crt.title === title);
        const criteria_id = criteria._id;
        if (sub_criteria_list.length > 0) {
          const formData = new FormData();
          formData.append("sub_list", sub_criteria_list);
          formData.append("criteria_id", criteria_id);
          axios
            .post(`${apiUrl}/api/bid/${bid_id}/criteria`, formData)
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        }
        // Update the subcriteria also, inside here
        this.props.history.push("/bid/" + bid_id);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { title, description } = this.state;
    return (
      <div class="ui container grid">
        <div class="four wide column" />
        <div class="eight wide column">
          <Header>Add Criteria</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <Input
                label="Enter Criteria"
                placeholder="Enter a new criteria"
                type="text"
                error="wrong"
                success="right"
                name="title"
                value={title}
                onChange={this.handleChange}
              />
            </Form.Field>
            <div class="ui horizontal divider">Sub-Criteria List</div>
            <Form.Field>
              <textarea
                value={description}
                cols="30"
                rows="10"
                name="description"
                placeholder="Enter a list separated by commas"
                onChange={this.handleChange}
              />
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

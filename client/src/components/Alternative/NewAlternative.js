import React, { Component } from "react";
import { Form, Header, Button, Input } from "semantic-ui-react";
import Axios from "axios";
const apiUrl = "http://localhost:5000";

class NewAlternative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid_id: "",
      title: "",
      description: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      bid_price: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit = event => {
    event.preventDefault();
    const { name, email, phone, address, bid_id, bid_price } = this.state;
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("phone", phone);
    data.append("address", address);
    data.append("bid_price", bid_price);

    Axios.post(`${apiUrl}/api/bid/${bid_id}/contractor`, data)
      .then(response => {
        console.log(response.data);
        this.props.history.push("/bid/" + bid_id);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { name, email, phone, address, bid_price } = this.state;
    return (
      <div className="ui container grid">
        <div className="four wide column" />
        <div className="eight wide column">
          <Header>Create a Alternative</Header>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Input
                placeholder="Enter Full Name/Company Name"
                value={name}
                label="Name   "
                type="text"
                error="wrong"
                success="right"
                name="name"
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Email  "
                type="text"
                error="wrong"
                success="right"
                name="email"
                onChange={this.handleChange}
                placeholder="Enter Email Address"
                value={email}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Phone  "
                type="text"
                error="wrong"
                success="right"
                name="phone"
                onChange={this.handleChange}
                placeholder="Phone Number"
                value={phone}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Address"
                type="text"
                error="wrong"
                success="right"
                name="address"
                onChange={this.handleChange}
                placeholder="Office/Home Address"
                value={address}
              />
            </Form.Field>
            <Form.Field>
              <Input
                label="Bid Price"
                type="text"
                error="wrong"
                success="right"
                name="bid_price"
                onChange={this.handleChange}
                placeholder="Enter the proposed price for this alternative"
                value={bid_price}
              />
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

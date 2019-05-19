import React, { Component } from "react";
import { Form, Header, Button } from "semantic-ui-react";
import axios from "axios";
import jwt_decode from "jwt-decode";

import setAuthToken from "../../utils/setAuthToken";
import { config } from "../../config";
const apiUrl = config.apiUrl;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    // Decode token to get user
    if (token) {
      const decoded = jwt_decode(token);
      console.log(decoded);
      this.props.history.push(`/competition`);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { email, password, username, password2 } = this.state;

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("password2", password2);
    data.append("name", username);

    axios
      .post(`${apiUrl}/api/auth/register`, data)
      .then(response => {
        if (response.data.errors) {
          this.setState({ errors: Object.values(response.data.errors) });
          console.log(this.state);
        } else {
          console.log(response.data);
          alert("Registration Successful");
          this.props.history.push(`/login`);
        }
      })
      .then(error => {
        this.setState({ error: error });
      });
  };

  render() {
    const { password, password2, email, name } = this.state;
    return (
      <div class="ui container grid">
        <div class="four wide column" />
        <div class="eight wide column">
          <Header>Register In</Header>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <input
                label="Full Name"
                placeholder="Full Name"
                type="text"
                error="wrong"
                success="right"
                name="name"
                value={name}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field>
              <input
                label="Email"
                placeholder="Email Address"
                type="email"
                error="wrong"
                success="right"
                name="email"
                value={email}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field>
              <input
                label="Password"
                placeholder="Enter Password"
                type="password"
                error="wrong"
                success="right"
                name="password"
                value={password}
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field>
              <input
                label="Confirm Password"
                placeholder="Enter Password Again"
                type="password"
                error="wrong"
                success="right"
                name="password2"
                value={password2}
                onChange={this.handleInputChange}
              />
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

import React, { Component } from "react";
import { Form, Header, Button, Message } from "semantic-ui-react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";

const apiUrl = "http://localhost:5000";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  loginUser = userData => {
    axios
      .post(`${apiUrl}/api/auth/login`, userData)
      .then(res => {
        console.log(res);
        // Save to localStorage
        const { token } = res.data;
        if (token) {
          // Set token to ls
          localStorage.setItem("jwtToken", token);
          // Set toke to Auth Header
          setAuthToken(token);
          console.log(token);
          // Set current user
          // dispatch(setCurrentUser(decoded));
          this.props.history.push(`/`);
        }
        if (res.data.errors) {
          this.setState({ errors: Object.values(res.data.errors) });
          console.log(this.state);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    // Decode token to get user
    if (token) {
      const decoded = jwt_decode(token);
      console.log(decoded);
      this.props.history.push(`/`);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;

    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    this.loginUser(data);
  };

  render() {
    const { password, email, errors } = this.state;
    return (
      <div className="ui container grid">
        <div className="four wide column" />
        <div className="eight wide column">
          <Header>Sign In</Header>
          {errors && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <Message.List>
                <Message.Item>{errors}</Message.Item>
              </Message.List>
            </Message>
          )}

          <Form onSubmit={this.handleSubmit}>
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
            <Button primary type="submit">
              Log in
            </Button>
          </Form>
          <p className="ui p">
            Not yet a user?{" "}
            <a href="/register" className="ui button">
              Register
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;

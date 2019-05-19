import React, { Component } from "react";
import { Input, Menu, Dropdown } from "semantic-ui-react";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

class Navbar extends Component {
  state = { activeItem: "home", loginText: "Login", loggedOut: true };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  logoutUser = () => {
    // Remove the token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove the auth header from future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
  };

  handleLogout = () => {
    this.logoutUser();
    this.setState({ loggedOut: true });
    // window.location.reload();
    // return <Redirect to="/login" />;
  };

  componentWillMount() {
    const token = localStorage.getItem("jwtToken");
    // Decode token to get user
    if (token) {
      const decoded = jwt_decode(token);
      this.setState({ user: decoded, loginText: "Logout" });
    }
  }

  render() {
    const { activeItem, loginText } = this.state;

    return (
      <Menu className="ui secondary menu">
        <Menu.Item
          name="AHP"
          href="/"
          active={activeItem === "AHP"}
          onClick={this.handleItemClick}
        />

        <Menu.Item
          name="menu"
          active={activeItem === "menu"}
          onClick={this.handleItemClick}
          href="/menu"
        />
        <Menu.Item
          name="action"
          active={activeItem === "action"}
          onClick={this.handleItemClick}
        >
          <Dropdown item text="Action">
            <Dropdown.Menu>
              <Dropdown.Item href="/open-bids">Open Bids</Dropdown.Item>
              <Dropdown.Item href="/my-bids">My Bids</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
        <Menu.Item
          name="admin"
          active={activeItem === "admin"}
          onClick={this.handleItemClick}
        >
          <Dropdown item text="Admin">
            <Dropdown.Menu>
              <Dropdown.Item href="/new-bid">Create New Bid</Dropdown.Item>
              <Dropdown.Item href="/bids">Manage Bids</Dropdown.Item>
              <Dropdown.Item href="/alternatives">
                Manage Alternatives
              </Dropdown.Item>
              <Dropdown.Item href="/register">Manage Users</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
          <Menu.Item
            name="login"
            active={activeItem === "login"}
            onClick={this.handleLogout}
            href="/login"
          >
            {loginText}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navbar;

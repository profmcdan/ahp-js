import React, { Component } from "react";
import { Input, Menu, Dropdown } from "semantic-ui-react";

class Navbar extends Component {
	state = { activeItem: "home" };

	handleItemClick = (e, { name }) => this.setState({ activeItem: name });

	render() {
		const { activeItem } = this.state;

		return (
			<Menu secondary>
				<Menu.Item name="home" href="/" active={activeItem === "home"} onClick={this.handleItemClick} />

				<Menu.Item name="menu" active={activeItem === "menu"} onClick={this.handleItemClick} href="/menu" />
				<Menu.Item name="action" active={activeItem === "action"} onClick={this.handleItemClick}>
					<Dropdown item text="Action">
						<Dropdown.Menu>
							<Dropdown.Item>Open Bids</Dropdown.Item>
							<Dropdown.Item>My Bids</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>
				<Menu.Item name="admin" active={activeItem === "admin"} onClick={this.handleItemClick}>
					<Dropdown item text="Admin">
						<Dropdown.Menu>
							<Dropdown.Item href="/new-bid">Create New Bid</Dropdown.Item>
							<Dropdown.Item>Manage Bids</Dropdown.Item>
							<Dropdown.Item>Manage Alternatives</Dropdown.Item>
							<Dropdown.Item>Manage Users</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>

				<Menu.Menu position="right">
					<Menu.Item>
						<Input icon="search" placeholder="Search..." />
					</Menu.Item>
					<Menu.Item  name="login" active={activeItem === "login"} onClick={this.handleItemClick} />
				</Menu.Menu>
			</Menu>
		);
	}
}

export default Navbar;

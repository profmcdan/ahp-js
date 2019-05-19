import React, { Component } from "react";
import _ from "lodash";
import { Header, Button, Checkbox, Icon, Table } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { config } from "../../config";
const apiUrl = config.apiUrl;

// import { Fraction } from "fractional";
import "./result.css";

export default class BidResultList extends Component {
  state = {
    users: [],
    user: null,
    bid_id: null,
    bid: null,
    decisions: null,
    column: null,
    direction: null,
    checked: false
  };
  handleSort = clickedColumn => () => {
    const { column, bids, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        bids: _.sortBy(bids, [clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      bids: bids.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  getBidDetails = () => {
    const { bid_id } = this.state;
    axios
      .get(`${apiUrl}/api/bid/${bid_id}`)
      .then(async res => {
        const { bid } = res.data;
        await this.setState({
          bid
        });
        return null;
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  };

  getUsers = () => {
    axios
      .get(`${apiUrl}/api/auth/users`)
      .then(async res => {
        const { users } = res.data;
        await this.setState({ users });
      })
      .catch(error => {
        console.log(error);
      });
  };

  async componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = jwt_decode(token);
      await this.setState({
        user: decoded,
        bid_id: this.props.match.params.id
      });
      console.log(decoded);
      await this.getBidDetails();
      await this.getUsers();
      const { bid_id } = this.state;
      axios
        .get(`${apiUrl}/api/decision/${bid_id}`)
        .then(async res => {
          const { decisions } = res.data;
          await this.setState({
            decisions
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({
        errorMessage: "You must be logged in to view this page"
      });
    }
  }

  getUser = user_id => {
    const { users } = this.state;
    const user = users.find(usr => usr._id === user_id);
    console.log(user);
    return user.email;
  };

  render() {
    const { column, direction, checked, decisions } = this.state;
    if (!decisions) {
      return <div>Loading ...</div>;
    }
    return (
      <div>
        <Table compact selectable sortable celled definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === "name" ? direction : null}
                onClick={this.handleSort("name")}
              >
                Decision Maker
              </Table.HeaderCell>
              <Table.HeaderCell>View</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {decisions.map((decision, index) => (
              <Table.Row key={index}>
                <Table.Cell>{this.getUser(decision.maker)}</Table.Cell>
                <Table.Cell>
                  <Link
                    to={"/bid/result/" + decision._id}
                    className="ui icon button"
                  >
                    <Icon name="registered" />
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

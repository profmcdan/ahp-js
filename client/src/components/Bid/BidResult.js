import React, { Component } from "react";
import _ from "lodash";
import { Header, Button, Checkbox, Icon, Table } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";

class BidResult extends Component {
  state = {
    bid_id: "",
    decisions: null
  };
  getBidDetails = () => {
    const { bid_id } = this.state;
    axios
      .get(`/api/decision/${bid_id}`)
      .then(async res => {
        const { decisions } = res.data;
        await this.setState({
          decisions
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  async componentDidMount() {
    await this.setState({ bid_id: this.props.match.params.id });
    await this.getBidDetails();
  }
  render() {
    const { decision, bid_id } = this.state;
    return (
      <div>
        <Header>Bid Result</Header>
        <p>{bid_id}</p>
      </div>
    );
  }
}

export default BidResult;

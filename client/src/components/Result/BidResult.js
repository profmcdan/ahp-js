import React, { Component } from "react";
import _ from "lodash";
import { Header, Button, Checkbox, Icon, Table } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
// import { Fraction } from "fractional";
import "./result.css";

class BidResult extends Component {
  state = {
    loading: true,
    bid_id: "",
    id: null,
    decisions: null,
    user: null,
    criteria_matrix: [],
    sub_criteria_matrix: [],
    alternative_matrix: [],
  };
  getBidDetails = () => {
    const { bid_id } = this.state;
    axios
      .get(`/api/decision/${bid_id}`)
      .then(async res => {
        const { decisions } = res.data;
        await this.setState({
          decisions,
        });
        return null;
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  };

  async componentDidMount() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = jwt_decode(token);
      await this.setState({
        user: decoded,
        id: this.props.match.params.id,
      });
      console.log(decoded);
      await this.getBidDetails();
      const { id } = this.state;
      // .get(`/api/compute/decision/${bid_id}/user/${user.id}`)
      axios
        .get(`/api/compute/decision/${id}`)

        .then(async res => {
          const {
            criteria_matrix,
            sub_criteria_matrix,
            alternative_matrix,
          } = res.data;
          await this.setState({
            criteria_matrix,
            sub_criteria_matrix,
            alternative_matrix,
            loading: false,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  formatData = valArray => {
    let stringVal =
      `${Number.parseFloat(valArray[0]).toFixed(4)}, ` +
      `${Number.parseFloat(valArray[1]).toFixed(4)}, ` +
      `${Number.parseFloat(valArray[2]).toFixed(4)}`;

    // let stringVal2 =
    //   `${new Fraction(valArray[0]).toString()}, ` +
    //   `${new Fraction(valArray[1]).toString()}, ` +
    //   `${new Fraction(valArray[2]).toString()}`;

    return `(${stringVal})`;
  };

  render() {
    const {
      criteria_matrix,
      bid_id,
      sub_criteria_matrix,
      alternative_matrix,
      loading,
    } = this.state;
    return (
      <div className="main-container">
        <div>
          <Header as="h1">Criteria Matrix</Header>
          {criteria_matrix ? (
            <Table compact selectable sortable celled definition striped>
              <Table.Body>
                {criteria_matrix.map((critCOl, cIndex) => (
                  <Table.Row key={cIndex}>
                    {critCOl.map((critRow, rIndex) => (
                      <Table.Cell key={rIndex}>
                        {this.formatData(critRow)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : loading ? (
            <div>Loading...</div>
          ) : (
            <div>There is no response for this user</div>
          )}
        </div>
        <div>
          <Header as="h1">SubCriteria Matrix</Header>
          {sub_criteria_matrix ? (
            <div>
              {sub_criteria_matrix.map((crit, index) => (
                <div key={index}>
                  <Header as="h3">Criteria {index}</Header>
                  <Table striped>
                    <Table.Body>
                      {crit.map((critCOl, cIndex) => (
                        <Table.Row key={cIndex}>
                          {critCOl.map((critRow, rIndex) => (
                            <Table.Cell key={rIndex}>
                              {this.formatData(critRow)}
                            </Table.Cell>
                          ))}
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div>Loading...</div>
          ) : (
            <div>There is no response for this user</div>
          )}
        </div>
        <div>
          <Header as="h1">Alternatives Matrix</Header>
          {alternative_matrix ? (
            <div>
              {alternative_matrix.map((sub_crit, index) => (
                <div key={index}>
                  <div className="title-header">
                    <Header as="h3">Sub-Criteria {index}</Header>
                  </div>
                  <Table striped>
                    <Table.Body>
                      {sub_crit.map((critCOl, cIndex) => (
                        <Table.Row key={cIndex}>
                          {critCOl.map((critRow, rIndex) => (
                            <Table.Cell key={rIndex}>
                              {this.formatData(critRow)}
                            </Table.Cell>
                          ))}
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div>Loading...</div>
          ) : (
            <div>There is no response for this user</div>
          )}
        </div>
      </div>
    );
  }
}

export default BidResult;

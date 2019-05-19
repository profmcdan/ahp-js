import React, { Component } from "react";
import _ from "lodash";
import { Header, Button, Checkbox, Icon, Table } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { config } from "../../config";
import "./result.css";
const apiUrl = config.apiUrl;

// import { Fraction } from "fractional";

class BidResult extends Component {
  state = {
    loading: true,
    bid_id: "",
    id: null,
    decisions: null,
    user: null,
    criteria_matrix: null,
    sub_criteria_matrix: null,
    alternative_matrix: null,
    global_weights: null,
    criteria_aggregate: null,
    criteria_aggregate_sum: null,
    criteria_fuzzy_weight: null,
    criteria_relative_non_fuzzy_weight: null,
    criteria_normalized: null,
    local_weight: null,
    criteria_fuzzy_table: null,
    criteria_cr: null,
    subcriteria_data: null,
    alternative_data: null
  };
  getBidDetails = () => {
    const { bid_id } = this.state;
    axios
      .get(`${apiUrl}/api/decision/${bid_id}`)
      .then(async res => {
        const { decisions } = res.data;
        await this.setState({
          decisions
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
        id: this.props.match.params.id
      });
      console.log(decoded);
      await this.getBidDetails();
      const { id } = this.state;
      // .get(`/api/compute/decision/${bid_id}/user/${user.id}`)
      axios
        .get(`${apiUrl}/api/compute/decision/${id}`)

        .then(async res => {
          const {
            bid_id,
            criteria_matrix,
            sub_criteria_matrix,
            alternative_matrix,
            global_weights,
            criteria_aggregate,
            criteria_aggregate_sum,
            criteria_fuzzy_weight,
            criteria_relative_non_fuzzy_weight,
            criteria_normalized,
            local_weight,
            criteria_fuzzy_table,
            criteria_cr,
            subcriteria_data,
            alternative_data
          } = res.data;
          await this.setState({
            bid_id,
            criteria_matrix,
            sub_criteria_matrix,
            alternative_matrix,
            global_weights,
            criteria_aggregate,
            criteria_aggregate_sum,
            criteria_fuzzy_weight,
            criteria_relative_non_fuzzy_weight,
            criteria_normalized,
            local_weight,
            criteria_fuzzy_table,
            criteria_cr,
            subcriteria_data,
            alternative_data,
            loading: false
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
      alternative_data,
      sub_criteria_matrix,
      alternative_matrix,
      criteria_aggregate,
      criteria_fuzzy_weight,
      criteria_fuzzy_table,
      criteria_cr,
      subcriteria_data,
      loading
    } = this.state;

    return (
      <div className="main-container">
        <div>
          <div>
            <Header as="h1">Criteria Matrix</Header>
            {criteria_matrix ? (
              <Table striped>
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
          <div className="shift-one">
            <Header as="h1">Criteria Matrix Aggregate</Header>
            {criteria_aggregate ? (
              <Table striped>
                <Table.Body>
                  {criteria_aggregate.map((critCOl, cIndex) => (
                    <Table.Row key={cIndex}>
                      {critCOl.map((critRow, rIndex) => (
                        <Table.Cell key={rIndex}>{critRow}</Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                Aggregate cannot be calculated because the criteria matrix does
                not exist.
              </div>
            )}
          </div>
          <div className="shift-one">
            <Header as="h1">Criteria Matrix Fuzzy Weight</Header>
            {criteria_fuzzy_weight ? (
              <Table striped>
                <Table.Body>
                  {criteria_fuzzy_weight.map((critCOl, cIndex) => (
                    <Table.Row key={cIndex}>
                      {critCOl.map((critRow, rIndex) => (
                        <Table.Cell key={rIndex}>{critRow}</Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                Aggregate cannot be calculated because the criteria matrix does
                not exist.
              </div>
            )}
          </div>
          <div className="shift-one">
            <Header as="h1">Criteria Local Weight Table</Header>
            {criteria_fuzzy_table ? (
              <Table striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Non-Fuzzy Weight</Table.HeaderCell>
                    <Table.HeaderCell>Normalized Weight</Table.HeaderCell>
                    <Table.HeaderCell>Local Weight</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {criteria_fuzzy_table.map((critCOl, cIndex) => (
                    <Table.Row key={cIndex}>
                      {critCOl.map((critRow, rIndex) => (
                        <Table.Cell key={rIndex}>{critRow}</Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                Aggregate cannot be calculated because the criteria matrix does
                not exist.
              </div>
            )}
          </div>
          <div className="shift-one">
            {criteria_cr ? (
              <div>
                <p>
                  Lambda Max: <span>{criteria_cr.lamda_max} </span>
                </p>
                <p>
                  Random Index: <span>{criteria_cr.RI}</span>
                </p>
                <p>
                  Consistency Index: <span>{criteria_cr.CI} </span>
                </p>
                <p>
                  Consistency Ratio <span>{criteria_cr.consistency_ratio}</span>
                </p>
                <p>
                  Status: <span>{criteria_cr.status} </span>
                </p>
              </div>
            ) : null}
          </div>
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
          <Header as="h2">SubCriteria Weight Table</Header>
          {subcriteria_data ? (
            <Table striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Criteria Local Weight</Table.HeaderCell>
                  <Table.HeaderCell>Sub-Criteria Local Weight</Table.HeaderCell>
                  <Table.HeaderCell>
                    Sub-Criteria Global Weight
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {subcriteria_data.map((sub_data, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{sub_data.local_weight_criteria}</Table.Cell>
                    <Table.Cell>
                      {sub_data.eigenvector.map(sbl => (
                        <div>{sbl}</div>
                      ))}
                    </Table.Cell>
                    <Table.Cell>
                      {sub_data.sub_global_weight.map(sgl => (
                        <div>{sgl}</div>
                      ))}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : null}
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

        <div>
          <Header as="h2">Alternative Local Weight Table</Header>
          {alternative_data ? (
            <Table striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>SubCriteria Global Weight</Table.HeaderCell>
                  <Table.HeaderCell>Alternative Local Weight</Table.HeaderCell>
                  <Table.HeaderCell>Alternative Global Weight</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {alternative_data.sub_global_weight.map((sub_data, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{sub_data}</Table.Cell>
                    <Table.Cell>
                      {alternative_data.alt_local_weights[index].map(
                        (sbl, i) => (
                          <div key={i}>{sbl}</div>
                        )
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {alternative_data.alt_local_weights[index].map(
                        (sbl, i) => (
                          <div key={i}>{sbl * sub_data}</div>
                        )
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : null}
        </div>

        <div className="shift-one">
          <Header>Final Alternative Global Weight</Header>
          {alternative_data ? (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Alternative Name</Table.HeaderCell>
                  <Table.HeaderCell>
                    Final Alternative Global Weight
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {alternative_data.alt_list.map((alt, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{alt.name}</Table.Cell>
                    <Table.Cell>{alt.weight}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : loading ? (
            <div>Loading...</div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default BidResult;

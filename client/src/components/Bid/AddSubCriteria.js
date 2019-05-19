import React, { Component } from "react";
import { Input, Form, Header, Image, List, Icon } from "semantic-ui-react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { config } from "../../config";
const apiUrl = config.apiUrl;

class AddSubCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid_id: "",
      title: "",
      description: "",
      criteria_id: "",
      subcriteria: [],
      criteria: [],
      the_criteria: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getBidDetails = () => {
    const { bid_id, criteria_id } = this.state;
    axios
      .get(`${apiUrl}/api/bid/${bid_id}`)
      .then(response => {
        const bid = response.data.bid;
        const criteria = bid.criteria;
        const the_criteria = criteria.find(crt => crt._id === criteria_id);
        console.log(the_criteria);
        this.setState({
          bid: bid,
          criteria: bid.criteria,
          subcriteria: the_criteria.subcriteria,
          the_criteria: the_criteria
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.setState({
      bid_id: this.props.match.params.bid_id,
      criteria_id: this.props.match.params.criteria_id
    });
    this.getBidDetails();
  }

  componentWillMount() {
    this.setState({
      bid_id: this.props.match.params.bid_id,
      criteria_id: this.props.match.params.criteria_id
    });
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
    const { title, description, bid_id, criteria_id } = this.state;
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("criteria_id", criteria_id);

    axios
      .post(`${apiUrl}/api/bid/${bid_id}/subcriteria`, data)
      .then(response => {
        console.log(response.data);
        const bid = response.data.bid;
        const criteria = bid.criteria;
        const the_criteria = criteria.find(crt => crt._id === criteria_id);
        console.log(the_criteria);
        this.setState({
          bid: bid,
          criteria: bid.criteria,
          subcriteria: the_criteria.subcriteria,
          the_criteria: the_criteria,
          title: "",
          description: ""
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  deleteSubCriteria = id => {
    const { bid_id, criteria_id, subcriteria } = this.state;
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this Alternative.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete(
                `${apiUrl}/api/bid/${bid_id}/criteria/${criteria_id}/sub/${id}`
              )
              .then(response => {
                // slice it off from the state
                for (var i = 0; i < subcriteria.length; i++) {
                  if (subcriteria[i]._id === id) {
                    subcriteria.splice(i, 1);
                    break;
                  }
                }
                this.setState({ subcriteria: subcriteria });
              })
              .catch(error => {
                console.log(error);
              });
          }
        },
        {
          label: "No"
          // onClick: () => alert("Click No")
        }
      ]
    });
  };

  render() {
    const { title, description, subcriteria, the_criteria } = this.state;
    return (
      <div className="ui container grid">
        <div className="eight wide column">
          <Header>
            List of sub-criteria for <span>{the_criteria.title}</span>
          </Header>
          <div className="ui segment">
            <List animated verticalAlign="middle">
              {subcriteria.map(sub => {
                return (
                  <List.Item key={sub._id}>
                    <List.Icon name="algolia" />

                    <List.Content>
                      <List.Header>
                        {sub.title}{" "}
                        <span
                          className="ui icon button"
                          onClick={() => this.deleteSubCriteria(sub._id)}
                          data-tooltip="Delete this criteria"
                        >
                          {" "}
                          <Icon name="delete" size="small" />{" "}
                        </span>
                      </List.Header>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </div>
        </div>
        <div className="eight wide column">
          <Header>Add Sub-Criteria</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <Input
                placeholder="Enter sub-criteria"
                type="text"
                error="wrong"
                success="right"
                name="title"
                value={title}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                error="wrong"
                success="right"
                value={description}
                name="description"
                placeholder="Description"
                onChange={this.handleChange}
              />
            </Form.Field>
            <button classNameName="ui teal labeled icon button" type="submit">
              Submit
              <i className="add icon" />
            </button>
          </Form>
        </div>
      </div>
    );
  }
}

export default AddSubCriteria;

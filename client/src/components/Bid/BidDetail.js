import React, { Component } from "react";
import { Header, Button, Form, Icon, Card } from "semantic-ui-react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { render } from "react-dom";
import Modal from "react-responsive-modal";

class BidDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid_id: "",
      bid: {},
      criteria: [],
      contractors: [],
      edit_price: false,
      price: "",
      open: false,
    };
  }

  onOpenModal = id => {
    this.setState({ open: true, alt_id: id });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  getBidDetails = () => {
    const { bid_id } = this.state;
    axios
      .get(`/api/bid/${bid_id}`)
      .then(bid => {
        const returned_bid = bid.data.bid;
        this.setState({
          bid: returned_bid,
          criteria: returned_bid.criteria,
          contractors: returned_bid.contractors,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.setState({ bid_id: this.props.match.params.id });
    this.getBidDetails();
  }

  componentWillMount() {
    this.setState({ bid_id: this.props.match.params.id });
    // this.getBidDetails();
  }

  deleteCriteria = id => {
    const { bid_id } = this.state;
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this Criteria.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete(`/api/bid/${bid_id}/criteria/${id}`)
              .then(response => {
                // slice it off from the state
                const { criteria } = this.state;
                for (var i = 0; i < criteria.length; i++) {
                  if (criteria[i]._id === id) {
                    criteria.splice(i, 1);
                    break;
                  }
                }
                this.setState({ criteria: criteria });
              })
              .catch(error => {
                console.log(error);
              });
          },
        },
        {
          label: "No",
          // onClick: () => alert("Click No")
        },
      ],
    });
  };

  editPrice = async id => {
    //   edit Price
    await this.setState({ edit_price: true });
    const { price } = this.state;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>Edit</h1>
            <p>Enter quoted bid price</p>
            <Form
              onSubmit={() => {
                this.submitPrice(id, price);
                this.getBidDetails();
                onClose();
              }}
            >
              <Form.Field>
                <input
                  label="Bid Price"
                  placeholder="Enter Price"
                  type="text"
                  name="price"
                  value={price}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <button type="submit" className="ui green button">
                Update
              </button>
            </Form>
          </div>
        );
      },
    });
  };

  deleteAlternative = id => {
    const { bid_id } = this.state;
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this Alternative.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            axios
              .delete(`/api/bid/${bid_id}/contractor/${id}`)
              .then(response => {
                // slice it off from the state
                const { contractors } = this.state;
                for (var i = 0; i < contractors.length; i++) {
                  if (contractors[i]._id === id) {
                    contractors.splice(i, 1);
                    break;
                  }
                }
                this.setState({ contractors: contractors });
              })
              .catch(error => {
                console.log(error);
              });
          },
        },
        {
          label: "No",
          // onClick: () => alert("Click No")
        },
      ],
    });
  };

  handleChange = async event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    await this.setState({
      [name]: value,
    });
  };

  submitPrice = async (id, price) => {
    // e.prevendDefault();
    await this.setState({ price });
    const { bid_id } = this.state;
    const data = new FormData();
    data.append("price", price);
    console.log(bid_id);
    console.log(id);

    axios
      .post(`/api/bid/${bid_id}/add-contractor-price/${id}`, data)
      .then(resp => {
        console.log(resp);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { bid, bid_id, criteria, contractors, open, price } = this.state;
    // const { criteria, contractors } = bid;
    console.log(contractors);
    console.log(bid);
    return (
      <div className="ui container">
        <div>
          <div class="ui top segment banner">
            <div>
              <Header>Bid Details</Header>
              <h4>{bid.name}</h4>
              <h5>{bid.description}</h5>
            </div>
          </div>
        </div>
        <div className="ui grid">
          <div className="eight wide column">
            <h4 class="ui horizontal divider header">
              <i class="tag icon" />
              Criteria
            </h4>
            <Card.Group>
              {criteria.map(crt => {
                return (
                  <Card fluid color="green" key={crt._id}>
                    <Card.Content>
                       
                      <Card.Header>
                        <a href={"/bid/" + bid_id + "/" + crt._id}>
                          {crt.title}
                        </a>
                      </Card.Header>
                      <Card.Meta>
                        {crt.subcriteria.length} sub-criteria
                      </Card.Meta>
                      <Card.Description>{crt.description}</Card.Description>
                    </Card.Content>
                    <Card.Meta>
                      <button
                        className="ui red icon button"
                        onClick={() => this.deleteCriteria(crt._id)}
                        data-tooltip="Delete this criteria"
                      >
                        {" "}
                        <Icon name="delete" size="large" />{" "}
                      </button>
                    </Card.Meta>
                  </Card>
                );
              })}
            </Card.Group>

            <a className="ui primary button" href={"/add-criteria/" + bid_id}>
              Add Criteria
            </a>
          </div>

          <div className="eight wide column">
            <h4 class="ui horizontal divider header">
              <i class="tag icon" />
              Alternatives
            </h4>
            <Card.Group>
              {contractors.map(crt => {
                return (
                  <Card fluid color="green" key={crt._id}>
                    <Card.Content>
                       
                      <Card.Header>
                        {" "}
                        <a href={"/alt/" + bid_id + "/" + crt._id}>
                          {crt.name}
                        </a>{" "}
                      </Card.Header>
                      <Card.Meta>
                        Quoted Price:{" "}
                        <span>₦ {crt.price ? crt.price : "0.00"}</span>
                      </Card.Meta>
                      <Card.Description>{crt.address}</Card.Description>
                    </Card.Content>
                    <Card.Meta>
                      <button
                        className="ui grey icon button"
                        onClick={() => this.onOpenModal(crt._id)}
                        data-tooltip="Edit Alternative Price"
                      >
                        <Icon name="edit" size="large" /> Edit Price
                      </button>
                      <button
                        className="ui red icon button"
                        onClick={() => this.deleteAlternative(crt._id)}
                        data-tooltip="Delete this alternative"
                      >
                        <Icon name="delete" size="large" /> Delete
                      </button>
                    </Card.Meta>
                  </Card>
                );
              })}
            </Card.Group>
            <a
              className="ui primary button"
              href={"/new-alternative/" + bid_id}
            >
              Add Alternative
            </a>
          </div>
        </div>
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>Simple centered modal</h2>
          <Form
            onSubmit={() => {
              this.submitPrice(this.state.alt_id, price);
              this.getBidDetails();
              this.onCloseModal();
            }}
          >
            <Form.Field>
              <input
                label="Bid Price"
                placeholder="Enter Price"
                type="text"
                name="price"
                value={price}
                onChange={this.handleChange}
              />
            </Form.Field>
            <button type="submit" className="ui green button">
              Update
            </button>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default BidDetail;

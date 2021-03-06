import React, { Component } from "react";
import { Form, Header, Button, List, Image } from "semantic-ui-react";
import Axios from "axios";
const apiUrl = "http://localhost:5000";

class EditAlternative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid_id: "",
      contractor_id: "",
      file_title: "",
      document: null,
      loaded: 0,
      bid: {},
      contractors: [],
      contractor: {},
      documents: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectedFile = this.handleSelectedFile.bind(this);
  }

  getBidDetails = () => {
    const { bid_id, contractor_id } = this.state;
    Axios.get(`${apiUrl}/api/bid/${bid_id}`)
      .then(response => {
        console.log(response.data);
        const bid = response.data.bid;
        const contractors = bid.contractors;
        const contractor = contractors.find(crt => crt._id === contractor_id);
        console.log(contractor.documents);
        this.setState({
          bid: bid,
          contractors: bid.contractors,
          contractor: contractor,
          documents: contractor.documents
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleSelectedFile = e => {
    this.setState({
      document: e.target.files[0],
      loaded: 0
    });
  };

  componentDidMount() {
    this.setState({
      bid_id: this.props.match.params.bid_id,
      contractor_id: this.props.match.params.contractor_id
    });
    this.getBidDetails();
  }

  componentWillMount() {
    this.setState({
      bid_id: this.props.match.params.bid_id,
      contractor_id: this.props.match.params.contractor_id
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

  handleSubmit = event => {
    event.preventDefault();
    const { file_title, document, bid_id, contractor_id } = this.state;

    const data = new FormData();
    data.append("file_title", file_title);
    data.append("contractor_id", contractor_id);
    if (document) {
      data.append("document", document, document.name);

      Axios.post(`${apiUrl}/api/bid/${bid_id}/alternative/upload`, data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      }).then(response => {
        console.log(response.data);
        console.log(response.data);
        const bid = response.data.bid;
        const contractors = bid.contractors;
        const contractor = contractors.find(crt => crt._id === contractor_id);
        console.log(contractor.documents);
        this.setState({
          bid: bid,
          contractors: bid.contractors,
          contractor: contractor,
          documents: contractor.documents,
          file_title: "",
          document: null
        });
        // this.props.history.push("/bid/" + bid_id);
      });
    }
  };

  render() {
    const { file_title, documents } = this.state;
    return (
      <div className="ui container grid">
        <div className="eight wide column">
          <Header>List of documents already uploaded</Header>
          <div class="ui segment">
            <List animated verticalAlign="middle">
              {documents.map(doc => {
                return (
                  <List.Item key={doc._id}>
                    <Image
                      avatar
                      src="https://react.semantic-ui.com/images/avatar/small/helen.jpg"
                    />

                    <List.Content>
                      <List.Header>{doc.file_title}</List.Header>
                      <List.Description>
                        <a
                          href={doc.filename}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </div>
        </div>
        <div className="eight wide column">
          <Header>Update a Alternative</Header>
          <Form onSubmit={this.handleSubmit} enctype="multipart/form-data">
            <Form.Field>
              <input
                type="text"
                name="file_title"
                placeholder="Enter document description"
                value={file_title}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <div class="ui right labeled left icon input">
                <i class="book icon" />
                <input
                  type="file"
                  name="document"
                  placeholder="Select the document"
                  onChange={this.handleSelectedFile}
                />
                <a class="ui tag label" href="!#">
                  {Math.round(this.state.loaded, 2)} %
                </a>
              </div>
            </Form.Field>

            <Button primary type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditAlternative;

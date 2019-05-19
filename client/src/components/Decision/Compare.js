import React, { Component } from "react";
import {
  Header,
  Button,
  Checkbox,
  Icon,
  Dropdown,
  Grid,
  Label
} from "semantic-ui-react";
import { compareOptions } from "../../constants";

class Compare extends Component {
  state = {};
  handleChange2 = (e, { value }) => {
    this.setState({ value, name: e.name });
    this.props.onHandleSelect(value, e.name);
    console.log(e);
  };

  handleChange = (i, event) => {
    this.setState({ value: event.value, name: event.name });
    this.props.onHandleSelect(event.value, event.name);
    // console.log(event);
  };

  render() {
    const { value } = this.state;
    const { from_text, to_text, name } = this.props;
    return (
      <Grid column={5}>
        <Grid.Column width={2} />
        <Grid.Row>
          <Grid.Column width={3}>
            <Label size="big">{from_text}</Label>
          </Grid.Column>
          <Grid.Column width={8}>
            <Dropdown
              className="cmp-drop"
              ref={ref => (this.dropdown = ref)}
              placeholder="Select .."
              selection
              options={compareOptions}
              value={value}
              name={name}
              onChange={this.handleChange}
            />
          </Grid.Column>
          <Grid.Column width={2}>
            <Label size="big">{to_text}</Label>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Compare;

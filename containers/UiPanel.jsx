import React from 'react';

class UiPanel extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <ul> {this.props.comments.map(renderComment)} </ul>;
  }
  renderComment({body, author}) {
    return <li>{body}—{author}</li>;
  }
}

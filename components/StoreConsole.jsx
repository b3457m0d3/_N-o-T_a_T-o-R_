import React from 'react';

class StoreConsole extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.getStore = () => store.getState();
  }
  render() {
    return (
      <div>
        <div className="store-console">
          {this.getStore()}
        </div>
      </div>
    );
  }
}

export default StoreConsole;

import React from 'react';
import ReactDOM from 'react-dom';

class Knob extends React.Component {
  componentDidMount(){
    const { text, ...config } = this.props;
    $(ReactDOM.findDOMNode(this)).dial(
      min:this.props.min || 0,
      max:this.props.max || 100,
      stopper:this.props.stopper || true,
      readOnly:this.props.readOnly || false,
      flatMouse:this.props.flatMouse || false,
      noScroll:this.props.noScroll || false,
      cursor:this.props.cursor || 'gauge',
      thickness:this.props.thickness,
      width:this.props.width,
      displayInput:this.props.displayInput,
      displayPrevious:this.props.displayPrevious,
      fgColor:this.props.fgColor,
      bgColor:this.props.bgColor,
      release:this.props.release,
      change:this.props.change,
      draw:this.props.draw,
      cancel:this.props.cancel,
      start:this.props.start
    );
  }
  render() {
    return <Knob

    />
}
export default Knob;

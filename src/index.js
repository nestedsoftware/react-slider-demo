import React from "react";
import ReactDOM from "react-dom";

import TweenLite from 'gsap/TweenLite'
import 'gsap/CSSPlugin'

import css from "./index.css"

const sliderMinX = 0
const sliderMaxX = 240

const coldGradient = {start: '#5564C2', end: '#3A2E8D'}
const hotGradient = {start:'#F0AE4B', end: '#9B4D1B'}

class ReactSliderDemo extends React.Component {
  constructor(props) {
    super(props);

    this.startDrag = this.startDrag.bind(this)
    this.startTouchDrag = this.startTouchDrag.bind(this)
    this.mouseMoving = this.mouseMoving.bind(this)
    this.touchMoving = this.touchMoving.bind(this)    
    this.stopDrag = this.stopDrag.bind(this)
    this.bgStyle = this.bgStyle.bind(this)

    this.temperatureGrades = [10, 15, 20, 25, 30]
    
    this.state = {
      dragging: false,
      sliderX: 0,
      gradientStart: coldGradient.start,
      gradientEnd: coldGradient.end     
    }
  }

  get gradientStart() {
    return this.state.gradientStart
  }

  set gradientStart(value) {
    this.setState({gradientStart: value})
  }

  get gradientEnd() {
    return this.state.gradientEnd
  }

  set gradientEnd(value) {
    this.setState({gradientEnd: value})
  }

  commonStartDrag(pageX) {
    this.initialMouseX = pageX
    this.setState({dragging: true})
    this.initialSliderX = this.state.sliderX
  }

  startDrag(e) {
    const pageX = e.pageX
    this.commonStartDrag(pageX)
  }

  startTouchDrag(e) {
    e.preventDefault()
    const pageX = e.changedTouches[0].pageX
    this.commonStartDrag(pageX)
  }

  stopDrag() {
    this.setState({dragging: false})
  }

  commonMoving(pageX) {
    if(this.state.dragging) {
      const dragAmount = pageX - this.initialMouseX
      const targetX = this.initialSliderX + dragAmount

      // keep slider inside limits
      const sliderX = Math.max(Math.min(targetX, sliderMaxX), sliderMinX)
      this.setState({sliderX: sliderX})


      let targetGradient = coldGradient
      if (this.currentTemperature >= 25) {
        targetGradient = hotGradient
      }

      if(this.activeGradientStart !== targetGradient.start) {
        this.activeGradientStart = targetGradient.start

        // gradient changed
        TweenLite.to(this, 0.7, {
          'gradientStart': targetGradient.start,
          'gradientEnd': targetGradient.end
        }) 
      }
    }     
  }  

  mouseMoving(e) {
    const pageX = e.pageX
    this.commonMoving(pageX)
  }

  touchMoving(e) {
    e.preventDefault()
    const pageX = e.changedTouches[0].pageX
    this.commonMoving(pageX)
  }

  get currentTemperature () {
    const tempRangeStart = 10
    const tempRange = 20 // from 10 - 30
    return (this.state.sliderX / sliderMaxX * tempRange ) + tempRangeStart
  } 

  tempElementStyle (temp) {
    const nearDistance = 3
    const liftDistance = 12

    // lifts up the element when the current temperature is near it
    const diff = Math.abs(this.currentTemperature - temp)
    const distY = (diff/nearDistance) - 1

    // constrain the distance so that the element doesn't go to the bottom
    const elementY = Math.min(distY*liftDistance, 0)
    const lift =  {top: `${elementY}px`}

    return lift
  }  
  
  bgStyle () {
    return { background: 
      'linear-gradient(to bottom right,'
      + `${this.gradientStart}, ${this.gradientEnd})` }
  }

  render() {
    return (
      <div id="app" className="main-container">
        
        <div className="upper-container" style={this.bgStyle()}>
          <h2 className="temperature-text">
            {Math.round(this.currentTemperature)}
          </h2>
          
          <div className="temperature-graduation">
            { this.temperatureGrades.map((temp, i) => (
              <div className="temperature-element" 
                style={this.tempElementStyle(temp)} key={i}>
                <span className="temperature-element-number">{temp}</span>
                <br/>
                <span className="temperature-element-line">|</span>
              </div> )
            )}
          </div>  
        </div>  

        <div className="lower-container">
          <div className={'slider-container ' + (this.state.dragging ? 'grabbing ' : '')}
            onMouseMove={this.mouseMoving}
            onTouchMove={this.touchMoving}
            onMouseUp={this.stopDrag}     
            onTouchEnd={this.stopDrag}     
            style={{left: this.state.sliderX}}>
            <svg width="150" height="30" viewBox="0 0 150 30" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M74.3132 0C47.0043 2.44032e-05 50.175 30 
                7.9179 30H144.27C99.4571 30 101.622 -2.44032e-05 74.3132 0Z" 
                transform="translate(-7.38794 0.5)" fill="#12132C"/>
            </svg>            
        
            <div className={'slider-button ' 
              + (this.state.dragging ? 'grabbing ' : '')}
              onMouseDown={this.startDrag}
              onTouchStart={this.startTouchDrag}>
              <i className="slider-icon"></i>
            </div>
          </div>
        </div>        
      </div>   
    )
  }  
}

ReactDOM.render(<ReactSliderDemo/>, document.getElementById('root'));

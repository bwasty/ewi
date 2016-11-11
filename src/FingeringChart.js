import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { prettyAccidental, adjustOctave } from './Util'
import { isStandardFingering } from './Fingering'

export default class FingeringChart extends Component {
  constructor() {
    super()
    this.state = { hovered: false }
  }
  onMouseMove = () => {
    if (!this.props.handleMouseOver)
      return

    this.props.handleMouseOver(this.props.index)
    this.setState({ hovered: true })
  }
  onMouseLeave = () => {
    if (!this.props.handleMouseLeave)
      return

    this.props.handleMouseLeave(this.props.index)
    this.setState({ hovered: false })
  }
  render() {
    let mainClasses = []
    if (this.props.readonly)
      mainClasses.push('readonly')
    if (this.props.selectable) 
      mainClasses.push('hover-background')
  
    return (
      <div
        style={{ height: this.props.height, marginBottom: !this.props.showNote && '16px', display: 'inline-block' }}
        onMouseOver={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        onClick={() => this.props.selectable && this.props.selectChart(this.props.fingering.bitmask)}
        >
        <svg
          height="100%"
          viewBox="0 0 160 595"
          className={mainClasses.join(' ')}>
          <g id="allkeys">
            <Keys
              index={this.props.index}
              fingering={this.props.fingering}
              handleKeyClick={this.props.handleKeyClick}
              />
            <OctaveRollers
              index={this.props.index}
              roller={this.props.fingering.roller}
              handleRollerClick={this.props.handleRollerClick}
              />
          </g>
        </svg>
        { this.props.showNote &&
          <div style={{ textAlign: 'center' }}>
            <a
              className='note-selector'
              style={{
                textDecoration: 'none',
                color: 'initial',
                fontSize: '1.2em',
                fontWeight: 'bold',
                padding: '10px', // TODO!: half-working, improve...http://stackoverflow.com/questions/15611905/making-the-clickable-area-of-in-line-links-bigger-without-affecting-the-layout
                margin: '-10px'
              }}
              href='#'
              onClick={(e) => { e.preventDefault(); this.props.selectChart(this.props.index) }}>
              <span style={{ textDecoration: this.state.hovered ? 'underline' : 'none', }}>
                {prettyAccidental(adjustOctave(this.props.fingering.note, this.props.fingering.roller))}
              </span>
              <div
                className='selection-dot'
                style={{
                  color: (this.props.selected || !this.state.hovered) ? '#337ab7' : 'darkgrey',
                  fontSize: '2em',
                  lineHeight: '12px',
                  visibility: this.props.selected ? 'visible' : 'hidden'
                }}>
                &bull;
              </div>
            </a>

          </div>
        }

        { !this.props.showNote && 
          <OverlayTrigger placement="bottom" overlay={
            <Tooltip id="tooltip">
              {isStandardFingering(this.props.fingering) ? 'Standard Fingering' : 'Selected Fingering'}
            </Tooltip>}>
            <div
              className='selection-dot'
              style={{
                textAlign: 'center',
                color: isStandardFingering(this.props.fingering) ? 'gold' : '#337ab7',
                fontSize: '2em',
                lineHeight: '12px',
                visibility: (this.props.selected || isStandardFingering(this.props.fingering)) ? 'visible' : 'hidden'
              }}>
              &bull;
            </div>
           </OverlayTrigger>
        }
      </div>
    )
  }
}

class Keys extends Component {
  classes(key) {
    let classes = []
    if (this.props.fingering[key].pressed)
      classes.push('closed')

    if (this.props.fingering[key].diff === 1)
      classes.push('diff-added')
    else if (this.props.fingering[key].diff === -1)
      classes.push('diff-removed')

    return classes.join(' ')
  }
  onClick = (e) => {
    this.props.handleKeyClick && this.props.handleKeyClick(e.target.id, this.props.index)
  }
  render() {
    return (
      <g id='keys'>
        <path
          id="lh1" name="Left first finger"
          className={this.classes('lh1')}
          onClick={this.onClick}
          d="M 95.856234,49 C 107.43729,49 116.85623,39.58106 116.85623,28 C 116.85623,16.41894 107.43729,7 95.856234,7 C 84.275174,7 74.856234,16.41894 74.856234,28 C 74.856234,39.58106 84.275174,49 95.856234,49 z" />
        <path
          id="bis" name="Bis key"
          className={this.classes('bis')}
          onClick={this.onClick}
          d="M 104.06837,69.61814 C 113.00841,67.98276 123.00841,65.48276 124.29452,61.43274 C 124.90185,57.38622 122.2719,53.24734 116.20405,54.88442 C 102.86674,62.29678 88.944224,61.21206 75.508414,54.88442 C 69.440564,53.24734 66.810614,57.38622 67.417944,61.43274 C 68.704054,65.48276 78.704054,67.98276 87.644094,69.61814 C 93.076994,70.62682 98.619224,70.32573 104.06837,69.61814 z" />
        <path
          id="lh2" name="Left second finger"
          className={this.classes('lh2')}
          onClick={this.onClick}
          d="M 95.856234,122.11217 C 107.43729,122.11217 116.85623,112.69323 116.85623,101.11217 C 116.85623,89.53111 107.43729,80.11217 95.856234,80.11217 C 84.275174,80.11217 74.856234,89.53111 74.856234,101.11217 C 74.856234,112.69323 84.275174,122.11217 95.856234,122.11217 z" />
        <path
          id="lh3" name="Left third finger"
          className={this.classes('lh3')}
          onClick={this.onClick}
          d="M 95.856234,182.11216 C 107.43729,182.11216 116.85623,172.69322 116.85623,161.11216 C 116.85623,149.5311 107.43729,140.11216 95.856234,140.11216 C 84.275174,140.11216 74.856234,149.5311 74.856234,161.11216 C 74.856234,172.69322 84.275174,182.11216 95.856234,182.11216 z" />
        <path
          id="lpinky1" name="Left little finger 1"
          className={this.classes('lpinky1')}
          onClick={this.onClick}
          d="M 84.330714,208.4849 C 84.330714,212.72754 90.088074,218.4849 94.330714,218.4849 C 119.33071,218.4849 108.33071,218.4849 133.33071,213.4849 C 135.41083,213.06888 138.33071,210.60622 138.33071,208.4849 C 138.33071,206.36358 135.41083,203.90092 133.33071,203.4849 C 108.33071,198.4849 119.33071,198.4849 94.330714,198.4849 C 90.088074,198.4849 84.330714,204.24226 84.330714,208.4849 z" />
        <path
          id="lpinky2" name="Left little finger 2"
          className={this.classes('lpinky2')}
          onClick={this.onClick}
          d="M 84.330714,240.68534 C 84.330714,244.92798 90.088074,250.68534 94.330714,250.68534 C 119.33071,250.68534 124.33071,250.68534 149.33071,245.68534 C 151.41083,245.26932 154.33071,242.80666 154.33071,240.68534 C 154.33071,238.56402 151.41083,236.10136 149.33071,235.68534 C 124.33071,230.68534 119.33071,230.68534 94.330714,230.68534 C 90.088074,230.68534 84.330714,236.4427 84.330714,240.68534 z" />

        <path
          id="separator" name="Separator"
          d="M 45.388815,270.08405 L 139.63124,270.08405" />

        <path
          id="rside" name="Right side key"
          className={this.classes('rside')}
          onClick={this.onClick}
          d="M 109,299.48276 C 109,303.7254 103.24264,309.48276 99.000004,309.48276 C 74.000004,309.48276 85.000004,309.48276 60.000004,304.48276 C 57.919884,304.06674 55.000004,301.60408 55.000004,299.48276 C 55.000004,297.36144 57.919884,294.89878 60.000004,294.48276 C 85.000004,289.48276 74.000004,289.48276 99.000004,289.48276 C 103.24264,289.48276 109,295.24012 109,299.48276 z" />
        <path
          id="rh1" name="Right first finger"
          className={this.classes('rh1')}
          onClick={this.onClick}
          d="M 95.856234,367.60118 C 107.43729,367.60118 116.85623,358.18224 116.85623,346.60117 C 116.85623,335.02011 107.43729,325.60117 95.856234,325.60117 C 84.275174,325.60117 74.856234,335.02011 74.856234,346.60117 C 74.856234,358.18224 84.275174,367.60118 95.856234,367.60118 z" />
        <path
          id="rh2" name="Right second finger"
          className={this.classes('rh2')}
          onClick={this.onClick}
          d="M 95.856234,428.71337 C 107.43729,428.71337 116.85623,419.29443 116.85623,407.71337 C 116.85623,396.13231 107.43729,386.71337 95.856234,386.71337 C 84.275174,386.71337 74.856234,396.13231 74.856234,407.71337 C 74.856234,419.29443 84.275174,428.71337 95.856234,428.71337 z" />
        <path
          id="rh3" name="Right third finger"
          className={this.classes('rh3')}
          onClick={this.onClick}
          d="M 95.856234,488.11218 C 107.43729,488.11218 116.85623,478.69324 116.85623,467.11218 C 116.85623,455.53112 107.43729,446.11218 95.856234,446.11218 C 84.275174,446.11218 74.856234,455.53112 74.856234,467.11218 C 74.856234,478.69324 84.275174,488.11218 95.856234,488.11218 z" />
        <path
          id="rpinky1" name="Right little finger 1"
          className={this.classes('rpinky1')}
          onClick={this.onClick}
          d="M 111,513.48276 C 111,517.7254 105.24264,523.48276 101,523.48276 C 76.000004,523.48276 87.000004,523.48276 62.000004,518.48276 C 59.919884,518.06674 57.000004,515.60408 57.000004,513.48276 C 57.000004,511.36144 59.919884,508.89878 62.000004,508.48276 C 87.000004,503.48276 76.000004,503.48276 101,503.48276 C 105.24264,503.48276 111,509.24012 111,513.48276 z" />
        <path
          id="rpinky2" name="Right little finger 2"
          className={this.classes('rpinky2')}
          onClick={this.onClick}
          d="M 111,545.68321 C 111,549.92585 105.24264,555.68321 101,555.68321 C 76.000004,555.68321 71.000004,555.68321 46.000004,550.68321 C 43.919884,550.26719 41.000004,547.80453 41.000004,545.68321 C 41.000004,543.56189 43.919884,541.09923 46.000004,540.68321 C 71.000004,535.68321 76.000004,535.68321 101,535.68321 C 105.24264,535.68321 111,541.44057 111,545.68321 z" />
        <path
          id="rpinky3" name="Right little finger 3"
          className={this.classes('rpinky3')}
          onClick={this.onClick}
          d="M 111,577.48276 C 111,581.7254 105.24264,587.48276 101,587.48276 C 76.000004,587.48276 55.000004,587.48276 30.000004,582.48276 C 27.919884,582.06674 25.000004,579.60408 25.000004,577.48276 C 25.000004,575.36144 27.919884,572.89878 30.000004,572.48276 C 55.000004,567.48276 76.000004,567.48276 101,567.48276 C 105.24264,567.48276 111,573.24012 111,577.48276 z" />
      </g>
    )
  }
}
class OctaveRollers extends Component {
  class(roller) {
    if (this.props.roller === roller || this.props.roller === roller + 1)
      return 'closed'
    else
      return ''
  }
  onClick = (e) => {
    if (!this.props.handleRollerClick)
      return
    let roller = Math.max(Number(e.target.id), -2)
    this.props.handleRollerClick(roller, this.props.index)
  }
  render() {
    return (
      <g id="octave" className={this.props.roller === 0 ? 'hide-rollers' : ''}>
        <path
          id="4" className={this.class(4)}
          onClick={this.onClick}
          d="M 12.999774,21.445836 L 35.000227,21.445836 C 37.216272,21.445836 39.000309,23.228698 39.000309,25.443284 L 39.000309,37.43563 C 39.000309,39.650216 37.216272,41.433078 35.000227,41.433078 L 12.999774,41.433078 C 10.783728,41.433078 8.9996912,39.650216 8.9996912,37.43563 L 8.9996912,25.443284 C 8.9996912,23.228698 10.783728,21.445836 12.999774,21.445836 z" />
        <path
          id="3" className={this.class(3)}
          onClick={this.onClick}
          d="M 12.999774,41.445835 L 35.000227,41.445835 C 37.216272,41.445835 39.000309,43.228697 39.000309,45.443283 L 39.000309,57.435629 C 39.000309,59.650215 37.216272,61.433077 35.000227,61.433077 L 12.999774,61.433077 C 10.783728,61.433077 8.9996912,59.650215 8.9996912,57.435629 L 8.9996912,45.443283 C 8.9996912,43.228697 10.783728,41.445835 12.999774,41.445835 z" />
        <path
          id="2" className={this.class(2)}
          onClick={this.onClick}
          d="M 12.990632,61.96999 L 35.009374,61.96999 C 37.227262,61.96999 39.012781,63.707209 39.012781,65.865101 L 39.012781,77.550434 C 39.012781,79.708326 37.227262,81.445545 35.009374,81.445545 L 12.990632,81.445545 C 10.772744,81.445545 8.9872248,79.708326 8.9872248,77.550434 L 8.9872248,65.865101 C 8.9872248,63.707209 10.772744,61.96999 12.990632,61.96999 z" />
        <path
          id="1" className={this.class(1)}
          onClick={this.onClick}
          d="M 12.999774,81.445839 L 35.000227,81.445839 C 37.216272,81.445839 39.000309,83.228699 39.000309,85.443284 L 39.000309,97.435619 C 39.000309,99.650203 37.216272,101.43306 35.000227,101.43306 L 12.999774,101.43306 C 10.783728,101.43306 8.9996912,99.650203 8.9996912,97.435619 L 8.9996912,85.443284 C 8.9996912,83.228699 10.783728,81.445839 12.999774,81.445839 z" />
        <path
          id="0" className={this.class(0)}
          onClick={this.onClick}
          d="M 13.000258,101.43311 L 34.999767,101.43311 C 37.215718,101.43311 38.999678,103.21835 38.999678,105.43588 L 38.999678,117.44418 C 38.999678,119.66172 37.215718,121.44695 34.999767,121.44695 L 13.000258,121.44695 C 10.784308,121.44695 9.0003474,119.66172 9.0003474,117.44418 L 9.0003474,105.43588 C 9.0003474,103.21835 10.784308,101.43311 13.000258,101.43311 z" />
        <path
          id="-1" className={this.class(-1)}
          onClick={this.onClick}
          d="M 13.000258,121.43311 L 34.999767,121.43311 C 37.215718,121.43311 38.999678,123.21835 38.999678,125.43588 L 38.999678,137.44418 C 38.999678,139.66172 37.215718,141.44695 34.999767,141.44695 L 13.000258,141.44695 C 10.784308,141.44695 9.0003474,139.66172 9.0003474,137.44418 L 9.0003474,125.43588 C 9.0003474,123.21835 10.784308,121.43311 13.000258,121.43311 z" />
        <path
          id="-2" className={this.class(-2)}
          onClick={this.onClick}
          d="M 13.000258,141.43311 L 34.999767,141.43311 C 37.215718,141.43311 38.999678,143.21834 38.999678,145.43587 L 38.999678,157.44418 C 38.999678,159.66171 37.215718,161.44695 34.999767,161.44695 L 13.000258,161.44695 C 10.784308,161.44695 9.0003474,159.66171 9.0003474,157.44418 L 9.0003474,145.43587 C 9.0003474,143.21834 10.784308,141.43311 13.000258,141.43311 z" />
        <path
          id="-3" className={this.class(-3)}
          onClick={this.onClick}
          d="M 13.000258,161.43311 L 34.999767,161.43311 C 37.215718,161.43311 38.999678,163.21834 38.999678,165.43587 L 38.999678,177.44418 C 38.999678,179.66171 37.215718,181.44695 34.999767,181.44695 L 13.000258,181.44695 C 10.784308,181.44695 9.0003474,179.66171 9.0003474,177.44418 L 9.0003474,165.43587 C 9.0003474,163.21834 10.784308,161.43311 13.000258,161.43311 z" />
      </g>
    )
  }
}

import { Component } from 'react'
import * as React from 'react';
import { StyleSheet, View, requireNativeComponent } from 'react-native'

interface Props {
  /* Wrapper component */
  source,
  style,

  /* Native only */
  paused      : boolean,
  seek        : number,
  resize      : object,
  rate        : number,
  volume      : number,
  snapshotPath: string,

  onVLCPaused       : (event) => void,
  onVLCStopped      : (event) => void,
  onVLCBuffering    : (event) => void,
  onVLCPlaying      : (event) => void,
  onVLCEnded        : (event) => void,
  onVLCError        : (event) => void,
  onVLCProgress     : (event) => void,
  onVLCVolumeChanged: (event) => void,

  /* Required by react-native */
  scaleX    : number,
  scaleY    : number,
  translateX: number,
  translateY: number,
  rotation  : number,
}

interface State {

}

export default class NativeVlcPlayer extends Component<Props, State> {
  private _root: any;
  constructor(props, context) {
    super(props, context);
    this.seek = this.seek.bind(this);
    this.snapshot = this.snapshot.bind(this);
    this._assignRoot = this._assignRoot.bind(this);
    this._onError = this._onError.bind(this);
    this._onProgress = this._onProgress.bind(this);
    this._onEnded = this._onEnded.bind(this);
    this._onPlaying = this._onPlaying.bind(this);
    this._onStopped = this._onStopped.bind(this);
    this._onPaused = this._onPaused.bind(this);
    this._onBuffering = this._onBuffering.bind(this);
    this._onVolumeChanged = this._onVolumeChanged.bind(this)
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  seek(pos) {
    this.setNativeProps({ seek: pos })
  }

  snapshot(path) {
    this.setNativeProps({ snapshotPath: path })
  }

  _assignRoot(component) {
    this._root = component
  }

  _onBuffering(event) {
    if(this.props.onVLCBuffering)
      this.props.onVLCBuffering(event.nativeEvent)
  }

  _onError(event) {
    if(this.props.onVLCError)
      this.props.onVLCError(event.nativeEvent)
  }

  _onProgress(event) {
    if(this.props.onVLCProgress)
      this.props.onVLCProgress(event.nativeEvent)
  }

  _onEnded(event) {
    if(this.props.onVLCEnded)
      this.props.onVLCEnded(event.nativeEvent)
  }

  _onStopped(event) {
    this.setNativeProps({ paused: true });
    if(this.props.onVLCStopped)
      this.props.onVLCStopped(event.nativeEvent)
  }

  _onPaused(event) {
    if(this.props.onVLCPaused)
      this.props.onVLCPaused(event.nativeEvent)
  }

  _onPlaying(event) {
    if(this.props.onVLCPlaying)
      this.props.onVLCPlaying(event.nativeEvent)
  }

  _onVolumeChanged(event) {
    if(this.props.onVLCVolumeChanged)
      this.props.onVLCVolumeChanged(event.nativeEvent)
  }

  render() {
    const {
      source
    } = this.props;
    source.initOptions = source.initOptions || [];
    // repeat the input media
    const nativeProps = {...this.props, ...{
        style             : [ styles.base, this.props.style ],
        source            : source,
        onVLCError        : this._onError,
        onVLCProgress     : this._onProgress,
        onVLCEnded        : this._onEnded,
        onVLCPlaying      : this._onPlaying,
        onVLCPaused       : this._onPaused,
        onVLCStopped      : this._onStopped,
        onVLCBuffering    : this._onBuffering,
        onVLCVolumeChanged: this._onVolumeChanged
      }};

    return (
      <RCTVlcPlayer ref={this._assignRoot} {...nativeProps} />
    )
  }
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden'
  }
});

const RCTVlcPlayer = requireNativeComponent('VlcPlayer');

Ext.require('Ext.plugin.Responsive');
Ext.require('Ext.grid.Grid');

import React, { Component } from 'react'
import {
  Panel
} from '@sencha/ext-react';

Ext.require('Ext.Toast');
import Thumbnail from './Thumbnails/Thumbnail';
import Album from './Albums/Album';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {album: false};
    this.newReleases = new Ext.data.Store({
      fields:[
        {
          name: 'image',
          mapping: 'images[1]'
        }
      ],     
      proxy: {
          type: 'ajax',
          url: 'https://api.spotify.com/v1/browse/new-releases',
          reader: {
              type: 'json',
              rootProperty: 'albums.items'
          }          
      },
      autoLoad: true
  });
    window.Spotify[this.constructor.name] = this;
  }

  render() {
      return (
          <Panel
            layout="fit"
            title="Spotify"
            shadow
          >
            <Thumbnail store = {this.newReleases} onChildTap = {this.onChildTap.bind(this)} />
            <Album album = {this.state.album} onUnSelect = {() => this.setState({album: false})}/>        

          </Panel>

      );    
  }
  onChildTap(dataview, location) {
    this.setState({
      album: location.record
    })
    console.log(location.record.data);
  }

}
export default App;


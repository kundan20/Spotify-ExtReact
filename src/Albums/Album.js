import React, { Component } from 'react';
import { Polar } from '@sencha/ext-charts';
import './Album.scss';
import {
    Dialog,
    Container,
    Grid,
    Column,
    Audio
  } from '@sencha/ext-react';

  class Album extends Component {
    categories = ['acousticness', 'danceability', 'energy', 'liveness', 'loudness', 'valence'];

    constructor(props) {
        super(props);
        this.state = {album: props.album};
        this.audio = React.createRef();
        this.tracks = new Ext.data.Store({             
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    rootProperty: 'tracks.items'
                }          
            },
            autoLoad: true
        });
        this.emptyAudioFeatures = this.categories.map(category => ({category, value: 0}));
        this.audioFeaturesStore = new Ext.data.Store({
            data: this.emptyAudioFeatures
        })

        window.Spotify[this.constructor.name] = this;
    }
    componentDidUpdate(prevProps) {
        if(this.props.album !== prevProps.album) {
            if(this.props.album) {
                this.setState({album: this.props.album});
                this.tracks.load({url: this.props.album.data.href});
            } else {
                this.setState({album: false});
            }
        }
    }
    onSelect(grid, records) {
        console.log(records[0]);
        const record = records[0];
        const audio = this.audio.current.cmp;
        if(record.data.preview_url) {
            audio.setUrl(record.data.preview_url);
            audio.enable();
            audio.play();
        } else {
            audio.stop();
            audio.setUrl(null);
            audio.disable();
        }
        console.log(record.data.name);
        this.fetchAudioFeatures(record.data.id);
    }
    fetchAudioFeatures(trackId) {
        Ext.Ajax.request({
            url: `https://api.spotify.com/v1/audio-features/${trackId}`,

            success: (response, opts) => {
                const resp = Ext.decode(response.responseText);
                const data = this.categories.map(category=> ({category, value: resp[category]}));
                console.log(data);
                this.audioFeaturesStore.setData(data);    
            }
        })
    }


    render() {
        return (
            <Dialog
              displayed={!!this.state.album}
              cls="album"
              title={this.state.album ? this.state.album.data.name : ''}
              closable
              maximizable
              maskTapHandler={dialog => dialog.hide()}
              closeAction="hide"
              bodyPadding="20"
              width={600}
              height={500}
              defaultFocus="#ok"
              layout= {{
                type: 'hbox'
              }}
              onHide = {() => {
                  this.setState({album: false});
                  this.props.onUnSelect();
                  this.audioFeaturesStore.setData(this.emptyAudioFeatures);
                  const audio = this.audio.current.cmp;
                  audio.stop();
                  audio.setUrl(null);
                  audio.disable();                  
                }             
            }            
            >
                <Grid onSelect={this.onSelect.bind(this)} flex={1} hideHeaders={true} store={this.tracks} >
                    <Column text="Name" dataIndex="name" flex="1"/>                  
                    <Column text="Duration"  dataIndex="duration_ms" align="center" width={80} /> 
                    
                </Grid>

                <Container flex={1} layout="vbox">
                    <Audio
                        ref={this.audio}
                        loop
                        disabled={true}                        
                    />
                    <Polar
                    insetPadding={40}
                    flex={1}
                    store={this.audioFeaturesStore}
                    theme="green"
                    interactions={['rotate']}
                    series={[{
                       type: 'radar',
                       angleField: 'category',
                       radiusField: 'value',
                       style: {
                           fillStyle: 'lightblue',
                           fillOpacity: .8,
                           strokeStyle: '#388FAD',
                           strokeOpacity: .8,
                           lineWidth: 1
                       }
                    }]}
                    axes={[{
                       type: 'numeric',
                       position: 'radial',
                       fields: 'value',
                       style: {
                           estStepSize: 10
                       },
                       minimum: 0,
                       maximum: 1,
                       grid: true
                    }, {
                       type: 'category',
                       position: 'angular',
                       fields: 'category',
                       style: {
                           estStepSize: 1
                       },
                       grid: true
                   }]}
                />           
                </Container>
             
                      
            </Dialog>
            
        );
    }
}
export default Album;
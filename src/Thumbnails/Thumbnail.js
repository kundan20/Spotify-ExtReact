import React, { Component } from 'react';
import { DataView } from '@sencha/ext-modern';
import './Thumbnail.scss';

class Thumbnail extends Component {
    constructor(props) {
        super(props);
        Object.assign(Spotify, { Thumbnails: this }); 
    }
    render() {
        return (
            <DataView
                {...this.props}
                cls="albums-view"
                layout={{
                    type: 'hbox',
                    pack: 'space-around',
                    wrap: true
                }}
                scrollable={true}
                itemTpl={[
                    '<figure>',
                    '<div class="thumbnail" style="background-image:url(\'{image.url}\')"></div>',
                    "<figcaption><div class='title'>{name}</div><div class='artist'>{artist}</div></figcaption>",
                    '</figure>'
                ]}
                itemCls="album"
            />
        );
    }
}
export default Thumbnail;
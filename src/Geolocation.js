var GeolocationUtil = require('bindings')('GeolocationUtil');
import {Path, LatLng} from 'leaflet';

export var Geolocation = Path.extend({

    initialize: function(geo, options) {
        this._setGeolocation(geo);
    },

    _setGeolocation: function(geo) {
        this._bounds = null;
        this._geo = this._convertGeolocation(geo);
    },

    _convertGeolocation: function(geo) {
        this._geo.center = new LatLng(geo[0], geo[1], geo[2]);
        this._geo.semimajor = geo[3];
        this._geo.semiminor = geo[4];
        this._vertices = GeolocationUtil.toEllipseVertices(this._geo);
    }

});
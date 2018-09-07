<template>
    <div style="display:none">
        <slot></slot>
    </div>
</template>

<script>
    import L from 'leaflet'
    import mixin from './../mixins/mixin'

    const EVENTS = [
        'add',
        'remove',
        'popupopen',
        'popupclose',
        'tooltipopen',
        'tooltipclose'
    ]

    export default {
        name: 'LLayerGroup',
        mixins: [mixin],
        props: {
            options: {
                type: Object
            }
        },
        mounted() {
            this.leaflet = L.layerGroup(this.options);

            this.addEventHook(this.leaflet, EVENTS);

            if (this.$parent._isMounted) {
                this._initHooks(this.$parent);
            }

            for (let children of this.$children) {
                children._initHooks(this.leaflet);
            }
        },
        beforeDestroy() {
          let parent = this.$parent.leaflet;
          if (parent) {
            this.leaflet.clearLayers();
            parent.removeLayer(this.leaflet);
          }
        },
    }

</script>

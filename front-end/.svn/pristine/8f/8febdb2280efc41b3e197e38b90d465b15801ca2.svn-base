<template>
  <ul
    :class="[
      ripple ? `anim-ripple-${ripple}` : 'anim-ripple',
      {
        'progress-tracker': true,
        [`progress-tracker--${alignment}`]: alignment,
        'progress-tracker--border': border,
        'progress-tracker--spaced': spaced,
        'progress-tracker--word': word,
        [`progress-tracker--word-${wordAlign}`]: wordAlign,
        'progress-tracker--text': text,
        [`progress-tracker--text-${textAlign}`]: textAlign,
        'anim-path': animatePath,
        [`progress-tracker--marker-${markerSize}`] : markerSize
      }]">
      <slot></slot>
  </ul>
</template>

<script>
  export default {
    props: {
      ripple: String,
      alignment: {
        type: String,
        default: 'center'
      },
      border: Boolean,
      spaced: Boolean,
      word: String,
      wordAlign: String,
      text: String,
      textAlign: String,
      animatePath: String,
      single: Boolean,
      defaultActive: [String, Number, Array],
      markerSize: String
    },
    data() {
      return {
        activeIndex: this.defaultActive
      }
    },
    mounted() {
      this.$children.forEach(item => {
        item.$on('item-click', this.handleItemClick);
      })
    },
    watch: {
      defaultActive(val) {
        this.activeIndex = val;
      }
    },
    methods: {
      handleItemClick(item) {
        const { title, index } = item;
        if (this.single) {
          this.activeIndex = item.index;
        } else {
          this.activeIndex = null;
        }
        this.$emit('time-change', index);
      }
    }
  }
</script>

<style lang="scss">
  @import '~progress-tracker/app/styles/progress-tracker.scss';

  .progress-tracker--marker-small .progress-marker{
    width: 22px;
    height: 22px;
  }

  .progress-tracker--marker-mini .progress-marker{
    width: 16px;
    height: 16px;
  }

  .progress-tracker--marker-big .progress-marker{
    width: 30px;
    height: 30px;
  }
</style>
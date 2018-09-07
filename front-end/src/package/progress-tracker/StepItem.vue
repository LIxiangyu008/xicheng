<template>
  <li class="progress-step" 
    :class="{ 'is-active': isActive, 'is-complete': isComplete }"
    @click="handleClick">
    <a :href="href ? href : 'javascript:void(0)'">
      <span class="progress-marker">{{ marker }}</span>
      <span class="progress-text" v-if="title">
        <h4 class="progress-title">{{ title }}</h4>{{ text }}
        <slot></slot>
      </span>
    </a>
  </li>
</template>

<script>
export default {
  props: {
    marker: {
      type: String,
      default: ''
    },
    title: String,
    text: String,
    href: String,
    index: [String, Number]
  },

  created () {
    this._isStepItem = true
  },

  computed: {
    isActive() {
      return this.$parent.activeIndex == this.index ? true : false;
    },
    isComplete() {
      return this.$parent.activeIndex == this.index ? true : false;
    }
  },
  methods: {
    handleClick() {
      this.$emit('item-click', this);
    }
  }
}
</script>
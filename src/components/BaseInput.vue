<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <input
      :value="value"
      v-bind="$attrs"
      @input="updateValue"
      v-on="listeners"
    />
  </div>
</template>

<script>
import { formFieldMixin } from '../mixins/formFieldMixin'

export default {
  mixins: [formFieldMixin],
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.updateValue
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>

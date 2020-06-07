<template>
  <v-img v-if="url" :src="img(url)" @error="setText" />
  <span v-else text>{{ name[0] }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { img } from "@/fetch"

@Component
export default class UserAvatar extends Vue {
  @Prop() url!: string;
  @Prop() size!: number;
  @Prop() name!: string;
  private hasImage: boolean = true;
  private img = img;

  setText() {
    this.hasImage = false;
  }
}
</script>

<style lang="scss" scoped></style>

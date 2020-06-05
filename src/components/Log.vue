<template>
    <v-snackbar v-model="snack.hasInfo" right bottom :timeout="3000">
        {{ snack.infoText }}
        <v-spacer></v-spacer>
        <v-btn icon>
        <v-icon @click="snack.hasInfo = false">close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Snack } from '../snack';

@Component
export default class Log extends Vue {
  @Prop() snack!: Snack;
}
</script>

<style lang="scss" scoped></style>
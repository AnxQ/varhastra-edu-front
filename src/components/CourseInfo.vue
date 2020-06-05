<template>
    <v-row>
        <v-col :cols="6">
            <v-container>

            </v-container>
        </v-col>
        <v-col :cols="3">
            <v-list>
                <v-list-group
                    prepend-icon="account_circle"
                    value="true"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                        <v-list-item-title>教师</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="(teacher, i) in courseInfo.teachers"
                        :key="i"
                        link
                    >
                        <v-list-item-avatar>
                            <v-img :src="teacher.avatar"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="teacher.name"></v-list-item-title>
                            <v-list-item-subtitle v-html="teacher.mail"></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-group
                    prepend-icon="account_circle"
                    value="true"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                        <v-list-item-title>助理</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="(teacher, i) in courseInfo.assistants"
                        :key="i"
                        link
                    >
                        <v-list-item-avatar>
                            <v-img :src="teacher.avatar"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="teacher.name"></v-list-item-title>
                            <v-list-item-subtitle v-html="teacher.mail"></v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-col>
    </v-row>
    
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { CourseInfo, UserInfo } from "@/struct";

@Component
export default class extends Vue {
    @Prop() private courseInfo!: CourseInfo;

}
</script>

<style lang="scss" scoped></style>
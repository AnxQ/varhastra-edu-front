<template>
    <div class="ma-5">
        <v-tabs centered v-model="tab">
            <v-tabs-slider></v-tabs-slider>

            <v-tab :href="`#tab-info`">
                <span><v-icon left>eco</v-icon>课程简介</span>
            </v-tab>

            <v-tab-item value="tab-info">
                <course-info-page v-if="course" :course="course"></course-info-page>

            </v-tab-item>
        </v-tabs>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CourseInfo, UserInfo, CourseInfoResult } from "@/struct";
import { Route } from "vue-router";
import { gqlQuery } from "@/fetch";
import Log from "@/components/Log.vue";
import CourseInfoPage from "@/components/CourseInfoPage.vue"

import { Snack } from "@/snack";

@Component({
  components: {
    CourseInfoPage,
    Log
  }
})

export default class Course extends Vue {
    private tab = null;
    private course: CourseInfo | null = null;
    private snack: Snack = new Snack();
    mounted() {
        this.queryCourseInfo(this.$route.params.course_id);
    }
    @Watch("$route")  
    beforeRouteUpdate(to: Route) {
        this.queryCourseInfo(to.params.course_id)
    }
    queryCourseInfo(courseId: string) {
        this.apolloQuery<CourseInfoResult, { courseId: string }>( 
            gqlQuery.course, 
            { courseId: courseId },
            (data) => {
                this.course = data.course;
            }, 
            this.snack)
    }
}
</script>


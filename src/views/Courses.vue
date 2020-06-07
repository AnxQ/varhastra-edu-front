<template>
    <v-container>
        <v-tabs
            v-model="tab"
        >
            <v-tabs-slider></v-tabs-slider>
            <v-tab :href="`#tab-my`">
                <span><v-icon left>eco</v-icon>我的课程</span>
            </v-tab>
            <v-tab :href="`#tab-teach`">
                <span><v-icon left>assignment_ind</v-icon>授课</span>
            </v-tab>
            <v-tab-item value="tab-my">
                <v-container class="d-flex flex-wrap justify-start">
                <v-card
                    class="course-card"
                    max-width="300"
                    height="368"
                    v-for="course in courses"
                    :key="course.courseId"
                >
                    <v-img class="white--text align-end" height="200px" :src="img(course.cover)"></v-img>
                    <v-card-title>{{ course.title }}</v-card-title>
                    <v-card-subtitle class="pb-0">{{ course.timeOpen}} ~ {{ course.timeClose }}</v-card-subtitle>

                    <v-card-text class="course-description-parent" >
                    <div class="course-description">{{ course.description}}</div>
                    </v-card-text>

                    <v-card-actions>
                    <v-btn color="orange" text @click="$router.push({ name: 'course', params: { course_id: course.courseId }})"
                    > 进入课程 </v-btn>
                    <v-btn color="orange" text> 操作 </v-btn>
                    <v-chip
                            class="ma-2 float-right"
                            :color="courseState[course.state].color"
                            small
                            outlined
                            pill
                        >
                        {{courseState[course.state].text}}
                        <v-icon right small>{{courseState[course.state].icon}}</v-icon>
                    </v-chip>
                    </v-card-actions>
                </v-card>
                </v-container>
            </v-tab-item>
            <v-tab-item  value="tab-teach">
                <v-container class="d-flex flex-wrap justify-start">
                    <v-card
                        class="course-card"
                        max-width="300"
                        height="368"
                        v-for="course in coursesTeach"
                        :key="course.courseId"
                    >
                        <v-img class="white--text align-end" height="200px" :src="img(course.cover)"></v-img>
                        <v-card-title>{{ course.title }}</v-card-title>
                        <v-card-subtitle class="pb-0">{{ course.timeOpen}} ~ {{ course.timeClose }}</v-card-subtitle>

                        <v-card-text class="course-description-parent" >
                        <div class="course-description">{{ course.description}}</div>
                        </v-card-text>

                        <v-card-actions>
                        <v-btn color="orange" text @click="$router.push({ name: 'course', params: { course_id: course.courseId }})"> 进入课程 </v-btn>
                        <v-btn color="orange" text> 操作 </v-btn>
                        <v-chip
                                class="ma-2 float-right"
                                :color="courseState[course.state].color"
                                small
                                outlined
                                pill
                            >
                            {{courseState[course.state].text}}
                            <v-icon right small>{{courseState[course.state].icon}}</v-icon>
                        </v-chip>
                        </v-card-actions>
                    </v-card>
                </v-container>
            </v-tab-item>
        </v-tabs>    
        <Log :snack="snack"></Log>
    </v-container>
    
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { gqlQuery, img } from "@/fetch"
import { CourseInfo, ManyCourseInfoResult } from "@/struct"
import constValue from "@/constValue"
import { Snack } from '../snack';
import Log from '@/components/Log.vue';

@Component({
  components: {
    Log
  }
})
export default class Courses extends Vue {
    private tab = null;
    private courses: CourseInfo[] = [];
    private coursesTeach: CourseInfo[] = [];
    private snack: Snack = new Snack();
    private img: (path: string) => string = img;
    private courseState = constValue.courseState;
    mounted() {
        this.apolloQuery<ManyCourseInfoResult, {}>(
            gqlQuery.courses, {},
            (data) => {
                this.courses = data.courses.filter(course => !course.teach);
                this.coursesTeach = data.courses.filter(course => course.teach);
            },
            this.snack)
    }
}
</script>
<style lang="scss">
.course-title {
    text-shadow: 5px 5px 5px #FF0000;
}

.course-description-parent {
    padding-bottom: 0px;
}

.course-description {
    height: 44px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.course-card {
    margin: 10px;
}
</style>
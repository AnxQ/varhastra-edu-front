<template>
    <v-row>
        <v-col :cols="9">
            <v-row>
                <v-col :cols="4" class="d-flex justify-center">
                    <v-img :src="img(course.cover)" contain></v-img>
                </v-col>
                <v-col :cols="8" class="course-data-text">
                    <div><h2>{{ course.title }}</h2></div>
                    <v-row>
                        <v-chip
                            class="ma-2"
                            :color="courseState[course.state].color"
                            outlined
                            pill
                        >
                        {{courseState[course.state].text}}
                        <v-icon right>{{courseState[course.state].icon}}</v-icon>
                        </v-chip>
                    </v-row>
                    <v-row class="ma-2">
                        <div class="d-flex align-center flex-column pa-0" style="width: 132px">
                            <v-row><span><v-icon left>group</v-icon><strong>参与人数</strong></span></v-row>
                            <v-row>{{ course.userCount }}</v-row>
                        </div>
                        <v-divider inset vertical class="course-data-divider"></v-divider>
                        <div class="d-flex align-center flex-column pa-0" style="width: 132px">
                            <v-row><span><v-icon left>star</v-icon><strong>评分</strong></span></v-row>
                            <v-row>
                                {{ course.sentiAvg > 0 ? course.sentiAvg : `暂无` }}
                            </v-row>
                        </div>
                    </v-row>
                    <v-row class="d-flex ma-2"><span class="align-self-center"><strong>课程标签：</strong></span>
                        <v-chip v-if="course.tags.length <= 1" pill small text-color="white" class="ma-2">暂无</v-chip>
                        <v-chip 
                        v-for="(tag, i) in course.tags" 
                        :key="i" 
                        text-color="white" 
                        :color="colorsCycle[i % colorsCycle.length]"
                        pill small
                        class="ma-2">{{ tag.name }}</v-chip>
                    </v-row>
                    <v-row class="ma-2"><span><strong>课程开放时间：</strong>&nbsp;{{ course.timeOpen }} ~ {{ course.timeClose }}</span></v-row>
                    <v-row class="ma-2"><span><strong>课程描述：</strong>&nbsp;{{ course.description }}</span></v-row>
                </v-col>
            </v-row>
            <comments v-if="course" 
            :comments_="course.comments" 
            :admin="admin"
            :courseId="course.courseId"
            :courseName="course.name"></comments>
        </v-col>
        <v-col :cols="3">
            <v-list rounded dense>
                <v-subheader>任课人员</v-subheader>
                <v-list-group
                    prepend-icon="account_circle"
                    value="true"
                    v-for="(userGroup, i) in userGroups"
                    :key="i"
                >
                    <template v-slot:activator>
                        <v-list-item-content>
                        <v-list-item-title>{{ userGroup.name }}</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        v-for="(member, j) in userGroup.members"
                        :key="j"
                        link
                    >
                        <v-list-item-avatar>
                            <v-avatar
                                class="hoverable"
                                :color="false ? 'grey' : 'blue'"
                                size="32"
                            >
                                <user-avatar
                                class="white--text avatar-text"
                                :url="member.avatar"
                                :size="32"
                                :name="member.name"
                                :key="member.avatar"
                                ></user-avatar>
                            </v-avatar>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-html="member.name"></v-list-item-title>
                            <v-list-item-subtitle v-html="member.mail"></v-list-item-subtitle>
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
import UserAvatar from "@/components/UserAvatar.vue"
import Comments from "@/components/Comments.vue"
import constValue from "@/constValue"
import { img } from "@/fetch";
@Component ({
    components: {
        Comments,
        UserAvatar
    }
})
export default class CourseInfoPage extends Vue {
    @Prop() private course!: CourseInfo;
    private img = img;
    private courseState = constValue.courseState;
    private tags = ["基础课程","机器学习","数学","大数据"]
    private colorsCycle = ["red", "pink", "purple", "deep-purple", "blue", "cyan", "teal", "light-green", "yellow", "orange", "brown"]
    private userGroups = [
        {name: "教师", members: this.course.teachers },
        {name: "助理", members: this.course.assistants },
    ]
    private admin = false; 
    mounted() {
        this.admin = !this.course.assistants.find(user => user.userId == this.$store.state.global.userId) || this.course.teach;

    }
}
</script>

<style lang="scss" scoped>
.avatar-text {
    font-size: .8125rem;
    font-weight: 500;
    line-height: 1rem;
}
.course-data-divider {
    margin: 10px 0;
}
.course-data-width {
    width: 132 !important;
}
.course-data-text {
    font-size: 14px;
}
</style>
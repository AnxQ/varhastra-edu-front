<template>
    <v-container >
        <v-row 
        class="pa-4"
        justify="center">
            <v-card width="80%" outlined>
                <v-card-title>
                    学生管理<v-spacer/>
                    <v-switch v-model="massMode" dense inset label="批量管理" class="hide-message"></v-switch>
                </v-card-title>
                <v-divider/>
                <v-card-text>
                <v-row>
                    <v-col :cols="5">
                        <v-sheet class="pa-4">
                            <v-text-field
                                v-model="search"
                                label="搜索用户"
                                flat
                                solo-inverted
                                hide-details
                                clearable
                                clear-icon="mdi-close-circle-outline"
                            ></v-text-field>
                        </v-sheet>
                        <v-sheet id="scrolling-techniques" class="overflow-y-auto" max-height="600px">
                        <v-treeview
                            v-model="checking"
                            :items="users"
                            item-key="userId"
                            :item-disabled="massMode ? `disable` : ``"
                            :open.sync="open"
                            :active.sync="active"
                            :selectable="massMode"
                            selected-color="primary darken"
                            activatable
                            open-on-click
                            transition
                            >
                            <template v-slot:prepend="{ item, active }">
                                <v-avatar
                                    v-if="!item.children"
                                    class="hoverable"
                                    :color="false ? 'grey' : 'blue'"
                                    size="32"   
                                >
                                    <user-avatar
                                    class="white--text avatar-text"
                                    :url="item.avatar"
                                    :size="32"
                                    :name="item.name"
                                    :key="item.avatar"
                                    ></user-avatar>
                                </v-avatar>
                            </template>
                        </v-treeview>
                        </v-sheet>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col class="d-flex text-center justify-center">
                        <v-scroll-y-transition mode="out-in">   
                            <v-card flat width="80%">
                            <template v-if="selected">
                                <v-card-text>
                                    <v-avatar
                                        class="hoverable ma-4"
                                        :color="false ? 'grey' : 'blue'"
                                        size="64"
                                    >   
                                        <user-avatar
                                        class="white--text"
                                        style="font-size: 1.5rem"
                                        :url="selected.avatar"
                                        :size="64"
                                        :name="selected.name"
                                        :key="selected.avatar"
                                        ></user-avatar>
                                    </v-avatar>
                                    <h3 class="headline mb-2"> {{ selected.name }} </h3>
                                    <div class="blue--text subheading font-weight-bold">{{ selected.number }}</div>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-row
                                class="text-left"
                                tag="v-card-text"
                                >
                                <v-col class="text-right mr-4" tag="strong" cols="5">身份</v-col>
                                    <v-col>{{ userRole[selected.role] }}</v-col>
                                <v-col class="text-right mr-4" tag="strong" cols="5">学院及专业</v-col>
                                    <v-col>{{`${selected.department.name} - ${selected.major.name}`}}</v-col>
                                </v-row>
                            </template>
                            <template>
                                <v-chip
                                v-for="(selection, i) in checking"
                                :key="i"
                                color="grey"
                                dark
                                small
                                class="ma-1"
                                >
                                <v-icon left small>face</v-icon>
                                {{ userDetails.find(u => u.userId == selection).name }}
                                </v-chip>
                            </template>
                            <v-card-actions v-if="(!!previliage && previliage != `teacher`) || massMode">
                                <v-btn outlined color="error" @click="confirmChange(`remove`)">移除</v-btn>
                                <v-spacer/>
                                <v-btn outlined color="warning" @click="confirmChange(`grant`)">授权</v-btn>
                                <v-btn outlined color="primary" @click="confirmChange(`revoke`)">驳回</v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-scroll-y-transition>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
        </v-row>
        <v-dialog v-model="confirm" persistent max-width="290">
            <v-card>
                <v-card-title>确认 {{ confirmAction }} 指定用户？</v-card-title>
                <v-card-text v-if="massMode">
                    <v-chip
                        v-for="(selection, i) in checking"
                        :key="i"
                        color="grey"
                        dark
                        small
                        class="ma-1"
                        >
                        <v-icon left small>face</v-icon>
                        {{ userDetails.find(u => u.userId == selection).name }}
                    </v-chip>
                </v-card-text>
                <v-card-text v-else>
                    <v-chip
                        v-if="selected"
                        color="grey"
                        dark
                        small
                        class="ma-1"
                        >
                        <v-icon left small>face</v-icon>
                        {{ selected.name }}
                    </v-chip>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="confirm = false">取消</v-btn>
                <v-btn color="green darken-1" text @click="submitChange()" :loading="snack.loading">确认</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch} from 'vue-property-decorator'
import { CourseInfo, UserInfoResult, ManyUserInfoResult, UserInfo, CourseChangeInput, Result, CourseInfoResult } from '../struct'
import UserAvatar from "@/components/UserAvatar.vue"
import { Snack } from '../snack';
import { gqlQuery, gqlMutation } from '../fetch';
import constValue  from '@/constValue';

@Component({
    components: {
        UserAvatar
    }
})
export default class CourseAdminPage extends Vue {
    @Prop() private course!: CourseInfo;
    private search: string = "";
    private users = [
        { name: "教师", children: this.course.teachers.map(u => { u.disable = true; return u;}), userId: "teacher" },
        { name: "助理", children: this.course.assistants, userId: "assist" },
        { name: "学生", children: this.course.students, userId: "student" },
    ]
    private userDetails: Array<UserInfo> = [];
    private massMode: boolean = false;
    private open = [ "teacher", "assist", "student" ];
    private active: Array<string> = [];
    private checking: Array<string> = [];
    private snack: Snack = new Snack();
    private userRole = constValue.userRole;
    private confirm = false;
    private confirmAction = '';
    private confirmType: {[key:string]: string} = {
        'remove': "移除",
        'grant': "授权",
        'revoke': "驳回"
    };

    get previliage() {
        if (!this.selected) return undefined;
        let userId = this.selected.userId;
        return this.course.teachers.some(u => u.userId == userId) ? 'teacher' : 
                this.course.assistants.some(u => u.userId == userId) ? 'assist' : 'student';
    }

    get selected() {
        if (!this.active.length) return undefined
        let userId = this.active[0]
        return this.userDetails.find(user => user.userId == userId)
    }

    confirmChange(type: string) {
        this.confirmAction = type
        this.confirm = true;
    }

    @Watch('users', { deep: true})
    onChange(after: any) {
        console.log(after)
    }

    submitChange() {
        this.snack.loading = true;
        this.apolloMutate<Result, CourseChangeInput>(
            gqlMutation.courseChange, 
            {
                type: this.confirmAction,
                userIds: this.massMode ? this.checking : this.active,
                courseId: this.course.courseId
            },
            (data) => {
                this.confirm = false;
                this.apolloQuery<CourseInfoResult, { courseId: string}>(
                    gqlQuery.courseUser, { courseId: this.course.courseId },
                    (update) => {
                        this.users[0].children = update.course.teachers.map(u => { u.disable = true; return u;})
                        this.users[1].children = update.course.assistants
                        this.users[2].children = update.course.students
                    }, this.snack, true
                )
            }, this.snack
        )
    }
    
    mounted() {
        this.apolloQuery<ManyUserInfoResult, { courseId: string }>(
            gqlQuery.usersByCourse, { courseId: this.course.courseId },
            (data) => { 
                this.userDetails = data.users;
            }, this.snack
        )

    }
}
</script>
<style lang="scss" scope>
.hide-message {
    margin-top: 0px;
    .v-input__control {
        .v-messages.theme--light {
            display: none;
        }
    }
}
</style>
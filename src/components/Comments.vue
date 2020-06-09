<template>
    <v-container>
        <v-card outlined class="mx-auto" max-width="800px">
            <v-card-title>评论<v-spacer/>
                <v-btn outlined rounded small color="grey" class="margin-right" @click="addComment({})">评论</v-btn>
                <v-btn outlined rounded small color="grey" @click="scoreDialog = true">打分</v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="comments.length <= 0 || !comments.some(comment => comment.details != `[deleted]`)" class="d-flex align-center justify-center">
                糟了...<v-img :src="img(`not_find.png`)" contain max-width="100"/>...这里什么都没有... 
            </v-card-text>
            <v-list three-line>
                <template v-for="(comment, i) in comments">
                <v-list-item v-if="comment.details != `[deleted]`" :key="comment.commentId" >
                    <v-list-item-avatar>
                        <v-avatar
                            class="hoverable"
                            :color="false ? 'grey' : 'blue'"
                            size="42"
                            left
                        >
                            <user-avatar
                            class="white--text avatar-text"
                            :url="comment.user.avatar"
                            :size="42"
                            :name="comment.user.name"
                            :key="comment.user.avatar"
                            ></user-avatar>
                        </v-avatar>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ comment.user.name }} - <span class="addtion-data-text" color="grey lighten-1">{{ simplifyDate(comment.timeCreate) }}</span></v-list-item-title> 
                        <v-list-item-subtitle><span v-if="comment.replyTo" class="ma-2 pa-2 comment-ref">{{ commentDesc(comment.replyTo) }}</span>{{comment.details}}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-row>
                            <v-btn rounded outlined small color="primary lighten-1" class="margin-right"
                            @click="addComment({ name: comment.user.name, commentId: comment.commentId})">
                                <v-icon>reply</v-icon> 回复
                            </v-btn>
                            <v-btn v-if="comment.user.userId == currentUserId" rounded outlined small 
                            color="green lighten-1" class="margin-right" 
                            @click="editComment(`${comment.commentId}`, false)">
                                <v-icon>edit</v-icon> 编辑
                            </v-btn>
                            <v-btn v-if="admin" rounded outlined small color="red lighten-1" class="margin-right" @click="editComment(`${comment.commentId}`, true)">
                                <v-icon>close</v-icon> 删除
                            </v-btn>
                        </v-row>
                    </v-list-item-action>
                </v-list-item>
                <v-divider
                    inset
                    v-if="i + 1 < comments.length && comment.details != `[deleted]` && comments[i + 1].details != `[deleted]`"
                    :key="`div`+i"
                ></v-divider>
                </template>
            </v-list>
            <v-dialog v-model="commentDialog" persistent max-width="600px">
                <v-card>
                    <v-card-title v-if="!form.del">在课程 {{ courseName }} 中 {{ !form.replyTo.name ? `评论`: `回复 @${form.replyTo.name}`}} </v-card-title>
                    <v-card-title v-if="form.del">确认删除该评论？</v-card-title>
                    <v-card-text v-if="!form.del">
                        <v-row>
                            <v-col :cols="12">
                                <v-textarea
                                v-model="form.details"
                                :rule="rules"
                                counter
                                maxlength="100"
                                >
                                <template v-slot:label>
                                    <div>
                                    内容
                                    </div>
                                </template>
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text @click="commentDialog = false">取消</v-btn>
                        <v-btn text @click="commentSubmit" :loading="form.loading">确认</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="scoreDialog" persistent max-width="600px">
                <v-card>
                    <v-card-text class="text-center">
                    <v-rating 
                    v-model="rating"
                    background-color="orange lighten-3"
                    color="orange"
                    medium>
                    </v-rating>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text @click="scoreDialog = false">取消</v-btn>
                        <v-btn text @click="scoreSubmit" :loading="form.loading">确认</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
        <Log :snack="snack"/>
    </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import UserAvatar from "@/components/UserAvatar.vue"
import Log from "@/components/Log.vue"
import { CommentInfo, CourseInfo, Result, CommentInput, ManyCommentInfoResult, ScoreInput } from "@/struct"
import { img, gqlMutation, gqlQuery } from "@/fetch"
import { simplifyDate } from "@/utils"
import { Snack } from "@/snack"


@Component({
    components:{
        UserAvatar,
        Log
    }
})
export default class Comments extends Vue {
    @Prop() private comments_!: CommentInfo[];
    @Prop() private admin?: boolean;
    @Prop() private courseName!: string;
    @Prop() private courseId!: string
    private comments: CommentInfo[] = this.comments_;
    private currentUserId: string = this.$store.state.global.userId;
    private img = img;
    private simplifyDate = simplifyDate;
    private commentDialog = false;
    private scoreDialog = false;
    private rating: Number = 0;
    private rules = [(v: string) => v.length <= 100 || '最多键入100字符'];
    private form = {
        replyTo: { name: "", commentId: "" },
        commentId: "",
        details: "",
        loading: false,
        del: false
    }
    private snack: Snack = new Snack();
    mounted() {
    }

    commentDesc(commentId: string) {
        let comment = this.comments.find(comment => comment.commentId == commentId);
        if (comment!.details == "[deleted]")
            return `@${comment!.user.name}: [评论已删除]`
        return '@'+ comment!.user.name + ': ' + comment!.details.substr(0, 10) + '...'
    }

    addComment(replyTo: { name:string, commentId:string }) {
        this.form = {
            replyTo: replyTo,
            commentId: "",
            details: "",
            loading: false,
            del: false
        }
        this.commentDialog = true;
    }

    editComment(commentId: string, del: boolean) {
        this.form = {
            replyTo: { name: "", commentId: "" },
            commentId: commentId,
            details: del ? "" : this.comments.find(comment => comment.commentId == commentId)!.details,
            loading: false,
            del: del
        }
        this.commentDialog = true;
    }

    commentSubmit() {
        this.form.loading = true;
        this.apolloMutate<Result, CommentInput>(
            gqlMutation.comment, 
            {
                commentId: this.form.commentId,
                details: this.form.details,
                courseId: this.courseId,
                replyTo: this.form.replyTo.commentId
            },
            (data) => { 
                this.form.loading = false; 
                this.commentDialog = false; 
                this.updateComment();
            },
            this.snack
        )
    }

    scoreSubmit() {
        this.form.loading = true;
        this.apolloMutate<Result, ScoreInput>(
            gqlMutation.score, 
            {
                courseId: this.courseId,
                score: this.rating
            },
            (data) => { 
                this.form.loading = false;
                this.scoreDialog = false;
            },
            this.snack
        )
    }

    updateComment() {
        this.apolloQuery<ManyCommentInfoResult, { courseId: string }>(
            gqlQuery.comments,
            { courseId: this.courseId },
            (data) => this.comments = data.comments,
            this.snack,
            true
        )
    }
}
</script>

<style lang="scss">
.user-name-text {
    font-size: 16px !important;
    font-weight: 400!important;
}
.addtion-data-text {
    font-size: 14px !important;
    font-weight: 300!important;
}
.margin-right {
    margin-right: 16px;
}
.comment-ref {
    border:1px dashed grey;
}
</style>
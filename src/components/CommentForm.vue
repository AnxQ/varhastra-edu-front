<template>
    <v-card>
        <v-card-title v-if="!commentId">在课程 {{ courseName }} 中 {{ replyTo ? `评论`: `回复 @${replyTo.name}`}} </v-card-title>
        <v-card-title v-if="commentId">确认删除该评论？</v-card-title>
        <v-card-text v-if="!commentId">
            <v-row>
                <v-col :cols="12">
                    <v-textarea
                    v-model="details"
                    maxlength="300"
                    >
                    <template v-slot:label>
                        <div>
                        Bio <small>(optional)</small>
                        </div>
                    </template>
                    </v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn text>取消</v-btn>
            <v-btn text>确认</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import { UserInfo } from '../struct'

@Component
export default class CommentForm extends Vue {
    @Prop() replyTo?: UserInfo;
    @Prop() courseId!: string;
    @Prop() courseName!: string;
    @Prop() commentId?: string;
    private details: string = "";
    
    mounted() {

    }
    
}

</script>
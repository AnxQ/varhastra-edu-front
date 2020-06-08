<template>
    <v-card outlined class="mx-auto">
        <v-card-title>{{ nodeTitle }}</v-card-title>
        <v-card-subtitle>{{ courseware.name }}  {{ courseware.timeCreate }}创建 - 最后编辑于{{ courseware.timeModified }}</v-card-subtitle>
        <div id="dplayer"></div>
        <pdf
        :v-if="this.courseware.type == 1"
        :src="pviewer.src" 
        :page="pviewer.currentPage" 
        @num-pages="pviewer.pageCount=$event" 
        @page-loaded="pviewer.currentPage=$event" 
        @loaded="pviewer.currentPage = 1">
        </pdf>
    </v-card>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import DPlayer from 'dplayer';
import { img, video, doc } from "@/fetch"
import { CoursewareInfo } from '../struct';

@Component({
    components: {
        // pdf
    }
})
export default class Courseware extends Vue {
    @Prop() courseware!: CoursewareInfo;
    @Prop() nodeTitle!: string;
    private dplayer?: DPlayer;
    private pviewer = {
        pageCount: 0,
        currentPage: 0,
        src: ""
    }
    mounted() {
        if (this.courseware.type == 0) {
            this.playVideo();
        }
    }

    showPdf() {
        this.pviewer.src = doc(this.courseware.coursewareId + '.pdf')
    }

    playVideo() {
        this.dplayer = new DPlayer({
            container: document.getElementById('dplayer'),
            screenshot: true,
            video: {
                url: video(this.courseware.coursewareId + '.mp4'),
                // pic: img(this.courseware.thumbsnail ? this.courseware.thumbsnail : 'cover_video.jpg'),
            },
        })
        this.dplayer.play();
    }

    @Watch('courseware')
    onUrlChange(courseware: CoursewareInfo) {
        this.dplayer!.destroy();
        if (this.courseware.type == 0) {
            this.playVideo();
        }
        if (this.courseware.type == 1) {
            this.showPdf();
        }
    }
}
</script>
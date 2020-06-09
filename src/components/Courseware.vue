<template>
    <v-card outlined class="mx-auto">
        <v-card-title>{{ nodeTitle }}</v-card-title>
        <v-card-subtitle>{{ courseware.name }}  {{ courseware.timeCreate }}创建 - 最后编辑于{{ courseware.timeModified }}</v-card-subtitle>
        <div id="dplayer"></div>
        <div v-if="this.courseware.type == 1" >
            <v-card :style="`height: ${maxViewerHeight}px`">
                <iframe :src="pviewer" class="full"></iframe>
            </v-card>
        </div>
    </v-card>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator'
import DPlayer from 'dplayer';
import { img, video, doc } from "@/fetch"
import { CoursewareInfo } from '../struct';

@Component
export default class Courseware extends Vue {
    @Prop() courseware!: CoursewareInfo;
    @Prop() nodeTitle!: string;
    private dplayer?: DPlayer;
    private pviewer?: string | undefined = undefined;
    private pageCount = 0;
    private maxViewerHeight = window.innerHeight - 184 - 110
    mounted() {
        window.onresize = () => {
            this.maxViewerHeight = window.innerHeight - 184 - 110;
        }
        if (this.courseware.type == 0) {
            this.playVideo();
        }
    }

    showPdf() {
        this.pviewer = doc(this.courseware.coursewareId + '.pdf');
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
        if (this.dplayer)
            this.dplayer.destroy();
        if (this.courseware.type == 0) {
            this.playVideo();
        }
        if (this.courseware.type == 1) {
            this.showPdf();
        }
    }
}
</script>
<style lang="scss">
.full {
    width: 100%;
    height: 100%;
}
</style>
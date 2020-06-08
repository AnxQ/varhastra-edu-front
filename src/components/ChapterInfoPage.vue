<template>
<v-row>
    <v-col v-if="selected" :cols="selected ? 8 : 0" >
        <courseware 
        :courseware="currentCourseware"
        :nodeTitle="selected.name"/>
    </v-col>
    <v-col :cols="selected ? 4 : 12" >
    <v-card outlined class="mx-auto" max-width="800px">
        <v-card-title>{{ course.title }} 的章节列表</v-card-title>
        <v-card-subtitle>点击可进入章节</v-card-subtitle>
        <v-card-text>
        <v-treeview 
        :active.sync="active"
        :items="organize" 
        item-key="coursewareId"
        activatable hoverable rounded open-on-click>
        </v-treeview>
        </v-card-text>
    </v-card>
    </v-col>
</v-row>
</template>
<script lang="ts">
import { Vue, Prop, Component, Watch } from "vue-property-decorator"
import Courseware from "@/components/Courseware.vue" 
import { CoursewareInfo, CourseInfo } from '../struct';

interface NodeInfo {
    name: string, 
    coursewareId: string, 
    children?: Array<NodeInfo> 
} 

function findInNodes(nodes: Array<NodeInfo>, coursewareId: string): NodeInfo | undefined {
    let res = undefined;
    try {
        nodes.forEach((node) => {
            res = node.coursewareId === coursewareId ? node : node.children ? findInNodes(node.children, coursewareId) : undefined;
            if (res != undefined)
                throw new Error("Founded")
        });
    } finally {
        return res;
    }
}

@Component({
    components: {
        Courseware
    }
})
export default class ChapterInfoPage extends Vue {
    @Prop() course!: CourseInfo;
    private currentCourseware?: CoursewareInfo;
    private organize: NodeInfo[] = JSON.parse(this.course.organize);
    private active: Array<string> = [];
    private get selected() {
        if (!this.active.length) return undefined
        const coursewareId = this.active[0]
        let res = findInNodes(this.organize, coursewareId);
        this.currentCourseware = this.course.coursewares.find(c => c.coursewareId == res!.coursewareId)
        return res
    }; 
}
</script>

<style lang="scss">
.smooth-scale {
    transition: max-width 0.5s;
    -webkit-transition: max-width 0.5s;
}
</style>
<template>
  <div class="app-container">
    表单
    <!-- <el-dialog title="dialog"
               :visible.sync="dialogVisible"
               v-dragDialog>
    </el-dialog> -->
    <div class="drag_wrap"
         v-draggable>111</div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      list: null,
      listLoading: true,
      dialogVisible: true
    };
  },
  created () {

  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.drag_wrap {
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>

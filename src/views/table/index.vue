<template>
  <div class="app-container">
    表单
    <!-- <el-dialog title="dialog"
               :visible.sync="dialogVisible"
               v-dragDialog>
    </el-dialog> -->
    <div class="drag_wrap"
         v-draggable>111</div>
    <el-button v-clipboard:copy='inputData'
               v-clipboard:success='clipboardSuccess'>copy</el-button>
    <img v-realImg="111"
         src="/assets/logo/lo2go.png" />
  </div>
</template>

<script>

export default {
  data () {
    return {
      list: null,
      listLoading: true,
      dialogVisible: true,
      inputData: '你刚刚复制了这句话'
    };
  },
  created () {

  },
  methods: {
    clipboardSuccess () {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
}
.drag_wrap {
  width: 200px;
  height: 200px;
  background-color: pink;
  position: absolute;
}
</style>

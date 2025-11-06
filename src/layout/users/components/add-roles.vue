<template>
  <el-button plain @click="open = true"> Click to open the Dialog </el-button>

  <el-dialog v-model="open" title="Warning" width="500" center>
    <span>
      It should be noted that the content will not be aligned in center by
      default
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="open = false">Cancel</el-button>
        <el-button type="primary" @click="open = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { AddRolesProps } from "./type";
// const props = defineProps<AddRolesProps>();
const open = defineModel({
  type: Boolean,
  default: false,
});

// watch(
//   () => props.open,
//   (newVal) => {
//     open.value = newVal;
//   }
// );
</script>

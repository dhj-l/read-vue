<template>
  <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >
    Check all
  </el-checkbox>
  <el-checkbox-group
    v-model="checkedCities"
    @change="handleCheckedCitiesChange"
  >
    <el-checkbox
      v-for="city in cities"
      :key="city.id"
      :label="city.name"
      :value="city.value"
    >
      {{ city.name }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import type { CheckboxValueType } from "element-plus";
import type { CheckRolesEmits, CheckRolesProps } from "../type";
import { getRolesAPI } from "@/api/role/role";
import type { RoleItem } from "@/api/user/type";

const props = withDefaults(defineProps<CheckRolesProps>(), {
  roles: () => [],
});
const emits = defineEmits<CheckRolesEmits>();
const checkAll = ref(false);
const isIndeterminate = ref(true);
const checkedCities = ref<string[]>([]);
const cities = ref<RoleItem[]>([]);

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedCities.value = val ? cities.value.map((item) => item.value) : [];
  isIndeterminate.value = false;
  emits(
    "change",
    cities.value.filter((item) => checkedCities.value.includes(item.value))
  );
};
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < cities.value.length;
  emits(
    "change",
    cities.value.filter((item) => checkedCities.value.includes(item.value))
  );
};
const getRoleList = async () => {
  const { data } = await getRolesAPI({
    page: 1,
    pageSize: 100,
  });

  cities.value = data.roles;
  initCheckedCities();
};
const initCheckedCities = () => {
  checkedCities.value = props.roles.map((item) => item.value);
  handleCheckedCitiesChange(checkedCities.value);
};
watch(
  () => props.open,
  () => {
    initCheckedCities();
  }
);
onMounted(() => {
  getRoleList();
});
</script>

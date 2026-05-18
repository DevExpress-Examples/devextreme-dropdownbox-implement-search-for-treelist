<script setup lang="ts">
import { onMounted, ref } from 'vue';
import 'devextreme/dist/css/dx.light.css';
import DxSelectBox from 'devextreme-vue/select-box';
import DxNumberBox from 'devextreme-vue/number-box';
import DataSource from 'devextreme/data/data_source';
import DropDownList from './DropDownList.vue';
import {
  type Employee,
  type SearchExprItem,
  createTasksDataSource,
  getDisplayExpr,
  getSearchExprItems,
  lookupStore,
} from '../service';

const displayExpr = ref<((item: unknown) => string) | undefined>(undefined);
const searchExprValue = ref<string | string[]>('Employee');
const searchTimeout = ref(1000);

const dataSource: DataSource = createTasksDataSource();
const searchExprItems: SearchExprItem[] = getSearchExprItems();

onMounted(() => {
  (lookupStore.load() as Promise<Employee[]>).then((items) => {
    displayExpr.value = (item: unknown) => getDisplayExpr(item as Parameters<typeof getDisplayExpr>[0], items);
    return items;
  }).catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Failed to load lookup data:', error);
  });
});
</script>

<template>
  <div class="dx-viewport demo-container">
    <div class="row">
      <p>DropDownBox with search and embedded TreeList</p>
      <DropDownList
        :selected-row-key="22"
        :data-source="dataSource"
        :drop-down-box-data-source="dataSource"
        :search-timeout="searchTimeout"
        :display-expr="displayExpr"
        :search-expr-value="searchExprValue"
      />
    </div>

    <div class="options">
      <div class="caption">Search Options</div>
      <div class="option">
        <div>Search Expression</div>
        <DxSelectBox
          :items="searchExprItems"
          display-expr="name"
          value-expr="value"
          v-model:value="searchExprValue"
        />
      </div>
      <div class="option">
        <div>Search Timeout</div>
        <DxNumberBox
          :min="0"
          :max="10000"
          :show-spin-buttons="true"
          :step="100"
          v-model:value="searchTimeout"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  margin: 40px 20px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.row p {
  margin: 0;
}

.options {
  height: 180px;
  width: 25vw;
  padding: 20px;
  background-color: rgb(191 191 191 / 15%);
  position: absolute;
  right: 20px;
  top: 40px;
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-top: 10px;
}
</style>

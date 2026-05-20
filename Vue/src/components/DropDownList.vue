<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { DataSource } from 'devextreme-vue/common/data';
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import type { DxDropDownBoxTypes } from 'devextreme-vue/drop-down-box';
import {
  DxTreeList,
  DxColumn,
  DxLookup,
  DxRemoteOperations,
  DxScrolling,
  DxSelection,
  type DxTreeListTypes,
} from 'devextreme-vue/tree-list';
import {
  type Task,
  FIRST_ROW_KEY,
  applySearchFilter,
  isSearchIncomplete,
  lookupStore,
} from '@/service';

const props = defineProps<{
  selectedRowKey: number;
  dataSource: DataSource;
  dropDownBoxDataSource: DataSource;
  searchTimeout?: number;
  displayExpr?: ((item: Task) => string) | undefined;
  searchExprValue: string | string[];
}>();

const searchTimeoutValue = computed(() => props.searchTimeout ?? 1000);

const treeListRef = ref<DxTreeList | null>(null);
const dropDownBoxRef = ref<DxDropDownBox | null>(null);

const value = ref<number | null>(props.selectedRowKey);
const dropDownBoxOpened = ref(false);
const selectedRowKeys = ref<number[]>([props.selectedRowKey]);
const focusedRowKey = ref<number | null>(props.selectedRowKey);

let searchTimerId: ReturnType<typeof setTimeout> | null = null;
let hasLoadedItems = false;
let listFirstLoadCompleted = false;

function changedHandler(): void {
  requestAnimationFrame(() => {
    hasLoadedItems = !!props.dataSource.items().length;
    if (hasLoadedItems && !focusedRowKey.value) {
      const items = props.dataSource.items();
      if (items.length) focusedRowKey.value = items[0].key as number;
    }
  });
}

onMounted(() => {
  props.dataSource.on('changed', changedHandler);
  changedHandler();
});

onUnmounted(() => {
  props.dataSource.off('changed', changedHandler);
});

watch(
  () => props.displayExpr,
  (newVal, oldVal) => {
    if (oldVal !== undefined) {
      dropDownBoxRef.value?.instance?.repaint();
    }
  },
);

function focusInput(): void {
  setTimeout(() => {
    dropDownBoxRef.value?.instance?.focus();
  });
}

function onInput(e: DxDropDownBoxTypes.InputEvent): void {
  if (searchTimerId) clearTimeout(searchTimerId);

  const instance = e.component;
  if (!dropDownBoxOpened.value) dropDownBoxOpened.value = true;

  if (isSearchIncomplete(instance)) {
    const text = instance.option('text');
    if (text) {
      searchTimerId = setTimeout(() => {
        applySearchFilter(text, props.searchExprValue, props.dataSource);
      }, searchTimeoutValue.value);
    } else {
      props.dataSource.filter(null);
    }
    focusInput();
  }
}

function onOpened(e: DxDropDownBoxTypes.OpenedEvent): void {
  const treeListInstance = treeListRef.value?.instance;
  const dropDownBox = e.component;

  function handleOptionChanged(args: DxTreeListTypes.OptionChangedEvent): void {
    const list = args.component;
    const triggerCondition = listFirstLoadCompleted
      ? args.name === 'openTrigger'
      : args.name === 'focusedRowKey' || args.name === 'focusedColumnIndex';

    if (triggerCondition) {
      list.off('optionChanged', handleOptionChanged);
      requestAnimationFrame(() => {
        list.focus();
        list.option('openTrigger', 'closed');
      });
    }
  }

  treeListInstance?.on('optionChanged', handleOptionChanged);

  if (listFirstLoadCompleted) {
    treeListInstance?.option('openTrigger', 'opened');
  }

  const { text, value: dropDownValue } = dropDownBox.option();
  const displayValue = dropDownBox.option('displayValue') as
    | string[]
    | undefined;
  const isTextEqualToDisplayValue = text === displayValue?.[0];
  const shouldClearSelection =
    (dropDownValue && !text) || !isTextEqualToDisplayValue;

  if (shouldClearSelection) {
    selectedRowKeys.value = [];
    treeListInstance
      ?.pageIndex(0)
      .then(() => {
        treeListInstance?.option('focusedRowIndex', 0);
        focusedRowKey.value = FIRST_ROW_KEY;
        focusInput();
      })
      .catch(() => {});
  }
}

function onOptionChanged(e: DxDropDownBoxTypes.OptionChangedEvent): void {
  if (e.name === 'text' && !e.value && listFirstLoadCompleted) {
    const treeListInstance = treeListRef.value?.instance;
    treeListInstance
      ?.pageIndex(0)
      .then(() => {
        treeListInstance?.option('focusedRowIndex', 0);
        focusedRowKey.value = FIRST_ROW_KEY;
      })
      .catch(() => {});
  }
}

function onValueChanged(e: DxDropDownBoxTypes.ValueChangedEvent): void {
  if (searchTimerId !== null) {
    clearTimeout(searchTimerId);
    searchTimerId = null;
  }
  value.value = e.value ?? null;
  if (e.value) {
    dropDownBoxOpened.value = false;
  }
}

function onKeyDown(e: DxDropDownBoxTypes.KeyDownEvent): void {
  if (e.event?.originalEvent?.key !== 'ArrowDown') return;
  const treeListInstance = treeListRef.value?.instance;
  if (!dropDownBoxOpened.value) {
    dropDownBoxOpened.value = true;
  } else if (treeListInstance) {
    treeListInstance.focus();
  }
}

function onClosed(e: DxDropDownBoxTypes.ClosedEvent): void {
  const treeListInstance = treeListRef.value?.instance;
  const dropDownBox = e.component;
  const text = dropDownBox.option('text');
  const displayValue = (
    dropDownBox.option('displayValue') as string[] | undefined
  )?.[0];
  const resetValue = text && text !== displayValue;

  if (!hasLoadedItems) {
    value.value = null;
    selectedRowKeys.value = [];
    props.dataSource.filter(null);
    props.dataSource.load().catch(() => {});
  }

  if (resetValue && !selectedRowKeys.value.length && treeListInstance) {
    const firstKey = treeListInstance.getKeyByRowIndex(0) as number;
    value.value = firstKey;
    selectedRowKeys.value = [firstKey];
    focusedRowKey.value = firstKey;
  }
}

function treeListOnContentReady(e: DxTreeListTypes.ContentReadyEvent): void {
  if (!listFirstLoadCompleted) {
    listFirstLoadCompleted = true;
    e.component.option('openTrigger', 'opened');
  }
}

function treeListOnKeyDown(e: DxTreeListTypes.KeyDownEvent): void {
  if (e.event?.key === 'Enter' && focusedRowKey.value) {
    value.value = focusedRowKey.value;
    selectedRowKeys.value = [focusedRowKey.value];
    focusInput();
  }
}

function onSelectionChanged(e: DxTreeListTypes.SelectionChangedEvent): void {
  if (!listFirstLoadCompleted || !e.selectedRowKeys.length) return;
  const keys = e.selectedRowKeys as number[];
  value.value = keys[0];
  focusInput();
}
</script>

<template>
  <DxDropDownBox
    ref="dropDownBoxRef"
    placeholder="Select a value..."
    width="40vw"
    value-expr="Task_ID"
    value-change-event=""
    :value="value"
    :data-source="dropDownBoxDataSource"
    :display-expr="displayExpr"
    :show-clear-button="true"
    :accept-custom-value="true"
    :open-on-field-click="false"
    v-model:opened="dropDownBoxOpened"
    @value-changed="onValueChanged"
    @option-changed="onOptionChanged"
    @key-down="onKeyDown"
    @input="onInput"
    @opened="onOpened"
    @closed="onClosed"
  >
    <template #content>
      <DxTreeList
        ref="treeListRef"
        height="400"
        width="100%"
        has-items-expr="Has_Items"
        parent-id-expr="Task_Parent_ID"
        :data-source="dataSource"
        :column-auto-width="true"
        :word-wrap-enabled="true"
        :show-borders="true"
        :focused-row-enabled="true"
        v-model:focused-row-key="focusedRowKey"
        v-model:selected-row-keys="selectedRowKeys"
        @content-ready="treeListOnContentReady"
        @key-down="treeListOnKeyDown"
        @selection-changed="onSelectionChanged"
      >
        <DxRemoteOperations
          :filtering="true"
          :sorting="true"
          :grouping="true"
        />
        <DxSelection mode="single"/>
        <DxScrolling mode="virtual"/>
        <DxColumn data-field="Task_ID"/>
        <DxColumn
          data-field="Task_Assigned_Employee_ID"
          caption="Employee"
          :min-width="120"
        >
          <DxLookup
            :data-source="lookupStore"
            value-expr="ID"
            display-expr="Name"
          />
        </DxColumn>
        <DxColumn
          data-field="Task_Subject"
          :width="300"
        />
        <DxColumn
          data-field="Task_Start_Date"
          caption="Start Date"
          data-type="date"
        />
        <DxColumn
          data-field="Task_Status"
          caption="Status"
        />
        <DxColumn
          data-field="Task_Due_Date"
          caption="Due Date"
          data-type="date"
        />
      </DxTreeList>
    </template>
  </DxDropDownBox>
</template>

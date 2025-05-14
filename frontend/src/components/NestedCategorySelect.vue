<template>
  <div>
    <!-- Existing levels -->
    <div v-for="(selected, level) in selectionPath" :key="level" class="mb-4">
      <label class="block text-sm font-medium mb-1"
        >Level {{ level + 1 }}</label
      >
      <select
        v-model="selectionPath[level]"
        @change="handleSelectionChange(level)"
        class="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600"
      >
        <option disabled value="">Select...</option>
        <option
          v-for="option in getCategoryAtLevel(level)"
          :key="option.name"
          :value="option.name"
        >
          {{ option.name }}
        </option>
        <option value="__add__">➕ Add new...</option>
      </select>
    </div>

    <!-- Always render next dropdown to allow adding -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1"
        >Level {{ selectionPath.length + 1 }}</label
      >
      <select
        v-model="newLevelSelection"
        @change="handleNextLevelSelection"
        class="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600"
      >
        <option disabled value="">Select...</option>
        <option
          v-for="option in getCategoryAtLevel(selectionPath.length)"
          :key="option.name"
          :value="option.name"
        >
          {{ option.name }}
        </option>
        <option value="__add__">➕ Add new...</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update"]);

const selectionPath = ref([]);
const newLevelSelection = ref("");

const getCategoryAtLevel = (level) => {
  let current = props.categories;
  for (let i = 0; i < level; i++) {
    const found = current.find((c) => c.name === selectionPath.value[i]);
    if (!found || !found.children) return [];
    current = found.children;
  }
  return current || [];
};

const handleSelectionChange = (level) => {
  const value = selectionPath.value[level];
  if (value === "__add__") {
    promptAddCategory(level);
  } else {
    selectionPath.value.splice(level, 1, value);
    selectionPath.value.splice(level + 1);
    newLevelSelection.value = "";
  }
};

const handleNextLevelSelection = () => {
  const value = newLevelSelection.value;
  if (value === "__add__") {
    promptAddCategory(selectionPath.value.length);
  } else {
    appendSelection(value);
  }
};

const appendSelection = (value) => {
  if (value) {
    selectionPath.value.splice(selectionPath.value.length, 1, value);
    newLevelSelection.value = "";
  }
};

const promptAddCategory = (level) => {
  const name = prompt(`Enter name for level ${level + 1}`);
  const existsInPath = selectionPath.value.includes(name.trim());
  if (existsInPath) {
    alert("A category with that name already exists in the current path.");
    return;
  }
  if (!name || !name.trim()) return;

  let current = props.categories;
  for (let i = 0; i < level; i++) {
    const found = current.find((c) => c.name === selectionPath.value[i]);
    if (!found) return;
    current = found.children ||= [];
  }

  current.push({ name: name.trim(), children: [] });

  selectionPath.value.splice(level);
  selectionPath.value[level] = name.trim();
  selectionPath.value.splice(level + 1); // Reset deeper levels
  newLevelSelection.value = "";
};

watchEffect(() => {
  //console.log("🔼 watchEffect triggered:", [...selectionPath.value]);
  emit("update", [...selectionPath.value]);
});
</script>

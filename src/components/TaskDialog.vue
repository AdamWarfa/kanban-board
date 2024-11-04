<script setup lang="ts">
import { ref, watch } from "vue";
import { VColorPicker } from "vuetify/components";

interface DialogProps {
  dialogVisible: boolean;
  task: { title: string; description: string; color: string };
  updateTask: (task: { title: string; description: string; color: string }) => void;
}

const props = defineProps<DialogProps>();
const emit = defineEmits(["update:dialogVisible"]);

const dialogLocal = ref(props.dialogVisible);
const taskLocal = ref({ ...props.task });

// Watch props changes to keep local refs in sync
watch(
  () => props.dialogVisible,
  (newVal) => {
    dialogLocal.value = newVal;
  }
);

watch(
  () => props.task,
  (newTask) => {
    taskLocal.value = { ...newTask }; // Update taskLocal when task prop changes
  }
);

const close = () => {
  dialogLocal.value = false;
  emit("update:dialogVisible", false);
};

const save = () => {
  props.updateTask(taskLocal.value);
  close();
};
</script>

<template>
  <v-dialog v-model="dialogLocal" max-width="500px" @update:modelValue="emit('update:dialogVisible', $event)">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Task</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="taskLocal.title" label="Task title"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="taskLocal.description" label="Task description"></v-text-field>
            </v-col>
            <v-col cols="12" class="flex align-middle items-center justify-center">
              <v-color-picker v-model="taskLocal.color" label="Pick a color" hide-canvas hide-inputs show-swatches></v-color-picker>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text="close" @click="close"></v-btn>
        <v-btn color="blue darken-1" text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

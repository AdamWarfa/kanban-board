<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import draggable from "vuedraggable";
import TaskDialog from "./TaskDialog.vue";

interface Task {
  title: string;
  description: string;
  color: string; // Added color property for customizable color
}

interface Columns {
  columnTitles: string[];
  column1: Task[];
  column2: Task[];
  column3: Task[];
  column4: Task[];
}

const columns = ref<Columns>({
  columnTitles: ["Backlog", "In Progress", "Review", "Done"],
  column1: [
    { title: "Task 1", description: "Description for Task 1", color: "#ffecbe" },
    { title: "Task 2", description: "Description for Task 2", color: "#ffecbe" },
    { title: "Task 3", description: "Description for Task 3", color: "#ffecbe" },
  ],
  column2: [
    { title: "Task 4", description: "Description for Task 4", color: "#ffecbe" },
    { title: "Task 5", description: "Description for Task 5", color: "#ffecbe" },
    { title: "Task 6", description: "Description for Task 6", color: "#ffecbe" },
  ],
  column3: [
    { title: "Task 7", description: "Description for Task 7", color: "#ffecbe" },
    { title: "Task 8", description: "Description for Task 8", color: "#ffecbe" },
    { title: "Task 9", description: "Description for Task 9", color: "#ffecbe" },
  ],
  column4: [
    { title: "Task 10", description: "Description for Task 10", color: "#ffecbe" },
    { title: "Task 11", description: "Description for Task 11", color: "#ffecbe" },
    { title: "Task 12", description: "Description for Task 12", color: "#ffecbe" },
  ],
});

const currentTask = ref<Task>({ title: "", description: "", color: "#ffecbe" });
const currentColumnIndex = ref(0);
const currentTaskIndex = ref(0);

const dialogVisible = ref(false);

const columnKeys = ["column1", "column2", "column3", "column4"] as const;
const newTasks = ref<string[]>(["", "", "", ""]);

const saveColumnsToLocalStorage = () => {
  localStorage.setItem("taskColumns", JSON.stringify(columns.value));
};

const loadColumnsFromLocalStorage = () => {
  const savedColumns = localStorage.getItem("taskColumns");
  if (savedColumns) {
    columns.value = JSON.parse(savedColumns);
  }
};

watch(columns, saveColumnsToLocalStorage, { deep: true });

onMounted(loadColumnsFromLocalStorage);

const addTask = (index: number, title: string) => {
  const newTask: Task = {
    title,
    description: "Description for New Task",
    color: "#ffecbe", // Default color for new tasks
  };
  columns.value[columnKeys[index]].push(newTask);
  newTasks.value[index] = "";
};

const deleteTask = (index: number, taskIndex: number) => {
  const columnKey = columnKeys[index];
  columns.value[columnKey].splice(taskIndex, 1);
};

const openDialog = (index: number, taskIndex: number) => {
  const columnKey = columnKeys[index];
  currentTask.value = { ...columns.value[columnKey][taskIndex] };
  currentColumnIndex.value = index;
  currentTaskIndex.value = taskIndex;
  dialogVisible.value = true;
};

const updateTask = (updatedTask: Task) => {
  const columnKey = columnKeys[currentColumnIndex.value];
  columns.value[columnKey][currentTaskIndex.value] = updatedTask;

  dialogVisible.value = false;
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="(title, index) in columns.columnTitles" :key="index" cols="3">
        <h2 class="text-4xl text-center mb-4 font-light">{{ title }}</h2>
        <draggable v-model="columns[columnKeys[index]]" tag="div" class="d-flex flex-column" :itemKey="title" :group="{ name: 'tasks', pull: true, put: true }" :animation="200">
          <template #item="{ element: task, index: taskIndex }">
            <div :style="{ backgroundColor: task.color || '#ffecbe' }" class="cursor-grab mb-2 pt-2 rounded-md">
              <v-card variant="elevated" color="surface-variant">
                <v-card-title>{{ task.title }}</v-card-title>
                <v-card-subtitle>{{ task.description }}</v-card-subtitle>

                <template v-slot:actions>
                  <v-btn variant="text" text="Edit" @click="openDialog(index, taskIndex)"></v-btn>
                  <v-btn variant="text" text="Delete" @click="deleteTask(index, taskIndex)"></v-btn>
                </template>
              </v-card>
            </div>
          </template>
        </draggable>
        <v-text-field v-model="newTasks[index]" label="Add new item" @keyup.enter="addTask(index, newTasks[index])" clearable />
        <v-btn @click="addTask(index, newTasks[index])" text="Add"></v-btn>
      </v-col>
    </v-row>
  </v-container>

  <TaskDialog :task="currentTask" :dialogVisible="dialogVisible" @update:dialogVisible="dialogVisible = $event" :updateTask="updateTask" />
</template>

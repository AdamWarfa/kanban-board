import { mount, VueWrapper } from "@vue/test-utils"; // Import VueWrapper
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import TaskBoard from "../../components/Board.vue"; // Adjust the import path as necessary
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { createVuetify } from "vuetify";

describe("TaskBoard.vue", () => {
  let vuetify;
  let wrapper: VueWrapper;

  beforeEach(() => {
    vuetify = createVuetify({
      components,
      directives,
    });
    wrapper = mount(TaskBoard, {
      attachToDocument: true,
      global: {
        plugins: [vuetify],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders the correct number of columns", () => {
    const columns = wrapper.findAll("h2");
    expect(columns.length).toBe(4);
  });

  async function createTask(title: string) {
    const index = 0;
    const input = wrapper.findAllComponents({ name: "VTextField" })[index];

    // Check if the input field exists
    expect(input.exists()).toBe(true);

    await input.vm.$emit("update:modelValue", title);

    expect(input.props("modelValue")).toBe(title);

    const buttons = wrapper.findAll(".v-btn");
    const button = buttons.find((button) => button.text() === "Add");

    await button.trigger("click");
  }

  it("adds a new task", async () => {
    const numberOfTasks = wrapper.findAll(".v-card-title").length;
    await createTask("New Task");

    const newLength = wrapper.findAll(".v-card-title").length;

    expect(newLength).toBe(numberOfTasks + 1);
  });

  it("deletes a task", async () => {
    await createTask("Task to Delete");

    const taskLength = wrapper.findAll(".v-card-title").length;

    const deleteButtons = wrapper.findAll(".v-btn");
    const deleteButton = deleteButtons.find((button) => button.text() === "Delete");

    expect(deleteButton).toBeTruthy();

    await deleteButton.trigger("click");

    const tasks = wrapper.findAll(".v-card-title");
    expect(tasks.length).toBe(taskLength - 1);
  });

  it("opens the edit dialog with correct task data", async () => {
    await createTask("Task to Edit");

    const taskCards = wrapper.findAll(".v-card-title");
    const taskToEdit = taskCards.find((card) => card.text() === "Task to Edit");

    expect(taskToEdit?.exists()).toBe(true);

    const taskCard = taskToEdit?.element.closest(".v-card");

    const editButton = Array.from(taskCard?.querySelectorAll(".v-btn")).find((button) => button?.textContent.trim() === "Edit");

    expect(editButton).not.toBeNull();

    await editButton?.click();

    const titleInputs = wrapper.findAllComponents({ name: "VTextField" });

    const input = titleInputs.find((input) => input.props("label") === "Task title");
    const titleValue = input?.props("modelValue");

    expect(titleValue).toBe("Task to Edit");
  });

  it("updates the task correctly", async () => {
    await createTask("Task to Update");

    const taskCards = wrapper.findAll(".v-card-title");
    const taskToEdit = taskCards.find((card) => card.text() === "Task to Update");

    expect(taskToEdit?.exists()).toBe(true);

    const taskCard = taskToEdit?.element.closest(".v-card");

    const editButton = Array.from(taskCard?.querySelectorAll(".v-btn")).find((button) => button.textContent.trim() === "Edit");

    await editButton.click();

    const titleInputs = wrapper.findAllComponents({ name: "VTextField" });
    const titleInput = titleInputs.find((input) => input.props("label") === "Task title");
    const descriptionInput = titleInputs.find((input) => input.props("label") === "Task description");

    const buttons = wrapper.findAllComponents({ name: "VBtn" });
    const saveButton = buttons.find((button) => button.props("text") === "Save");

    await titleInput?.vm.$emit("update:modelValue", "Updated Task");
    await descriptionInput?.vm.$emit("update:modelValue", "This task has been updated");

    await saveButton?.trigger("click");

    const updatedTask = wrapper.findAll(".v-card-title").find((card) => card.text() === "Updated Task");

    expect(updatedTask).toBeTruthy();
  });
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { Task } from "../types/task";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type TaskFormScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TaskForm"
>;
type TaskFormScreenRouteProp = RouteProp<RootStackParamList, "TaskForm">;

interface Props {
  navigation: TaskFormScreenNavigationProp;
  route: TaskFormScreenRouteProp;
}

export const TaskFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { addTask, updateTask } = useTasks();
  const task = route.params?.task;
  const isEditing = !!task;

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDeadline(task.deadline ? task.deadline.split("T")[0] : "");
      setPriority(task.priority);
      setCategory(task.category || "");
    }
  }, [task]);

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorText("Title is required");
      return;
    }

    setSubmitting(true);
    setErrorText("");

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        priority,
        category: category.trim() || undefined,
      };

      if (isEditing && task) {
        await updateTask(task._id, taskData);
      } else {
        await addTask(taskData);
      }

      Alert.alert("Task saved successfully");
      navigation.goBack();
    } catch (error: any) {
      setErrorText(error.message || "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{isEditing ? "Edit Task" : "New Task"}</Text>

        <TextInput
          style={styles.input}
          placeholder="Title *"
          value={title}
          onChangeText={setTitle}
          editable={!submitting}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          editable={!submitting}
        />

        {/* Deadline with date picker */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!submitting) setDatePickerVisible(true);
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Deadline (YYYY-MM-DD)"
            value={deadline}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setDatePickerVisible(false);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            setDeadline(`${yyyy}-${mm}-${dd}`);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* Priority */}
        <View style={styles.priorityContainer}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityButtons}>
            {(["low", "medium", "high"] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton,
                  priority === p && styles.priorityButtonActive,
                ]}
                onPress={() => setPriority(p)}
                disabled={submitting}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    priority === p && styles.priorityButtonTextActive,
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          editable={!submitting}
        />

        {/* Error */}
        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

        {/* Save button */}
        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{isEditing ? "Update" : "Create"}</Text>
          )}
        </TouchableOpacity>

        {/* Cancel button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  priorityContainer: {
    marginBottom: 16,
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  priorityButtonActive: {
    backgroundColor: "#007AFF",
  },
  priorityButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  priorityButtonTextActive: {
    color: "#fff",
  },

  button: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 15,
  },

  errorText: {
    color: "#FF3B30",
    marginBottom: 8,
    textAlign: "center",
    fontSize: 13,
  },
});

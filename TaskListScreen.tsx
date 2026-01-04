import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Task } from "../types/task";

type TaskListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Tasks"
>;

interface Props {
  navigation: TaskListScreenNavigationProp;
}

// Empty state component shown when there are no tasks
export const TaskEmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>
        You have no tasks yet. Tap + to add your first task.
      </Text>
    </View>
  );
};

export const TaskListScreen: React.FC<Props> = ({ navigation }) => {
  const {
    getFilteredTasks,
    tasksLoading,
    tasksError,
    statusFilter,
    categoryFilter,
    setStatusFilter,
    setCategoryFilter,
    toggleTaskCompletion,
    deleteTask,
  } = useTasks();
  const { logout } = useAuth();

  const filteredTasks = getFilteredTasks();

  const categories = useMemo(() => {
    const cats = new Set<string>();
    // TODO: fill from tasks if needed
    return Array.from(cats);
  }, []);

  const handleDelete = (task: Task) => {
    Alert.alert("Delete Task", `Are you sure you want to delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTask(task._id),
      },
    ]);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return "";
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FF9500";
      case "low":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskItem}
      onPress={() => navigation.navigate("TaskForm", { task: item })}
    >
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.taskCompleted]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.taskMeta}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          >
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
          {item.deadline ? (
            <Text style={styles.deadlineText}>Due: {formatDate(item.deadline)}</Text>
          ) : null}
          {item.category ? (
            <Text style={styles.categoryText}>{item.category}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleTaskCompletion(item._id)}
        >
          <Text style={styles.actionButtonText}>{item.completed ? "✓" : "○"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionButtonText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Logout", "Are you sure you want to logout?", [
              { text: "Cancel", style: "cancel" },
              { text: "Logout", style: "destructive", onPress: logout },
            ]);
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.statusFilters}>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === "all" && styles.filterButtonActive]}
            onPress={() => setStatusFilter("all")}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === "all" && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "pending" && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter("pending")}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === "pending" && styles.filterButtonTextActive,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === "completed" && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter("completed")}
          >
            <Text
              style={[
                styles.filterButtonText,
                statusFilter === "completed" && styles.filterButtonTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.filterButton, categoryFilter !== "all" && styles.filterButtonActive]}
          onPress={() => setCategoryFilter("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              categoryFilter !== "all" && styles.filterButtonTextActive,
            ]}
          >
            {categoryFilter === "all" ? "All Categories" : categoryFilter}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {tasksError ? <Text style={styles.errorText}>{tasksError}</Text> : null}

      {/* List / Loading */}
      {tasksLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<TaskEmptyState />}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("TaskForm", {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: "#007AFF",
    // subtle bottom shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  filters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  statusFilters: {
    flexDirection: "row",
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f1f3f5",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    color: "#333",
    fontSize: 13,
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  errorText: {
    color: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 10,
    textAlign: "center",
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  taskItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    // remove hard border, use shadow instead
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  priorityText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  deadlineText: {
    fontSize: 12,
    color: "#6b7280",
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },

  taskActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
    backgroundColor: "#f3f4f6",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
  },
  actionButtonText: {
    fontSize: 18,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});
import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  Alert, 
  TouchableOpacity, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const expenseTypes = [
  { id: "income", label: "Income", color: "#10B981" },
  { id: "expense", label: "Expense", color: "#EF4444" }
];

const categories = [
  { id: "food", label: "Food & Dining", icon: "🍽️" },
  { id: "transportation", label: "Transportation", icon: "🚗" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "bills", label: "Bills & Utilities", icon: "💡" },
  { id: "health", label: "Health & Medical", icon: "🏥" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "travel", label: "Travel", icon: "✈️" },
  { id: "groceries", label: "Groceries", icon: "🛒" },
  { id: "salary", label: "Salary", icon: "💰" },
  { id: "freelance", label: "Freelance", icon: "💼" },
  { id: "investment", label: "Investment", icon: "📈" },
  { id: "other", label: "Other", icon: "📋" }
];

export default function AddExpenseScreen({ navigation }: { navigation: any }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "",
    category: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      type: "",
      category: ""
    });
  };

  const validateForm = () => {
    const { title, amount, type, category } = formData;
    
    if (!title || !amount || !type || !category) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return false;
    }

    return true;
  };

//   const handleAdd = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const userId = await AsyncStorage.getItem("userId");
      
//       const res = await axios.post("http://10.0.2.2:8080/ExpenseApp/expense", {
//         userId,
//         title: formData.title,
//         amount: Number(formData.amount),
//         type: formData.type,
//         category: formData.category,
//         date: new Date().toISOString()
//       });

//       if (res.data.success) {
//         Alert.alert("Success", "Transaction added successfully!", [
//           { text: "OK", onPress: () => navigation.goBack() }
//         ]);
//       } else {
//         Alert.alert("Error", "Failed to add transaction");
//       }
//     } catch (err) {
//       Alert.alert("Error", "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

  const getSelectedType = () => {
    return expenseTypes.find(type => type.id === formData.type);
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === formData.category);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Transaction</Text>
            <Text style={styles.subtitle}>Track your income and expenses</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                value={formData.title}
                onChangeText={(value) => updateFormData("title", value)}
                style={styles.input}
                placeholder="e.g., Lunch at restaurant"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="sentences"
              />
            </View>

            {/* Amount */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                value={formData.amount}
                onChangeText={(value) => updateFormData("amount", value)}
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>

            {/* Type Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type</Text>
              <TouchableOpacity 
                style={styles.selector}
                onPress={() => setShowTypeModal(true)}
              >
                <Text style={[
                  styles.selectorText, 
                  !formData.type && styles.placeholderText
                ]}>
                  {getSelectedType()?.label || "Select transaction type"}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Category Selector */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity 
                style={styles.selector}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[
                  styles.selectorText, 
                  !formData.category && styles.placeholderText
                ]}>
                  {getSelectedCategory() ? 
                    `${getSelectedCategory()?.icon} ${getSelectedCategory()?.label}` : 
                    "Select category"
                  }
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetForm}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.addButton, isLoading && styles.addButtonDisabled]}
                // onPress={handleAdd}
                disabled={isLoading}
              >
                <Text style={styles.addButtonText}>
                  {isLoading ? "Adding..." : "Add Transaction"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Type Selection Modal */}
        <Modal
          visible={showTypeModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTypeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Type</Text>
              {expenseTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.modalOption,
                    formData.type === type.id && styles.selectedOption
                  ]}
                  onPress={() => {
                    updateFormData("type", type.id);
                    setShowTypeModal(false);
                  }}
                >
                  <View style={[styles.typeIndicator, { backgroundColor: type.color }]} />
                  <Text style={[
                    styles.modalOptionText,
                    formData.type === type.id && styles.selectedOptionText
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTypeModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Category Selection Modal */}
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView style={styles.modalScrollView}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.modalOption,
                      formData.category === category.id && styles.selectedOption
                    ]}
                    onPress={() => {
                      updateFormData("category", category.id);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.modalOptionText,
                      formData.category === category.id && styles.selectedOptionText
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  formContainer: {
    marginHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    color: "#111827",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  chevron: {
    fontSize: 12,
    color: "#6B7280",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  resetButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 2,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    maxHeight: "80%",
    minWidth: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#EBF4FF",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  selectedOptionText: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryIcon: {
    fontSize: 20,
  },
  modalCloseButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  modalCloseText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
});
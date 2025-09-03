import React, { useState, useEffect } from "react";
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
import {
  ALERT_TYPE,
  Dialog,
  Toast,
} from "react-native-alert-notification";

const PUBLICK_URL = "https://ec52c035de10.ngrok-free.app/";


export default function AddExpenseScreen({ navigation }: { navigation: any }) {

  const [getCategories, setCategories] = useState<any[]>([]);
  const [getExpenseTypes, setExpenseTypes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    typeId: 0,
    categoryId: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const response = await fetch(PUBLICK_URL+"FinTrack/metaData");
        const res = await response.json();
        setCategories(res.categories);
        setExpenseTypes(res.types);
      } catch (err) {
        Alert.alert("Error", "Failed to load categories and types");
      }
    };
    fetchMetaData();
  }, []);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      typeId: 0,
      categoryId: 0
    });
  };

  const validateForm = () => {
    const { title, amount, typeId, categoryId } = formData;

    if (!title || !amount || !typeId || !categoryId) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return false;
    }

    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(PUBLICK_URL+"FinTrack/SaveExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: Number(userId),
          title: formData.title,
          category: formData.categoryId,
          type: formData.typeId,
          amount: Number(formData.amount)
        })
      });

      const res = await response.json();

      if (response.ok && res.success) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Transaction added successfully!"
        });
        // Alert.alert("Success", "Transaction added successfully!");
        resetForm();
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: res.error || "Failed to add transaction",
        });
        // Alert.alert("Error", res.error || "Failed to add transaction");
      }
    } catch (err: any) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const getSelectedType = () => getExpenseTypes.find(t => t.id === formData.typeId);
  const getSelectedCategory = () => getCategories.find(c => c.id === formData.categoryId);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Transaction</Text>
            <Text style={styles.subtitle}>Track your income and expenses</Text>
          </View>

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

            {/* Type */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowTypeModal(true)}
              >
                <Text style={[styles.selectorText, !formData.typeId && styles.placeholderText]}>
                  {getSelectedType()?.value || "Select transaction type"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.selectorText, !formData.categoryId && styles.placeholderText]}>
                  {getSelectedCategory()?.value || "Select category"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, isLoading && styles.addButtonDisabled]}
                onPress={handleAdd}
                disabled={isLoading}
              >
                <Text style={styles.addButtonText}>
                  {isLoading ? "Adding..." : "Add Transaction"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Type Modal */}
        <Modal visible={showTypeModal} transparent animationType="fade" onRequestClose={() => setShowTypeModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Type</Text>
              {getExpenseTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.modalOption, formData.typeId === type.id && styles.selectedOption]}
                  onPress={() => {
                    updateFormData("typeId", type.id);
                    setShowTypeModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, formData.typeId === type.id && styles.selectedOptionText]}>
                    {type.value}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowTypeModal(false)}>
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Category Modal */}
        <Modal visible={showCategoryModal} transparent animationType="fade" onRequestClose={() => setShowCategoryModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView>
                {getCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.modalOption, formData.categoryId === category.id && styles.selectedOption]}
                    onPress={() => {
                      updateFormData("categoryId", category.id);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={[styles.modalOptionText, formData.categoryId === category.id && styles.selectedOptionText]}>
                      {category.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCategoryModal(false)}>
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
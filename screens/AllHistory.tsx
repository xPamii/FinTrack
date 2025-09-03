import React, { useMemo, useState } from "react";
import {

    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    SafeAreaView,
} from "react-native";

type ExpenseType = "Expense" | "Income";
type Category = "Food" | "Transport" | "Bills" | "Shopping" | "Salary" | "Other";

interface Expense {
    id: string;
    title: string;
    amount: number;
    type: ExpenseType;
    category: Category;
    date: string; // ISO string
    note?: string;
}

const SAMPLE_DATA: Expense[] = [
    {
        id: "1",
        title: "Groceries",
        amount: 45.5,
        type: "Expense",
        category: "Food",
        date: new Date().toISOString(),
        note: "Weekly groceries",
    },
    {
        id: "2",
        title: "Bus Card Topup",
        amount: 20,
        type: "Expense",
        category: "Transport",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        note: "Monthly commute",
    },
    {
        id: "3",
        title: "Electricity Bill",
        amount: 80.99,
        type: "Expense",
        category: "Bills",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        note: "Monthly",
    },
    {
        id: "4",
        title: "T-shirt",
        amount: 25,
        type: "Expense",
        category: "Shopping",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        note: "Gift",
    },
    {
        id: "5",
        title: "Monthly Salary",
        amount: 3000,
        type: "Income",
        category: "Salary",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        note: "August salary",
    },
    {
        id: "6",
        title: "Coffee",
        amount: 4.5,
        type: "Expense",
        category: "Food",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        note: "Café",
    },
];

const CATEGORIES: Category[] = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Salary",
    "Other",
];

const TYPES: ExpenseType[] = ["Expense", "Income"];

const DATE_FILTERS = ["All", "Today", "This Week", "This Month"] as const;
type DateFilter = typeof DATE_FILTERS[number];

function startOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // make Monday first
    return new Date(date.setDate(diff));
}
function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}
function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export default function ALLHistory() {
    const [expenses] = useState<Expense[]>(SAMPLE_DATA);
    const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
        "All"
    );
    const [selectedType, setSelectedType] = useState<ExpenseType | "All">("All");
    const [selectedDateFilter, setSelectedDateFilter] =
        useState<DateFilter>("All");
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const now = new Date();
        const startWeek = startOfWeek(new Date(now));
        const startMonth = startOfMonth(now);

        return expenses.filter((e) => {
            // Category filter
            if (selectedCategory !== "All" && e.category !== selectedCategory) {
                return false;
            }
            // Type filter
            if (selectedType !== "All" && e.type !== selectedType) {
                return false;
            }
            // Date filter
            const d = new Date(e.date);
            if (selectedDateFilter === "Today" && !sameDay(d, now)) return false;
            if (selectedDateFilter === "This Week") {
                // include dates from startOfWeek to now
                if (d < startWeek || d > now) return false;
            }
            if (selectedDateFilter === "This Month") {
                if (d < startMonth || d > now) return false;
            }
            // Search query filter (title + note)
            if (query.trim() !== "") {
                const q = query.trim().toLowerCase();
                const hay =
                    `${e.title} ${e.note ?? ""} ${e.category} ${e.type}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [expenses, selectedCategory, selectedType, selectedDateFilter, query]);

    function clearFilters() {
        setSelectedCategory("All");
        setSelectedType("All");
        setSelectedDateFilter("All");
        setQuery("");
    }

    const renderExpense = ({ item }: { item: Expense }) => {
        const dt = new Date(item.date);
        return (
            <View style={styles.card}>
                <View style={styles.cardLeft}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.meta}>
                        {item.category} • {item.type}
                    </Text>
                    <Text style={styles.note}>{item.note}</Text>
                </View>
                <View style={styles.cardRight}>
                    <Text
                        style={[
                            styles.amount,
                            item.type === "Expense" ? styles.negative : styles.positive,
                        ]}
                    >
                        {item.type === "Expense" ? "-" : "+"}
                        {new Intl.NumberFormat("en-LK", {
                            style: "currency",
                            currency: "LKR",
                            minimumFractionDigits: 2,
                        }).format(item.amount)}
                    </Text>
                    <Text style={styles.date}>
                        {dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Expense History</Text>

            {/* Filters row */}
            <View style={styles.filtersRow}>
                <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>Category</Text>
                    <View style={styles.chipsRow}>
                        <TouchableOpacity
                            style={[
                                styles.chip,
                                selectedCategory === "All" && styles.chipSelected,
                            ]}
                            onPress={() => setSelectedCategory("All")}
                        >
                            <Text style={styles.chipText}>All</Text>
                        </TouchableOpacity>
                        {CATEGORIES.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[
                                    styles.chip,
                                    selectedCategory === c && styles.chipSelected,
                                ]}
                                onPress={() => setSelectedCategory(c)}
                            >
                                <Text style={styles.chipText}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>Type</Text>
                    <View style={styles.chipsRow}>
                        <TouchableOpacity
                            style={[styles.chip, selectedType === "All" && styles.chipSelected]}
                            onPress={() => setSelectedType("All")}
                        >
                            <Text style={styles.chipText}>All</Text>
                        </TouchableOpacity>
                        {TYPES.map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.chip, selectedType === t && styles.chipSelected]}
                                onPress={() => setSelectedType(t)}
                            >
                                <Text style={styles.chipText}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>Date</Text>
                    <View style={styles.chipsRow}>
                        {DATE_FILTERS.map((d) => (
                            <TouchableOpacity
                                key={d}
                                style={[
                                    styles.chip,
                                    selectedDateFilter === d && styles.chipSelected,
                                ]}
                                onPress={() => setSelectedDateFilter(d)}
                            >
                                <Text style={styles.chipText}>{d}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* Search + actions */}
            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Search title, note, category..."
                    value={query}
                    onChangeText={setQuery}
                    style={styles.searchInput}
                    returnKeyType="search"
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                        // trigger filter is automatic via state; keep for UX parity
                    }}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.resultCount}>{filtered.length} results</Text>

            <FlatList
                data={filtered.sort((a, b) => +new Date(b.date) - +new Date(a.date))}
                keyExtractor={(item) => item.id}
                renderItem={renderExpense}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No records found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f7fb", padding: 12, },
    header: { fontSize: 22, fontWeight: "700", marginBottom: 8, color: "#111",  marginTop: 50 },
    filtersRow: { marginBottom: 8 },
    filterGroup: { marginBottom: 8 },
    filterLabel: { fontSize: 13, color: "#444", marginBottom: 6 },
    chipsRow: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#fff",
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#e0e6ef",
    },
    chipSelected: {
        backgroundColor: "#2f80ed",
        borderColor: "#2f80ed",
    },
    chipText: { color: "#111", fontSize: 13 },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e6ef",
        marginRight: 8,
    },
    searchButton: {
        backgroundColor: "#2f80ed",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginRight: 8,
    },
    searchButtonText: { color: "#fff", fontWeight: "600" },
    clearButton: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e6ef",
    },
    clearButtonText: { color: "#444" },
    resultCount: { marginBottom: 8, color: "#666" },
    list: { paddingBottom: 24 },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#eef3ff",
    },
    cardLeft: { flex: 1 },
    cardRight: { alignItems: "flex-end" },
    title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
    meta: { fontSize: 12, color: "#666", marginBottom: 6 },
    note: { fontSize: 12, color: "#777" },
    amount: { fontSize: 16, fontWeight: "700" },
    negative: { color: "#e23b3b" },
    positive: { color: "#27ae60" },
    date: { fontSize: 11, color: "#999", marginTop: 6 },
    empty: { padding: 30, alignItems: "center" },
    emptyText: { color: "#888" },
});
import React, { FC, useMemo, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Animated,
    GestureResponderEvent,
} from "react-native";

type Transaction = {
    id: string;
    title: string;
    amount: number;
    date: string; // ISO
    type: "income" | "expense";
    category?: string;
};

const COLORS = {
    blue: "#1E90FF",
    green: "#2ECC71",
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
    {
        id: "1",
        title: "Salary",
        amount: 3200,
        date: "2025-08-01",
        type: "income",
        category: "Job",
    },
    {
        id: "2",
        title: "Groceries",
        amount: 82.5,
        date: "2025-08-03",
        type: "expense",
        category: "Food",
    },
    {
        id: "3",
        title: "Electric Bill",
        amount: 120,
        date: "2025-08-05",
        type: "expense",
        category: "Utilities",
    },
    {
        id: "4",
        title: "Sold old bike",
        amount: 150,
        date: "2025-08-06",
        type: "income",
        category: "Sale",
    },
    {
        id: "5",
        title: "Coffee",
        amount: 4.5,
        date: "2025-08-07",
        type: "expense",
        category: "Food",
    },
];

const formatCurrency = (value: number) =>
    Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString();
};

const StatCard: FC<{ label: string; amount: number; color?: string }> = ({
    label,
    amount,
    color = "#333",
}) => (
    <View style={[styles.statCard, { borderColor: color }]}>
        <Text style={[styles.statLabel, { color }]}>{label}</Text>
        <Text style={[styles.statAmount, { color }]}>{formatCurrency(amount)}</Text>
    </View>
);

const TransactionRow: FC<{
    item: Transaction;
    onPress?: (e: GestureResponderEvent) => void;
}> = ({ item, onPress }) => {
    const isIncome = item.type === "income";
    return (
        <TouchableOpacity style={styles.txRow} onPress={onPress}>
            <View
                style={[
                    styles.txIndicator,
                    { backgroundColor: isIncome ? "#2ecc71" : "#e74c3c" },
                ]}
            />
            <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{item.title}</Text>
                <Text style={styles.txCategory}>
                    {item.category ?? formatDate(item.date)}
                </Text>
            </View>
            <View style={styles.txRight}>
                <Text
                    style={[styles.txAmount, { color: isIncome ? "#2ecc71" : "#e74c3c" }]}
                >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(item.amount)}
                </Text>
                <Text style={styles.txDate}>{formatDate(item.date)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const Dashboard: FC = () => {
    const transactions = SAMPLE_TRANSACTIONS;

    const { income, expense, balance } = useMemo(() => {
        const income = transactions
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + t.amount, 0);
        const expense = transactions
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + t.amount, 0);
        const balance = income - expense;
        return { income, expense, balance };
    }, [transactions]);

    const handleAdd = () => {
        // Placeholder: navigate to Add Transaction screen or open modal
        console.log("Add transaction tapped");
    };

    const fade = useRef(new Animated.Value(0)).current;
    const slide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fade, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(slide, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                {/* Title */}
                <Animated.Text
                    style={[
                        styles.title,
                        { opacity: fade, transform: [{ translateY: slide }] },
                    ]}
                >
                    <Text style={{ color: COLORS.blue }}>Fin</Text>
                    <Text style={{ color: COLORS.green }}>Track</Text>
                </Animated.Text>
                <Text style={styles.subtitle}>Overview</Text>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
                <TouchableOpacity style={styles.addButton} 
               onPress={() => navigation.navigate("SignUp")}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <StatCard label="Income" amount={income} color="#2ecc71" />
                <StatCard label="Expense" amount={expense} color="#e74c3c" />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <Text style={styles.sectionSub}>{transactions.length} items</Text>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(t) => t.id}
                renderItem={({ item }) => <TransactionRow item={item} />}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No transactions yet</Text>
                }
            />

            <TouchableOpacity style={styles.fab} onPress={handleAdd}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f8fb",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 4,
        marginLeft: 4,
        flexDirection: "row",
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 2,
    },
    balanceCard: {
        marginHorizontal: 20,
        marginTop: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    balanceLabel: {
        fontSize: 13,
        color: "#6b7280",
    },
    balanceAmount: {
        marginTop: 8,
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
    },
    addButton: {
        position: "absolute",
        right: 12,
        top: 12,
        backgroundColor: "#2563eb",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 6,
        borderWidth: 1,
        alignItems: "flex-start",
    },
    statLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
    statAmount: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: "700",
    },
    sectionHeader: {
        marginTop: 18,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    sectionSub: {
        fontSize: 12,
        color: "#6b7280",
    },
    listContent: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 120,
    },
    txRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 6,
        marginHorizontal: 8,
    },
    txIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    txInfo: {
        flex: 1,
    },
    txTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    txCategory: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
    txRight: {
        alignItems: "flex-end",
    },
    txAmount: {
        fontSize: 14,
        fontWeight: "700",
    },
    txDate: {
        fontSize: 11,
        color: "#9ca3af",
        marginTop: 4,
    },
    separator: {
        height: 8,
    },
    emptyText: {
        textAlign: "center",
        color: "#9ca3af",
        marginTop: 20,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#111827",
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
    },
    fabText: {
        color: "#fff",
        fontSize: 28,
        lineHeight: 32,
        fontWeight: "700",
    },
});

import React, { FC, useMemo, useEffect, useRef, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
    dark: "#111827",
};

const PUBLICK_URL = "https://sh9m42hg-8080.asse.devtunnels.ms/";

const formatCurrency = (value: number) =>
    Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "LKR",
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
       const navigator = useNavigation();

    const [menuVisible, setMenuVisible] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchUserData = async (userId: string) => {
        const formData = new FormData();
        formData.append("userId", userId);

        try {
            const response = await fetch(`${PUBLICK_URL}FinTrack/RecordsFetch`, {
                method: "POST",
                body: formData,
            });

            const rawText = await response.text();
            let json: any;
            try {
                json = JSON.parse(rawText);
            } catch {
                throw new Error("Server did not return valid JSON.");
            }

            if (response.ok && json.status) {
                console.log("Records:", json.records);
                await AsyncStorage.setItem("records", JSON.stringify(json.records));
                return json.records;
            } else {
                throw new Error(json.message || "Failed to fetch user data.");
            }
        } catch (error: any) {
            console.error("Fetch Error:", error.message);
            return [];
        }
    };

    // Safely parse date
    const parseDate = (rawDate: string): string => {
        try {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) return d.toISOString();

            // fallback for "Sep 3, 2025 2:46:27 PM"
            const months: Record<string, string> = {
                Jan: "01", Feb: "02", Mar: "03", Apr: "04",
                May: "05", Jun: "06", Jul: "07", Aug: "08",
                Sep: "09", Oct: "10", Nov: "11", Dec: "12",
            };

            const parts = rawDate.split(" ");
            const month = months[parts[0]];
            const day = parts[1].replace(",", "").padStart(2, "0");
            const year = parts[2];

            return `${year}-${month}-${day}T00:00:00.000Z`;
        } catch {
            return new Date().toISOString();
        }
    };

    const getTransactions = async (): Promise<Transaction[]> => {
        try {
            const recordsString = await AsyncStorage.getItem("records");

            if (!recordsString) return [];

            const records = JSON.parse(recordsString);

            const transactions: Transaction[] = records.map((item: any) => ({
                id: item.id.toString(),
                title: item.title,
                amount: item.amount,
                date: parseDate(item.created_at),
                type: item.type.value.toLowerCase() as "income" | "expense",
                category: item.category?.value,
            }));

            return transactions;
        } catch (error) {
            console.error("Error loading transactions:", error);
            return [];
        }
    };
    useEffect(() => {
        const loadData = async () => {
            const userId = await AsyncStorage.getItem("userId");
            if (userId) {
                await fetchUserData(userId);
            }
            const txns = await getTransactions();
            console.log("Mapped Transactions:", txns);
            setTransactions(txns);
        };
        loadData();
    }, []);



    const navigation = useNavigation();
    const handleNavigate = (screen: string) => {
        setMenuVisible(false);
        navigation.navigate(screen as never);
    }

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
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigator.navigate("AddExpense" as never)}
                >
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

            <TouchableOpacity style={styles.fab}
                onPress={() => navigator.navigate("AddExpense" as never)}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f8fb",
    },
    header: {
        paddingTop: 20,
        paddingBottom: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        // justifyContent: "", // ensures title left, menu right
        paddingHorizontal: 16,
        paddingVertical: 12,
        position: "relative",
    },
    title: {
        fontSize: 25,
        fontWeight: "700",
        marginBottom: 4,
        marginLeft: 4,
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "center",
        letterSpacing: 1,
        marginTop: 25,
    },
    subtitle: {
        flex:1,
        fontSize: 17,
        color: "#6b7280",
        fontWeight: "500",
        marginTop: 70,
        marginRight:1,
        flexDirection: "row",
        // marginVertical: ,

    },
    balanceCard: {
        marginHorizontal: 20,
        marginTop: 5,
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
        bottom: 110,
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

export default Dashboard;

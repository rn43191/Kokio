import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Mock data (replace with real data in your implementation)
const walletData = {
  balance: '1000.00',
  address: '0x1234...5678',
};

const tokens = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: '0.5', icon: '🟠' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', balance: '2.0', icon: '🔷' },
  { id: '3', name: 'Litecoin', symbol: 'LTC', balance: '10.0', icon: '⚪' },
];

const transactions = [
  { id: '1', name: 'Alice', amount: '+0.1 BTC', date: '2023-08-29', icon: '👩' },
  { id: '2', name: 'Bob', amount: '-0.5 ETH', date: '2023-08-28', icon: '👨' },
  { id: '3', name: 'Charlie', amount: '+5.0 LTC', date: '2023-08-27', icon: '🧑' },
];

const contacts = [
  { id: '1', name: 'Alice', icon: '👩' },
  { id: '2', name: 'Bob', icon: '👨' },
  { id: '3', name: 'Charlie', icon: '🧑' },
  { id: '4', name: 'Diana', icon: '👩' },
  { id: '5', name: 'Ethan', icon: '👨' },
];

const WalletPage = () => {
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Section 1: eSIM Wallet Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <ThemedText style={styles.cardTitle}>eSIM Wallet</ThemedText>
            <Ionicons name="wallet-outline" size={24} color={Colors.light.icon} />
          </View>
          <View style={styles.cardRow}>
            <ThemedText style={styles.balance}>{walletData.balance} USDC</ThemedText>
            <ThemedText style={styles.address}>{walletData.address}</ThemedText>
          </View>
        </View>

        {/* Section 2: Tokens List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Your Tokens</ThemedText>
            <Link href="/wallet/tokens" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllButton}>Show All</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
          {tokens.map((token) => (
            <View key={token.id} style={styles.tokenItem}>
              <ThemedText style={styles.tokenIcon}>{token.icon}</ThemedText>
              <ThemedText style={styles.tokenName}>{token.name}</ThemedText>
              <ThemedText style={styles.tokenBalance}>{token.balance} {token.symbol}</ThemedText>
            </View>
          ))}
        </View>

        {/* Section 3: Transactions List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Transactions</ThemedText>
            <Link href="/wallet/transactions" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllButton}>Show All</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <ThemedText style={styles.transactionIcon}>{tx.icon}</ThemedText>
              <View style={styles.transactionDetails}>
                <ThemedText style={styles.transactionName}>{tx.name}</ThemedText>
                <ThemedText style={styles.transactionDate}>{tx.date}</ThemedText>
              </View>
              <ThemedText style={styles.transactionAmount}>{tx.amount}</ThemedText>
            </View>
          ))}
        </View>

        {/* Section 4: Contacts List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Contacts</ThemedText>
            <Link href="/wallet/contacts" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.seeAllButton}>Show All</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsList}>
            {contacts.map((contact) => (
              <TouchableOpacity key={contact.id} style={styles.contactItem}>
                <ThemedText style={styles.contactIcon}>{contact.icon}</ThemedText>
                <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  address: {
    fontSize: 14,
    color: Colors.light.inactive,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  seeAllButton: {
    color: Colors.light.highlight,
    fontSize: 14,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tokenName: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  tokenBalance: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    color: Colors.light.text,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.light.inactive,
  },
  transactionAmount: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
  contactsList: {
    flexDirection: 'row',
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  contactIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 12,
    color: Colors.light.text,
  },
});

export default WalletPage;
import React from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';

const AllTokensScreen = (tokens: any[]) => {
  const renderToken = ({ item }: { item: { icon: string, name: string, balance: string, id: string } }) => (
    <View style={styles.tokenItem}>
      <Image source={{ uri: item.icon }} style={styles.tokenIcon} />
      <ThemedText style={styles.tokenName}>{item.name}</ThemedText>
      <ThemedText style={styles.tokenBalance}>{item.balance}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={tokens}
        renderItem={renderToken}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
};

const AllTransactionsScreen = (transactions: any[]) => {
  const renderTransaction = ({ item }: { item: { id: string, name: string, date: string, amount: string, image: string } }) => (
    <View style={styles.transactionItem}>
      <Image source={{ uri: item.image }} style={styles.transactionImage} />
      <View style={styles.transactionDetails}>
        <ThemedText style={styles.transactionName}>{item.name}</ThemedText>
        <ThemedText style={styles.transactionDate}>{item.date}</ThemedText>
      </View>
      <ThemedText style={styles.transactionAmount}>{item.amount}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
};

const AllContactsScreen = (contacts: any[]) => {
  const renderContact = ({ item }: { item: { id: string, image: string, name: string } }) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => {/* Handle contact press */}}>
      <Image source={{ uri: item.image }} style={styles.contactImage} />
      <ThemedText style={styles.contactName}>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.inactive,
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tokenName: {
    flex: 1,
  },
  tokenBalance: {
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.inactive,
  },
  transactionImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.light.inactive,
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  contactItem: {
    alignItems: 'center',
    width: '33.33%',
    marginBottom: 16,
  },
  contactImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  contactName: {
    textAlign: 'center',
  },
});

export { AllTokensScreen, AllTransactionsScreen, AllContactsScreen };
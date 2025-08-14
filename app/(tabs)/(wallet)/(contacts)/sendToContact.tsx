import { View, Text, Image, Pressable, Platform, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { KeyboardAvoidingView } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { router, useLocalSearchParams } from 'expo-router'
import { TextInput } from 'react-native-gesture-handler'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRef, useMemo } from 'react'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import _ from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import { useToast } from '@/contexts/ToastContext'

interface Token {
    id: string;
    name: string
    symbol: string;
    value: string;
    icon: string


}
interface Transaction {
    id: string;
    dateTime: string | Date; // Can adjust based on how you want to store it
    tokenAmount: string;
    name: string;
    amount: string;
    status: "pending" | "completed"; // Union type for valid statuses
    type: "sent" | "received"; // Union type for valid types
    icon: string;
  }
  interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    walletAddress: string;
    monogramUrl: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    transactions: Transaction[];
  }

const sendToContact = () => {
    const params = useLocalSearchParams();
    const [amount, setAmount] = useState("0");
    const [token, setToken] = useState<Token | null>(null);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [isLoading,setIsLoading] = useState(false);
    const {showToast} = useToast();


    const sheetRef = useRef(null);


    const snapPoints = useMemo(() => ['96.5%', '97%'], []);
    const handleShowSheet = () => {
        sheetRef.current?.snapToIndex(1); // Snap to the first snap point (65%)
    };
    const handleSend = async () => {
        setIsLoading(true);
        try {
          const contactId = params.id as string;
    
          // Fetch the existing contact
          const contactJson = await AsyncStorage.getItem(`contact_${contactId}`);
          const contact: Contact = contactJson ? JSON.parse(contactJson) : null;
    
          if (!contact) {
            throw new Error("Contact not found");
          }
    
          // Create a new transaction object
          const newTransaction: Transaction = {
            id: `0x${Math.random().toString(16).slice(2)}`, // Generate a random ID (replace with real tx ID if available)
            dateTime: new Date().toISOString(), // Current timestamp in ISO format
            tokenAmount: `${parseFloat(amount)} ${token?.symbol}`, // Example conversion, adjust logic as needed
            name: `${params.firstName} ${params.lastName}`, // Use contact's first name
            amount: `$${(parseFloat(amount) * parseFloat(token?.value || "0")).toFixed(2)}`, // Use the amount from state
            status: "completed", // Assuming send completes immediately
            type: "sent", // This is a send action
            icon: params?.monogramUrl, // Replace with actual icon URL
          };
    
          // Update the transactions array
          const updatedTransactions = [...contact.transactions, newTransaction];
    
          // Update the contact object
          const updatedContact: Contact = {
            ...contact,
            transactions: updatedTransactions,
            updatedAt: new Date(), // Update timestamp
          };
    
          // Save back to AsyncStorage
          await AsyncStorage.setItem(`contact_${contactId}`, JSON.stringify(updatedContact));
    
          console.log("Transaction added successfully:", newTransaction);
          router.push({pathname:"/(tabs)/(wallet)/transactionDetails", params: { transaction: JSON.stringify(newTransaction) }})
    
          
          showToast(newTransaction.amount,newTransaction.tokenAmount,'Sent',params?.firstName,params.monogramUrl)
        } catch (error) {
          console.error("Error adding transaction:", error);
          Alert.alert("Error", "Failed to send transaction");
        } finally {
          setIsLoading(false);
          setAmount('0');
        }
      };

    const getAllTokens = async () => {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
            );
            if (!response.ok) {
                throw new Error('Failed to fetch tokens');
            }
            const data = await response.json();

            // Map the API response to the Token interface and take only the first 20
            const mappedTokens: Token[] = data.slice(0, 20).map((coin: any) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                value: coin.current_price.toString(), // Convert number to string for consistency
                icon: coin.image,
            }));

            // Update state with the first 20 tokens
            setTokens(mappedTokens);
            setToken(mappedTokens[0]);
        } catch (error) {
            console.error('Error fetching tokens:', error);
        }
    };

    useEffect(() => {
        getAllTokens();
    }, [])


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            extraScrollHeight={20}

        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                style={{ flex: 1 }}
            >
                <ThemedView className='flex-1'>
                    <ThemedView darkColor='black' className='w-auto  justify-center'>
                        <View className='w-auto   items-center mt-8'>
                            <Image source={params.monogramUrl ? { uri: params?.monogramUrl } : require('../../../../assets/images/wallet/sampleProfileImg.png')} className='h-[216px] w-[216px]' />
                            <ThemedText variant='xxl' className='text-center mt-4'>{params?.firstName} {params?.lastName}</ThemedText>


                        </View>
                    </ThemedView>
                    <View className='flex-1 mt-10 items-center'>
                        <ThemedView darkColor='#1c1c1e' className='w-auto mx-2 flex-row py-3 rounded-3xl '>
                            <View className='w-[67%]'>
                                <ThemedText light className='ml-6 mt-2'>Amount</ThemedText>
                                <TextInput
                                    value={amount}
                                    placeholder='Enter Amount'
                                    className='text-[18px] text-white font-LexendSemiBold mb-2 ml-6 mt-1 '
                                    placeholderTextColor="white"
                                    onChangeText={(text) => setAmount(text)}
                                    keyboardType='numeric'
                                />
                            </View>
                            <View className='w-[32%]'>
                                <ThemedText light className='mt-2'>Token</ThemedText>
                                <Pressable onPress={handleShowSheet} className='flex-row mt-1 gap-x-2 items-center '>
                                    <ThemedText variant='xl' className=''>{token?.symbol}</ThemedText>
                                    <Image source={{ uri: token?.icon }} className='h-[24] w-[24]' />
                                    <AntDesign name="down" size={24} color="white" />
                                </Pressable>
                            </View>

                        </ThemedView>
                        <ThemedText className='mt-3' >Balance: 100 {token?.symbol}</ThemedText>
                        <ThemedView darkColor='#1c1c1e' className='w-[97%] mt-3 mx-2 px-6 py-5 rounded-3xl '>
                            <View className='flex-row justify-between'>
                                <ThemedText>Estimated Gas Fee:</ThemedText>
                                <ThemedText> 0.0014 {token?.symbol}</ThemedText>
                            </View>
                            <View className='flex-row mt-2 justify-between'>
                                <ThemedText>Total:</ThemedText>
                                <ThemedText>{(parseFloat(amount) + 0.0014).toFixed(4)} {token?.symbol}</ThemedText>
                            </View>
                        </ThemedView>
                        <Pressable onPress={handleSend} className='w-[97%] fixed bg-[#FFD60A] py-3  mt-[200] rounded-3xl'>
                            {isLoading?<ActivityIndicator size='small'/>:
                            <ThemedText darkColor='black' className='text-center'>Confirm & Send {amount} {token?.symbol} </ThemedText>}
                        </Pressable>

                    </View>
                </ThemedView>
                <BottomSheet
                     ref={sheetRef}
                     index={-1} // hidden initially
                     snapPoints={snapPoints}
                     enablePanDownToClose
                     style={{ paddingBottom: 10, borderRadius: 25 }}
                     backgroundStyle={{ backgroundColor: 'rgba(37, 37, 37, 0.95)' }}
                >
                    <ThemedText variant='xl' className='text-center bg-[rgba(37, 37, 37)] pt-2 pb-4'>Select Token</ThemedText>
                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        {_.size(tokens) === 0 ? (
                            <ThemedText darkColor='#AEAEB2' className='mt-5 ml-2 mb-2'>
                                You don't hold any tokens yet.
                            </ThemedText>
                        ) : (
                            <ThemedView darkColor='rgba(37, 37, 37)' className='gap-y-3 mt-3 mb-3 px-4'>
                                {_.map(tokens, (tk, index) => (
                                    <Pressable
                                        onPress={() => setToken(tokens[index])}
                                        key={index}
                                        className="flex-row items-center justify-between mx-3 p-2 rounded-lg"
                                    >
                                        <View className="flex-row items-center">
                                            <Image source={{ uri: tk?.icon }} className="h-[45px] w-[45px]" />
                                            <ThemedText
                                                bold
                                                variant="xl"
                                                darkColor={token?.id === tk.id ? '#FF9F0A' : 'white'
                                                }
                                                className={`ml-3 ${token?.id === tk.id ? 'text-[#FF9F0A]' : 'text-white'
                                                    }`}
                                            >
                                                {tk?.symbol}
                                            </ThemedText>
                                        </View>
                                        <View className="flex-col items-end">
                                            <ThemedText
                                                variant="xl"
                                                darkColor={token?.id === tk.id ? '#FF9F0A' : 'white'
                                                }
                                                className={`${token?.id === tk.id ? 'text-[#FF9F0A]' : 'text-white'
                                                    }`}
                                            >
                                                {tk?.value}
                                            </ThemedText>
                                        </View>
                                    </Pressable>
                                ))}
                            </ThemedView>
                        )}
                    </BottomSheetScrollView>
                </BottomSheet>
            </KeyboardAvoidingView>
        </KeyboardAwareScrollView>
    )
}
const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: 'rgba(37, 37, 37)',
        padding: 0,

        elevation: 50,




    },
})

export default sendToContact;
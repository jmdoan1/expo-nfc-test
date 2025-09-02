import React, { useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import WalletManager from "react-native-wallet-manager";

const PKPASS_URL =
  "https://github.com/dev-family/react-native-wallet-manager/blob/main/example/resources/pass.pkpass?raw=true";
// Replace with a valid JWT for Google Wallet testing
const GOOGLE_WALLET_JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...";

const CARD_IDENTIFIER = "pass.family.dev.walletManager";

export default function WalletScreen() {
  const [canAdd, setCanAdd] = useState<boolean | null>(null);
  const [hasPass, setHasPass] = useState<boolean | null>(null);

  const checkCanAddPasses = async () => {
    try {
      const result = await WalletManager.canAddPasses();
      setCanAdd(result);
      Alert.alert("Can Add Passes", result ? "Yes" : "No");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const addPass = async () => {
    try {
      const result = await WalletManager.addPassFromUrl(PKPASS_URL);
      Alert.alert("Add Pass", JSON.stringify(result));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const addGoogleWalletPass = async () => {
    try {
      await WalletManager.addPassToGoogleWallet(GOOGLE_WALLET_JWT);
      Alert.alert("Google Wallet", "Pass added!");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const checkHasPass = async () => {
    try {
      const result = await WalletManager.hasPass(CARD_IDENTIFIER);
      setHasPass(result);
      Alert.alert("Has Pass", result ? "Yes" : "No");
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const removePass = async () => {
    try {
      const result = await WalletManager.removePass(CARD_IDENTIFIER);
      Alert.alert("Remove Pass", JSON.stringify(result));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  const viewPass = async () => {
    try {
      const result = await WalletManager.viewInWallet(CARD_IDENTIFIER);
      Alert.alert("View Pass", JSON.stringify(result));
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Proof of Concept</Text>
      <Button title="Check if can add passes" onPress={checkCanAddPasses} />
      <View style={styles.spacer} />
      <Button title="Add Pass from URL" onPress={addPass} />
      {/* {Platform.OS === "android" && (
        <>
          <View style={styles.spacer} />
          <Button
            title="Add Pass to Google Wallet"
            onPress={addGoogleWalletPass}
          />
        </>
      )} */}
      {Platform.OS === "ios" && (
        <>
          <View style={styles.spacer} />
          <Button title="Check if pass exists" onPress={checkHasPass} />
          <View style={styles.spacer} />
          <Button title="Remove Pass" onPress={removePass} />
          <View style={styles.spacer} />
          <Button title="View Pass in Wallet" onPress={viewPass} />
        </>
      )}
      <View style={styles.spacer} />
      <Text>
        Can Add Passes: {canAdd === null ? "Unknown" : canAdd ? "Yes" : "No"}
      </Text>
      {Platform.OS === "ios" && (
        <Text>
          Has Pass: {hasPass === null ? "Unknown" : hasPass ? "Yes" : "No"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  spacer: {
    height: 16,
  },
});

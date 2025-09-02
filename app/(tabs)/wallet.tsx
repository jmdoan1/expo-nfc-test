import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WalletManager from "react-native-wallet-manager";

const PKPASS_URL =
  "https://github.com/dev-family/react-native-wallet-manager/blob/main/example/resources/pass.pkpass?raw=true";
// Replace with a valid JWT for Google Wallet testing

const CARD_IDENTIFIER = "pass.family.dev.walletManager";
const CARD_SERIAL = "serial201";

export default function WalletScreen() {
  const [canAdd, setCanAdd] = useState<boolean | null>(null);
  const [hasPass, setHasPass] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const handle = async (fn: () => Promise<any>, loadingMsg: string) => {
    setLoading(loadingMsg);
    setResultMsg(null);
    try {
      const result = await fn();
      setResultMsg(
        typeof result === "object" ? JSON.stringify(result) : String(result)
      );
    } catch (e) {
      setResultMsg("Error: " + String(e));
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎟️ Wallet Test</Text>
      <ScrollView
        style={styles.cardScroll}
        contentContainerStyle={styles.cardScrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wallet Actions</Text>
          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : {}]}
            onPress={() =>
              handle(async () => {
                const result = await WalletManager.canAddPasses();
                setCanAdd(result);
                return "Can Add Passes: " + (result ? "Yes" : "No");
              }, "Checking...")
            }
            disabled={!!loading}
          >
            <Text style={styles.buttonText}>Check if can add passes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : {}]}
            onPress={() =>
              handle(async () => {
                const result = await WalletManager.addPassFromUrl(PKPASS_URL);
                return "Add Pass: " + JSON.stringify(result);
              }, "Adding Pass...")
            }
            disabled={!!loading}
          >
            <Text style={styles.buttonText}>Add Pass from URL</Text>
          </TouchableOpacity>
          {Platform.OS === "ios" && (
            <>
              <TouchableOpacity
                style={[styles.button, loading ? styles.buttonDisabled : {}]}
                onPress={() =>
                  handle(async () => {
                    const result = await WalletManager.hasPass(
                      CARD_IDENTIFIER,
                      CARD_SERIAL
                    );
                    setHasPass(result);
                    return "Has Pass: " + (result ? "Yes" : "No");
                  }, "Checking Pass...")
                }
                disabled={!!loading}
              >
                <Text style={styles.buttonText}>Check if pass exists</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, loading ? styles.buttonDisabled : {}]}
                onPress={() =>
                  handle(async () => {
                    const result = await WalletManager.removePass(
                      CARD_IDENTIFIER
                    );
                    return "Remove Pass: " + JSON.stringify(result);
                  }, "Removing Pass...")
                }
                disabled={!!loading}
              >
                <Text style={styles.buttonText}>Remove Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, loading ? styles.buttonDisabled : {}]}
                onPress={() =>
                  handle(async () => {
                    const result = await WalletManager.viewInWallet(
                      CARD_IDENTIFIER
                    );
                    return "View Pass: " + JSON.stringify(result);
                  }, "Opening Wallet...")
                }
                disabled={!!loading}
              >
                <Text style={styles.buttonText}>View Pass in Wallet</Text>
              </TouchableOpacity>
            </>
          )}
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Can Add Passes:</Text>
            <Text style={styles.statusValue}>
              {canAdd === null ? "Unknown" : canAdd ? "Yes" : "No"}
            </Text>
            {Platform.OS === "ios" && (
              <>
                <Text style={styles.statusLabel}>Has Pass:</Text>
                <Text style={styles.statusValue}>
                  {hasPass === null ? "Unknown" : hasPass ? "Yes" : "No"}
                </Text>
              </>
            )}
            {loading && <Text style={styles.loadingText}>{loading}</Text>}
            {resultMsg && <Text style={styles.resultText}>{resultMsg}</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardScroll: {
    width: "100%",
    maxHeight: 600,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  cardScrollContent: {
    flexGrow: 1,
  },
  card: {
    padding: 16,
    backgroundColor: "#222",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  statusBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  statusLabel: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
  statusValue: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  loadingText: {
    color: "#FFD700",
    fontSize: 15,
    marginTop: 8,
  },
  resultText: {
    color: "#0f0",
    fontSize: 15,
    marginTop: 8,
  },
});

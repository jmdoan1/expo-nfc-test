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

const CARD_IDENTIFIER = "pass.haus.logica.exponfctest";

const PKPASS_URL_1 = "https://www.logica.haus/test/TestPass.pkpass";
// const PKPASS_URL_2 = "https://www.logica.haus/test/TestPass2.pkpass";
const PKPASS_URL_2 = "https://www.logica.haus/test/FinalTestPass2.pkpass";

const CARD_SERIAL_1 = "serial201";
const CARD_SERIAL_2 = "serial202";

export default function WalletScreen() {
  const [canAdd, setCanAdd] = useState<boolean | null>(null);
  const [hasPass1, setHasPass1] = useState<boolean | null>(null);
  const [hasPass2, setHasPass2] = useState<boolean | null>(null);
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

  const renderPassActions = (
    label: string,
    pkpassUrl: string,
    cardSerial: string,
    hasPassState: boolean | null,
    setHasPassState: React.Dispatch<React.SetStateAction<boolean | null>>
  ) => (
    <View style={styles.passRow}>
      <Text style={styles.passLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.buttonSmall, loading ? styles.buttonDisabled : {}]}
        onPress={() =>
          handle(async () => {
            const result = await WalletManager.addPassFromUrl(pkpassUrl);
            return "Add Pass: " + JSON.stringify(result);
          }, `Adding ${label}...`)
        }
        disabled={!!loading}
      >
        <Text style={styles.buttonTextSmall}>Add</Text>
      </TouchableOpacity>
      {Platform.OS === "ios" && (
        <>
          <TouchableOpacity
            style={[styles.buttonSmall, loading ? styles.buttonDisabled : {}]}
            onPress={() =>
              handle(async () => {
                const result = await WalletManager.hasPass(
                  CARD_IDENTIFIER,
                  cardSerial
                );
                setHasPassState(result);
                return "Has Pass: " + (result ? "Yes" : "No");
              }, `Checking ${label}...`)
            }
            disabled={!!loading}
          >
            <Text style={styles.buttonTextSmall}>Check</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSmall, loading ? styles.buttonDisabled : {}]}
            onPress={() =>
              handle(async () => {
                const result = await WalletManager.removePass(CARD_IDENTIFIER);
                return "Remove Pass: " + JSON.stringify(result);
              }, `Removing ${label}...`)
            }
            disabled={!!loading}
          >
            <Text style={styles.buttonTextSmall}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSmall, loading ? styles.buttonDisabled : {}]}
            onPress={() =>
              handle(async () => {
                const result = await WalletManager.viewInWallet(
                  CARD_IDENTIFIER
                );
                return "View Pass: " + JSON.stringify(result);
              }, `Opening ${label}...`)
            }
            disabled={!!loading}
          >
            <Text style={styles.buttonTextSmall}>View</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.passStatus}>
        <Text style={styles.statusLabel}>Has Pass:</Text>
        <Text style={styles.statusValue}>
          {hasPassState === null ? "Unknown" : hasPassState ? "Yes" : "No"}
        </Text>
      </View>
    </View>
  );

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
          {renderPassActions(
            "Pass 1",
            PKPASS_URL_1,
            CARD_SERIAL_1,
            hasPass1,
            setHasPass1
          )}
          {renderPassActions(
            "Pass 2",
            PKPASS_URL_2,
            CARD_SERIAL_2,
            hasPass2,
            setHasPass2
          )}
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Can Add Passes:</Text>
            <Text style={styles.statusValue}>
              {canAdd === null ? "Unknown" : canAdd ? "Yes" : "No"}
            </Text>
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
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 8,
  },
  passLabel: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 8,
    minWidth: 60,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    alignItems: "center",
    marginRight: 6,
  },
  buttonTextSmall: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  passStatus: {
    marginLeft: 8,
    alignItems: "flex-start",
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

import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

// Initialize NFC
NfcManager.start();

export default function NfcTestScreen() {
  const [isReading, setIsReading] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [nfcJson, setNfcJson] = useState<{
    time?: string;
    message?: string;
  } | null>(null);
  const [rawTag, setRawTag] = useState<string | null>(null);
  const [broadcastText, setBroadcastText] = useState("Hello NFC!");

  // Read NFC
  async function readNfc() {
    setIsReading(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setRawTag(JSON.stringify(tag, null, 2));

      // Try to decode NDEF text payload as JSON
      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        const payload = tag.ndefMessage[0].payload;
        let text = "";
        try {
          text = Ndef.text.decodePayload(Uint8Array.from(payload));
          const json = JSON.parse(text);
          setNfcJson(json);
        } catch (e) {
          setNfcJson({ message: "Failed to parse JSON", time: "" });
        }
      } else {
        setNfcJson(null);
      }
    } catch (ex) {
      Alert.alert("Error", "Failed to read NFC");
    } finally {
      setIsReading(false);
      NfcManager.cancelTechnologyRequest();
    }
  }

  // Broadcast NFC (write)
  async function broadcastNfc() {
    setIsBroadcasting(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const payloadObj = {
        time: new Date().toISOString(),
        message: broadcastText,
      };
      const payloadStr = JSON.stringify(payloadObj);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(payloadStr)]);
      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert("Broadcasted!", "Message sent via NFC");
      }
    } catch (ex) {
      Alert.alert("Error", "Failed to broadcast NFC");
    } finally {
      setIsBroadcasting(false);
      NfcManager.cancelTechnologyRequest();
    }
  }

  // Helper to format timestamp
  function formatTime(time?: string) {
    if (!time) return "";
    const date = new Date(time);
    if (isNaN(date.getTime())) return time;
    return date.toLocaleString();
  }

  useEffect(() => {
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 NFC Test</Text>
      <TextInput
        style={styles.input}
        value={broadcastText}
        onChangeText={setBroadcastText}
        placeholder="Enter NFC message"
        editable={!isBroadcasting && !isReading}
      />
      <View style={{ height: 16 }} />
      <TouchableOpacity
        style={[
          styles.button,
          isBroadcasting || isReading ? styles.buttonDisabled : {},
        ]}
        onPress={broadcastNfc}
        disabled={isBroadcasting || isReading}
      >
        <Text style={styles.buttonText}>
          {isBroadcasting ? "Broadcasting..." : "Broadcast JSON"}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 16 }} />
      <TouchableOpacity
        style={[
          styles.button,
          isReading || isBroadcasting ? styles.buttonDisabled : {},
        ]}
        onPress={readNfc}
        disabled={isReading || isBroadcasting}
      >
        <Text style={styles.buttonText}>
          {isReading ? "Reading..." : "Read NFC"}
        </Text>
      </TouchableOpacity>
      {(nfcJson || rawTag) && (
        <ScrollView
          style={styles.cardScroll}
          contentContainerStyle={styles.cardScrollContent}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Last NFC Tag:</Text>
            {nfcJson && (
              <View style={styles.jsonBox}>
                <Text style={styles.jsonLabel}>Message:</Text>
                <Text style={styles.jsonValue}>{nfcJson.message}</Text>
                <Text style={styles.jsonLabel}>Time Written:</Text>
                <Text style={styles.jsonValue}>{formatTime(nfcJson.time)}</Text>
              </View>
            )}
            {rawTag && (
              <View style={styles.rawBox}>
                <Text style={styles.rawLabel}>Raw Tag Data:</Text>
                <Text selectable style={styles.rawValue}>
                  {rawTag}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#111",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#222",
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
  cardScroll: {
    marginTop: 32,
    width: "100%",
    maxHeight: 260,
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
  jsonBox: {
    marginBottom: 12,
  },
  jsonLabel: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
  jsonValue: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  rawBox: {
    marginTop: 8,
  },
  rawLabel: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 2,
  },
  rawValue: {
    color: "#ccc",
    fontSize: 12,
  },
});

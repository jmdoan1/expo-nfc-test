import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

// Initialize NFC
NfcManager.start();

export default function NfcTestScreen() {
  const [isReading, setIsReading] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [nfcMessage, setNfcMessage] = useState<string | null>(null);
  const [broadcastText, setBroadcastText] = useState("Hello NFC!");

  // Read NFC
  async function readNfc() {
    setIsReading(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setNfcMessage(JSON.stringify(tag));
      Alert.alert("NFC Tag Read", JSON.stringify(tag));
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
      const bytes = Ndef.encodeMessage([Ndef.textRecord(broadcastText)]);
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

  useEffect(() => {
    return () => {
      NfcManager.cancelTechnologyRequest();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NFC Test</Text>
      <TextInput
        style={styles.input}
        value={broadcastText}
        onChangeText={setBroadcastText}
        placeholder="Enter NFC message"
        editable={!isBroadcasting && !isReading}
      />
      <View style={{ height: 16 }} />
      <Button
        title={isBroadcasting ? "Broadcasting..." : "Broadcast Text"}
        onPress={broadcastNfc}
        disabled={isBroadcasting || isReading}
      />
      <View style={{ height: 16 }} />
      <Button
        title={isReading ? "Reading..." : "Read NFC"}
        onPress={readNfc}
        disabled={isReading || isBroadcasting}
      />
      {nfcMessage && (
        <View style={styles.result}>
          <Text>Last NFC Tag:</Text>
          <Text selectable>{nfcMessage}</Text>
        </View>
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
  },
  title: { fontSize: 24, marginBottom: 24 },
  result: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});

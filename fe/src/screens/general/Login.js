import React, { useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import { useRegisterFace, useTrainFace, useVerifyFace } from "@/hooks/useFace";

export default function FaceRecognitionScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [npk, setNpk] = useState("");
  const registerMutation = useRegisterFace();
  const trainMutation = useTrainFace();
  const verifyMutation = useVerifyFace();

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      const result = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setPhoto({
        uri: result.uri,
        name: "face.jpg",
        type: "image/jpeg",
      });
    } catch (err) {
      console.log(err);

      Alert.alert("Error", err.message);
    }
  };

  const handleRegister = async () => {
    try {
      if (!npk) {
        Alert.alert("Info", "NPK wajib");
        return;
      }

      if (!photo) {
        Alert.alert("Info", "Take photo terlebih dahulu");
        return;
      }

      const result = await registerMutation.mutateAsync({
        employeeId: npk,
        fullName: npk,
        image: photo,
      });

      if (result.success) {
        await trainMutation.mutateAsync();
        Alert.alert("Success", "Register wajah berhasil");
      } else {
        Alert.alert("Failed", result.message);
      }
    } catch (err) {
      console.log("Register Error:", err);

      Alert.alert("Error", err?.response?.data?.message || err.message);
    }
  };

  const handleVerify = async () => {
    try {
      if (!npk) {
        Alert.alert("Info", "NPK wajib");
        return;
      }

      if (!photo) {
        Alert.alert("Info", "Take photo terlebih dahulu");
        return;
      }

      const result = await verifyMutation.mutateAsync({
        employeeId: npk,
        image: photo,
      });

      if (result.success) {
        Alert.alert("Success", `Welcome ${result.fullName}`);
      } else {
        Alert.alert("Failed", result.message);
      }
    } catch (err) {
      console.log(err);

      Alert.alert("Error", err?.response?.data?.message || err.message);
    }
  };

  const loading =
    registerMutation.isPending ||
    verifyMutation.isPending ||
    trainMutation.isPending;

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission diperlukan</Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Face Recognition</Text>

        <TextInput
          placeholder="Masukkan NPK"
          value={npk}
          onChangeText={setNpk}
          style={styles.input}
        />

        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        {photo && <Image source={{ uri: photo.uri }} style={styles.preview} />}

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Register Wajah</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Verify Wajah</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  cameraContainer: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },

  bottomContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  captureButton: {
    backgroundColor: "#424242",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  registerButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  verifyButton: {
    backgroundColor: "#1565c0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  permissionButton: {
    backgroundColor: "#1565c0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  preview: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

import { AppCard } from "@/components/ui/AppCard";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const InstitusiCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("DetailInstitusi", { id: item.id })}
    >
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.namaInstitusi}</Text>
          <View
            style={[
              styles.badge,
              item.status === "Aktif"
                ? styles.badgeActive
                : styles.badgeInactive,
            ]}
          >
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Direktur:</Text>
          <Text style={styles.value}>{item.namaDirektur}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>No. SK:</Text>
          <Text style={styles.value}>{item.nomorSK}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanggal SK:</Text>
          <Text style={styles.value}>
            {new Date(item.tanggalSK).toLocaleDateString("id-ID")}
          </Text>
        </View>
      </AppCard>
    </TouchableOpacity>
  );
};

InstitusiCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    namaInstitusi: PropTypes.string.isRequired,
    namaDirektur: PropTypes.string.isRequired,
    nomorSK: PropTypes.string.isRequired,
    tanggalSK: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  card: { marginBottom: 12, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 16, fontWeight: "bold", flex: 1, color: "#333" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeActive: { backgroundColor: "#D4EDDA" },
  badgeInactive: { backgroundColor: "#F8D7DA" },
  badgeText: { fontSize: 10, fontWeight: "bold", color: "#721C24" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  label: { width: 80, fontSize: 12, color: "#777" },
  value: { flex: 1, fontSize: 12, color: "#333", fontWeight: "500" },
});

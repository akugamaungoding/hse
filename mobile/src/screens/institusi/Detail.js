import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useDetailInstitusi } from "@/hooks/useInstitusi";
import { AppCard } from "@/components/ui/AppCard";
import { COLORS } from "@/constants/theme";
import { Button } from "@/components/ui/AppButton";
import { useAuthStore } from "@/store/useAuthStore";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import { AppText } from "@/components/ui/AppText";
import { globalStyles } from "@/styles/globalStyles";
import PropTypes from "prop-types";

const DetailInstitusiScreen = ({ route }) => {
  const { id } = route.params;
  const { data, isLoading, isError, error } = useDetailInstitusi(id);
  const logout = useAuthStore((state) => state.logout);

  const detail = data;

  console.log("DetailInstitusiScreen data:", detail);

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={styles.value}>{value || "-"}</AppText>
    </View>
  );
  InfoRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  if (isLoading) {
    return (
      <View style={{ padding: 20 }}>
        <SkeletonLoader width="60%" height={30} style={{ marginBottom: 20 }} />
        <SkeletonLoader width="100%" height={100} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <AppText style={{ color: COLORS.danger }}>
          Error: {error.message}
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.headerContainer}>
        <AppText style={styles.title}>{detail.namaInstitusi}</AppText>
        <View
          style={[
            styles.badge,
            detail.status === "Aktif" ? styles.bgSuccess : styles.bgDanger,
          ]}
        >
          <AppText style={styles.badgeText}>{detail.status}</AppText>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Struktur Pimpinan</Text>
      <AppCard style={styles.card}>
        <InfoRow label="Direktur" value={detail.namaDirektur} />
        <InfoRow label="Wadir 1" value={detail.namaWadir1} />
        <InfoRow label="Wadir 2" value={detail.namaWadir2} />
        <InfoRow label="Wadir 3" value={detail.namaWadir3} />
        <InfoRow label="Wadir 4" value={detail.namaWadir4} />
      </AppCard>

      <Text style={styles.sectionTitle}>Kontak & Lokasi</Text>
      <AppCard style={styles.card}>
        <InfoRow label="Alamat" value={detail.alamat} />
        <InfoRow label="Email" value={detail.email} />
        <InfoRow label="Telepon" value={detail.telepon} />
        <InfoRow label="Website" value={detail.website} />
      </AppCard>

      <Text style={styles.sectionTitle}>Legalitas</Text>
      <AppCard style={styles.card}>
        <InfoRow label="Nomor SK" value={detail.nomorSK} />
        <InfoRow
          label="Tanggal SK"
          value={new Date(detail.tanggalSK).toLocaleDateString("id-ID")}
        />
      </AppCard>
      <Button title="Logout / Keluar" variant="outline" onPress={logout} />
    </ScrollView>
  );
};

DetailInstitusiScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center" },
  headerContainer: { marginBottom: 20, alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    color: COLORS.primary,
  },
  card: { padding: 12, marginBottom: 10 },
  infoRow: { marginBottom: 10 },
  label: { fontSize: 12, color: "#888", marginBottom: 2 },
  value: { fontSize: 14, color: "#333", fontWeight: "500" },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  bgSuccess: { backgroundColor: "#D4EDDA" },
  bgDanger: { backgroundColor: "#F8D7DA" },
  badgeText: { fontSize: 12, fontWeight: "bold" },
});

export default DetailInstitusiScreen;

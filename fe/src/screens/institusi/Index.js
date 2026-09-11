import React from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import { useInstitusi } from "@/hooks/useInstitusi";
import { InstitusiCard } from "@/components/module/institusi/InstitusiCard";
import { COLORS } from "@/constants/theme";
import { AppText } from "@/components/ui/AppText";
import { Loader } from "@/components/common/Loader";
import { globalStyles } from "@/styles/globalStyles";

const InstitusiScreen = () => {
  const params = {
    PageNumber: 1,
    PageSize: 10,
    SearchKeyword: "",
    Status: "",
    Urut: "[Nama Institusi] asc",
  };
  
  const { data, isLoading, isError, error, refetch, isFetching } =
    useInstitusi(params);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <AppText style={styles.errorText}>
          Terjadi Kesalahan: {error.message}
        </AppText>
        <AppText onPress={() => refetch()} style={styles.retryText}>
          Coba Lagi
        </AppText>
      </View>
    );
  }

  const listData = data?.data || [];

  return (
    <View style={globalStyles.container}>
      <AppText style={styles.screenTitle}>
        Daftar Institusi ({data?.totalData || 0})
      </AppText>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <InstitusiCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <AppText style={styles.emptyText}>Tidak ada data institusi.</AppText>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", marginBottom: 10 },
  retryText: {
    color: COLORS.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  emptyText: { textAlign: "center", marginTop: 20, color: "#999" },
});

export default InstitusiScreen;

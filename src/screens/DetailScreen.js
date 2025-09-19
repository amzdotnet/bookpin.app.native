import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Linking } from "react-native";

const DetailScreen = ({ route }) => {
  const { item } = route.params;

  const renderSharedContent = () => {
    if (!item.sharedData) return null;

    if (item.mimeType?.startsWith('image/')) {
      return (
        <View style={styles.sharedContent}>
          <Text style={styles.label}>Shared Image:</Text>
          <Image 
            source={{ uri: item.sharedData }} 
            style={styles.sharedImage}
            resizeMode="contain"
          />
        </View>
      );
    } else if (item.mimeType === 'text/plain' || item.sharedData.startsWith('http')) {
      return (
        <View style={styles.sharedContent}>
          <Text style={styles.label}>Shared Content:</Text>
          <Text 
            style={item.sharedData.startsWith('http') ? styles.link : styles.sharedText}
            onPress={() => {
              if (item.sharedData.startsWith('http')) {
                Linking.openURL(item.sharedData);
              }
            }}
          >
            {item.sharedData}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.sharedContent}>
        <Text style={styles.label}>Shared Content:</Text>
        <Text style={styles.sharedText}>{item.sharedData}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Item Details</Text>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.name}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{item.tag}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{item.description || "No description"}</Text>
      </View>
      
      {renderSharedContent()}
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Date Saved:</Text>
        <Text style={styles.value}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    flex: 1,
    marginLeft: 10,
  },
  sharedContent: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  sharedImage: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  sharedText: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  link: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default DetailScreen;
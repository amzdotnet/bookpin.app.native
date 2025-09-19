import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFS from 'react-native-fs';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { saveItem } from "../utils/storage";
import { useShare } from "../context/ShareContext";
import { api } from "../services/authService";

const ShareScreen = ({ navigation }) => {
  // const [tag, setTag] = useState("image");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { sharedData, clearSharedData } = useShare();

  // useEffect(() => {
  //   // If we have shared data, set the name based on the shared content
  //   if (sharedData) {
  //     if (sharedData.mimeType?.startsWith('image/')) {
  //       setTag('image');
  //       setName('Shared Image');
  //     } else if (sharedData.mimeType === 'text/plain') {
  //       setTag('text');
  //       setName('Shared Text');
  //       setDescription(sharedData.data);
  //     } else if (sharedData.data && sharedData.data.startsWith('http')) {
  //       setTag('link');
  //       setName('Shared Link');
  //       setDescription(sharedData.data);
  //     }
  //   }
  // }, [sharedData]);
  useEffect(() => {
  const fetchTags = async () => {
    try {
      // Token ka manual fetching aur header set karna zaruri nahi agar interceptor sahi se token laga raha hai
      const token = await AsyncStorage.getItem('token'); 

      const response = await api.get('/api/tag/get-all-active-tag');
      

      setTags(response.tagDtoList); // Directly use karo, kyunki interceptor ne response simplify kar diya hai
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setLoading(false);
    }
  };

  fetchTags();
}, []);

// useEffect(() => {
//   const fetchTags = async () => {
//     try {
//       debugger;
//       const token = await AsyncStorage.getItem('token'); // Token ko AsyncStorage se get karo
//       // const response = await axios.get('http://10.0.2.2:5118/api/tag/get-all-active-tag',
//       const response = await api.get('/api/tag/get-all-active-tag', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // 'Content-Type': 'application/json', // Optional for GET
//         },
//       });

//       debugger; // Debug here if needed

//       setTags(response.tagDtoList); // assuming response.data is an array of tags
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch tags:', error);
//       setLoading(false);
//     }
//   };

//   fetchTags();
// }, []);


const uriToBase64 = async (uri) => {
  try {
    const base64 = await RNFS.readFile(uri, 'base64');
    return base64;
  } catch (error) {
    console.error('Failed to convert file to base64:', error);
    return null;
  }
};
const handleSave = async () => {
  if (!name.trim()) {
    Alert.alert("Error", "Please enter a name");
    return;
  }

  if (!sharedData) {
    Alert.alert("Error", "No shared content to save");
    return;
  }

  // Convert content URI to base64
  const base64Data = await uriToBase64(sharedData.data);
  if (!base64Data) {
    Alert.alert("Error", "Failed to read image data");
    return;
  }

  const newItem = {
    id: Date.now().toString(),
    tag,
    name: name.trim(),
    description: description.trim(),
    Screenshot: base64Data, // ✅ base64 image
    date: new Date().toISOString(),
    sharedData: base64Data,
    mimeType: sharedData.mimeType,
    FileBase64: base64Data,
    FileName: sharedData.fileName || "screenshot.png",
  };

  const success = await saveItem(newItem);

  if (success) {
    Alert.alert("Success", "Item saved successfully!");
    setName("");
    setDescription("");
    setTag("image");
    clearSharedData();
    navigation.navigate('Home');
  } else {
    Alert.alert("Error", "Failed to save item");
  }
};


  const renderSharedContent = () => {
    if (!sharedData) {
      return (
        <View style={styles.sharedContent}>
          <Text style={styles.noContentText}>No shared content received. Please share something from another app.</Text>
        </View>
      );
    }

    if (sharedData.mimeType?.startsWith('image/')) {
      return (
        <View style={styles.sharedContent}>
          <Text style={styles.label}>Shared Image:</Text>
          <Image 
            source={{ uri: sharedData.data }} 
            style={styles.sharedImage}
            resizeMode="contain"
          />
        </View>
      );
    } else if (sharedData.mimeType === 'text/plain') {
      return (
        <View style={styles.sharedContent}>
          <Text style={styles.label}>Shared Text:</Text>
          <Text style={styles.sharedText}>{sharedData.data}</Text>
        </View>
      );
    } else if (sharedData.data && sharedData.data.startsWith('http')) {
      return (
        <View style={styles.sharedContent}>
          <Text style={styles.label}>Shared Link:</Text>
          <Text style={styles.sharedText}>{sharedData.data}</Text>
        </View>
      );
    }

    return (
      <View style={styles.sharedContent}>
        <Text style={styles.label}>Shared Content:</Text>
        <Text style={styles.sharedText}>{sharedData.data}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Add Shared Item</Text>

        {renderSharedContent()}

        {/* <Text style={styles.label}>Select Tag</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tag}
            onValueChange={(itemValue) => setTag(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Image" value="image" />
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Link" value="link" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View> */}

        <View style={styles.container}>
  <Text style={styles.label}>Select Tag</Text>
  <View style={styles.pickerContainer}>
    {loading && (
      <Text style={styles.loadingText}>Loading tags...</Text>
    )}

    {!loading && (
      <Picker
        selectedValue={tag}
        onValueChange={(itemValue) => setTag(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label=" Select Tag " value="" />
        {
          tags.map((item) => (
            <Picker.Item
              key={item._id || item.id}
              label={item.name}
              value={item.value || item.name.toLowerCase()}
            />
          ))
        }
      </Picker>
    )}
  </View>
</View>


        {/* <View style={styles.container}>
      <Text style={styles.label}>Select Tag</Text>
      <View style={styles.pickerContainer}>
        {
          loading ? (
            <Text>Loading tags...</Text>
          ) : (
            <Picker
              selectedValue={tag}
              onValueChange={(itemValue) => setTag(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label=" Select Tag " value="" />
              {
                tags.map((item) => (
                  <Picker.Item
                    key={item._id || item.id}
                    label={item.name}
                    value={item.value || item.name.toLowerCase()}
                  />
                ))
              }
            </Picker>
          )
        }
      </View>
    </View> */}


        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter a name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => {
            clearSharedData();
            navigation.goBack();
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#333',
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  sharedContent: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sharedImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 6,
  },
  sharedText: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    fontSize: 14,
  },
  noContentText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ShareScreen;
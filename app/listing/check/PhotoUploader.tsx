import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PhotoUploaderProps {
    photoUrl?: string;
    onPhotoSelected: (file: any) => void; // Новая пропса: функция для передачи файла
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photoUrl, onPhotoSelected }) => {
    const [localPhoto, setLocalPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setLocalPhoto(uri);

            // Создаем объект файла для отправки на сервер
            const fileName = uri.split("/").pop() || "photo.jpg";
            const fileType = fileName.split(".").pop();

            const photoFile = {
                uri,
                name: fileName,
                type: `image/${fileType}`,
            };

            // Передаем объект файла обратно в родительский компонент
            onPhotoSelected(photoFile);
        }
    };

    return (
        <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={[styles.infoText, { marginBottom: 5 }]}>Фото счетчика:</Text>
            <View style={{ position: "relative" }}>
                {/* Отображаем фото */}
                {localPhoto || photoUrl ? (
                    <Image
                        source={{ uri: localPhoto || photoUrl }}
                        style={{ width: 350, height: 200, resizeMode: "cover", borderRadius: 10 }}
                    />
                ) : (
                    <View
                        style={{
                            width: 350,
                            height: 200,
                            borderRadius: 10,
                            backgroundColor: "#f3f3f3",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={styles.infoText}>Фото отсутствует</Text>
                    </View>
                )}
                {/* Кнопка для выбора фото */}
                <TouchableOpacity onPress={pickImage} style={styles.iconButton} disabled={loading}>
                    <Camera size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    infoText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    iconButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#EA961C",
        padding: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
});

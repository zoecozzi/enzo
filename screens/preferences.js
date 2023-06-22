import React, { useState, useContext } from 'react';
import { StyleSheet, Image, Text, View, SafeAreaView, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import QuickButton from '../components/button';
import Section from '../components/section';
import Search from "../components/search";
import { Context } from '../lib/context';
import styles from "../styles/preferences.scss";
import { colors } from '../assets/favories/colors';
import IconDisplay from '../components/icon-display';

const Stack = createStackNavigator();

export default function Preferences({ visible, closeScreenFunction }) {
  return (
    <SafeAreaView >
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="FavoritesList" component={FavoritesList} />
          <Stack.Screen name="SearchAddressToAddToFavorites" component={SearchAddressToAddToFavorites} />
          <Stack.Screen name="SettingToAddToFavorites" component={SettingToAddToFavorites} />
        </Stack.Navigator>
      </NavigationContainer>
      <QuickButton onPressFunction={closeScreenFunction} image={require('../assets/cross.png')} />
    </SafeAreaView>
  );
}

function FavoritesList({ closeScreenFunction }) {
  const { setStoredFavoris, storedFavoris } = useContext(Context);
  const navigation = useNavigation();

  const handleAddFavorite = () => {
    navigation.navigate('SearchAddressToAddToFavorites');
  };

  const handleClean = async () => {
    await setStoredFavoris([]);
  };

  const FavoritesItem = ({ imagePath, name, street, city }) => {
    return (
      <View style={styles.favoritesItem}>
        <View style={styles.favoritesIconContainer}>
          <Image source={imagePath} style={styles.favoritesIcon} />
        </View>
        <View style={styles.descriptionContainer}>
          <Text>{name}</Text>
          <Text>{street}</Text>
          <Text>{city}</Text>
        </View>
        <QuickButton onPressFunction={closeScreenFunction} image={require('../assets/plus.png')} />
      </View>
    );
  };

  navigation.navigate('SearchAddressToAddToFavorites'); 

  return (
    <View>
      <Text>Mes adresses favorites</Text>
      <Section title="Mes adresses favorites" />
      <View style={styles.favoritesList}>
        <FavoritesItem
          imagePath={require('../assets/favories/cafe.png')}
          name="Maison"
          street="561 Chemin des Peuplier"
          city="13530 Trets"
        />
        <FavoritesItem
          imagePath={require('../assets/favories/school.png')}
          name="..."
          street="..."
          city="..."
        />
        <FavoritesItem
          imagePath={require('../assets/favories/airplane.png')}
          name="..."
          street="..."
          city="..."
        />
        {/* <TouchableOpacity onPress={() => }> */}
        <Text style={styles.favoriteButtonText}>+ Ajouter</Text>
              {/* </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.addToFavoriteButton} onPress={navigation.navigate('SearchAddressToAddToFavorites')}>
          <Text style={styles.favoriteButtonText}>+ Ajouter</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.addToFavoriteButton} onPress={handleClean}>
          <Text style={styles.favoriteButtonText}>- Clean</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

function SearchAddressToAddToFavorites() {
  const navigation = useNavigation();

  const handleCancelAddFavorite = () => {
    navigation.goBack();
  };

  const handleEditFavorite = () => {
    navigation.navigate('SettingToAddToFavorites');
  };

  return (
    <View style={[{ flex: 1 }, styles.searchContainer]}>
      <Search />
      <View style={styles.stageSelector}>
        <TouchableOpacity onPress={handleCancelAddFavorite}>
          <Text style={styles.stageSelectorCancelButton}>{'<'}  Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Étape 1 sur 2</Text>
        <TouchableOpacity onPress={handleEditFavorite}>
          <Text style={styles.stageSelectorValidateButton}>Suivant  {'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingToAddToFavorites() {
  const [selectedColor, setSelectedColor] = useState(colors[0].code);
  const [selectedImage, setSelectedImage] = useState(require('../assets/favories/airplane.png'));
  const [nameFavoris, setNameFavoris] = useState('');
  const { setStoredFavoris, storedAddresses } = useContext(Context);
  const navigation = useNavigation();

  const handleReturnAddFavorite = () => {
    navigation.navigate('SearchAddressToAddToFavorites');
  };

  const handleButtonClick = async () => {
    let adresse = storedAddresses[storedAddresses.length - 1].address.name;
    let ville = storedAddresses[storedAddresses.length - 1].address.administrative_regions[storedAddresses[storedAddresses.length - 1].address.administrative_regions.length - 1].name;
    let codePostal = storedAddresses[storedAddresses.length - 1].address.administrative_regions[storedAddresses[storedAddresses.length - 1].address.administrative_regions.length - 1].zip_code;
    let city = codePostal + " " + ville;

    let newList = [];
    if (storedFavoris?.length > 0) newList = [...storedFavoris];

    newList.push({
      selectedColor: selectedColor,
      selectedImage: selectedImage,
      nameFavoris: nameFavoris,
      adresse: adresse,
      city: city,
    });

    try {
      await setStoredFavoris(newList);
    } catch (error) {
      console.log(error);
    }

    closeScreenFunction(); // Call the closeScreenFunction after saving the favorite
  };

  const handleColorSelect = (colorCode) => {
    setSelectedColor(colorCode);
  };

  const handleIconSelect = (index) => {
    setSelectedImage(index + 1);
  };

  return (
    <View style={[{ flex: 1 }, styles.searchContainer]}>
      <View style={styles.generalContainer}>
        <View style={styles.favoritesContainer}>
          <View style={[styles.favoritesIconContainer, { backgroundColor: selectedColor }]}>
            <Image source={selectedImage} style={styles.favoritesIcon} />
          </View>
          <TextInput
            onChangeText={(text) => setNameFavoris(text)}
            style={styles.favoriteInput}
            placeholder="Nom du favoris"
          />
        </View>
        <View style={styles.colorContainer}>
          {colors.map((c) => (
            <TouchableOpacity
              key={c.name}
              style={[styles.colorDot, { backgroundColor: c.code }]}
              onPress={() => handleColorSelect(c.code)}
            />
          ))}
        </View>
        <IconDisplay handleIconSelect={handleIconSelect} />
      </View>
      <View style={styles.stageSelector}>
        <TouchableOpacity onPress={handleReturnAddFavorite}>
          <Text style={styles.stageSelectorCancelButton}>{'<'}  Précédent</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Étape 2 sur 2</Text>
        <TouchableOpacity onPress={handleButtonClick}>
          <Text style={styles.stageSelectorValidateButton}>Valider  {'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

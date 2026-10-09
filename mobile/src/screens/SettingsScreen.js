import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen({ navigation }) {
  const {
    modoEscuro,
    idioma,
    cores,
    traduzir,
    alternarTema,
    alterarIdioma,
  } = useSettings();

  const styles = criarEstilos(cores);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={21}
          color={cores.primary}
        />
        <Text style={styles.backText}>
          {idioma === 'pt' ? 'Voltar' : 'Back'}
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons
            name="settings-outline"
            size={30}
            color={cores.primary}
          />
        </View>

        <Text style={styles.title}>
          {traduzir('settings')}
        </Text>

        <Text style={styles.subtitle}>
          {idioma === 'pt'
            ? 'Personalize sua experiência no aplicativo.'
            : 'Customize your app experience.'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {traduzir('preferences')}
        </Text>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceIcon}>
            <Ionicons
              name={modoEscuro ? 'moon' : 'sunny-outline'}
              size={22}
              color={cores.primary}
            />
          </View>

          <View style={styles.preferenceText}>
            <Text style={styles.itemTitle}>
              {traduzir('darkMode')}
            </Text>
            <Text style={styles.itemDescription}>
              {modoEscuro
                ? idioma === 'pt'
                  ? 'Tema escuro ativado'
                  : 'Dark theme enabled'
                : idioma === 'pt'
                  ? 'Tema claro ativado'
                  : 'Light theme enabled'}
            </Text>
          </View>

          <Switch
            value={modoEscuro}
            onValueChange={alternarTema}
            trackColor={{
              false: '#D0D5DD',
              true: cores.primary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.languageHeader}>
          <View style={styles.preferenceIcon}>
            <Ionicons
              name="language-outline"
              size={22}
              color={cores.primary}
            />
          </View>

          <View style={styles.preferenceText}>
            <Text style={styles.itemTitle}>
              {traduzir('language')}
            </Text>
            <Text style={styles.itemDescription}>
              {idioma === 'pt'
                ? 'Selecione o idioma do aplicativo'
                : 'Select the app language'}
            </Text>
          </View>
        </View>

        <View style={styles.languageOptions}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              idioma === 'pt' && styles.languageSelected,
            ]}
            onPress={() => alterarIdioma('pt')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.languageText,
                idioma === 'pt' && styles.languageTextSelected,
              ]}
            >
            {traduzir('portuguese')}
            </Text>

            {idioma === 'pt' && (
              <Ionicons
                name="checkmark-circle"
                size={19}
                color={cores.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              idioma === 'en' && styles.languageSelected,
            ]}
            onPress={() => alterarIdioma('en')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.languageText,
                idioma === 'en' && styles.languageTextSelected,
              ]}
            >
            {traduzir('english')}
            </Text>

            {idioma === 'en' && (
              <Ionicons
                name="checkmark-circle"
                size={19}
                color={cores.primary}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {traduzir('about')}
        </Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            {traduzir('name')}
          </Text>
          <Text style={styles.infoValue}>
            GaragePedia
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            {traduzir('version')}
          </Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoItemLast}>
          <Text style={styles.infoLabel}>
            {traduzir('platform')}
          </Text>
          <Text style={styles.infoValue}>
            React Native
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.aboutHeader}>
          <Ionicons
            name="car-sport-outline"
            size={22}
            color={cores.primary}
          />
          <Text style={styles.sectionTitle}>
            GaragePedia
          </Text>
        </View>

        <Text style={styles.description}>
          {traduzir('description')}
        </Text>
      </View>

      <Text style={styles.footer}>
        GaragePedia • 1.0.0
      </Text>
    </ScrollView>
  );
}

function criarEstilos(cores) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.background,
    },
    content: {
      padding: 20,
      paddingBottom: 35,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: 20,
      paddingVertical: 8,
      paddingRight: 12,
    },
    backText: {
      fontSize: 15,
      color: cores.primary,
      fontWeight: '600',
      marginLeft: 8,
    },
    header: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 28,
    },
    headerIcon: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: cores.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    title: {
      fontSize: 27,
      fontWeight: 'bold',
      color: cores.primary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: cores.secondary,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 21,
    },
    section: {
      marginBottom: 20,
      padding: 18,
      backgroundColor: cores.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: cores.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: cores.text,
      marginBottom: 16,
    },
    preferenceItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    preferenceIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: cores.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    preferenceText: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: cores.text,
    },
    itemDescription: {
      fontSize: 12,
      color: cores.secondary,
      marginTop: 4,
      lineHeight: 17,
    },
    separator: {
      height: 1,
      backgroundColor: cores.border,
      marginVertical: 18,
    },
    languageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    languageOptions: {
      marginTop: 15,
      gap: 10,
    },
    languageButton: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 13,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: cores.border,
      backgroundColor: cores.background,
    },
    languageSelected: {
      borderColor: cores.primary,
      borderWidth: 1.5,
    },
    languageText: {
      fontSize: 14,
      color: cores.text,
    },
    languageTextSelected: {
      color: cores.primary,
      fontWeight: 'bold',
    },
    infoItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: cores.border,
    },
    infoItemLast: {
      paddingTop: 12,
    },
    infoLabel: {
      fontSize: 12,
      color: cores.secondary,
      marginBottom: 5,
    },
    infoValue: {
      fontSize: 15,
      color: cores.text,
    },
    aboutHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    description: {
      fontSize: 14,
      color: cores.secondary,
      lineHeight: 22,
    },
    footer: {
      fontSize: 12,
      color: cores.secondary,
      textAlign: 'center',
      marginTop: 3,
    },
  });
}
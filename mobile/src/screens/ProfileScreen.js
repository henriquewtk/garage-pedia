import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profile}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>L</Text>
        </View>

        <Text style={styles.name}>Lucas Silva</Text>

        <Text style={styles.email}>
          lucas.silva@email.com
        </Text>

      </View>

      <View style={styles.stats}>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Comparações</Text>
        </View>

      </View>

      <View style={styles.menu}>

        <ProfileOption title="Editar Perfil" />

        <ProfileOption title="Configurações" />

      </View>

      <View style={styles.logout}>
        <Text style={styles.logoutText}>
          Sair da Conta
        </Text>
      </View>

    </ScrollView>
  );
}

function ProfileOption({ title }) {
  return (
    <View style={styles.option}>

      <Text style={styles.optionText}>
        {title}
      </Text>

      <Text style={styles.arrow}>
        ›
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  header: {
    marginTop: 50,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
  },

  profile: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111111',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
  },

  email: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },

  stats: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
  },

  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },

  menu: {
    marginBottom: 20,
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  optionText: {
    fontSize: 16,
    color: '#111111',
  },

  arrow: {
    fontSize: 25,
    color: '#888888',
  },

  logout: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CC3333',
  },

});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from './Ionicons';

const items = [
  { key: 'informed', icon: 'reader-outline', label: 'Right to be Informed', color: '#FFEDD5' },
  { key: 'access', icon: 'key-outline', label: 'Right to Access', color: '#FEF3C7' },
  { key: 'rectify', icon: 'create-outline', label: 'Right to Rectification', color: '#ECFEFF' },
  { key: 'erase_block', icon: 'trash-outline', label: 'Right to Erasure or Blocking', color: '#FEF2F2' },
  { key: 'object', icon: 'ban-outline', label: 'Right to Object', color: '#F0F9FF' },
  { key: 'portability', icon: 'cloud-upload-outline', label: 'Right to Data Portability', color: '#F5F3FF' },
  { key: 'damages', icon: 'alert-circle-outline', label: 'Right to Damages', color: '#FFF7ED' },
  { key: 'data_erase', icon: 'close-circle-outline', label: 'Right to Data Erasure', color: '#F8FAFC' },
];

const PrivacyRightsGrid: React.FC = () => {
  return (
    <View style={styles.container}>
      {items.map(item => (
        <View key={item.key} style={styles.cell}>
          <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={[styles.iconWrap, { backgroundColor: item.color, borderColor: '#E6E6E6' }]}>
              <Ionicons name={item.icon as any} size={22} color="#0F172A" />
            </View>
            <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  cell: {
    width: '48%',
    paddingBottom: 12,
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
});

export default PrivacyRightsGrid;

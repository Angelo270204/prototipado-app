/**
 * Designer Projects Screen
 * Lista de proyectos para diseñadores
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/DesignSystem';
import { ProjectCard } from '@/components/molecules/ProjectCard';
import { Button } from '@/components/atoms/Button';
import { mockProjects } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';

export default function DesignerProjectsScreen() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress' | 'validation'>('all');

  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'pending', label: 'Pendientes' },
    { key: 'in_progress', label: 'En Progreso' },
    { key: 'validation', label: 'Validación' },
  ];

  const filteredProjects = selectedFilter === 'all'
    ? mockProjects
    : mockProjects.filter(p => p.status === selectedFilter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {currentUser?.name?.split(' ')[0] || 'Diseñador'}</Text>
          <Text style={styles.subtitle}>{filteredProjects.length} proyectos activos</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/designer/new-project')}>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Nuevo</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => router.push(`/designer/project-detail?id=${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay proyectos en esta categoría</Text>
          </View>
        }
      />

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/designer/projects')}>
          <Text style={styles.navIcon}>📁</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Proyectos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/designer/ar-viewer')}>
          <Text style={styles.navIcon}>🥽</Text>
          <Text style={styles.navLabel}>Vista RA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/designer/profile')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.sizes.h1,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  addButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.background.primaryer,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
  },
  filterChipActive: {
    backgroundColor: Colors.success,
  },
  filterText: {
    fontSize: Typography.sizes.bodySmall,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.background.primaryer,
    fontWeight: Typography.weights.semibold,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.background.primaryer,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  navLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  navLabelActive: {
    color: Colors.success,
    fontWeight: Typography.weights.semibold,
  },
});

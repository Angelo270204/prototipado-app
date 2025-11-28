/**
 * Project Comments Screen
 * Vista de comentarios/chat del proyecto - Comunicación entre todos los roles
 * Diseñador ↔ Cliente ↔ Producción ↔ Operador
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignSystem';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';

export default function ProjectCommentsScreen() {
  const router = useRouter();
  const { projectId } = useLocalSearchParams();
  const authContext = useAuth();
  const { user: currentUser } = authContext;
  const { sendMessage, getProjectMessages, normalizeAllMessages } = useChat();
  const { projects } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);

  const [newComment, setNewComment] = useState('');

  // Obtener proyecto desde el contexto (incluye proyectos nuevos compartidos)
  const project = projects.find(p => p.id === projectId);

  // Obtener mensajes del proyecto
  const projectMessages = getProjectMessages(projectId as string);

  // Debug logs
  console.log('💬 [Chat] ProjectId:', projectId);
  console.log('💬 [Chat] Auth Context completo:', authContext);
  console.log('💬 [Chat] Current User Object:', currentUser);
  console.log('💬 [Chat] User Name:', currentUser?.name);
  console.log('💬 [Chat] User Role:', currentUser?.role);
  console.log('💬 [Chat] Total Messages for Project:', projectMessages.length);

  useEffect(() => {
    // Scroll al final cuando hay nuevos mensajes
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [projectMessages.length]);

  const handleSendComment = () => {
    console.log('🔴 [Chat] handleSendComment INICIADO');
    console.log('🔴 [Chat] newComment:', newComment);
    console.log('🔴 [Chat] newComment.trim():', newComment.trim());

    if (!newComment.trim()) {
      console.log('🔴 [Chat] ABORTADO: mensaje vacío');
      Alert.alert('Error', 'Por favor escribe un mensaje');
      return;
    }

    console.log('🔴 [Chat] currentUser:', currentUser);
    if (!currentUser) {
      console.log('🔴 [Chat] ABORTADO: no hay currentUser');
      Alert.alert('Error', 'No hay usuario autenticado. Por favor inicia sesión nuevamente.');
      return;
    }

    console.log('🔴 [Chat] projectId:', projectId);
    if (!projectId) {
      console.log('🔴 [Chat] ABORTADO: no hay projectId');
      Alert.alert('Error', 'ID de proyecto no válido');
      return;
    }

    const messageData = {
      projectId: projectId as string,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content: newComment.trim(),
    };

    console.log('📤 [Chat] ENVIANDO mensaje:', messageData);

    try {
      sendMessage(messageData);
      console.log('✅ [Chat] sendMessage ejecutado exitosamente');
    } catch (error) {
      console.error('❌ [Chat] Error al enviar mensaje:', error);
      Alert.alert('Error', 'No se pudo enviar el mensaje');
      return;
    }

    setNewComment('');
    console.log('🔴 [Chat] Input limpiado');

    // Scroll al final después de enviar
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      console.log('🔴 [Chat] Scroll ejecutado');
    }, 100);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'designer':
        return Colors.functional.info;
      case 'client':
        return '#9C27B0'; // Púrpura
      case 'production':
        return '#FF9800'; // Naranja
      case 'operator':
        return '#4CAF50'; // Verde
      default:
        return Colors.text.secondary;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'designer':
        return 'Diseñador';
      case 'client':
        return 'Cliente';
      case 'production':
        return 'Producción';
      case 'operator':
        return 'Operador';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'designer':
        return '🎨';
      case 'client':
        return '👤';
      case 'production':
        return '🏭';
      case 'operator':
        return '🔧';
      default:
        return '💬';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.base.blackPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {project?.name || 'Proyecto'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Chat del Proyecto
            </Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.base.blackPrimary} />
          </TouchableOpacity>
        </View>

        {/* Participantes */}
        <View style={styles.participantsBar}>
          <Ionicons name="people-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.participantsText}>
            {mockUsers.map(u => u.name.split(' ')[0]).join(', ')}
          </Text>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {projectMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={Colors.grays.medium} />
              <Text style={styles.emptyStateTitle}>No hay comentarios aún</Text>
              <Text style={styles.emptyStateText}>
                Sé el primero en comentar este proyecto
              </Text>
            </View>
          ) : (
            projectMessages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser?.id;
              const showDate = index === 0 ||
                new Date(message.timestamp).toDateString() !==
                new Date(projectMessages[index - 1].timestamp).toDateString();

              return (
                <View key={message.id}>
                  {showDate && (
                    <View style={styles.dateSeparator}>
                      <View style={styles.dateLine} />
                      <Text style={styles.dateText}>
                        {new Date(message.timestamp).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </Text>
                      <View style={styles.dateLine} />
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageContainer,
                      isCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
                    ]}
                  >
                    {!isCurrentUser && (
                      <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(message.senderRole) }]}>
                        <Text style={styles.avatarText}>{getRoleIcon(message.senderRole)}</Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        isCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
                      ]}
                    >
                      <View style={styles.messageHeader}>
                        <Text style={styles.senderName}>
                          {message.senderName || mockUsers.find(u => u.id === message.senderId)?.name || 'Sin Nombre'}
                        </Text>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(message.senderRole) }]}>
                          <Text style={styles.roleBadgeText}>
                            {getRoleLabel(message.senderRole)}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.messageText,
                          isCurrentUser ? styles.messageTextRight : styles.messageTextLeft,
                        ]}
                      >
                        {message.content}
                      </Text>

                      <Text
                        style={[
                          styles.messageTime,
                          isCurrentUser ? styles.messageTimeRight : styles.messageTimeLeft,
                        ]}
                      >
                        {formatTime(message.timestamp)}
                      </Text>
                    </View>

                    {isCurrentUser && (
                      <View style={[styles.avatarContainer, { backgroundColor: getRoleColor(message.senderRole) }]}>
                        <Text style={styles.avatarText}>{getRoleIcon(message.senderRole)}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach-outline" size={24} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Escribe un comentario..."
            placeholderTextColor={Colors.text.secondary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendComment}
            disabled={!newComment.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={newComment.trim() ? Colors.base.whitePrimary : Colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.base.blackPrimary,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  infoButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  participantsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
    gap: Spacing.xs,
  },
  participantsText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
  },
  messagesList: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  messagesContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyStateTitle: {
    fontSize: Typography.sizes.h3,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
  },
  emptyStateText: {
    fontSize: Typography.sizes.body,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grays.light,
  },
  dateText: {
    fontSize: Typography.sizes.caption,
    color: Colors.text.secondary,
    marginHorizontal: Spacing.md,
    textTransform: 'capitalize',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-end',
  },
  messageContainerLeft: {
    justifyContent: 'flex-start',
  },
  messageContainerRight: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.xs,
  },
  avatarText: {
    fontSize: 18,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  messageBubbleLeft: {
    backgroundColor: Colors.base.whitePrimary,
    borderBottomLeftRadius: 4,
  },
  messageBubbleRight: {
    backgroundColor: Colors.functional.info,
    borderBottomRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  senderName: {
    fontSize: Typography.sizes.bodySmall,
    fontWeight: Typography.weights.semibold,
    color: Colors.base.blackPrimary,
  },
  roleBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.medium,
    color: Colors.base.whitePrimary,
  },
  messageText: {
    fontSize: Typography.sizes.body,
    lineHeight: Typography.lineHeight.relaxed * Typography.sizes.body,
  },
  messageTextLeft: {
    color: Colors.base.blackPrimary,
  },
  messageTextRight: {
    color: Colors.base.whitePrimary,
  },
  messageTime: {
    fontSize: Typography.sizes.caption,
    marginTop: Spacing.xs,
  },
  messageTimeLeft: {
    color: Colors.text.secondary,
  },
  messageTimeRight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
    gap: Spacing.sm,
  },
  attachButton: {
    padding: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.body,
    color: Colors.base.blackPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.functional.info,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.grays.light,
  },
});

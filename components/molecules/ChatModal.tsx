/**
 * Chat Component
 * Sistema de chat integrado para comunicación entre roles
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/DesignSystem';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
}

export default function ChatModal({ visible, onClose, projectId, projectName }: ChatModalProps) {
  const { sendMessage, getProjectMessages } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');

  const projectMessages = projectId ? getProjectMessages(projectId) : [];

  const handleSendMessage = () => {
    if (!messageText.trim() || !user) return;

    sendMessage({
      projectId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: messageText.trim(),
    });

    setMessageText('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'designer':
        return Colors.functional.info;
      case 'client':
        return Colors.functional.success;
      case 'operator':
        return Colors.functional.warning;
      case 'production':
        return '#9333ea'; // Purple
      default:
        return Colors.grays.dark;
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      designer: 'Diseñador',
      client: 'Cliente',
      operator: 'Operador',
      production: 'Producción',
    };
    return labels[role] || role;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffMins < 1440) return `Hace ${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.base.blackPrimary} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>
                {projectName ? `Chat - ${projectName}` : 'Chat General'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {projectMessages.length} mensajes
              </Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {projectMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={Colors.grays.medium} />
              <Text style={styles.emptyStateText}>No hay mensajes aún</Text>
              <Text style={styles.emptyStateSubtext}>
                Inicia la conversación con tu equipo
              </Text>
            </View>
          ) : (
            projectMessages.map((message) => {
              const isOwnMessage = message.senderId === user?.id;
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    isOwnMessage ? styles.ownMessageWrapper : styles.otherMessageWrapper,
                  ]}
                >
                  {!isOwnMessage && (
                    <View style={styles.messageHeader}>
                      <View
                        style={[
                          styles.roleIndicator,
                          { backgroundColor: getRoleColor(message.senderRole) },
                        ]}
                      />
                      <Text style={styles.senderName}>{message.senderName}</Text>
                      <Text style={styles.roleLabel}>
                        • {getRoleLabel(message.senderRole)}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.messageBubble,
                      isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
                      ]}
                    >
                      {message.content}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.messageTime,
                      isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor={Colors.grays.dark}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !messageText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={messageText.trim() ? Colors.base.whitePrimary : Colors.grays.dark}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base.whitePrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    backgroundColor: Colors.base.whitePrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grays.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.base.blackPrimary,
    fontStyle: 'italic',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.grays.dark,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  messageWrapper: {
    maxWidth: '80%',
  },
  ownMessageWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  roleIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.base.blackPrimary,
  },
  roleLabel: {
    fontSize: 12,
    color: Colors.grays.dark,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: Colors.base.blackPrimary,
  },
  otherMessageBubble: {
    backgroundColor: Colors.base.whitePrimary,
    borderWidth: 1,
    borderColor: Colors.grays.light,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Colors.base.whitePrimary,
  },
  otherMessageText: {
    color: Colors.base.blackPrimary,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  ownMessageTime: {
    color: Colors.grays.dark,
    textAlign: 'right',
  },
  otherMessageTime: {
    color: Colors.grays.dark,
    textAlign: 'left',
  },
  inputContainer: {
    padding: 12,
    backgroundColor: Colors.base.whitePrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.grays.light,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: Colors.background.secondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.base.blackPrimary,
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.base.blackPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.grays.light,
  },
});



/// <reference types="@testing-library/jest-dom" />

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from '../ChatMessage';
import { Message } from '@/types/messages';

const mockMessage: Message = {
  id: '1',
  content: 'Test message',
  sender_id: 'assistant',
  receiver_id: 'user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  read: false,
  sender: {
    id: 'assistant',
    full_name: 'Assistant',
    avatar_url: '/avatar.png',
    online_status: true,
    last_seen: new Date().toISOString()
  },
  receiver: {
    id: 'user',
    full_name: 'User',
    avatar_url: '/avatar.png',
    online_status: true,
    last_seen: new Date().toISOString()
  },
  timestamp: new Date().toISOString(),
  message_type: 'assistant',
  status: 'sent',
  metadata: {},
  reaction: null,
  is_assistant: true,
  thinking: false
};

describe('ChatMessage', () => {
  it('renders message content correctly', () => {
    render(<ChatMessage message={mockMessage} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('displays loading state when thinking', () => {
    const thinkingMessage = { ...mockMessage, thinking: true };
    render(<ChatMessage message={thinkingMessage} />);
    expect(screen.getByText('En train de réfléchir...')).toBeInTheDocument();
  });

  it('handles reply callback', () => {
    const onReply = jest.fn();
    render(<ChatMessage message={mockMessage} onReply={onReply} />);
    // Test reply functionality if available
  });
});

package org.example.chat_app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("message")
public class Message {

    public enum MessageType {
        TEXT, IMAGE, VIDEO, FILE
    }

    public enum MessageStatus {
        SENT, DELIVERED, READ
    }

    @Id
    @Column("message_id")
    private UUID messageId;

    @Column("conversation_id")
    private UUID conversationId;

    @Column("sender_id")
    private UUID senderId;

    @Column("message_text")
    private String messageText;

    @Column("message_type")
    private MessageType messageType = MessageType.TEXT;

    @Column("sent_datetime")
    private LocalDateTime sentDatetime;

    @Column("status")
    private MessageStatus status = MessageStatus.SENT;

    @Column("parent_message_id")
    private UUID parentMessageId;

}
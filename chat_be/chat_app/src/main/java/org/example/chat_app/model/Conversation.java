package org.example.chat_app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("conversation")
public class Conversation {
    public enum ConversationType {
        PRIVATE, GROUP
    }

    @Id
    @Column("conversation_id")
    private UUID conversationId;

    @Column("conversation_name")
    private String conversationName;

    @Column("conversation_type")
    private ConversationType conversationType;

    @Column("created_by")
    private UUID createdBy;

    @Column("created_at")
    private LocalDateTime createdAt;
}

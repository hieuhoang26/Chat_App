package org.example.chat_app.repository;

import org.example.chat_app.model.Conversation;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface ConversationRepository extends R2dbcRepository<Conversation, UUID> {
    Flux<Conversation> findByConversationType(Conversation.ConversationType type);

    @Query("SELECT c.* FROM conversation c " +
            "JOIN group_member gm ON c.conversation_id = gm.conversation_id " +
            "WHERE gm.contact_id = :contactId")
    Flux<Conversation> findByContactId(UUID contactId);
}
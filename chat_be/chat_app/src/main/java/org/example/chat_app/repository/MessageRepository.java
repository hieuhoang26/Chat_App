package org.example.chat_app.repository;

import org.example.chat_app.model.Message;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface MessageRepository extends R2dbcRepository<Message, UUID> {

    @Query("SELECT * FROM message WHERE conversation_id = :conversationId ORDER BY sent_datetime DESC LIMIT :limit")
    Flux<Message> findLatestByConversationId(UUID conversationId, int limit);

    @Query("SELECT * FROM message WHERE conversation_id = :conversationId AND sent_datetime > :afterDateTime ORDER BY sent_datetime ASC")
    Flux<Message> findByConversationIdAfterDate(UUID conversationId, java.time.LocalDateTime afterDateTime);

    @Query("UPDATE message SET status = :status WHERE message_id = :messageId")
    Mono<Void> updateMessageStatus(UUID messageId, Message.MessageStatus status);
}
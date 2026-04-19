package org.example.chat_app.repository;

import org.example.chat_app.model.GroupMember;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface GroupMemberRepository extends R2dbcRepository<GroupMember, UUID> {

    @Query("SELECT * FROM group_member WHERE conversation_id = :conversationId AND contact_id = :contactId")
    Mono<GroupMember> findByConversationIdAndContactId(UUID conversationId, UUID contactId);

    @Query("SELECT * FROM group_member WHERE conversation_id = :conversationId")
    Flux<GroupMember> findByConversationId(UUID conversationId);

    @Query("SELECT * FROM group_member WHERE contact_id = :contactId AND left_datetime IS NULL")
    Flux<GroupMember> findActiveByContactId(UUID contactId);
}
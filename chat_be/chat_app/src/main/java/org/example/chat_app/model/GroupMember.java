package org.example.chat_app.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("group_member")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class GroupMember {

    public enum MemberRole {
        ADMIN, MEMBER
    }

    @Id
    private UUID id;

    @Column("conversation_id")
    private UUID conversationId;

    @Column("contact_id")
    private UUID contactId;

    @Column("joined_datetime")
    private LocalDateTime joinedDatetime;

    @Column("left_datetime")
    private LocalDateTime leftDatetime;

    @Column("role")
    private MemberRole role = MemberRole.MEMBER;
}
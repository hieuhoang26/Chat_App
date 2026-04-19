-- ============================================
-- DATABASE SCHEMA v1
-- ============================================

CREATE TABLE user_account (
                              user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              keycloak_id UUID UNIQUE NOT NULL,                -- ID từ Keycloak (token.sub)
                              username VARCHAR(50) UNIQUE NOT NULL,            -- preferred_username
                              email VARCHAR(100),
                              phone_number VARCHAR(20),
                              first_name VARCHAR(50),
                              last_name VARCHAR(50),
                              profile_photo VARCHAR(255),
                              status_message VARCHAR(255),
                              is_online BOOLEAN DEFAULT FALSE,
                              roles TEXT[] DEFAULT '{}',
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              last_login TIMESTAMP
);

-- 2️⃣ CONVERSATION
CREATE TABLE conversation (
                              conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              conversation_name VARCHAR(100),
                              conversation_type VARCHAR(10) CHECK (conversation_type IN ('private','group')) NOT NULL,
                              created_by UUID,
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              FOREIGN KEY (created_by) REFERENCES user_account(user_id)
);

-- 3️⃣ GROUP MEMBER
CREATE TABLE group_member (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              conversation_id UUID NOT NULL,
                              user_id UUID NOT NULL,
                              joined_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              left_datetime TIMESTAMP,
                              role VARCHAR(10) CHECK (role IN ('admin','member')) DEFAULT 'member',
                              UNIQUE (conversation_id, user_id),
                              FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
                              FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);

-- 4️⃣ MESSAGE
CREATE TABLE message (
                         message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         conversation_id UUID NOT NULL,
                         sender_id UUID NOT NULL,
                         message_text TEXT,
                         message_type VARCHAR(10) CHECK (message_type IN ('text','image','video','file')) DEFAULT 'text',
                         sent_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         status VARCHAR(10) CHECK (status IN ('sent','delivered','read')) DEFAULT 'sent',
                         parent_message_id UUID NULL,
                         FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
                         FOREIGN KEY (sender_id) REFERENCES user_account(user_id),
                         FOREIGN KEY (parent_message_id) REFERENCES message(message_id)
);

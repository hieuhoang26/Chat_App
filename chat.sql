-- ============================================
-- DATABASE SCHEMA: Chat Application
-- ============================================

CREATE DATABASE IF NOT EXISTS chat_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chat_app;

-- =========================
-- 1. USER ACCOUNT
-- =========================
CREATE TABLE user_account (
    user_id        CHAR(36) PRIMARY KEY,
    username       VARCHAR(50) UNIQUE NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    email          VARCHAR(100) UNIQUE,
    phone_number   VARCHAR(20) UNIQUE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login     DATETIME
);

-- =========================
-- 2. CONTACT PROFILE
-- =========================
CREATE TABLE contact (
    contact_id     CHAR(36) PRIMARY KEY,
    first_name     VARCHAR(50),
    last_name      VARCHAR(50),
    profile_photo  VARCHAR(255),
    status_message VARCHAR(255),
    is_online      BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (contact_id) REFERENCES user_account(user_id)
);

-- =========================
-- 3. CONVERSATION
-- =========================
CREATE TABLE conversation (
    conversation_id   CHAR(36) PRIMARY KEY,
    conversation_name VARCHAR(100),
    conversation_type ENUM('private','group') NOT NULL,
    created_by        CHAR(36),
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES user_account(user_id)
);

-- =========================
-- 4. GROUP MEMBER
-- =========================
CREATE TABLE group_member (
    conversation_id CHAR(36),
    contact_id      CHAR(36),
    joined_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_datetime   DATETIME,
    role            ENUM('admin','member') DEFAULT 'member',
    PRIMARY KEY (conversation_id, contact_id),
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
    FOREIGN KEY (contact_id) REFERENCES contact(contact_id)
);

-- =========================
-- 5. MESSAGE
-- =========================
CREATE TABLE message (
    message_id          CHAR(36) PRIMARY KEY,
    conversation_id     CHAR(36) NOT NULL,
    sender_id           CHAR(36) NOT NULL,
    message_text        TEXT,
    message_type        ENUM('text','image','video','file') DEFAULT 'text',
    sent_datetime       DATETIME DEFAULT CURRENT_TIMESTAMP,
    status              ENUM('sent','delivered','read') DEFAULT 'sent',
    parent_message_id   CHAR(36) NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id),
    FOREIGN KEY (sender_id) REFERENCES contact(contact_id),
    FOREIGN KEY (parent_message_id) REFERENCES message(message_id)
);

-- =========================
-- 6. MESSAGE READ RECEIPT
-- =========================
CREATE TABLE message_read_receipt (
    message_id    CHAR(36),
    reader_id     CHAR(36),
    read_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, reader_id),
    FOREIGN KEY (message_id) REFERENCES message(message_id),
    FOREIGN KEY (reader_id) REFERENCES contact(contact_id)
);

-- =========================
-- 7. NOTIFICATION
-- =========================
CREATE TABLE notification (
    notification_id CHAR(36) PRIMARY KEY,
    user_id         CHAR(36) NOT NULL,
    message_id      CHAR(36),
    type            ENUM('message','mention','system') DEFAULT 'message',
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_account(user_id),
    FOREIGN KEY (message_id) REFERENCES message(message_id)
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- USERS
INSERT INTO user_account (user_id, username, password_hash, email, phone_number)
VALUES
('u1', 'alice', 'hash_pw1', 'alice@mail.com', '0901000001'),
('u2', 'bob', 'hash_pw2', 'bob@mail.com', '0901000002'),
('u3', 'carol', 'hash_pw3', 'carol@mail.com', '0901000003');

-- CONTACTS
INSERT INTO contact (contact_id, first_name, last_name, status_message, is_online)
VALUES
('u1', 'Alice', 'Nguyen', 'Chilling 😎', TRUE),
('u2', 'Bob', 'Tran', 'Busy...', FALSE),
('u3', 'Carol', 'Le', 'On vacation 🏝️', TRUE);

-- CONVERSATION (private + group)
INSERT INTO conversation (conversation_id, conversation_name, conversation_type, created_by)
VALUES
('c1', NULL, 'private', 'u1'),
('c2', 'Team Chat', 'group', 'u1');

-- GROUP MEMBERS
INSERT INTO group_member (conversation_id, contact_id, role)
VALUES
('c1', 'u1', 'member'),
('c1', 'u2', 'member'),
('c2', 'u1', 'admin'),
('c2', 'u2', 'member'),
('c2', 'u3', 'member');

-- MESSAGES
INSERT INTO message (message_id, conversation_id, sender_id, message_text, sent_datetime, status)
VALUES
('m1', 'c1', 'u1', 'Hi Bob!', NOW(), 'sent'),
('m2', 'c1', 'u2', 'Hey Alice, how are you?', NOW(), 'read'),
('m3', 'c2', 'u1', 'Good morning team!', NOW(), 'sent'),
('m4', 'c2', 'u3', 'Morning Alice!', NOW(), 'sent');

-- READ RECEIPTS
INSERT INTO message_read_receipt (message_id, reader_id, read_datetime)
VALUES
('m1', 'u2', NOW()),
('m2', 'u1', NOW()),
('m3', 'u2', NOW()),
('m3', 'u3', NOW());

-- NOTIFICATIONS
INSERT INTO notification (notification_id, user_id, message_id, type, is_read)
VALUES
('n1', 'u2', 'm1', 'message', TRUE),
('n2', 'u1', 'm2', 'message', TRUE),
('n3', 'u2', 'm3', 'message', FALSE),
('n4', 'u3', 'm3', 'message', FALSE);

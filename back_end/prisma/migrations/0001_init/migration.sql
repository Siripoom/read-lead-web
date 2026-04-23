-- =========================================================
-- Fiction Platform - Improved Schema (PostgreSQL)
-- =========================================================
-- Notes:
-- - ใช้ PostgreSQL 13+ แนะนำ 14/15+
-- - ใช้ pgcrypto สำหรับ gen_random_uuid()
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;



-- =========================================================
-- 1) USERS / AUTH
-- =========================================================

CREATE TABLE users (
    user_id              BIGSERIAL PRIMARY KEY,
    username             VARCHAR(50) NOT NULL,
    email                VARCHAR(255) NOT NULL,
    password_hash        TEXT NULL, -- nullable เผื่อ social login only
    coin_balance         INTEGER NOT NULL DEFAULT 0 CHECK (coin_balance >= 0),
    role                 VARCHAR(20) NOT NULL DEFAULT 'user'
                         CHECK (role IN ('user', 'creator', 'admin', 'finance')),
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at           TIMESTAMPTZ NULL
);


CREATE INDEX ix_users_role ON users(role);



-- เผื่ออนาคต user หนึ่งมีหลาย role (MVP จะยังใช้ users.role ได้)
CREATE TABLE user_roles (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role                 VARCHAR(20) NOT NULL
                         CHECK (role IN ('user', 'creator', 'admin', 'finance')),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);



CREATE TABLE user_socials (
    social_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    provider             VARCHAR(30) NOT NULL CHECK (provider IN ('facebook', 'google', 'apple', 'line')),
    provider_uid         VARCHAR(255) NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (provider, provider_uid)
);



-- =========================================================
-- 2) CONTENT (NOVELS / CHAPTERS / AUDIO)
-- =========================================================

CREATE TABLE novels (
    novel_id             BIGSERIAL PRIMARY KEY,
    author_id            BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    title                VARCHAR(255) NOT NULL,
    slug                 VARCHAR(255) NULL, -- optional for SEO URL
    synopsis             TEXT NULL,
    cover_image_url      TEXT NULL,

    writer_share_percent NUMERIC(5,2) NOT NULL DEFAULT 70.00
                         CHECK (writer_share_percent >= 0 AND writer_share_percent <= 100),

    status               VARCHAR(20) NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft', 'pending_review', 'published', 'rejected', 'blocked', 'completed')),
    visibility           VARCHAR(20) NOT NULL DEFAULT 'public'
                         CHECK (visibility IN ('public', 'private', 'unlisted')),

    rejection_reason     TEXT NULL,
    published_at         TIMESTAMPTZ NULL,

    total_chapters       INTEGER NOT NULL DEFAULT 0 CHECK (total_chapters >= 0),
    total_views          BIGINT NOT NULL DEFAULT 0 CHECK (total_views >= 0),
    follower_count       BIGINT NOT NULL DEFAULT 0 CHECK (follower_count >= 0),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at           TIMESTAMPTZ NULL
);


CREATE INDEX ix_novels_author_id ON novels(author_id);


CREATE INDEX ix_novels_status ON novels(status);


CREATE INDEX ix_novels_visibility ON novels(visibility);


CREATE INDEX ix_novels_created_at ON novels(created_at);



CREATE TABLE chapters (
    chapter_id           BIGSERIAL PRIMARY KEY,
    novel_id             BIGINT NOT NULL REFERENCES novels(novel_id) ON DELETE CASCADE,

    chapter_no           INTEGER NOT NULL CHECK (chapter_no > 0),
    title                VARCHAR(255) NOT NULL,

    content_text         TEXT NULL, -- ถ้าเก็บไฟล์/HTML อาจเปลี่ยนเป็น content_url
    coin_price           INTEGER NOT NULL DEFAULT 0 CHECK (coin_price >= 0),
    is_free              BOOLEAN NOT NULL DEFAULT TRUE,

    status               VARCHAR(20) NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft', 'published', 'hidden')),
    preview_text         TEXT NULL,
    word_count           INTEGER NOT NULL DEFAULT 0 CHECK (word_count >= 0),
    published_at         TIMESTAMPTZ NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at           TIMESTAMPTZ NULL,

    -- กันข้อมูลขัดกัน
    CHECK ((is_free = TRUE AND coin_price = 0) OR (is_free = FALSE AND coin_price >= 0))
);



CREATE INDEX ix_chapters_novel_id ON chapters(novel_id);


CREATE INDEX ix_chapters_status ON chapters(status);


CREATE INDEX ix_chapters_published_at ON chapters(published_at);



CREATE TABLE chapter_audios (
    audio_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id           BIGINT NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    file_url             TEXT NOT NULL,
    duration_seconds     INTEGER NULL CHECK (duration_seconds IS NULL OR duration_seconds >= 0),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (chapter_id)
);



-- =========================================================
-- 3) PACKAGES (Novel package + included chapters)
-- =========================================================

CREATE TABLE novel_packages (
    package_id           BIGSERIAL PRIMARY KEY,
    novel_id             BIGINT NOT NULL REFERENCES novels(novel_id) ON DELETE CASCADE,

    package_name         VARCHAR(150) NOT NULL,
    description          TEXT NULL,
    price_coin           INTEGER NOT NULL CHECK (price_coin >= 0),

    status               VARCHAR(20) NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'inactive')),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_novel_packages_novel_id ON novel_packages(novel_id);


CREATE INDEX ix_novel_packages_status ON novel_packages(status);



CREATE TABLE package_items (
    id                   BIGSERIAL PRIMARY KEY,
    package_id           BIGINT NOT NULL REFERENCES novel_packages(package_id) ON DELETE CASCADE,
    chapter_id           BIGINT NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (package_id, chapter_id)
);



CREATE INDEX ix_package_items_package_id ON package_items(package_id);


CREATE INDEX ix_package_items_chapter_id ON package_items(chapter_id);



-- =========================================================
-- 4) READING LIBRARY / ACCESS
-- =========================================================

CREATE TABLE reading_library (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    novel_id             BIGINT NOT NULL REFERENCES novels(novel_id) ON DELETE CASCADE,

    is_favorite          BOOLEAN NOT NULL DEFAULT FALSE,
    is_following         BOOLEAN NOT NULL DEFAULT TRUE,
    notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    last_read_chapter_id BIGINT NULL REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    last_read_at         TIMESTAMPTZ NULL,
    added_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, novel_id)
);



CREATE INDEX ix_reading_library_user_id ON reading_library(user_id);


CREATE INDEX ix_reading_library_novel_id ON reading_library(novel_id);



-- =========================================================
-- 5) PAYMENT / TOPUP / LOGS
-- =========================================================

CREATE TABLE topup_transactions (
    transaction_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    amount_money         NUMERIC(12,2) NOT NULL CHECK (amount_money > 0),
    amount_coins         INTEGER NOT NULL CHECK (amount_coins > 0),
    currency             CHAR(3) NOT NULL DEFAULT 'THB',

    payment_method       VARCHAR(30) NOT NULL DEFAULT 'manual'
                         CHECK (payment_method IN ('manual', 'promptpay', 'card', 'bank_transfer')),
    gateway_name         VARCHAR(50) NULL,
    gateway_transaction_id VARCHAR(255) NULL,
    payment_reference    VARCHAR(255) NULL,

    status               VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'cancelled')),

    failure_reason       TEXT NULL,
    initiated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at              TIMESTAMPTZ NULL,
    expired_at           TIMESTAMPTZ NULL,
    confirmed_at         TIMESTAMPTZ NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_topup_transactions_user_id ON topup_transactions(user_id);


CREATE INDEX ix_topup_transactions_status ON topup_transactions(status);


CREATE INDEX ix_topup_transactions_user_status ON topup_transactions(user_id, status);


CREATE INDEX ix_topup_transactions_paid_at ON topup_transactions(paid_at);



-- generic payment/event logs (ใช้ได้ทั้ง topup/payout/purchase)
CREATE TABLE payment_logs (
    log_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    entity_type          VARCHAR(30) NOT NULL
                         CHECK (entity_type IN ('topup', 'payout', 'chapter_purchase', 'package_purchase')),
    entity_id            VARCHAR(100) NOT NULL, -- เก็บ UUID/BIGINT เป็น string เพื่อ generic
    provider             VARCHAR(50) NULL,
    event_type           VARCHAR(100) NOT NULL, -- e.g. webhook.received, callback.success

    request_payload      JSONB NULL,
    response_payload     JSONB NULL,
    raw_request          TEXT NULL,

    http_status_code     INTEGER NULL,
    log_status           VARCHAR(20) NOT NULL DEFAULT 'info'
                         CHECK (log_status IN ('info', 'success', 'warning', 'error')),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_payment_logs_entity ON payment_logs(entity_type, entity_id);


CREATE INDEX ix_payment_logs_created_at ON payment_logs(created_at);



-- =========================================================
-- 6) WALLET LEDGER (สำคัญมาก)
-- =========================================================

CREATE TABLE wallet_ledger (
    ledger_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    entry_type           VARCHAR(30) NOT NULL
                         CHECK (entry_type IN (
                            'topup',
                            'chapter_purchase',
                            'package_purchase',
                            'refund',
                            'gift_received',
                            'gift_sent',
                            'adjustment_credit',
                            'adjustment_debit'
                         )),
    direction            VARCHAR(10) NOT NULL
                         CHECK (direction IN ('credit', 'debit')),

    coin_amount          INTEGER NOT NULL CHECK (coin_amount > 0),
    balance_before       INTEGER NOT NULL CHECK (balance_before >= 0),
    balance_after        INTEGER NOT NULL CHECK (balance_after >= 0),

    ref_type             VARCHAR(30) NULL, -- topup_transaction / chapter_purchase / package_purchase / admin_adjustment
    ref_id               VARCHAR(100) NULL,

    note                 TEXT NULL,
    created_by           BIGINT NULL REFERENCES users(user_id) ON DELETE SET NULL, -- admin adjustment
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        (direction = 'credit' AND balance_after = balance_before + coin_amount)
        OR
        (direction = 'debit'  AND balance_after = balance_before - coin_amount)
    )
);



CREATE INDEX ix_wallet_ledger_user_id ON wallet_ledger(user_id);


CREATE INDEX ix_wallet_ledger_entry_type ON wallet_ledger(entry_type);


CREATE INDEX ix_wallet_ledger_ref ON wallet_ledger(ref_type, ref_id);


CREATE INDEX ix_wallet_ledger_created_at ON wallet_ledger(created_at);



-- =========================================================
-- 7) PURCHASES (chapter / package) + access grants
-- =========================================================

CREATE TABLE package_purchases (
    pkg_trans_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    package_id           BIGINT NOT NULL REFERENCES novel_packages(package_id) ON DELETE RESTRICT,

    coin_paid            INTEGER NOT NULL CHECK (coin_paid >= 0),
    purchased_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    status               VARCHAR(20) NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'refunded', 'revoked')),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_package_purchases_user_id ON package_purchases(user_id);


CREATE INDEX ix_package_purchases_package_id ON package_purchases(package_id);


CREATE INDEX ix_package_purchases_purchased_at ON package_purchases(purchased_at);



CREATE TABLE chapter_purchases (
    purchase_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    chapter_id           BIGINT NOT NULL REFERENCES chapters(chapter_id) ON DELETE RESTRICT,

    coin_amount          INTEGER NOT NULL CHECK (coin_amount >= 0),
    source_type          VARCHAR(20) NOT NULL
                         CHECK (source_type IN ('single', 'package', 'grant', 'refund_restore')),
    ref_pkg_trans_id     UUID NULL REFERENCES package_purchases(pkg_trans_id) ON DELETE SET NULL,

    status               VARCHAR(20) NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'refunded', 'revoked')),

    purchased_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- ถ้า source_type = package ต้องมี ref_pkg_trans_id
    CHECK (
        (source_type = 'package' AND ref_pkg_trans_id IS NOT NULL)
        OR
        (source_type <> 'package')
    )
);



CREATE INDEX ix_chapter_purchases_user_id ON chapter_purchases(user_id);


CREATE INDEX ix_chapter_purchases_chapter_id ON chapter_purchases(chapter_id);


CREATE INDEX ix_chapter_purchases_ref_pkg_trans_id ON chapter_purchases(ref_pkg_trans_id);


CREATE INDEX ix_chapter_purchases_purchased_at ON chapter_purchases(purchased_at);



-- =========================================================
-- 8) CREATOR EARNINGS / REVENUE SPLIT
-- =========================================================

CREATE TABLE creator_earnings (
    earning_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    novel_id             BIGINT NOT NULL REFERENCES novels(novel_id) ON DELETE RESTRICT,
    chapter_id           BIGINT NULL REFERENCES chapters(chapter_id) ON DELETE SET NULL,

    source_type          VARCHAR(30) NOT NULL
                         CHECK (source_type IN ('chapter_purchase', 'package_purchase')),
    source_purchase_id   UUID NOT NULL, -- chapter_purchases.purchase_id OR package_purchases.pkg_trans_id

    gross_coin           INTEGER NOT NULL CHECK (gross_coin >= 0),
    writer_share_percent NUMERIC(5,2) NOT NULL CHECK (writer_share_percent >= 0 AND writer_share_percent <= 100),
    creator_coin         INTEGER NOT NULL CHECK (creator_coin >= 0),
    platform_coin        INTEGER NOT NULL CHECK (platform_coin >= 0),

    status               VARCHAR(20) NOT NULL DEFAULT 'available'
                         CHECK (status IN ('pending', 'available', 'reserved_for_payout', 'paid_out', 'reversed')),

    payout_request_id    UUID NULL, -- ผูกภายหลังเมื่อทำ payout request
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (creator_coin + platform_coin = gross_coin)
);



CREATE INDEX ix_creator_earnings_creator_id ON creator_earnings(creator_id);


CREATE INDEX ix_creator_earnings_novel_id ON creator_earnings(novel_id);


CREATE INDEX ix_creator_earnings_status ON creator_earnings(status);


CREATE INDEX ix_creator_earnings_source ON creator_earnings(source_type, source_purchase_id);



-- =========================================================
-- 9) PAYOUT REQUESTS / PAYOUTS (Finance workflow)
-- =========================================================

CREATE TABLE payout_requests (
    payout_request_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    requested_amount     NUMERIC(12,2) NOT NULL CHECK (requested_amount > 0),
    requested_coin_total INTEGER NULL CHECK (requested_coin_total IS NULL OR requested_coin_total >= 0),

    status               VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'approved', 'rejected', 'paid', 'cancelled')),

    requested_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    reviewed_by          BIGINT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    reviewed_at          TIMESTAMPTZ NULL,
    rejection_reason     TEXT NULL,

    paid_at              TIMESTAMPTZ NULL,
    payment_ref          VARCHAR(255) NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_payout_requests_creator_id ON payout_requests(creator_id);


CREATE INDEX ix_payout_requests_status ON payout_requests(status);


CREATE INDEX ix_payout_requests_requested_at ON payout_requests(requested_at);



-- ผูก creator_earnings กับ payout_requests (หลังจากสร้าง payout_requests แล้ว)
ALTER TABLE creator_earnings
ADD CONSTRAINT fk_creator_earnings_payout_request
FOREIGN KEY (payout_request_id) REFERENCES payout_requests(payout_request_id) ON DELETE SET NULL;



CREATE TABLE payouts (
    payout_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id    UUID NOT NULL REFERENCES payout_requests(payout_request_id) ON DELETE RESTRICT,
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT, -- creator

    amount_money_paid    NUMERIC(12,2) NOT NULL CHECK (amount_money_paid > 0),
    fee_amount           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (fee_amount >= 0),
    net_amount           NUMERIC(12,2) NOT NULL CHECK (net_amount >= 0),

    payment_method       VARCHAR(30) NOT NULL DEFAULT 'bank_transfer'
                         CHECK (payment_method IN ('bank_transfer', 'promptpay', 'manual')),
    transaction_ref      VARCHAR(255) NULL,
    note                 TEXT NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (net_amount = amount_money_paid - fee_amount)
);



CREATE INDEX ix_payouts_user_id ON payouts(user_id);


CREATE INDEX ix_payouts_request_id ON payouts(payout_request_id);


CREATE INDEX ix_payouts_created_at ON payouts(created_at);



-- =========================================================
-- 10) MODERATION / ADMIN REVIEW
-- =========================================================

CREATE TABLE novel_moderation_logs (
    review_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    novel_id             BIGINT NOT NULL REFERENCES novels(novel_id) ON DELETE CASCADE,
    admin_user_id        BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,

    action               VARCHAR(20) NOT NULL
                         CHECK (action IN ('submit', 'approve', 'reject', 'block', 'unblock', 'request_changes')),
    reason               TEXT NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_novel_moderation_logs_novel_id ON novel_moderation_logs(novel_id);


CREATE INDEX ix_novel_moderation_logs_admin_user_id ON novel_moderation_logs(admin_user_id);


CREATE INDEX ix_novel_moderation_logs_created_at ON novel_moderation_logs(created_at);



-- =========================================================
-- 11) COMMENTS / NOTIFICATIONS / REPORTS
-- =========================================================

CREATE TABLE comments (
    comment_id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    novel_id             BIGINT NULL REFERENCES novels(novel_id) ON DELETE CASCADE,
    chapter_id           BIGINT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,

    content              TEXT NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'visible'
                         CHECK (status IN ('visible', 'hidden', 'deleted')),

    parent_comment_id    UUID NULL REFERENCES comments(comment_id) ON DELETE CASCADE,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- ต้องผูกอย่างน้อยกับ novel หรือ chapter อย่างใดอย่างหนึ่ง
    CHECK (novel_id IS NOT NULL OR chapter_id IS NOT NULL)
);



CREATE INDEX ix_comments_user_id ON comments(user_id);


CREATE INDEX ix_comments_novel_id ON comments(novel_id);


CREATE INDEX ix_comments_chapter_id ON comments(chapter_id);


CREATE INDEX ix_comments_status ON comments(status);


CREATE INDEX ix_comments_parent ON comments(parent_comment_id);



CREATE TABLE notifications (
    notification_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    type                 VARCHAR(50) NOT NULL, -- e.g. novel_approved, payout_status_changed
    title                VARCHAR(255) NOT NULL,
    message              TEXT NOT NULL,

    is_read              BOOLEAN NOT NULL DEFAULT FALSE,
    read_at              TIMESTAMPTZ NULL,

    ref_type             VARCHAR(50) NULL, -- novel / payout_request / topup_transaction ...
    ref_id               VARCHAR(100) NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_notifications_user_id ON notifications(user_id);


CREATE INDEX ix_notifications_user_unread ON notifications(user_id, is_read);


CREATE INDEX ix_notifications_created_at ON notifications(created_at);



CREATE TABLE user_reports (
    report_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_user_id     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    target_type          VARCHAR(30) NOT NULL
                         CHECK (target_type IN ('novel', 'chapter', 'comment', 'user')),
    target_id            VARCHAR(100) NOT NULL,

    reason               TEXT NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'open'
                         CHECK (status IN ('open', 'in_review', 'resolved', 'rejected')),

    handled_by           BIGINT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    handled_at           TIMESTAMPTZ NULL,
    resolution_note      TEXT NULL,

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_user_reports_reporter ON user_reports(reporter_user_id);


CREATE INDEX ix_user_reports_status ON user_reports(status);


CREATE INDEX ix_user_reports_target ON user_reports(target_type, target_id);



-- =========================================================
-- 12) OPTIONAL: creator payout account (แนะนำเพิ่มไว้)
-- =========================================================

CREATE TABLE creator_payout_accounts (
    payout_account_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    account_type         VARCHAR(20) NOT NULL
                         CHECK (account_type IN ('bank_account', 'promptpay')),
    bank_name            VARCHAR(100) NULL,
    account_name         VARCHAR(255) NULL,
    account_number_masked VARCHAR(50) NULL,  -- เก็บ masked เพื่อแสดงผล
    promptpay_id_masked  VARCHAR(50) NULL,   -- เก็บ masked เพื่อแสดงผล

    -- ถ้าต้องเก็บจริง แนะนำ encrypt ที่ application layer / KMS
    account_number_enc   TEXT NULL,
    promptpay_id_enc     TEXT NULL,

    is_default           BOOLEAN NOT NULL DEFAULT FALSE,
    status               VARCHAR(20) NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'inactive')),

    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE INDEX ix_creator_payout_accounts_user_id ON creator_payout_accounts(user_id);

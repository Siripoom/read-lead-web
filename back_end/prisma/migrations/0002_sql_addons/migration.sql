-- SQL add-ons for features not fully supported by Prisma schema

-- Partial unique indexes
CREATE UNIQUE INDEX ux_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_novels_slug ON novels(slug) WHERE slug IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX ux_chapters_novel_chapter_no
  ON chapters(novel_id, chapter_no)
  WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX ux_chapter_purchases_user_chapter_active
  ON chapter_purchases(user_id, chapter_id)
  WHERE status = 'active';
CREATE UNIQUE INDEX ux_creator_payout_accounts_default_per_user
  ON creator_payout_accounts(user_id)
  WHERE is_default = TRUE;

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_novels_updated_at
BEFORE UPDATE ON novels
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_chapters_updated_at
BEFORE UPDATE ON chapters
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_chapter_audios_updated_at
BEFORE UPDATE ON chapter_audios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_novel_packages_updated_at
BEFORE UPDATE ON novel_packages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reading_library_updated_at
BEFORE UPDATE ON reading_library
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_topup_transactions_updated_at
BEFORE UPDATE ON topup_transactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_package_purchases_updated_at
BEFORE UPDATE ON package_purchases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_chapter_purchases_updated_at
BEFORE UPDATE ON chapter_purchases
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_creator_earnings_updated_at
BEFORE UPDATE ON creator_earnings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_payout_requests_updated_at
BEFORE UPDATE ON payout_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_reports_updated_at
BEFORE UPDATE ON user_reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_creator_payout_accounts_updated_at
BEFORE UPDATE ON creator_payout_accounts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

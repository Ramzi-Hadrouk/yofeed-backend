-- =====================================================
-- ALGERIAN EVENTS PLATFORM DATABASE SCHEMA
-- Complete PostgreSQL Schema with ENUMs and Improvements
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS SECTION
-- =====================================================

-- Algerian Cities (Wilayas)
CREATE TYPE city_enum AS ENUM (
    'ADRAR', 'CHLEF', 'LAGHOUAT', 'OUM_EL_BOUAGHI', 'BATNA', 'BEJAIA', 
    'BISKRA', 'BECHAR', 'BLIDA', 'BOUIRA', 'TAMANRASSET', 'TEBESSA', 
    'TLEMCEN', 'TIARET', 'TIZI_OUZOU', 'ALGIERS', 'DJELFA', 'JIJEL', 
    'SETIF', 'SAIDA', 'SKIKDA', 'SIDI_BEL_ABBES', 'ANNABA', 'GUELMA', 
    'CONSTANTINE', 'MEDEA', 'MOSTAGANEM', 'MSILA', 'MASCARA', 'OUARGLA', 
    'ORAN', 'EL_BAYADH', 'ILLIZI', 'BORDJ_BOU_ARRERIDJ', 'BOUMERDES', 
    'EL_TARF', 'TINDOUF', 'TISSEMSILT', 'EL_OUED', 'KHENCHELA', 
    'SOUK_AHRAS', 'TIPAZA', 'MILA', 'AIN_DEFLA', 'NAAMA', 'AIN_TEMOUCHENT', 
    'GHARDAIA', 'RELIZANE'
);

-- Event Categories
CREATE TYPE event_category_enum AS ENUM (
    'ARTIFICIAL_INTELLIGENCE', 'WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 
    'DATA_SCIENCE', 'CYBERSECURITY', 'BLOCKCHAIN', 'GAME_DEVELOPMENT',
    'UI_UX_DESIGN', 'DEVOPS', 'CLOUD_COMPUTING', 'IOT', 'ROBOTICS',
    'SOFT_SKILLS', 'ENTREPRENEURSHIP', 'DIGITAL_MARKETING', 'NETWORKING',
    'CAREER_DEVELOPMENT', 'STARTUP', 'FINTECH', 'HEALTHTECH', 'EDTECH',
    'GENERAL_TECH', 'OTHER'
);

-- Event Types
CREATE TYPE event_type_enum AS ENUM (
    'HACKATHON', 'WORKSHOP', 'COURSE', 'WEBINAR', 'CONFERENCE', 
    'MEETUP', 'BOOTCAMP', 'SEMINAR', 'PANEL_DISCUSSION', 'NETWORKING_EVENT'
);

-- Event Status
CREATE TYPE event_status_enum AS ENUM (
    'DRAFT', 'PUBLISHED', 'CANCELLED', 'POSTPONED', 'ONGOING', 'COMPLETED'
);

-- Registration Status
CREATE TYPE registration_status_enum AS ENUM (
    'PENDING', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'ATTENDED', 'NO_SHOW'
);

-- Organizer Types
CREATE TYPE organizer_type_enum AS ENUM (
    'INDIVIDUAL', 'TEAM', 'ORGANIZATION', 'COMPANY', 'UNIVERSITY', 
    'GOVERNMENT', 'NGO', 'STARTUP'
);

-- User Roles
CREATE TYPE user_role_enum AS ENUM (
    'USER', 'ORGANIZER', 'ADMIN', 'MODERATOR'
);

-- Notification Types
CREATE TYPE notification_type_enum AS ENUM (
    'EVENT_REMINDER', 'EVENT_UPDATE', 'NEW_EVENT_MATCH', 'REGISTRATION_CONFIRMED',
    'EVENT_CANCELLED', 'EVENT_STARTING_SOON', 'FOLLOW_NEW_EVENT', 'BADGE_EARNED',
    'COLLABORATION_INVITE', 'SYSTEM_ANNOUNCEMENT'
);

-- Media Types
CREATE TYPE media_type_enum AS ENUM (
    'IMAGE', 'VIDEO', 'DOCUMENT', 'PRESENTATION', 'AUDIO', 'ARCHIVE'
);

-- Badge Types
CREATE TYPE badge_type_enum AS ENUM (
    'ATTENDANCE', 'ORGANIZER', 'PARTICIPATION', 'ACHIEVEMENT', 'MILESTONE', 'SPECIAL'
);

-- Collaboration Roles
CREATE TYPE collaboration_role_enum AS ENUM (
    'CO_ORGANIZER', 'MODERATOR', 'SPEAKER', 'SPONSOR', 'PARTNER'
);

-- =====================================================
-- TABLES SECTION
-- =====================================================

-- Users Table (Enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar TEXT,
    role user_role_enum DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Profile Information
    bio TEXT,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    city city_enum,
    
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'fr',
    timezone VARCHAR(50) DEFAULT 'Africa/Algiers',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP(3)
);

-- User Interests (Many-to-Many with categories)
CREATE TABLE user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category event_category_enum NOT NULL,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category)
);

-- User Follows (Users following organizers)
CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Organizer Profiles (Enhanced)
CREATE TABLE organizer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type organizer_type_enum NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    logo TEXT,
    website TEXT,
    
    -- Social Links
    facebook_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    
    -- Contact Info
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP(3),
    
    -- Timestamps
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Events Table (Enhanced)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category event_category_enum NOT NULL,
    type event_type_enum NOT NULL,
    status event_status_enum DEFAULT 'DRAFT',
    
    -- Location Details
    city city_enum NOT NULL,
    venue TEXT,
    address TEXT,
    is_online BOOLEAN DEFAULT false,
    meeting_link TEXT,
    
    -- Timing
    start_date TIMESTAMP(3) NOT NULL,
    end_date TIMESTAMP(3) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'Africa/Algiers',
    registration_deadline TIMESTAMP(3),
    
    -- Capacity
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    is_registration_open BOOLEAN DEFAULT true,
    
    -- Pricing
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'DZD',
    
    -- Content
    cover_image TEXT,
    agenda JSONB,
    requirements TEXT,
    what_to_bring TEXT,
    
    -- SEO & Discovery
    slug VARCHAR(250) UNIQUE,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Event Organizers (Many-to-Many for co-hosting)
CREATE TABLE event_organizers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES organizer_profiles(id) ON DELETE CASCADE,
    role collaboration_role_enum DEFAULT 'CO_ORGANIZER',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, organizer_id)
);

-- Event Collaborators (Additional event team members)
CREATE TABLE event_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role collaboration_role_enum NOT NULL,
    permissions JSONB, -- Custom permissions object
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP(3),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(event_id, user_id, role)
);

-- Registrations (Enhanced)
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status registration_status_enum DEFAULT 'PENDING',
    
    -- Registration Details
    registration_data JSONB, -- Custom form responses
    special_requirements TEXT,
    dietary_restrictions TEXT,
    
    -- Check-in Details
    checked_in_at TIMESTAMP(3),
    checked_in_by UUID REFERENCES users(id),
    qr_code TEXT UNIQUE,
    
    -- Timestamps
    registered_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, user_id)
);

-- Event Bookmarks (Users saving events for later)
CREATE TABLE event_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Notifications (Enhanced)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related Entities
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Data
    data JSONB, -- Additional structured data
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP(3),
    
    -- Delivery
    sent_via_email BOOLEAN DEFAULT false,
    sent_via_push BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP(3),
    push_sent_at TIMESTAMP(3),
    
    -- Timestamps
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Badges (Enhanced)
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT,
    color VARCHAR(7), -- Hex color
    type badge_type_enum NOT NULL,
    
    -- Badge Criteria (stored as JSON for flexibility)
    criteria JSONB NOT NULL,
    
    -- Badge Properties
    is_active BOOLEAN DEFAULT true,
    rarity_score INTEGER DEFAULT 1, -- 1-5 scale
    
    -- Timestamps
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- User Badges (Many-to-Many)
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    
    -- Context of earning the badge
    event_id UUID REFERENCES events(id),
    reason TEXT,
    
    UNIQUE(user_id, badge_id)
);

-- Event Media (Enhanced)
CREATE TABLE event_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    type media_type_enum NOT NULL,
    url TEXT NOT NULL,
    filename VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Media Metadata
    title VARCHAR(200),
    description TEXT,
    alt_text TEXT,
    
    -- Organization
    is_cover BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Upload Info
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Event Reviews/Feedback
CREATE TABLE event_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ratings (1-5 scale)
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    content_rating INTEGER CHECK (content_rating BETWEEN 1 AND 5),
    organization_rating INTEGER CHECK (organization_rating BETWEEN 1 AND 5),
    venue_rating INTEGER CHECK (venue_rating BETWEEN 1 AND 5),
    
    -- Written Feedback
    comment TEXT,
    suggestions TEXT,
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(event_id, user_id)
);

-- Event Analytics (for tracking and insights)
CREATE TABLE event_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Daily metrics
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    registrations INTEGER DEFAULT 0,
    cancellations INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    bookmarks INTEGER DEFAULT 0,
    
    -- Traffic sources
    direct_traffic INTEGER DEFAULT 0,
    social_media_traffic INTEGER DEFAULT 0,
    search_traffic INTEGER DEFAULT 0,
    referral_traffic INTEGER DEFAULT 0,
    
    UNIQUE(event_id, date)
);

-- Tokens (for email verification, password reset, etc.)
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'email_verification', 'password_reset', etc.
    expires_at TIMESTAMP(3) NOT NULL,
    used_at TIMESTAMP(3),
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Events indexes
CREATE INDEX idx_events_status_start_date ON events(status, start_date);
CREATE INDEX idx_events_city_category ON events(city, category);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_is_featured ON events(is_featured);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_tags ON events USING GIN(tags);

-- Registrations indexes
CREATE INDEX idx_registrations_event_status ON registrations(event_id, status);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_registered_at ON registrations(registered_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Other important indexes
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_event_organizers_event ON event_organizers(event_id);
CREATE INDEX idx_event_organizers_organizer ON event_organizers(organizer_id);
CREATE INDEX idx_event_bookmarks_user ON event_bookmarks(user_id);
CREATE INDEX idx_tokens_hash ON tokens(token_hash);
CREATE INDEX idx_tokens_user_type ON tokens(user_id, type);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
/*
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizer_profiles_updated_at BEFORE UPDATE ON organizer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_feedback_updated_at BEFORE UPDATE ON event_feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS AND PROCEDURES
-- =====================================================

-- Function to update event participant count
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.event_id AND NEW.status = 'CONFIRMED';
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- If status changed to CONFIRMED
        IF OLD.status != 'CONFIRMED' AND NEW.status = 'CONFIRMED' THEN
            UPDATE events 
            SET current_participants = current_participants + 1 
            WHERE id = NEW.event_id;
        -- If status changed from CONFIRMED
        ELSIF OLD.status = 'CONFIRMED' AND NEW.status != 'CONFIRMED' THEN
            UPDATE events 
            SET current_participants = current_participants - 1 
            WHERE id = NEW.event_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_participants = current_participants - 1 
        WHERE id = OLD.event_id AND OLD.status = 'CONFIRMED';
        RETURN OLD;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply trigger for participant count
CREATE TRIGGER update_event_participants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();
*/
-- =====================================================
-- SAMPLE DATA FOR BADGES
-- =====================================================

INSERT INTO badges (name, description, icon, color, type, criteria) VALUES
('First Event', 'Attended your first event', '🎉', '#4CAF50', 'MILESTONE', '{"type": "attendance_count", "value": 1}'),
('Event Enthusiast', 'Attended 5 events', '⭐', '#FF9800', 'MILESTONE', '{"type": "attendance_count", "value": 5}'),
('Event Veteran', 'Attended 25 events', '🏆', '#9C27B0', 'MILESTONE', '{"type": "attendance_count", "value": 25}'),
('First Organizer', 'Organized your first event', '🎪', '#2196F3', 'ACHIEVEMENT', '{"type": "organized_count", "value": 1}'),
('Popular Organizer', 'Organized 10 events', '👑', '#E91E63', 'ACHIEVEMENT', '{"type": "organized_count", "value": 10}'),
('Hackathon Winner', 'Won a hackathon', '🥇', '#FFD700', 'SPECIAL', '{"type": "manual_award", "context": "hackathon_winner"}'),
('Community Builder', 'Has 100+ followers', '🌟', '#00BCD4', 'SPECIAL', '{"type": "follower_count", "value": 100}'),
('Early Adopter', 'One of the first 100 users', '🚀', '#795548', 'SPECIAL', '{"type": "user_number", "value": 100}');

-- =====================================================
-- ADDITIONAL VIEWS FOR ANALYTICS
-- =====================================================
/*
-- View for event statistics
CREATE VIEW event_stats AS
SELECT 
    e.id,
    e.title,
    e.category,
    e.type,
    e.city,
    e.start_date,
    e.max_participants,
    e.current_participants,
    COALESCE(e.current_participants::float / NULLIF(e.max_participants, 0) * 100, 0) as registration_percentage,
    COUNT(eb.id) as bookmark_count,
    COALESCE(AVG(ef.overall_rating), 0) as average_rating,
    COUNT(ef.id) as review_count
FROM events e
LEFT JOIN event_bookmarks eb ON e.id = eb.event_id
LEFT JOIN event_feedback ef ON e.id = ef.event_id
GROUP BY e.id, e.title, e.category, e.type, e.city, e.start_date, e.max_participants, e.current_participants;

-- View for user activity summary
CREATE VIEW user_activity_summary AS
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.city,
    COUNT(DISTINCT r.id) as events_attended,
    COUNT(DISTINCT eo.event_id) as events_organized,
    COUNT(uf.following_id) as following_count,
    COUNT(uf2.follower_id) as followers_count,
    COUNT(ub.badge_id) as badges_earned
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id AND r.status = 'ATTENDED'
LEFT JOIN organizer_profiles op ON u.id = op.user_id
LEFT JOIN event_organizers eo ON op.id = eo.organizer_id
LEFT JOIN user_follows uf ON u.id = uf.follower_id
LEFT JOIN user_follows uf2 ON u.id = uf2.following_id
LEFT JOIN user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.first_name, u.last_name, u.city;
*/
-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'User accounts with enhanced profile information and preferences';
COMMENT ON TABLE events IS 'Events with comprehensive metadata, location, timing and capacity management';
COMMENT ON TABLE registrations IS 'Event registrations with status tracking and check-in capabilities';
COMMENT ON TABLE organizer_profiles IS 'Detailed profiles for event organizers (individuals, teams, organizations)';
COMMENT ON TABLE event_organizers IS 'Many-to-many relationship for co-hosted events';
COMMENT ON TABLE notifications IS 'Comprehensive notification system with delivery tracking';
COMMENT ON TABLE badges IS 'Gamification system with flexible criteria';
COMMENT ON TABLE event_analytics IS 'Daily analytics tracking for events';
COMMENT ON TABLE user_interests IS 'User preferred event categories for personalized recommendations';
COMMENT ON TABLE user_follows IS 'Social following system for organizers';
COMMENT ON TABLE event_bookmarks IS 'Users can save events for later reference';

-- End of schema
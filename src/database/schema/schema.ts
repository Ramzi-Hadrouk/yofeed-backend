import { pgTable, foreignKey, unique, uuid, date, integer, index, varchar, timestamp, text, boolean, check, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const badgeTypeEnum = pgEnum("badge_type_enum", ['ATTENDANCE', 'ORGANIZER', 'PARTICIPATION', 'ACHIEVEMENT', 'MILESTONE', 'SPECIAL'])
export const cityEnum = pgEnum("city_enum", ['ADRAR', 'CHLEF', 'LAGHOUAT', 'OUM_EL_BOUAGHI', 'BATNA', 'BEJAIA', 'BISKRA', 'BECHAR', 'BLIDA', 'BOUIRA', 'TAMANRASSET', 'TEBESSA', 'TLEMCEN', 'TIARET', 'TIZI_OUZOU', 'ALGIERS', 'DJELFA', 'JIJEL', 'SETIF', 'SAIDA', 'SKIKDA', 'SIDI_BEL_ABBES', 'ANNABA', 'GUELMA', 'CONSTANTINE', 'MEDEA', 'MOSTAGANEM', 'MSILA', 'MASCARA', 'OUARGLA', 'ORAN', 'EL_BAYADH', 'ILLIZI', 'BORDJ_BOU_ARRERIDJ', 'BOUMERDES', 'EL_TARF', 'TINDOUF', 'TISSEMSILT', 'EL_OUED', 'KHENCHELA', 'SOUK_AHRAS', 'TIPAZA', 'MILA', 'AIN_DEFLA', 'NAAMA', 'AIN_TEMOUCHENT', 'GHARDAIA', 'RELIZANE'])
export const collaborationRoleEnum = pgEnum("collaboration_role_enum", ['CO_ORGANIZER', 'MODERATOR', 'SPEAKER', 'SPONSOR', 'PARTNER'])
export const eventCategoryEnum = pgEnum("event_category_enum", ['ARTIFICIAL_INTELLIGENCE', 'WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'DATA_SCIENCE', 'CYBERSECURITY', 'BLOCKCHAIN', 'GAME_DEVELOPMENT', 'UI_UX_DESIGN', 'DEVOPS', 'CLOUD_COMPUTING', 'IOT', 'ROBOTICS', 'SOFT_SKILLS', 'ENTREPRENEURSHIP', 'DIGITAL_MARKETING', 'NETWORKING', 'CAREER_DEVELOPMENT', 'STARTUP', 'FINTECH', 'HEALTHTECH', 'EDTECH', 'GENERAL_TECH', 'OTHER'])
export const eventStatusEnum = pgEnum("event_status_enum", ['DRAFT', 'PUBLISHED', 'CANCELLED', 'POSTPONED', 'ONGOING', 'COMPLETED'])
export const eventTypeEnum = pgEnum("event_type_enum", ['HACKATHON', 'WORKSHOP', 'COURSE', 'WEBINAR', 'CONFERENCE', 'MEETUP', 'BOOTCAMP', 'SEMINAR', 'PANEL_DISCUSSION', 'NETWORKING_EVENT'])
export const mediaTypeEnum = pgEnum("media_type_enum", ['IMAGE', 'VIDEO', 'DOCUMENT', 'PRESENTATION', 'AUDIO', 'ARCHIVE'])
export const notificationTypeEnum = pgEnum("notification_type_enum", ['EVENT_REMINDER', 'EVENT_UPDATE', 'NEW_EVENT_MATCH', 'REGISTRATION_CONFIRMED', 'EVENT_CANCELLED', 'EVENT_STARTING_SOON', 'FOLLOW_NEW_EVENT', 'BADGE_EARNED', 'COLLABORATION_INVITE', 'SYSTEM_ANNOUNCEMENT'])
export const organizerTypeEnum = pgEnum("organizer_type_enum", ['INDIVIDUAL', 'TEAM', 'ORGANIZATION', 'COMPANY', 'UNIVERSITY', 'GOVERNMENT', 'NGO', 'STARTUP'])
export const registrationStatusEnum = pgEnum("registration_status_enum", ['PENDING', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'ATTENDED', 'NO_SHOW'])
export const userRoleEnum = pgEnum("user_role_enum", ['USER', 'ORGANIZER', 'ADMIN', 'MODERATOR'])


export const eventAnalytics = pgTable("event_analytics", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	date: date().notNull(),
	views: integer().default(0),
	registrations: integer().default(0),
	cancellations: integer().default(0),
	shares: integer().default(0),
	bookmarks: integer().default(0),
	directTraffic: integer("direct_traffic").default(0),
	socialMediaTraffic: integer("social_media_traffic").default(0),
	searchTraffic: integer("search_traffic").default(0),
	referralTraffic: integer("referral_traffic").default(0),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_analytics_event_id_fkey"
		}).onDelete("cascade"),
	unique("event_analytics_event_id_date_key").on(table.eventId, table.date),
]);

export const tokens = pgTable("tokens", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	tokenHash: varchar("token_hash", { length: 255 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	expiresAt: timestamp("expires_at", { precision: 3, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { precision: 3, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_tokens_hash").using("btree", table.tokenHash.asc().nullsLast().op("text_ops")),
	index("idx_tokens_user_type").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.type.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "tokens_user_id_fkey"
		}).onDelete("cascade"),
	unique("tokens_token_hash_key").on(table.tokenHash),
]);

export const users = pgTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 100 }).notNull(),
	lastName: varchar("last_name", { length: 100 }).notNull(),
	avatar: text(),
	role: userRoleEnum().default('USER'),
	isActive: boolean("is_active").default(true),
	isVerified: boolean("is_verified").default(false),
	bio: text(),
	phoneNumber: varchar("phone_number", { length: 20 }),
	dateOfBirth: date("date_of_birth"),
	linkedinUrl: text("linkedin_url"),
	githubUrl: text("github_url"),
	websiteUrl: text("website_url"),
	city: cityEnum(),
	preferredLanguage: varchar("preferred_language", { length: 10 }).default('fr'),
	timezone: varchar({ length: 50 }).default('Africa/Algiers'),
	emailNotifications: boolean("email_notifications").default(true),
	pushNotifications: boolean("push_notifications").default(true),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	lastLoginAt: timestamp("last_login_at", { precision: 3, mode: 'string' }),
}, (table) => [
	index("idx_users_city").using("btree", table.city.asc().nullsLast().op("enum_ops")),
	index("idx_users_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_users_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_users_is_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_users_role").using("btree", table.role.asc().nullsLast().op("enum_ops")),
	unique("users_email_key").on(table.email),
]);

export const userInterests = pgTable("user_interests", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	category: eventCategoryEnum().notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_user_interests_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_interests_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_interests_user_id_category_key").on(table.userId, table.category),
]);

export const userFollows = pgTable("user_follows", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	followerId: uuid("follower_id").notNull(),
	followingId: uuid("following_id").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_user_follows_follower").using("btree", table.followerId.asc().nullsLast().op("uuid_ops")),
	index("idx_user_follows_following").using("btree", table.followingId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [users.id],
			name: "user_follows_follower_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.followingId],
			foreignColumns: [users.id],
			name: "user_follows_following_id_fkey"
		}).onDelete("cascade"),
	unique("user_follows_follower_id_following_id_key").on(table.followerId, table.followingId),
	check("user_follows_check", sql`follower_id <> following_id`),
]);

export const organizerProfiles = pgTable("organizer_profiles", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: organizerTypeEnum().notNull(),
	name: varchar({ length: 200 }).notNull(),
	description: text(),
	logo: text(),
	website: text(),
	facebookUrl: text("facebook_url"),
	twitterUrl: text("twitter_url"),
	linkedinUrl: text("linkedin_url"),
	instagramUrl: text("instagram_url"),
	contactEmail: varchar("contact_email", { length: 255 }),
	contactPhone: varchar("contact_phone", { length: 20 }),
	isVerified: boolean("is_verified").default(false),
	verificationDate: timestamp("verification_date", { precision: 3, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "organizer_profiles_user_id_fkey"
		}).onDelete("cascade"),
]);

export const events = pgTable("events", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text().notNull(),
	category: eventCategoryEnum().notNull(),
	type: eventTypeEnum().notNull(),
	status: eventStatusEnum().default('DRAFT'),
	city: cityEnum().notNull(),
	venue: text(),
	address: text(),
	isOnline: boolean("is_online").default(false),
	meetingLink: text("meeting_link"),
	startDate: timestamp("start_date", { precision: 3, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { precision: 3, mode: 'string' }).notNull(),
	timezone: varchar({ length: 50 }).default('Africa/Algiers'),
	registrationDeadline: timestamp("registration_deadline", { precision: 3, mode: 'string' }),
	maxParticipants: integer("max_participants"),
	currentParticipants: integer("current_participants").default(0),
	isRegistrationOpen: boolean("is_registration_open").default(true),
	isFree: boolean("is_free").default(true),
	price: numeric({ precision: 10, scale:  2 }),
	currency: varchar({ length: 3 }).default('DZD'),
	coverImage: text("cover_image"),
	agenda: jsonb(),
	requirements: text(),
	whatToBring: text("what_to_bring"),
	slug: varchar({ length: 250 }),
	tags: text().array(),
	isFeatured: boolean("is_featured").default(false),
	viewCount: integer("view_count").default(0),
	shareCount: integer("share_count").default(0),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_events_city_category").using("btree", table.city.asc().nullsLast().op("enum_ops"), table.category.asc().nullsLast().op("enum_ops")),
	index("idx_events_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_events_is_featured").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops")),
	index("idx_events_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("idx_events_start_date").using("btree", table.startDate.asc().nullsLast().op("timestamp_ops")),
	index("idx_events_status_start_date").using("btree", table.status.asc().nullsLast().op("enum_ops"), table.startDate.asc().nullsLast().op("timestamp_ops")),
	index("idx_events_tags").using("gin", table.tags.asc().nullsLast().op("array_ops")),
	index("idx_events_type").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	unique("events_slug_key").on(table.slug),
]);

export const eventOrganizers = pgTable("event_organizers", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	organizerId: uuid("organizer_id").notNull(),
	role: collaborationRoleEnum().default('CO_ORGANIZER'),
	isPrimary: boolean("is_primary").default(false),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_event_organizers_event").using("btree", table.eventId.asc().nullsLast().op("uuid_ops")),
	index("idx_event_organizers_organizer").using("btree", table.organizerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_organizers_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.organizerId],
			foreignColumns: [organizerProfiles.id],
			name: "event_organizers_organizer_id_fkey"
		}).onDelete("cascade"),
	unique("event_organizers_event_id_organizer_id_key").on(table.eventId, table.organizerId),
]);

export const eventCollaborators = pgTable("event_collaborators", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	userId: uuid("user_id").notNull(),
	role: collaborationRoleEnum().notNull(),
	permissions: jsonb(),
	invitedBy: uuid("invited_by"),
	invitedAt: timestamp("invited_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	acceptedAt: timestamp("accepted_at", { precision: 3, mode: 'string' }),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_collaborators_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "event_collaborators_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitedBy],
			foreignColumns: [users.id],
			name: "event_collaborators_invited_by_fkey"
		}),
	unique("event_collaborators_event_id_user_id_role_key").on(table.eventId, table.userId, table.role),
]);

export const registrations = pgTable("registrations", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	userId: uuid("user_id").notNull(),
	status: registrationStatusEnum().default('PENDING'),
	registrationData: jsonb("registration_data"),
	specialRequirements: text("special_requirements"),
	dietaryRestrictions: text("dietary_restrictions"),
	checkedInAt: timestamp("checked_in_at", { precision: 3, mode: 'string' }),
	checkedInBy: uuid("checked_in_by"),
	qrCode: text("qr_code"),
	registeredAt: timestamp("registered_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_registrations_event_status").using("btree", table.eventId.asc().nullsLast().op("uuid_ops"), table.status.asc().nullsLast().op("enum_ops")),
	index("idx_registrations_registered_at").using("btree", table.registeredAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_registrations_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "registrations_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "registrations_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.checkedInBy],
			foreignColumns: [users.id],
			name: "registrations_checked_in_by_fkey"
		}),
	unique("registrations_event_id_user_id_key").on(table.eventId, table.userId),
	unique("registrations_qr_code_key").on(table.qrCode),
]);

export const eventBookmarks = pgTable("event_bookmarks", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_event_bookmarks_user").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_bookmarks_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "event_bookmarks_user_id_fkey"
		}).onDelete("cascade"),
	unique("event_bookmarks_event_id_user_id_key").on(table.eventId, table.userId),
]);

export const notifications = pgTable("notifications", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: notificationTypeEnum().notNull(),
	title: varchar({ length: 200 }).notNull(),
	message: text().notNull(),
	eventId: uuid("event_id"),
	relatedUserId: uuid("related_user_id"),
	data: jsonb(),
	isRead: boolean("is_read").default(false),
	readAt: timestamp("read_at", { precision: 3, mode: 'string' }),
	sentViaEmail: boolean("sent_via_email").default(false),
	sentViaPush: boolean("sent_via_push").default(false),
	emailSentAt: timestamp("email_sent_at", { precision: 3, mode: 'string' }),
	pushSentAt: timestamp("push_sent_at", { precision: 3, mode: 'string' }),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_notifications_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_notifications_type").using("btree", table.type.asc().nullsLast().op("enum_ops")),
	index("idx_notifications_user_unread").using("btree", table.userId.asc().nullsLast().op("bool_ops"), table.isRead.asc().nullsLast().op("bool_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notifications_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "notifications_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.relatedUserId],
			foreignColumns: [users.id],
			name: "notifications_related_user_id_fkey"
		}).onDelete("cascade"),
]);

export const userBadges = pgTable("user_badges", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	badgeId: uuid("badge_id").notNull(),
	earnedAt: timestamp("earned_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	eventId: uuid("event_id"),
	reason: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_badges_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.badgeId],
			foreignColumns: [badges.id],
			name: "user_badges_badge_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "user_badges_event_id_fkey"
		}),
	unique("user_badges_user_id_badge_id_key").on(table.userId, table.badgeId),
]);

export const badges = pgTable("badges", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text().notNull(),
	icon: text(),
	color: varchar({ length: 7 }),
	type: badgeTypeEnum().notNull(),
	criteria: jsonb().notNull(),
	isActive: boolean("is_active").default(true),
	rarityScore: integer("rarity_score").default(1),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("badges_name_key").on(table.name),
]);

export const eventMedia = pgTable("event_media", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	type: mediaTypeEnum().notNull(),
	url: text().notNull(),
	filename: varchar({ length: 255 }),
	fileSize: integer("file_size"),
	mimeType: varchar("mime_type", { length: 100 }),
	title: varchar({ length: 200 }),
	description: text(),
	altText: text("alt_text"),
	isCover: boolean("is_cover").default(false),
	sortOrder: integer("sort_order").default(0),
	uploadedBy: uuid("uploaded_by"),
	uploadedAt: timestamp("uploaded_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_media_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploadedBy],
			foreignColumns: [users.id],
			name: "event_media_uploaded_by_fkey"
		}),
]);

export const eventFeedback = pgTable("event_feedback", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	userId: uuid("user_id").notNull(),
	overallRating: integer("overall_rating"),
	contentRating: integer("content_rating"),
	organizationRating: integer("organization_rating"),
	venueRating: integer("venue_rating"),
	comment: text(),
	suggestions: text(),
	isPublic: boolean("is_public").default(true),
	isAnonymous: boolean("is_anonymous").default(false),
	createdAt: timestamp("created_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_feedback_event_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "event_feedback_user_id_fkey"
		}).onDelete("cascade"),
	unique("event_feedback_event_id_user_id_key").on(table.eventId, table.userId),
	check("event_feedback_overall_rating_check", sql`(overall_rating >= 1) AND (overall_rating <= 5)`),
	check("event_feedback_content_rating_check", sql`(content_rating >= 1) AND (content_rating <= 5)`),
	check("event_feedback_organization_rating_check", sql`(organization_rating >= 1) AND (organization_rating <= 5)`),
	check("event_feedback_venue_rating_check", sql`(venue_rating >= 1) AND (venue_rating <= 5)`),
]);
